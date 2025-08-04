
import { normalize, sep, join } from 'node:path'
import { parseNue } from 'nuedom'
import { nuedoc } from 'nuemark'

import { renderMD, renderSVG, renderHTML } from './html'
import { listDependencies } from './deps'
import { parseYAML } from './yaml'
import { minifyCSS } from './css'


// only processed file types
const TYPES = {
  '.html.js': 'application/javascript',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.html': 'text/html',
  '.css': 'text/css',
}

export function createAsset(file, files) {
  const { path, ext } = file
  let cachedObj = null

  async function data() {
    return await readData(file.dir, files)
  }

  // private
  async function linkedPaths() {
    const { lib, use, use_local_css } = await data()
    const paths = files.map(el => el.path)
    return listDependencies(path, { paths, lib, use, use_local_css })
  }

  async function assets() {
    const paths = await linkedPaths()
    const linkedFiles = paths.map(path => files.find(file => file.path == path))
    return linkedFiles.map(file => createAsset(file, files))
  }

  function flush() {
    cachedObj = null
    file.flush()
  }

  async function document() {
    if (!cachedObj) {
      const str = await file.text()
      cachedObj = file.is_md ? nuedoc(str) : parseNue(str)
    }
    return cachedObj
  }

  async function isDHTML() {
    if (!file.is_html) return false
    const { doctype } = await document()
    return doctype == 'dhtml'
  }

  async function isPage() {
    if (!file.is_html) return false
    const { doctype } = await document()
    return doctype == 'html'
  }

  async function isSPA() {
    return file.base == 'index.html' && await isDHTML()
  }

  async function components() {
    const dhtml = await isDHTML()
    const arr = await assets()
    const ret = []

    for (const asset of arr.filter(el => el.is_html)) {
      const { doctype, elements } = await asset.document()
      const reactive = await asset.isDHTML()

      // client components
      if (dhtml && reactive) ret.push(...elements)

      // server components
      if (!dhtml && !reactive) ret.push(...elements)
    }

    return ret
  }

  async function render(minify) {
    const asset = createAsset(file, files)

    return file.is_js && minify || file.is_ts ? compileJS(file.rootpath, minify)
      : file.is_svg && (await data()).process_svg ? renderSVG(asset, minify)
      : file.is_css && minify ? minifyCSS(await file.text())
      : file.is_md ? await renderMD(asset, minify)
      : file.is_html ? await renderHTML(asset)
      : null
  }

  async function toExt() {
    return await isDHTML() ? '.html.js'
      : file.is_md ? '.html'
      : file.is_ts ? '.js'
      : file.ext
  }

  async function contentType() {
    return TYPES[await toExt()]
  }

  return {
    ...file, data, assets, document, flush, components,
    render, isDHTML, isSPA, isPage, toExt, contentType,
  }

}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}

export async function readData(dir, files) {
  const dirs = ['', ...parseDirs(dir)]
  const ret = {}
  const use = []

  for (const cwd of dirs) {
    const path = join(cwd, cwd ? 'app.yaml' : 'site.yaml')
    const file = files.find(el => el.path == path)
    if (file) {
      const data = parseYAML(await file.text())
      if (Array.isArray(data.use)) use.push(...data.use)
      Object.assign(ret, data)
    }
  }

  return { ...ret, use }
}


export async function compileJS(path, minify, bundle) {
  const result = await Bun.build({
    external: bundle ? undefined : ['*'],
    entrypoints: [path],
    target: 'browser',
    minify
  })

  const [ js ] = result.outputs
  return await js.text()
}



