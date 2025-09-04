
import { parseNuemark } from 'nuemark'
import { parseYAML } from 'nueyaml'
import { parseNue } from 'nuedom'

import { minifyCSS } from './tools/css'
import { renderSVG } from './render/svg'
import { renderMD, renderHTML } from './render/page'
import { getCollections } from './collections'
import { mergeConf, mergeData } from './conf'
import { listDependencies } from './deps'


export function createAsset(file, files=[], conf={}) {
  let cachedObj = null

  function flush() {
    cachedObj = null
    file.flush()
  }

  function toAssets(paths) {
    const arr = paths.map(path => files.find(file => file.path == path))
    return arr.map(file => createAsset(file, files, conf))
  }

  function getDeps(opts={}) {
    const { include, exclude, design } = opts
    const paths = files.map(f => f.path)
    const deps = listDependencies(file.path, { paths, include, exclude, central: design?.central })
    return toAssets(deps)
  }

  async function config() {
    const asset = getDeps().find(f => f.base == 'app.yaml')
    return asset ? mergeConf(conf, await asset.parse()) : conf
  }

  async function data() {
    const yaml_files = getDeps().filter(f => f.is_yaml && f.name != 'site')
    const dataset = await Promise.all(yaml_files.map(f => f.parse()))
    const data = mergeData([ conf, ...dataset ])
    return await mergeCollections(data, conf.collections)
  }

  async function mergeCollections(data, opts) {
    if (opts) {
      const md_paths = files.filter(f => f.is_md).map(f => f.path)
      Object.assign(data, await getCollections(toAssets(md_paths), opts))
    }
    return data
  }

  // list all dependencies (public method)
  async function assets() {
    return getDeps(await config())
  }

  async function parse() {
    if (!cachedObj) {
      const str = await file.text()
      cachedObj = file.is_yaml ? parseYAML(str) : file.is_md ? parseNuemark(str) : parseNue(str)
    }
    return cachedObj
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
      const ast = await asset.parse()
      const { doctype='' } = ast

      if (ast.is_lib) {
        const same_type = is_dhtml == ast.is_dhtml
        const isomorphic = doctype.startsWith('html+dhtml')
        const forced = doctype.startsWith(force_type)
        if (isomorphic || same_type || forced) ret.push(...ast.lib)
      }
    }

    return ret
  }

  async function render(params) {
    const asset = createAsset(file, files, conf)
    const { is_prod } = conf

    if (file.is_svg) {
      const { svg } = await config()
      if (svg?.process) return await renderSVG(asset, { fonts: svg.fonts, ...params })
    }

    return file.is_js && is_prod || file.is_ts ? compileJS(file.rootpath, is_prod)
      : file.is_css && is_prod ? minifyCSS(await file.text())
      : file.is_html ? await renderHTML(asset)
      : file.is_md ? await renderMD(asset)
      : null
  }

  return { ...file, flush, config, data, assets, parse, components, toExt, contentType, render }
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

