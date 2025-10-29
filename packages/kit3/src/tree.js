
import { sep, join } from 'node:path'

import { renderAsset, renderFeed } from './render/asset'
import { createAsset } from './asset'
import { fswalk } from './tools/fswalk'
import { findAsset } from './find'


export function createTree() {
  const map = new Map()

  // _paths for testing
  async function load(_paths) {
    const paths = _paths || await fswalk()
    for (const path of paths) update(path, paths)
  }

  function update(path, paths=map.keys()) {
    const sites = getSitenames(paths)
    const site = parseSitename(path, sites)
    const asset = createAsset(path, site)
    map.set(path, asset)
  }

  function getAll() {
    return [ ...map.values() ]
  }

  async function render(url) {
    if (typeof url == 'string') url = { pathname: url, host: '' }

    const { pathname, host } = url
    const { site, is_prod } = parseHost(host)
    const assets = getAll()
    const chain = await getChain(site, assets)
    const asset = await findAsset(pathname, chain, assets)

    if (pathname.endsWith('.xml')) {
      const content = asset ? await asset.read()
        : await renderFeed(pathname, site, await getConf(chain), assets)

      return content && { content, type: MIME.xml }
    }

    if (asset) {
      let content = await renderAsset(asset, chain, assets, is_prod)
      const is_js = pathname.endsWith('.js')
      if (content.html) content = is_js ? content.js : content.html
      return { content, type: is_js ? MIME.js : getMimeType(asset) }
    }
  }

  async function getConf(chain) {
    if (!chain) chain = [null, '@base']

    for (const name of chain) {
      const yaml = getAll().find(el => el.site == name && el.path == 'site.yaml')
      if (yaml) return yaml.parse()
    }
  }

  return {
    delete: path =>  map.delete(path),
    get: path =>  map.get(path),
    getConf,
    update,
    getAll,
    render,
    load,
  }

}

export function parseHost(host) {
  const els = host.split('.')
  const site = els.length == 1 ? null : els[0]
  return { site, is_prod: host.includes('production') }
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

