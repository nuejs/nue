import { promises as fs, existsSync } from 'node:fs'
import { join, parse as parsePath } from 'node:path'

import { parse as parseNue, compile as compileNue } from 'nuejs-core'
import { nuedoc } from 'nuemark'

import { lightningCSS, buildJS } from './builder.js'
import { createServer, send } from './nueserver.js'
import { printStats, categorize } from './stats.js'
import { initNueDir } from './init.js'
import { createSite } from './site.js'
import { fswatch } from './nuefs.js'

import { log, colors, getAppDir, parsePathParts, extendData } from './util.js'
import { renderPage, getSPALayout } from './layout/page.js'


// the HTML5 doctype
const DOCTYPE = '<!doctype html>\n\n'


export async function createKit(args) {
  const { root, is_prod, esbuild, dryrun } = args

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
        const { css } = await processCSS({ path, ...parsePath(path)})
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
    if (data.view_transitions || data.router) push('view-transitions')
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
    const data = { ...await site.getData(appdir), ...parsePathParts(index_path) }

    // scripts & styling
    data.assets = {}
    await setupScripts(dir, data)
    await setupStyles(dir, data)

    // SPA components and layout
    const html = await read(index_path)

    if (html.includes('<html')) {
      const lib = await site.getServerComponents(appdir, data)
      const [ spa, ...spa_lib ] = parseNue(html)
      return DOCTYPE + spa.render(data, [...lib, ...spa_lib])
    }
    const [ spa ] = parseNue(getSPALayout(html, data))
    return DOCTYPE + spa.render(data)
  }


  async function processScript(file) {
    const { path } = file
    const data = await site.getData(getAppDir(path))
    const bundle = data.bundle?.includes(file.base)

    // else -> build()
    await buildJS({
      outdir: join(process.cwd(), dist, file.dir),
      path: join(process.cwd(), root, path),
      minify: is_prod,
      esbuild,
      bundle
    })

    log(path)

    return { bundle }
  }

  async function processCSS({ path, base, dir}) {
    const data = await site.getData()
    const css = data.lightning_css === false ?
      await read(path) :
      await lightningCSS(join(root, path), is_prod, data)
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
    style: 'Processing styles',
    scripts: 'Building scripts',
    islands: 'Transpiling components',
    pages: 'Generating pages',
    media: 'Copying static files',
    spa:   'Single-page apps'
  }

  // build all / given matches
  async function build(matches=[]) {
    const begin = Date.now()
    log('Building site to:', colors.cyan(dist))

    // paths
    let paths = await site.walk()

    // ignore layouts
    paths = paths.filter(p => !p.endsWith('layout.html'))


    if (args.incremental) {
      paths = await site.filterUpdated(paths)

    } else if (matches[0]) {
      paths = paths.filter(p => matches.find(m => m == '.' ? p == 'index.md' : p.includes(m)))
    }

    // categories
    const cats = categorize(paths)

    for (const key in cats) {
      const paths = cats[key]
      const len = paths.length
      if (len) {
        console.log('')
        log(DESC[key], len)
        for (const path of paths) {
          if (!dryrun) await gen(path, true)
          console.log('  ', colors.gray(path))
        }
      }
    }

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
