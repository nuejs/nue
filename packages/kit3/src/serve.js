
import { sep } from 'node:path'
import { createServer, broadcast } from './tools/server'
import { getChain, findAsset } from './find'
import { fswatch } from './tools/fswatch'
import { fswalk } from './tools/fswalk'
import { createAsset } from './asset'
import { createPage } from './page'

const assetMap = new Map()

async function loadAssets() {
  const paths = await fswalk()
  for (const path of paths) putAsset(path, paths)
}

async function serve({ host, pathname, params }) {
  const { sitename, is_prod } = parseHost(host)

  // find asset
  const assets = [ ...assetMap.values() ] // .values() cannot be re-iterated
  const chain = await getChain(sitename, assets)
  const asset = await findAsset(pathname, chain, assets)

  // render page
  if (asset?.is_md) {
    return {
      content: await renderPage(asset, is_prod),
      type: 'text/html; charset=utf-8'
    }
  }

  // render page asset
  if (asset?.render) {
    const content = await asset.render(is_prod)
    return { content, type: await asset.contentType() }
  }

  return asset
}


async function renderPage(asset, is_prod) {
  const assets = [ ...assetMap.values() ]
  const chain = await getChain(asset.site, assets)
  const page = await createPage(asset, chain, assets)
  return await page.render(is_prod)
}

export async function start() {
  await loadAssets()

  const watcher = fswatch()

  watcher.onupdate = async path => {
    const asset = putAsset(path)

    if (asset.is_md) asset.content = await renderPage(asset)
    if (asset.is_css) asset.content = await asset.render()

    if (asset.is_html) {
      const doc = await asset.parse()
      asset.is_dhtml = doc.is_dhtml
      asset.is_lib = doc.is_lib
    }

    broadcast(asset)
  }

  watcher.onremove = path => {
    const asset = assetMap.get(path)

    if (asset) {
      assetMap.delete(path)
      broadcast({ remove: asset })
    }
  }

  // dev server
  const server = createServer({ port: 5050 }, serve)

  // print
  console.log(getSitenames(assetMap.keys()))
}

function parseHost(host) {
  const els = host.split('.')
  const sitename = els.length == 1 ? '@base' : els[0]
  const is_prod = els.pop() == 'production'
  return { sitename, is_prod }
}

function putAsset(path, paths=assetMap.keys()) {
  const sitenames = getSitenames(paths)
  const sitename = parseSitename(path, sitenames)
  const asset = createAsset(path, sitename)
  assetMap.set(path, asset)
  return asset
}

export function getSitenames(paths) {
  const filenames = ['site.yaml', 'index.md', 'index.html']
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




