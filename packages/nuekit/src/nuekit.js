
import { join, parse as parsePath, extname, basename } from 'node:path'
import { renderHead, getDefaultHTML, getDefaultSPA } from './layout.js'
import { parse as parseNue, compile as compileNue } from 'nuejs-core'
import { log, colors, getAppDir, getParts } from './util.js'
import { createServer, send } from './nueserver.js'
import { lightningCSS, buildJS } from './builder.js'
import { printStats, categorize } from './stats.js'
import { parsePage, renderPage } from 'nuemark'
import { promises as fs } from 'node:fs'
import { createSite } from './site.js'
import { fswatch } from './nuefs.js'
import { init } from './init.js'

// the HTML5 doctype
const DOCTYPE = '<!doctype html>\n\n'

// file not found error code
const NOT_FOUND = -2

export async function createKit(args) {
  const { root, is_prod, esbuild } = args

  // site: various file based functions
  const site = await createSite(args)

  const { dist, port, read, copy, write, is_empty } = site
  const is_dev = !is_prod

  // make sure @nue dir has all the latest
  if (!args.dryrun) await init({ dist, is_dev, esbuild, force: args.init })


  async function setupStyles(dir, data) {
    const paths = data.styles = await site.getStyles(dir, data)

    if (data.inline_css) {
      data.inline_css = await buildAllCSS(paths)
      delete data.styles
    }
  }

  async function buildAllCSS(paths) {
    const arr = []
    for (const path of paths) {
      const { css } = await processCSS({ path, ...parsePath(path)})
      arr.push({ path, css })
    }
    return arr
  }

  async function setupScripts(dir, data) {

    // scripts
    const scripts = data.scripts = await site.getScripts(dir, data.main)

    // components
    if (data.automount !== false) data.components = await site.getComponents(dir)

    // system scripts
    function push(name) {
      const url = `/@nue/${name}.js`
      if (!scripts.includes(url)) scripts.push(url)
    }

    if (is_dev && data.hotreload !== false) push('hotreload')
    if (data.components?.length) push('mount')
    if (data.page?.isomorphic) push('nuemark')
    if (data.router) push('page-router')
  }


  async function getPageData(path) {

    const { dir } = parsePath(path)
    const data = await site.getData(dir)

    // markdown
    const raw = await read(path)

    // { meta, sections, headings, links }
    const page = parsePage(raw, data)
    const { meta } = page

    // YAML data
    Object.assign(data, getParts(path), meta, { page })

    // content collection
    const cdir = data.content_collection
    if (cdir) {
      const key = data.collection_name || cdir
      data[key] = await site.getContentCollection(cdir)
    }

    // scripts & styling
    const asset_dir = meta.appdir || dir
    await setupScripts(asset_dir, data)
    await setupStyles(asset_dir, data)

    return data
  }

  // index.html for single-page application
  async function renderSPA(index_path) {

    // data
    const file = parsePath(index_path)
    const dir = file.dir
    const appdir = getAppDir(index_path)
    const data = { ...await site.getData(appdir), ...getParts(index_path) }

    // scripts & styling
    await setupScripts(dir, data)
    await setupStyles(dir, data)

    // head / meta tags
    data.head = renderHead(data, is_prod)

    // SPA components and layout
    const html = await read(index_path)

    if (html.includes('<html')) {
      const lib = await site.getLayoutComponents(appdir)
      const [ spa, ...spa_lib ] = parseNue(html)
      return DOCTYPE + spa.render(data, [...lib, ...spa_lib])
    }
    const [ spa ] = parseNue(getDefaultSPA(html, data))
    return DOCTYPE + spa.render(data)
  }

  // Markdown- based multi-page application page
  async function renderMPA(path, data) {
    const file = parsePath(path)
    const dir = data.appdir || file.dir
    const lib = await site.getLayoutComponents(dir)

    data.content = renderPage(data.page, { data, lib }).html

    function render(name, def) {
      const layout = lib.find(el => el.tagName == name) || def && parseNue(def)[0]

      try {
        return layout ? layout.render(data, lib) : ''
      } catch (e) {
        delete data.inline_css
        log.error(`Error in ${path}, on <${name}> component`)
        throw { component: name, ...e }
      }
    }

    data.header = render('header')
    data.footer = render('footer')
    data.main = render('main', '<slot for="content"/>')
    data.custom_head = render('head').slice(6, -7)
    data.head = renderHead(data, is_prod)

    return DOCTYPE + render('html', getDefaultHTML(data))
  }


  // processor methods
  async function processPage(file) {
    const { dir, name, path } = file
    const data = await getPageData(path)
    const html = await renderMPA(path, data)
    await write(html, dir, `${name}.html`)
    return html
  }


  async function processScript(file) {
    const { path } = file
    const data = await site.getData(getAppDir(path))
    const bundle = data.bundle?.includes(file.base)

    // else -> build()
    await buildJS({
      outdir: join(process.cwd(), dist, file.dir),
      path: join(process.cwd(), root, path),
      esbuild,
      minify: is_prod,
      bundle
    })

    log(path)

    return { bundle }
  }

  async function processCSS({ path, base, dir}) {
    const raw = await read(path)
    const data = await site.getData()
    const css = data.lightning_css === false ? raw : await lightningCSS(raw, is_prod, data)
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
      const html = await processPage(file)
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

    // reactive component
    if (file.is_nue) {
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
    if (['layout.html', 'site.yaml', 'app.yaml'].includes(asset.base)) {
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
  async function build(matches=[], dryrun) {
    const begin = Date.now()
    log('Building site to:', colors.cyan(dist))

    // paths
    let paths = await site.walk()

    // ignore layouts
    paths = paths.filter(p => !p.endsWith('layout.html'))

    if (matches[0]) {
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

    // dev mode -> watch for changes
    let watcher
    if (is_dev) watcher = fswatch(root, async file => {
      try {
        const ret = await processFile(file)
        if (ret) send({ ...file, ...getParts(file.path), ...ret })
      } catch (e) {
        send({ error: e, ...file })
        console.error(e)
      }

    // when a file/dir was removed
    }, async path => {
      const dpath = join(dist, path)
      await fs.rm(dpath, { recursive: true, force: true })
      log('Removed', dpath)

      const file = parsePath(path)
      if (file.ext) send({ remove: true, path, ...file })
    })

    const cleanup = () => {
      if (watcher) watcher.close()
    }
    const terminate = () => {
      cleanup()
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
    build, serve, stats, dist,
  }

}



