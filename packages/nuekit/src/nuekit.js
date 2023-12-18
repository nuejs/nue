
import { parse as parseNue, compile as compileNue } from 'nuejs-core/index.js'
import { log, colors, parseMarkdown, getAppDir, getParts } from './util.js'
import { renderHead, getDefaultHTML, getDefaultSPA } from './layout.js'
import { join, parse as parsePath, extname } from 'node:path'
import { readStats, printTable, categorize } from './stats.js'
import { createServer, send } from './nueserver.js'
import { minifyCSS, buildJS } from './builder.js'
import { promises as fs } from 'node:fs'
import { createSite } from './site.js'
import { fswatch } from './nuefs.js'
import { init } from './init.js'

// the HTML5 doctype
const DOCTYPE = '<!doctype html>\n\n'

// file not found error code
const NOT_FOUND = -2

export async function createKit(args) {
  const { root, is_prod, env } = args

  // site: various file based functions
  const site = await createSite(args)

  const { dist, port, read, copy, write, is_empty } = site
  const is_dev = !is_prod

  // make sure @nue dir has all the latest
  if (!args.dryrun) await init({ dist, is_dev })



  async function setupStyles(dir, data) {
    const paths = await site.getAssets(dir, ['style', 'css'])

    if (data.inline_css) {
      data.inline_css = await readAllCSS(paths)

      // prefetch global CSS
      if (data.prefetch_global_css) data.prefetch = await site.getStyles()

    } else {
      data.styles = paths.map(path => path.replace('.style', '.css'))
    }
  }

  async function setupScripts(dir, data) {

    // components
    if (!data.no_automount) data.components = await site.getAssets(dir, ['nue'], 'js')

    // scripts
    const scripts = data.scripts = await site.getScripts(dir, data.include)

    function push(name) {
      const url = `/@nue/${name}.js`
      if (!scripts.includes(url)) scripts.push(url)
    }

    // system scripts
    if (!data.is_spa && data.page_router) push('page-router')
    if (is_dev && !data.no_hotreload) push('hotreload')
    if (data.components?.length) push('mount')
  }


  async function getPageData(path) {

    // markdown
    const raw = await read(path)
    const { meta, content } = parseMarkdown(raw)

    const file = parsePath(path)
    const dir = meta.appdir || file.dir || '.'

    // YAML data
    const data = { ...await site.getData(dir), content, ...getParts(path), ...meta }

    // content collection
    const cdir = data.content_collection
    if (cdir) {
      const key = data.collection_name || cdir
      data[key] = await site.getContentCollection(cdir)
    }

    // scripts & styling
    await setupScripts(dir, data)
    await setupStyles(dir, data)

    return data
  }

  // index.html for single-page application
  async function renderSPA(index_path) {

    // data
    const appdir = getAppDir(index_path)
    const data = { ...await site.getData(appdir), ...getParts(index_path), is_spa: true }
    const file = parsePath(index_path)
    const dir = file.dir || '.'

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
      return DOCTYPE + spa.render(data, lib.concat(spa_lib))
    }
    const [ spa ] = parseNue(getDefaultSPA(html, data))
    return DOCTYPE + spa.render(data)
  }

  // Markdown- based multi-page application page
  async function renderPage(path, data) {
    const appdir = data.appdir || getAppDir(path)
    const lib = await site.getLayoutComponents(appdir)

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


  async function writePage(file) {
    const { dir, name, path } = file
    const data = await getPageData(path)
    const html = await renderPage(path, data)
    await write(html, dir, `${name}.html`)
    return html
  }

  async function renderNueCSS(path) {
    const nuecss = await import('nuecss')
    const raw = await read(path)
    return nuecss.default(raw, { minify: is_prod })
  }

  async function readAllCSS(paths) {
    const arr = []
    for (const path of paths) {
      const content = extname(path) == '.css' ? await read(path) : await renderNueCSS(path)
      arr.push({ path, content })
    }
    return arr
  }


  async function processScript(file) {
    const { path } = file
    const data = await site.getData(getAppDir(path))
    const bundle = data.bundle?.includes(file.base)

    // else -> build()
    await buildJS({
      outdir: join(dist, file.dir),
      path: join('.', root, path),
      minify: is_prod,
      bundle
    })

    return { bundle }
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
      const html = await writePage(file)
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

    // Nue CSS (not official yet)
    if (file.is_style) {
      const css = await renderNueCSS(path)
      await write(css, dir, `${name}.css`)
      return { css }
    }

    // Plain CSS
    if (file.is_css) {
      const css = await read(path)

      // production -> minify
      if (is_prod) return await write(minifyCSS(css), dir, base)

      // development -> return for hot-reload
      await copy(file)
      return { css }
    }

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
      return ['.', ...site.globals].includes(appdir) || getAppDir(page.dir) == appdir
    }
  }


  // generate single path
  async function gen(path, is_bulk) {
    await processFile({ path, ...parsePath(path) }, is_bulk)
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
  async function build(matches, dryrun) {
    const begin = Date.now()
    log('Building site to:', colors.cyan(dist))

    // paths
    let paths = await site.walk()
    if (matches?.length) paths = paths.filter(p => matches.find(m => p.includes(m)))

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
    if (args.stats) await stats()
    const elapsed = Date.now() - begin

    console.log(`\nTime taken: ${colors.yellow(elapsed + 'ms')}\n`)
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
    is_dev && fswatch(root, async file => {
      try {
        const ret = await processFile(file)
        if (ret) send({ ...file, ...getParts(file.path), ...ret })
      } catch (e) {
        console.error(e)
        send({ error: e, ...file })
      }

    // when a file/dir was removed
    }, async path => {
      const dpath = join(dist, path)
      await fs.rm(dpath, { recursive: true, force: true })
      send({ remove: true, path, ...parsePath(path) })
      log('Removed', dpath)
    })

    // server.once('error', e => { if (e.code == 'EADDRINUSE') {} })

    server.listen(port)
    log(`http://localhost:${port}/`)
  }

  async function stats() {
    const rows = await readStats(dist, site.globals)
    printTable(['Page', 'HTML', 'CSS', 'JS'], rows)
    return rows
  }

  return {

    // for testing only
    gen, getPageData, renderPage, renderSPA,

    // public API
    build, serve, stats, dist,
  }

}



