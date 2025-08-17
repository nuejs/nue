
import { mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { parseYAML } from './tools/yaml'
import { fswalk } from './tools/fswalk'

import { createAsset } from './asset'
import { createFile } from './file'

const IGNORE = `node_modules .toml .rs .lock package.json .lockb lock.yaml README.md Makefile`.split(' ')

export async function readAssets(root, is_prod) {

  // site config
  const conf = await readSiteYAML(root)
  if (!conf) return console.error('Not a Nue directory')

  // files
  const ignore = [...IGNORE, ...(conf.ignore || [])]
  ignore.push(conf.server?.dir || join('@system', 'server'))

  const paths = await fswalk(root, { ignore, followSymlinks: conf.follow_symlinks })
  const files = await Promise.all(paths.map(path => createFile(root, path)))

  // assets
  const assets = files.map(file => createAsset(file, files, is_prod))

  assets.get = function(path) {
    return assets.find(el => el.path == path)
  }

  assets.remove = function(path) {
    function splice(arr) {
      const i = arr.findIndex(el => el.path == path)
      if (i >= 0) arr.splice(i, 1)
    }
    splice(files)
    splice(assets)
  }

  assets.update = async function(path) {
    let asset = assets.get(path)

    // update existing
    if (asset) { asset.flush(); return asset }

    // add new one
    const file = await createFile(root, path)

    if (file) {
      files.push(file)
      asset = createAsset(file, files, is_prod)
      assets.push(asset)
      return asset
    }
  }

  return { assets, ignore }
}


export async function readSiteYAML(root) {
  const files = await readdir(root)

  // site.yaml
  if (files.includes('site.yaml')) {
    const file = Bun.file(join(root, 'site.yaml'))
    return await parseYAML(await file.text())
  }

  // empty conf
  const index = files.find(name => ['index.md', 'index.html'].includes(name))
  if (index) return {}
}

