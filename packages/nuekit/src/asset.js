
// import { normalize, sep, join } from 'node:path'
import { parseNue } from 'nuedom'
import { parseNuemark } from 'nuemark'

import { parseYAML } from './tools/yaml'
import { minifyCSS } from './tools/css'

import { renderMD, renderSVG, renderHTML } from './html'
import { getCollections } from './collections'
import { listDependencies } from './deps'

export function createAsset(file, files=[]) {
  let cachedDoc = null

  function flush() {
    cachedDoc = null
    file.flush()
  }

  function toAssets(paths) {
    const arr = paths.map(path => files.find(file => file.path == path))
    return arr.map(file => createAsset(file, files))
  }

  function getDeps(exclude, strict) {
    const paths = files.map(f => f.path)
    const deps = listDependencies(file.path, { paths, exclude, strict })
    return toAssets(deps)
  }

  async function collections(opts) {
    if (!opts) return
    const paths = files.filter(f => f.is_md).map(f => f.path)
    return await getCollections(toAssets(paths), opts)
  }

  async function data() {
    const yaml = getDeps().filter(f => f.is_yaml)
    const data = {}

    for (const file of yaml) {
      Object.assign(data, parseYAML(await file.text()))
    }

    // content collections
    Object.assign(data, await collections(data.collections))

    return data
  }

  async function assets() {
    const { exclude, design } = await data()
    return getDeps(exclude, design?.strict)
  }

  async function document() {
    if (!cachedDoc) {
      const str = await file.text()
      cachedDoc = file.is_md ? parseNuemark(str) : parseNue(str)
    }
    return cachedDoc
  }

  async function isPage() {
    if (!file.is_html) return false
    const { doctype } = await document()
    return doctype == 'html'
  }

  async function isDHTML() {
    if (!file.is_html) return false
    const { doctype } = await document()
    return doctype == 'dhtml'
  }

  async function isSPA() {
    return file.base == 'index.html' && await isDHTML()
  }

  async function toExt() {
    return await isDHTML() ? '.html.js'
      : file.is_md ? '.html'
      : file.is_ts ? '.js'
      : file.ext
  }

  async function contentType() {
    const types = {
      '.html.js': 'application/javascript',
      '.js': 'application/javascript',
      '.svg': 'image/svg+xml',
      '.html': 'text/html',
      '.css': 'text/css',
    }

    return types[await toExt()]
  }

  async function components() {
    const dhtml = await isDHTML()
    const arr = await assets()
    const ret = []

    for (const asset of arr.filter(el => el.is_html)) {
      const { doctype, elements } = await asset.document()
      const reactive = await asset.isDHTML()
      const comps = asset.path == file.path ? elements.slice(1) : elements

      // client components (reactive)
      if (dhtml && reactive) ret.push(...comps)

      // server components (layout modules)
      if (!dhtml && !reactive) ret.push(...comps)
    }

    return ret
  }

  async function render(is_prod) {
    const asset = createAsset(file, files)

    return file.is_js && is_prod || file.is_ts ? compileJS(file.rootpath, is_prod)
      : file.is_svg && (await data()).process_svg ? renderSVG(asset, is_prod)
      : file.is_css && is_prod ? minifyCSS(await file.text())
      : file.is_html ? await renderHTML(asset, is_prod)
      : file.is_md ? await renderMD(asset, is_prod)
      : null
  }

  return {
    ...file, flush, data, assets, document, components,
    isDHTML, isSPA, isPage, toExt, contentType, render
  }
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

