
import { parse } from 'node:path'
import { fswalk } from './tools/fswalk'
import { createAsset } from './asset'
import { createFile } from './file'

export async function createSite(conf) {
  const { root, ignore } = conf

  // assets
  const paths = sortPaths(await fswalk(root, { ignore }))
  const files = await Promise.all(paths.map(path => createFile(root, path)))
  const assets = files.map(file => createAsset(file, files, conf))

  function get(path) {
    return assets.find(el => el.path == path)
  }

  function remove(path) {
    function splice(arr) {
      const i = arr.findIndex(el => el.path == path)
      if (i >= 0) arr.splice(i, 1)
    }
    splice(files)
    splice(assets)
  }

  async function update(path) {
    let asset = get(path)

    // update existing
    if (asset) { asset.flush(); return asset }

    // add new one
    const file = await createFile(root, path)

    if (file) {
      files.push(file)
      asset = createAsset(file, files, conf)
      assets.push(asset)
      return asset
    }
  }

  return { assets, conf, get, remove, update }
}

export function sortPaths(paths) {

  function prio(path) {
    const { dir, base } = parse(path)
    return base == dir.startsWith('@shared') ? 0 : !dir ? 2 : 1
  }

  return paths.sort((a, b) => {
    const prioA = prio(a)
    const prioB = prio(b)
    return prioA == prioB ? a.localeCompare(b) : prioA - prioB
  })

}
