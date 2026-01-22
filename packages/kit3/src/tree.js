
import { sep, join } from 'node:path'

import { generateSitemap, generateFeed } from './render/feed'
import { renderAsset, MIME } from './render/asset'
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

    if (site) {
      const asset = createAsset(path, site)
      map.set(path, asset)
      return asset
    }
  }

  function getAll() {
    return [ ...map.values() ]
  }

  async function renderURL(url) {
    if (typeof url == 'string') url = { pathname: url, host: '' }
    const { pathname } = url
    const site = parseHost(url.host)

    if (['/sitemap.xml', '/feed.xml'].includes(pathname)) {
      const content = await renderFeed(site, pathname.slice(1))
      return { content, type: MIME.xml }
    }

    const assets = getAll()
    const chain = await getChain(site)
    const asset = await findAsset(pathname, chain, assets)

    // update page before rendering
    if (asset?.is_md) await update(asset.filepath)

    const as_js = pathname.endsWith('.html.js')
    return await renderAsset(asset, { chain, assets, as_js })
  }

  async function renderFeed(site, filename) {
    const pages = getAll().filter(el => el.is_md && el.site == site)
    const fn = filename == 'feed.xml' ? generateFeed : generateSitemap
    return await fn(pages, await getConf(site))
  }

  async function buildFeed(site, filename) {
    const xml = await renderFeed(site, filename)
    if (xml) {
      const path = join('.dist', site, filename)
      await Bun.file(path).write(xml)
      return path
    }
  }

  async function buildAsset(asset, opts={}) {
    const { is_prod = true, dist = '.dist' } = opts
    const chain = await getChain(asset.site)
    const ret = await renderAsset(asset, { assets: getAll(), chain, is_prod })

    if (ret && dist) {
      const path = join(dist, join(asset.site, asset.path).replace('.md', '.html'))
      await Bun.file(path).write(ret.content)
    }

    return ret?.content
  }

  async function getChain(site) {
    if (site == null) return [ null, '@base' ]

    const asset = getAll().find(el => el.site == site && el.path == 'site.yaml')
    if (asset) {
      const { extend } = await asset.parse()
      if (extend) return [ ...extend, site ]
    }

    return [ site ]
  }

  async function getConf(site) {
    const chain = await getChain(site)
    const conf = {}

    for (const name of chain) {
      const yaml = getAll().find(el => el.site == name && el.path == 'site.yaml')
      if (yaml) Object.assign(conf, await yaml.parse())
    }

    return conf
  }

  function remove(path) {
    const asset = map.get(path)
    if (asset) {
      map.delete(path)
      return asset
    }
  }

  // Tree API
  return {
    get: path =>  map.get(path),
    buildAsset,
    buildFeed,
    renderURL,
    getChain,
    getConf,
    update,
    remove,
    getAll,
    load,
  }

}

export function parseHost(hostname) {
  const i = hostname.lastIndexOf('.')
  return i > 0 ? hostname.slice(0, i) : null
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


