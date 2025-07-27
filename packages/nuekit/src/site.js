
import { join, extname, basename } from 'node:path'
import { mkdir, readdir } from 'node:fs/promises'

import { renderMD, renderSVG, renderHTML } from './render.js'
import { createAssets, createFile } from './assets.js'
import { createServer } from './server.js'
import { fswatch } from './fswatch.js'
import { minifyCSS } from './css.js'
import { parseYAML } from './yaml.js'
import { fswalk } from './fswalk.js'
import { init } from './init.js'

const IGNORE = `_* _*/** .* .*/** node_modules/** @system/worker/**\
 *.toml *.rs *.lock package.json bun.lockb pnpm-lock.yaml README.md`.split(' ')


export async function createSite(root='.', opts={}) {
  const { is_prod, dryrun, silent } = opts

  // site config
  const conf = await isNueDir(root)
  if (!conf) return console.error('Not a Nue directory')

  // assets
  const ignore = [...IGNORE, ...(conf.ignore || [])]
  const paths = await fswalk(root, { ignore, followSymlinks: conf.follow_symlinks })
  const assets = await createAssets(root, paths)

  // dist directory
  const dist = join(root, opts.dist || (is_prod ? '.dist/prod' : '.dist/dev'))
  await mkdir(dist, { recursive: true })

  // init @nue directory
  if (!dryrun && !opts.noinit) {
    const nuedir = await init({ dist, minify: is_prod, force: opts.init })
    if (nuedir && !silent) console.log(`@nue directory initialized`)
  }

  async function processCSS(file) {
    return is_prod ? await write(file, minifyCSS(await file.text()))
      : await file.copy(dist)
  }

  async function processJS(file) {
    return !is_prod && !file.is_ts ? await file.copy(dist)
      : await buildJS(file.fullpath, join(dist, file.dir), is_prod)
  }

  async function processMD(file) {
    const html = await renderMD(file, is_prod)
    return await file.write(dist, html, '.html')
  }

  async function processSVG(file) {
    const data = await file.data()
    if (data.process_svg) {
      const svg = await renderSVG(file, is_prod)
      await file.write(dist, svg)
    } else {
      await file.copy(dist)
    }
  }

  // server rendered or compiled to client JS
  async function processHTML(file) {
    const { html, js } = await renderHTML(file)
    if (js) await file.write(dist, js, '.js')
    if (html) return await file.write(dist, html)
  }

  async function processYAML(file) {

  }

  async function process(file) {
    return file.is_js || file.is_ts ? await processJS(file)
      : file.is_yaml ? await processYAML(file)
      : file.is_html ? await processHTML(file)
      : file.is_svg ? await processSVG(file)
      : file.is_css ? await processCSS(file)
      : file.is_md ? await processMD(file)
      : await file.copy(dist)
  }

  async function build() {
    const { paths=[] } = opts
    const subset = paths.length ? assets.filter(el => matches(el.path, paths)) : assets
    const start = performance.now()
    if (!dryrun) await Promise.all(subset.map(process))

    if (!silent) {
      stats(subset).forEach(line => console.log(line))
      const time = Math.round(performance.now() - start)
      console.log(`-----\nBuilt in: ${time}ms\n`)
    }

    return subset
  }

  // for debugging / testing
  async function results() {
    const paths = await fswalk(dist)
    const files = await Promise.all(paths.map(path => createFile(dist, path)))

    files.read = async function(path) {
      const file = files.find(el => el.path == path)
      return await file?.text()
    }
    return files
  }

  function serve() {
    const { worker } = conf
    const port = opts.port || conf.port

    const server = createServer({ port, dist, worker }, async ({ pathname }) => {
      const is_page = !extname(pathname)
      let asset = assets.find(asset => asset.url == pathname)

      // error page
      if (!asset && is_page) asset = assets.find(asset => asset.name == '404')

      return is_page ? await process(asset) : join(dist, pathname)
    })

    const watcher = fswatch(root, { ignore })

    watcher.onupdate = async function(path) {
      const file = await assets.update(path)

      if (file) {
        const distpath = await process(file)
        const content = distpath ? await Bun.file(distpath).text() : null
        server.broadcast({ ...file, content })
      }
    }

    watcher.onremove = async function(path) {
      assets.remove(path)
      server.broadcast({ remove: path })
    }

    if (!silent) console.log(`Serving on ${server.url}`)

    return {
      stop() { watcher.close(); server.stop() },
      url: server.url.toString(),
      port,
    }
  }

  return { build, serve, results }
}


export function matches(path, matches) {
  return matches.some(match => {
    return match.startsWith('./') ? path == match.slice(2) : path.includes(match)
  })
}


export function stats(assets) {
  const lines = []

  const types = {
    md: 'Markdown',
    js: 'JavaScript',
    ts: 'TypeScript',
    html: 'HTML',
    svg: 'SVG',
    css: 'CSS',
    png: 'PNG',
    webp: 'WebP',
  }

  for (const type in types) {
    const count = assets.filter(el => el.type == type).length
    if (count) lines.push(`${types[type]} files: ${count}`)
  }

  // misc files
  const basics = ['yaml', ...Object.keys(types)]
  const count = assets.filter(el => !basics.includes(el.type)).length
  if (count) lines.push(`Misc files: ${count}`)

  return lines
}


export async function buildJS(path, outdir, minify) {
  return await Bun.build({
    entrypoints: [path],
    target: 'browser',
    external: ['*'],
    outdir,
    minify
  })
}


async function readData(root, name) {
  if (await file.exists()) {
    return parseYAML(await file.text())
  }
}

async function isNueDir(root) {
  const files = await readdir(root)

  // site.yaml
  if (files.includes('site.yaml')) {
    const file = Bun.file(join(root, 'site.yaml'))
    return await parseYAML(await file.text())
  }

  // index file
  const index = files.find(name => ['index.md', 'index.html'].includes(name))
  if (index) return {}
}

