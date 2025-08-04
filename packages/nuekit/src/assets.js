
import { join, extname, basename } from 'node:path'
import { mkdir, readdir } from 'node:fs/promises'

import { createAsset } from './asset'
import { createFile } from './file'
import { parseYAML } from './yaml'
import { fswalk } from './fswalk'

const IGNORE = `_* _*/** .* .*/** node_modules/** @system/worker/**\
 *.toml *.rs *.lock package.json bun.lockb pnpm-lock.yaml README.md`.split(' ')


export async function readAssets(root) {

  // site config
  const conf = await isNueDir(root)
  if (!conf) return console.error('Not a Nue directory')

  // files
  const ignore = [...IGNORE, ...(conf.ignore || [])]
  const paths = await fswalk(root, { ignore, followSymlinks: conf.follow_symlinks })
  const files = await Promise.all(paths.map(path => createFile(root, path)))

  // assets
  const assets = files.map(file => createAsset(file, files))

  assets.get = function(path) {
    return assets.find(el => el.path == path)
  }

  assets.remove = function(path) {
    const i = files.findIndex(el => el.path == path)
    if (i >= 0) files.splice(i, 1)
  }

  assets.update = async function(path) {
    let asset = assets.get(path)

    // update existing
    if (asset) { asset.flush(); return asset }

    // add new one
    const file = await createFile(root, path)

    if (file) {
      files.push(file)
      asset = createAsset(file, files)
      assets.push(asset)
      return asset
    }
  }

  return { assets, ignore }
}


async function isNueDir(root) {
  const files = await readdir(root)

  // site.yaml
  if (files.includes('site.yaml')) {
    const file = Bun.file(join(root, 'site.yaml'))
    return await parseYAML(await file.text())
  }

  // index file
  const index = files.find(name => ['index.md', 'index.html'].includes(name))
  if (index) return {}
}

