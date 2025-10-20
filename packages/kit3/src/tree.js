
import { sep, join } from 'node:path'

import { renderAsset } from './render/asset'
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

    async function render(host) {
      const { site, is_prod } = parseHost(host)
      const chain = await getChain(site,  getAll())
      return await renderAsset(asset, chain,  getAll(), is_prod)
    }

    return { ...asset, render }
  }

  function getAll() {
    return [ ...map.values() ]
  }

  async function find(url) {
    const { site, is_prod } = parseHost(url.host)
    const assets = getAll()
    const chain = await getChain(site, assets)

    const asset = await findAsset(url.pathname, chain, assets)
    if (!asset) return null

    async function render() {
      return await renderAsset(asset, chain, assets, is_prod)
    }

    return { ...asset, render }
  }

  return {
    get: path =>  map.get(path),
    delete: path =>  map.delete(path),
    load, find, update, getAll,
  }

}

export function parseHost(host) {
  const els = host.split('.')
  const site = els.length == 1 ? '@base' : els[0]
  return { site, is_prod: host.includes('production') }
}

export function getSitenames(paths) {
  const filenames = ['@shared', 'site.yaml', 'index.md', 'index.html']
  const names = new Set()

  for (const path of paths) {
    const els = path.split(sep)

    for (const filename of filenames) {
      const i = els.indexOf(filename)
      if (i > 0) names.add(els[i -1])
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
  const asset = assets.find(el => el.site == site && el.path == 'site.yaml')
  if (asset) {
    const { extend } = await asset.parse()
    if (extend) return [ ...extend, site ]
  }
  return [ site ]
}
