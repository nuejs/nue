
import { sep } from 'node:path'
import { createServer, broadcast } from './tools/server'
import { fswatch } from './tools/fswatch'
import { fswalk } from './tools/fswalk'
import { createAsset } from './asset'
import { findAsset } from './find'

const assets = new Map()

async function loadAssets() {
  const paths = await fswalk()
  for (const path of paths) putAsset(path, paths)
}

async function serve({ host, pathname, params }) {
  const { sitename, is_prod } = parseHost(host)

  // find asset
  const asset = await findAsset(pathname, sitename, assets)

  // render
  if (asset?.render) {
    const content = await asset.render(is_prod)
    return { content, type: await asset.contentType() }
  }

  return asset
}

export async function start() {
  await loadAssets()

  const watcher = fswatch()

  watcher.onupdate = async (path) => {
    broadcast({ path })
    putAsset(path)
  }

  watcher.onremove = (path) => {
    assets.delete(path.replaceAll(sep, '/'))
  }

  // dev server
  const server = createServer({ port: 5050 }, serve)

  // print
  console.log(getSitenames(assets.keys()))
}

function parseHost(host) {
  const els = host.split('.')
  const sitename = els.length == 1 ? '@base' : els[0]
  const is_prod = els.pop() == 'production'
  return { sitename, is_prod }
}

function putAsset(path, keys=assets.keys()) {
  const sitenames = getSitenames(keys)
  const sitename = parseSitename(path, sitenames)
  const asset = createAsset(path, sitename)
  const key = path.replaceAll(sep, '/').replace(asset.folder + '/', '')
  assets.set(key, asset)
}

export function getSitenames(keys) {
  const filenames = ['site.yaml', 'index.md', 'index.html']
  const names = new Set()

  for (const key of keys) {
    const els = key.split('/')

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




