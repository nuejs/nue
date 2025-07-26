
import { normalize, relative, parse, sep, join } from 'node:path'
import { lstat } from 'node:fs/promises'
import { nuedoc, elem } from 'nuemark'
import { parseNue } from 'nuedom'

import { listDependencies } from './deps.js'
import { parseYAML } from './yaml.js'


export function createAsset(file, files) {
  const { path, ext } = file
  let cachedObj = null

  async function data() {
    return await readData(file.dir, files)
  }

  // private
  async function linkedPaths() {
    const { lib, use } = await data()
    const paths = files.map(el => el.path)
    return listDependencies(path, { paths, lib, use })
  }

  async function assets() {
    const paths = await linkedPaths()
    const linkedFiles = paths.map(path => files.find(file => file.path == path))
    return linkedFiles.map(file => createAsset(file, files))
  }

  function flush() {
    cachedObj = null
    file.flush()
  }

  async function document() {
    if (!cachedObj) {
      const str = await file.text()
      cachedObj = file.is_md ? nuedoc(str) : parseNue(str)
    }
    return cachedObj
  }

  async function isDHTML() {
    if (!file.is_html) return false
    const { doctype } = await document()
    return doctype == 'dhtml'
  }

  async function isSPA() {
    return file.base == 'index.html' && await isDHTML()
  }

  async function components() {
    const dhtml = await isDHTML()
    const arr = await assets()
    const ret = []

    for (const asset of arr.filter(el => el.is_html)) {
      const { doctype, elements } = await asset.document()
      const reactive = await asset.isDHTML()

      // client components
      if (dhtml && reactive) ret.push(...elements)

      // server components
      if (!dhtml && !reactive) ret.push(...elements)
    }

    return ret
  }

  return { ...file, data, assets, document, flush, isDHTML, isSPA, components }
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

export function getFileInfo(path) {
  const info = parse(path)
  delete info.root

  const { ext, dir } = info
  const type = info.ext.slice(1)
  const url = toURL(info)

  if (dir.includes(sep)) info.basedir = dir.split(sep)[0]

  return { ...info, path, type, url, [`is_${type}`]: true }
}


export async function createFile(root, path) {
  try {
    const fullpath = join(root, path)
    const stat = await lstat(fullpath)
    const info = getFileInfo(path)
    const file = Bun.file(fullpath)
    const mtime = stat.mtime
    let cachedText = null

    // is_md, is_js, ...
    if (stat.isSymbolicLink()) info.is_symlink = true

    async function text() {
      if (!cachedText) cachedText = await file.text()
      return cachedText
    }

    function flush() {
      cachedText = null
    }

    async function copy(dist) {
      const to = join(dist, path)
      await Bun.write(to, file)
      return to
    }

    async function write(dist, content, ext) {
      const toname = ext ? info.base.replace(info.ext, ext) : info.base
      const to = join(dist, info.dir, toname)
      await Bun.write(to, content)
      return to
    }

    return { ...info, fullpath, mtime, text, copy, write, flush }

  } catch (error) {
    console.warn(`Warning: Error reading ${path}: ${error.message}`)
    return null
  }
}

export function toURL(file) {
  let { name, ext, dir } = file
  if (name == 'index') name = ''
  if (['.html', '.md'].includes(ext)) ext = ''
  if (ext == '.ts') ext = '.js'
  const els = dir.split(sep)
  els.push(name + ext)

  return `/${ els.join('/') }`.replace('//', '/')
}

export async function createAssets(root, paths) {
  const files = await Promise.all(paths.map(path => createFile(root, path)))
  const assets = files.map(file => createAsset(file, files))

  assets.get = function(path) {
    return assets.find(el => el.path == path)
  }

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


