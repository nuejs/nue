
// import { normalize, sep, join } from 'node:path'
import { parseNue } from 'nuedom'
import { parseNuemark } from 'nuemark'

import { parseYAML } from './tools/yaml'
import { minifyCSS } from './tools/css'

import { renderSVG,  } from './render/svg'
import { renderMD, renderHTML } from './render/page'
import { getCollections } from './collections'
import { listDependencies } from './deps'

export function createAsset(file, files=[], is_prod) {
  let cachedAST = null

  function flush() {
    cachedAST = null
    file.flush()
  }

  function toAssets(paths) {
    const arr = paths.map(path => files.find(file => file.path == path))
    return arr.map(file => createAsset(file, files))
  }

  function getDeps(exclude, central) {
    const paths = files.map(f => f.path)
    const deps = listDependencies(file.path, { paths, exclude, central })
    return toAssets(deps)
  }

  async function collections(opts) {
    if (!opts) return
    const paths = files.filter(f => f.is_md).map(f => f.path)
    return await getCollections(toAssets(paths), opts)
  }

  async function data() {
    const yaml = getDeps().filter(f => f.is_yaml)
    const data = { is_prod }

    for (const file of yaml) {
      Object.assign(data, parseYAML(await file.text()))
    }

    // content collections
    Object.assign(data, await collections(data.collections))

    return data
  }

  async function assets() {
    const { exclude, design } = await data()
    return getDeps(exclude, design?.central)
  }

  async function parse() {
    if (!cachedAST) {
      const str = await file.text()
      cachedAST = file.is_md ? parseNuemark(str) : parseNue(str)
    }
    return cachedAST
  }

  async function toExt() {
    if (file.is_html) {
      const { is_dhtml } = await parse()
      if (is_dhtml) return '.html.js'
    }
    return file.is_md ? '.html' : file.is_ts ? '.js' : file.ext
  }

  async function contentType() {
    const types = {
      '.html.js': 'application/javascript',
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript',
      '.svg': 'image/svg+xml',
      '.css': 'text/css',
    }

    return types[await toExt()]
  }

  async function components(force_type) {
    const { is_dhtml=false } = await parse()
    const ret = []

    for (const asset of (await assets()).filter(el => el.is_html)) {
      const { doctype, lib } = await asset.parse()

      if (doctype?.endsWith('lib')) {
        const same_type = is_dhtml == doctype.startsWith('dhtml')
        const isomorphic = doctype.startsWith('html+dhtml')
        const forced = doctype.startsWith(force_type)
        if (isomorphic || same_type || forced) ret.push(...lib)
      }
    }

    return ret
  }

  async function render(params) {
    const asset = createAsset(file, files)

    if (file.is_svg) {
      const { svg } = await data()
      if (svg?.process) return await renderSVG(asset, { fonts: svg.fonts, ...params })
    }

    return file.is_js && is_prod || file.is_ts ? compileJS(file.rootpath, is_prod)
      : file.is_css && is_prod ? minifyCSS(await file.text())
      : file.is_html ? await renderHTML(asset)
      : file.is_md ? await renderMD(asset)
      : null
  }

  return { ...file, flush, data, assets, parse, components, toExt, contentType, render }
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

