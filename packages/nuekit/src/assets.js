
import { normalize, relative, parse, sep, join } from 'node:path'
import { lstat } from 'node:fs/promises'
import { parseNue } from 'nuedom'

import { listDependencies } from './deps.js'
import { parseYAML } from './yaml.js'


export function createAsset(file, files) {
  const { path, ext } = file

  async function data() {
    return await readData(file.dir, files)
  }

  async function deps() {
    const { lib, use } = await data()
    const paths = files.map(el => el.path)
    return listDependencies(path, { paths, lib, use })
  }

  async function assets() {
    const paths = await deps()
    return paths.map(path => files.find(file => file.path == path))
  }

  async function serverComponents() {
    const arr = await assets()
    const ret = []

    for (const asset of arr.filter(el => el.is_html)) {
      const { doctype, elements } = await parseNue(await asset.text())
      if (doctype != 'dhtml') ret.push(...elements)
    }

    return ret
  }

  return { ...file, data, assets, serverComponents }
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}

export async function readData(dir, files) {
  const dirs = ['', ...parseDirs(dir)]
  const ret = {}
  const use = []

  for (const cwd of dirs) {
    const path = join(cwd, cwd ? 'app.yaml' : 'site.yaml')
    const file = files.find(el => el.path == path)
    if (file) {
      const data = parseYAML(await file.text())
      if (Array.isArray(data.use)) use.push(...data.use)
      Object.assign(ret, data)
    }
  }

  return { ...ret, use }
}

export async function createFile(root, path) {
  try {
    const fullpath = join(root, path)
    const stat = await lstat(fullpath)
    const info = parse(path)
    const file = Bun.file(fullpath)
    const mtime = stat.mtime

    // is_md, is_js, ...
    info[`is_${info.ext.slice(1)}`] = true

    // cached text content
    let cached

    delete info.root
    if (stat.isSymbolicLink()) info.is_symlink = true
    if (info.dir.includes(sep)) info.basedir = info.dir.split(sep)[0]

    async function text() {
      if (!cached) cached = await file.text()
      return cached
    }

    async function copy(dist) {
      await Bun.write(join(dist, path), file)
    }

    async function write(dist, content, ext) {
      const toname = ext ? file.base.replace(file.ext, ext) : file.base
      await Bun.write(join(dist, info.dir, toname), content)
    }

    return { ...info, path, fullpath, mtime, text, copy, write, flush() { cached = null } }

  } catch (error) {
    console.warn(`Warning: Error reading ${path}: ${error.message}`)
    return null
  }
}

export async function createAssets(root, paths) {
  const files = await Promise.all(paths.map(path => createFile(root, path)))
  const assets = files.map(file => createAsset(file, files))

  assets.remove = function(path) {
    const i = files.findIndex(el => el.path == path)
    if (i >= 0) files.splice(i, 1)
  }

  assets.update = function(path) {
    const asset = assets.find(el => el.path == path)
    return asset?.flush()
  }

  return assets
}


