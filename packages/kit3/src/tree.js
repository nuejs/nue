
import { sep, join } from 'node:path'

import { renderAsset } from './render/asset'
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
    const sites = getSitenames([...paths, path ])
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
    const env = await getEnv(url)

    // refresh page before rendering
    if (!env.is_prod && env.asset?.is_md) await update(env.asset.filepath)

    return await renderAsset(env)
  }

  async function build(asset) {
    const assets = getAll()
    const chain = await getChain(asset.site, assets)
    return await renderAsset(asset, chain, assets, true)
  }

  async function dependsOn(url, path) {
    const env = await getEnv(url)
    const deps = await getDeps(env.asset, env.chain, env.assets)
    return deps.some(el => el.path == path)
  }

  async function getConf(chain) {
    if (!chain) chain = [null, '@base']
    const conf = {}

    for (const name of chain) {
      const yaml = getAll().find(el => el.site == name && el.path == 'site.yaml')
      if (yaml) Object.assign(conf, await yaml.parse())
    }

    return conf
  }


  async function getEnv(url) {
    const { pathname } = url
    const { site, is_prod } = parseHost(url.host)
    const assets = getAll()
    const chain = await getChain(site, assets)
    const asset = await findAsset(pathname, chain, assets)
    const conf = await getConf(chain)
    return { pathname, site, is_prod, chain, assets, asset, conf }
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

export function parseHost(hostname) {
  const is_prod = hostname.includes('production')

  let host = hostname.replace('production.', '').replace('localhost', '')

  const els = host.split('.')
  const site = els.length == 1 ? null : els.slice(0, -1).join('.')
  return { site, is_prod }
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
