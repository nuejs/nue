import { promises as fs, existsSync } from 'node:fs'
import { join, parse as parsePath } from 'node:path'

import { parse as parseNue, compile as compileNue } from 'nuejs-core'
import { nuedoc } from 'nuemark'

import { buildCSS, buildJS } from './builder.js'
import { createServer, send } from './nueserver.js'
import { printStats, categorize } from './stats.js'
import { initNueDir } from './init.js'
import { createSite } from './site.js'
import { fswatch } from './nuefs.js'

import { log, colors, getAppDir, parsePathParts, extendData, toPosix } from './util.js'
import { renderPage, getSPALayout } from './layout/page.js'
import { getLayoutComponents, collectionToFeed, formatFeedTitle } from './layout/components.js'


// the HTML5 doctype (can/prefer lowercase for consistency)
const DOCTYPE = '<!doctype html>\n\n'


export async function createKit(args) {
  args.root = args.root && toPosix(args.root) // fixes windows ".\" prefixed path
  const { root, is_prod, esbuild, lcss, dryrun } = args

  // site: various file based functions
  const site = await createSite(args)

  const { dist, port, read, copy, write, is_empty } = site
  const is_dev = !is_prod


  async function init(force) {
    await initNueDir({ dist, is_dev, esbuild, force })
  }

  if (!existsSync(join(root, 'site.yaml'))) {
    console.error('No site.yaml found. Please go to project root\n')
    return false
  }

  // make sure @nue dir has all the latest
  if (!dryrun) await init()

  async function setupStyles(dir, data) {
    const paths = await site.getStyles(dir, data)
    const { assets } = data

    if (data.inline_css) {
      assets.inline_css = await buildAllCSS(paths)
      assets.styles = paths.filter(path => path.includes('@nue'))

    } else {
      assets.inline_css = []
      assets.styles = paths
    }
  }

  async function buildAllCSS(paths) {
    const arr = []
    for (const path of paths) {
      if (!path.startsWith('/@nue')) {
        const { css } = await processCSS({ path, ...parsePath(path) })
        arr.push({ path, css })
      }
    }
    return arr
  }

  async function setupScripts(dir, data) {

    // scripts
    const { assets } = data
    const scripts = assets.scripts = await site.getScripts(dir, data)

    // components
    assets.components = await site.getClientComponents(dir, data)

    // system scripts
    function push(name) {
      const url = `/@nue/${name}.js`
      if (!scripts.includes(url)) scripts.push(url)
    }

    if (is_dev && data.hotreload !== false) push('hotreload')
    if (assets.components?.length) push('mount')

    if (!data.is_spa) {
      if (data.view_transitions || data.router) push('view-transitions')
    }
  }


  async function getPageData(path) {

    // markdown data: meta, sections, headings, links
    const raw = await read(path)
    const document = nuedoc(raw)
    const { meta } = document

    const { dir } = parsePath(path)
    const data = await site.getData(meta.appdir || dir)

    // include & exclude concatenation
    extendData(data, meta)

    // content collection
    const cdir = data.content_collection
    if (cdir) {
      const key = data.collection_name || cdir
      data[key] = await site.getContentCollection(cdir)
    }

    // scripts & styling
    const asset_dir = meta.appdir || dir
    data.use_syntax = data.syntax_highlight !== false && document.codeblocks[0]

    data.assets = {}
    await setupScripts(asset_dir, data)
    await setupStyles(asset_dir, data)

    return { ...data, ...parsePathParts(path), document }
  }

  // Markdown page
  async function renderMPA(path) {
    const data = await getPageData(path)
    const file = parsePath(path)
    const lib = await site.getServerComponents(data.appdir || file.dir, data)
    return DOCTYPE + renderPage({ ...data, ...site.model }, lib, site.tags)
  }


  // index.html for single-page application
  async function renderSPA(index_path) {

    // data
    const file = parsePath(index_path)
    const dir = file.dir
    const appdir = getAppDir(index_path)
    const data = { ...await site.getData(appdir), ...parsePathParts(index_path), is_spa: true }

    // scripts & styling
    data.assets = {}
    await setupScripts(dir, data)
    await setupStyles(dir, data)

    // SPA components and layout
    const html = await read(index_path)

    const lib = await site.getServerComponents(appdir, data)
    lib.push(...getLayoutComponents())

    if (html.includes('<html')) {
      const [spa, ...spa_lib] = parseNue(html)
      return DOCTYPE + spa.render(data, [...lib, ...spa_lib])
    }
    const [spa] = parseNue(getSPALayout(html, data))

    return DOCTYPE + spa.render(data, lib)
  }

  // Generate feeds for all `has_feed: true` collections
  // and their non-excluded subdirectories.
  async function renderFeeds(pages, misc) {

    const feedFile = 'feed.xml'

    const getDir = p => {
      const posixPath = toPosix(p)
      return posixPath.slice(0, posixPath.lastIndexOf('/'))
    }

    const siteData = await site.getData()

    // sorted by depth to make sure we later can exclude
    // based on child directories in `excludedDirs`.

    const yamlFiles = misc
      .filter(f => f.endsWith('.yaml'))
      .sort((a, b) => toPosix(b).split('/').length - toPosix(a).split('/').length);

    const excludedDirs = []

    for (const yamlPath of yamlFiles) {

      if (yamlPath === 'site.yaml') continue

      const baseDir = getDir(yamlPath)

      const yaml = {}
      Object.assign(yaml, await site.getData(baseDir))

      // Will be true if explicitly in the collections .yaml, or if
      // the .yaml in a child directory of a "feedable" parent has
      // no `has_feed` defined. Excluded when collection or child
      // explicitly opt-out via `has_feed: false`.

      if (!yaml.has_feed) {
        excludedDirs.push(baseDir)

        try {

          // todo: do we need this or is it a Nue bug?
          // Nue does not seem to wipe the build folder on new builds.
          // This can cause leftover `feed.xml` files when the config
          // in `.yaml` files changes. Hence, we cleanup ourselves.

          const { promises: fs } = await import('node:fs')
          await fs.unlink(join(site.dist, baseDir, 'feed.xml'))

        } catch (e) {
          // No file, all good.
        }

        continue
      }

      const feedObj = {
        nuekit_version: yaml.nuekit_version,
        title_template: siteData.title_template,
        origin: siteData.origin,
        title: yaml.collection_name || baseDir,
        subtitle: yaml.description,
        icon: siteData.favicon,
        author: typeof yaml.author == 'object' && yaml.author
          ? yaml.author
          : { name: yaml.author, mail: undefined },

        link_self: `${siteData.origin}/${baseDir}/${feedFile}`,
        link_alternate: (() => {
          const pagesSet = new Set(pages)

          // find out whether the parent directory is an actual
          // page or simply a URL structure kinda thingy. If we
          // find an index.md, it's a page. Otherwise, we walk
          // up until the next actual linkable page.

          let dir = baseDir
          while (!pagesSet.has(`${dir}/index.md`)) {
            const idx = dir.lastIndexOf('/')
            if (idx < 0) break // no more parents
            dir = dir.slice(0, idx)
          }

          return `${siteData.origin}/${dir}/`
        })(),
        items: (await site.getContentCollection(baseDir)).filter(item =>
          // we don't vibe items from a `has_feed: false` dir
          !excludedDirs.some(ex => item.dir == ex)
        ),
      }

      await write(collectionToFeed(feedObj), baseDir, feedFile)
    }
  }

  async function processScript(file) {
    const { base, path } = file
    const data = await site.getData(getAppDir(path))
    const bundle = data.bundle?.includes(base)

    // is_prod && base == 'index.js' ||

    // else -> build()
    await buildJS({
      outdir: join(process.cwd(), dist, file.dir),
      path: join(process.cwd(), root, path),
      minify: is_prod,
      esbuild,
      bundle
    })

    if (is_dev) log(path)


    return { bundle }
  }

  async function processCSS({ path, base, dir }) {
    const data = await site.getData()

    const css = data.minify_css !== false
      // try using bundler, if not data.minify_css === false
      && await buildCSS(join(root, path), is_prod, data, lcss)
      // fallback to copy css
      || await read(path)

    await write(css, dir, base)
    return { css }
  }


  // the page user is currently working on
  let active_page

  // process different file types and returns data for hot-reloading
  async function processFile(file, is_bulk) {
    const { path, dir, name, base, ext } = file
    file['is_' + ext.slice(1)] = true


    // global config reload first
    if (is_dev && !is_bulk && path == 'site.yaml') {
      if (await site.update()) return { site_updated: true }
    }

    // markdown content
    if (file.is_md) {
      const { dir, name, path } = file
      const html = await renderMPA(path)
      await write(html, dir, `${name}.html`)
      active_page = file
      return { html }
    }

    // SPA
    if (base == 'index.html') {
      const html = await renderSPA(path)
      await write(html, dir, base)
      active_page = file
      return { html }
    }

    // script
    if (file.is_ts || file.is_js) return await processScript(file)

    // css
    if (ext == '.css') return await processCSS(file)

    // reactive component (.dhtml, .htm)
    if (file.is_dhtml || file.is_htm) {
      const raw = await read(path)
      const js = await compileNue(raw)
      await write(js, dir, `${name}.js`)
      return { size: js.length }
    }

    // layout or data -> hotreload active page
    if (is_dev && active_page && isAssetFor(active_page, file)) {
      return await processFile(active_page)
    }

    // static file -> copy
    if (!file.is_yaml && !file.is_html) await copy(file)

  }

  function isAssetFor(page, asset) {
    if (['.html', '.yaml'].includes(asset.ext)) {
      const appdir = getAppDir(asset.dir)
      return ['', '.', ...site.globals].includes(appdir) || getAppDir(page.dir) == appdir
    }
  }


  // generate single path
  async function gen(path, is_bulk) {
    const page = await processFile({ path, ...parsePath(path) }, is_bulk)
    return page?.html
  }

  // collect data
  const DESC = {
    style: 'Processing CSS',
    scripts: 'Processing JS',
    islands: 'Reactive components',
    pages: 'Markdown content',
    spa: 'SPA entry points',
    media: 'Static files',
  }

  // build all / given matches
  async function build(matches = []) {
    const begin = Date.now()
    log('Building site to:', colors.cyan(dist))

    // paths
    let paths = await site.walk()


    if (args.incremental) {
      paths = await site.filterUpdated(paths)

    } else if (matches[0]) {
      paths = paths.filter(p => matches.find(m => m == '.' ? p == 'index.md' : p.includes(m)))
    }

    // categories
    const {cats, misc} = categorize(paths)

    // build
    for (const key in cats) {
      const paths = cats[key]
      const len = paths.length
      let start = Date.now()
      if (len) {
        log(DESC[key], len)
        for (const path of paths) {
          if (!dryrun) await gen(path, true)
          if (args.verbose) console.log('  ', colors.gray(path))
        }
      }
    }

    if (!dryrun) await renderFeeds(cats.pages, misc)

    // stats
    if (args.stats) await stats(args)

    const elapsed = Date.now() - begin

    console.log(`\nTime taken: ${colors.yellow(elapsed + 'ms')}\n`)

    // returned for deploying etc..
    return paths
  }

  async function stats(args) {
    await printStats(site, args)
  }

  async function serve() {
    log('Serving site from', colors.cyan(dist))

    if (is_empty) await build()

    const server = createServer(dist, async (req_url) => {
      const { src, path, name } = await site.getRequestPaths(req_url) || {}
      if (src) await gen(src)
      return { path, code: name == 404 ? 404 : 200 }
    })

    // watch for changes
    const watcher = is_prod ? null : await fswatch(root, async file => {
      try {
        const ret = await processFile(file)
        if (ret) send({ ...file, ...parsePathParts(file.path), ...ret })
      } catch (e) {
        send({ error: e, ...file })
        console.error(file.path, e)
      }

      // when a file/dir was removed
    }, async path => {
      const dpath = join(dist, path)
      await fs.rm(dpath, { recursive: true, force: true })
      log('Removed', dpath)

      const file = parsePath(path)
      if (file.ext) send({ remove: true, path, ...file })
    })

    const terminate = () => {
      if (watcher) watcher.close()
      server.close()
    }

    try {
      server.listen(port)
      log(`http://localhost:${port}/`)
      return terminate

    } catch (e) {
      if (e.code != 'EADDRINUSE') console.error(e)
      log.error(e.message, '\n')
      process.exit()
    }
  }

  return {
    // for testing only
    gen, getPageData, renderMPA, renderSPA,

    // public API
    build, serve, stats, init, dist, port,
  }
}
