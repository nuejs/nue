
import { posix, parse } from 'node:path'
import { fswalk } from './tools/fswalk'
import { createAsset } from './asset'
import { createFile } from './file'

export async function createSite(conf) {
  const { root, ignore } = conf

  // assets
  const paths = sortAssets(await fswalk(root, { ignore }))
  const files = await Promise.all(paths.map(path => createFile(root, path)))

  // createAsset options
  const site_opts = { files, conf }

  const assets = files.map(file => createAsset(file, site_opts))

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
      asset = createAsset(file, site_opts)
      assets.push(asset)

      sortAssets(files)
      sortAssets(assets)
      return asset
    }
  }

  return { assets, conf, get, remove, update }

}

export function sortAssets(items) {

  function prio(path) {
    const { dir, base } = parse(path)
    return base == dir.startsWith('@shared') ? 0 : !dir ? 2 : 1
  }

  return items.sort((a, b) => {
    if (a.path) { a = a.path; b = b.path }
    const prioA = prio(a)
    const prioB = prio(b)
    return prioA == prioB ? a.localeCompare(b) : prioA - prioB
  })

}


export async function mergeSharedData(assets, data={}) {
  const SHARED_DATA_DIR = '@shared/data';

  const shared = assets.filter(a => {
    const dir = a.dir ? posix.normalize(a.dir) : null
    return dir?.startsWith(SHARED_DATA_DIR);
  });
  const statics = shared.filter(f => f.is_json || f.is_yaml)

  const dataset = await Promise.all(statics.map(f => f.parse()))

  dataset.forEach(more => Object.assign(data, more))

  // modifier scripts
  const mods = shared.filter(f => (f.is_js || f.is_ts) && !f.name?.endsWith('.test'))

  for (const mod of mods) {
    const fns = await mod.parse()
    await fns.default?.(data)
  }

  return data
}
