
// import { normalize, sep, join } from 'node:path'
import { parseNue } from 'nuedom'
import { parseNuemark } from 'nuemark'

import { parseYAML } from './tools/yaml'
import { minifyCSS } from './tools/css'

import { renderSVG,  } from './render/svg'
import { renderMD, renderHTML } from './render/page'
import { getCollections } from './collections'
import { listDependencies } from './deps'


// configuration properties (separate from )
const CONF = 'collections content design exclude import_map include port server site svg'.split(' ')

export function createAsset(file, files=[], is_prod=false) {
  let cachedObj = null

  function flush() {
    cachedObj = null
    file.flush()
  }

  function toAssets(paths) {
    const arr = paths.map(path => files.find(file => file.path == path))
    return arr.map(file => createAsset(file, files))
  }

  function getDeps({ include, exclude, design }) {
    const paths = files.map(f => f.path)
    const deps = listDependencies(file.path, { paths, include, exclude, central: design?.central })
    return toAssets(deps)
  }

  async function collections(opts) {
    if (!opts) return
    const md_paths = files.filter(f => f.is_md).map(f => f.path)
    return await getCollections(toAssets(md_paths), opts)
  }

  async function config() {
    const ret = { is_prod }
    const conf_files = getDeps({}).filter(f => f.is_yaml && ['site', 'app'].includes(f.name))

    for (const asset of conf_files) {
      const data = await asset.parse()
      const is_site = asset.name == 'site'

      Object.entries(data).forEach(([key, val]) => {
        if (CONF.includes(key)) {
          if (is_site) ret[key] = structuredClone(val)
          else mergeAppConfig(ret, key, val)
        }
      })
    }
    return ret
  }

  async function data() {
    const ret = { is_prod }

    for (const asset of getDeps({}).filter(f => f.is_yaml)) {
      const data = await asset.parse()

      Object.entries(data).forEach(([key, val]) => {
        if (key == 'meta') return Object.assign(ret, val)
        if (!CONF.includes(key)) ret[key] = val
      })

      // production override
      if (is_prod && asset.path == 'site.yaml') {
        Object.assign(ret, data.production)
      }
    }

    // content collections
    const conf = await config()
    Object.assign(ret, await collections(conf.collections))

    // delete production node
    delete ret.production

    return ret
  }

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
      const { doctype } = ast

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
    const asset = createAsset(file, files)

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

// CONF keys only
export function mergeAppConfig(conf, key, val) {

  // site level only
  if ('site design server production port'.split(' ').includes(key)) return

  // extend collections
  if (key == 'collections') return conf[key] = { ...conf.collections, ...val }


  // merge meta / content
  if (['meta', 'content'].includes(key) && typeof val == 'object') {
    return conf[key] = { ...conf[key], ...val }
  }

  // override
  return conf[key] = val
}


