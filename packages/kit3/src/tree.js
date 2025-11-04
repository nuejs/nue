
import { sep, join } from 'node:path'
import { compileNue } from 'nuedom'

import { renderAsset, renderFeed } from './render/asset'
import { createAsset } from './asset'
import { fswalk } from './tools/fswalk'
import { findAsset } from './find'
import { getDeps } from './deps'

export function createTree() {
  const map = new Map()

  // _paths for testing
  async function load(_paths) {
    const paths = _paths || await fswalk()
    for (const path of paths) update(path, paths)
  }

  function update(path, _paths) {
    const paths = _paths || [...map.keys()]
    const sites = getSitenames(paths)
    const site = parseSitename(path, sites)
    const asset = createAsset(path, site)
    map.set(path, asset)
    return asset
  }

  function getAll() {
    return [ ...map.values() ]
  }

  async function render(url) {
    if (typeof url == 'string') url = { pathname: url, host: '' }
    const { pathname, host } = url
    const { site, is_prod, chain, assets, asset } = await getThings(url)

    if (pathname.endsWith('.xml')) {
      const content = asset ? await asset.read()
        : await renderFeed(pathname, site, await getConf(chain), assets)
      return content && { content, type: MIME.xml }
    }

    if (asset && pathname.endsWith('.html.js')) {
      return { content: compileNue(await asset.parse()), type: MIME.js }
    }

    if (asset) {
      const content = await renderAsset(asset, chain, assets, is_prod)
      return { content, type: getMimeType(asset) }
    }
  }

  async function getThings(url) {
    const { site, is_prod } = parseHost(url.host)
    const assets = getAll()
    const chain = await getChain(site, assets)
    const asset = await findAsset(url.pathname, chain, assets)
    return { site, is_prod, chain, assets, asset }
  }

  async function build(asset) {
    const assets = getAll()
    const chain = await getChain(asset.site, assets)
    return await renderAsset(asset, chain, assets, true)
  }

  async function dependsOn(url, path) {
    const els = await getThings(url)
    const deps = await getDeps(els.asset, els.chain, els.assets)
    return deps.some(el => el.path == path)
  }

  async function getConf(chain) {
    if (!chain) chain = [null, '@base']

    for (const name of chain) {
      const yaml = getAll().find(el => el.site == name && el.path == 'site.yaml')
      if (yaml) return yaml.parse()
    }

    return {}
  }

  // Tree API
  return {
    delete: path =>  map.delete(path),
    get: path =>  map.get(path),
    dependsOn,
    getConf,
    update,
    getAll,
    render,
    build,
    load,
  }

}

export function parseHost(host) {
  const prod = 'production'
  const els = host.split('.')
  const site = els.length == 1 ? null : els[0]
  if (site == prod) return { site: null, is_prod: true }
  return { site, is_prod: host.includes(prod) }
}

export function getSitenames(paths) {
  const filenames = ['@shared', 'site.yaml', 'index.md', 'index.html']
  const names = new Set()

  // build a map of which directories have marker files
  const dirsWithMarkers = new Set()
  for (const path of paths) {
    const els = path.split('/')
    for (let i = 0; i < els.length; i++) {
      if (filenames.includes(els[i])) {
        dirsWithMarkers.add(els.slice(0, i).join('/'))
      }
    }
  }

  // for each path, find the shortest dir with a marker
  for (const path of paths) {
    const els = path.split('/')
    for (let i = 1; i < els.length; i++) {
      const dir = els.slice(0, i).join('/')
      if (dirsWithMarkers.has(dir)) {
        names.add(els[i - 1])
        break
      }
    }
  }

  return [...names]
}


export function parseSitename(path, names) {
  for (const name of names) {
    const els = path.split(sep)
    if (els.includes(name)) return name
  }
}

export async function getChain(site, assets) {
  if (site == null) return [ null, '@base' ]

  const asset = assets.find(el => el.site == site && el.path == 'site.yaml')
  if (asset) {
    const { extend } = await asset.parse()
    if (extend) return [ ...extend, site ]
  }

  return [ site ]
}


const MIME = {
  xml: 'application/xml; charset=utf-8',
  html: 'text/html; charset=utf-8',
  js: 'application/javascript',
}

function getMimeType(asset) {
  return asset.is_ts ? MIME.js : asset.is_md ? MIME.html : (MIME[asset.type] || asset.file?.type)
}

