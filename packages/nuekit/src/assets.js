
import { lstat } from 'node:fs/promises'
import { normalize, relative, parse, sep, join } from 'node:path'

import { listDependencies } from './deps.js'
import { parseYAML } from './yaml.js'


export function createAsset(file, files) {
  const { path, ext } = file
  const kind = `is_${ext.slice(1)}`

  async function data() {
    return await readData(file.dir, files)
  }

  async function deps() {
    const { lib, use } = await data()
    const paths = files.map(el => el.path)
    return listDependencies(path, { paths, lib, use })
  }

  async function lib() {
    const ret = []
    await deps().filter(el => el.ext == '.html').forEach(async file => {
      const pate = await parsePage()
      ret.push(...page.tags)
    })
    return ret
  }

  return { ...file, data, deps, lib, [kind]: true }
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}

export async function readData(dir, files) {
  const ret = {}
  const use = []

  for (const cwd of ['', ...parseDirs(dir)]) {
    const path = join(cwd, cwd ? 'app.yaml' : 'site.yaml')
    const file = files.find(el => el.path == path)
    if (file) {
      const data = parseYAML(await file.read())
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

    // cached content
    let text

    delete info.root
    if (stat.isSymbolicLink()) info.is_symlink = true
    if (info.dir.includes(sep)) info.basedir = info.dir.split(sep)[0]

    async function read() {
      if (!text) text = await file.text()
      return text
    }

    async function copy(dist) {
      await Bun.write(join(dist, path), file)
    }

    async function write(dist, content) {
      await Bun.write(join(dist, path), content)
    }

    return { ...info, path, fullpath, mtime, read, copy, write, flush() { text = null } }

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


