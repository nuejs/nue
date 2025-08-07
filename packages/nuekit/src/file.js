
import { parse, sep, join } from 'node:path'
import { lstat } from 'node:fs/promises'

export async function createFile(root, path) {
  try {
    const rootpath = join(root, path)
    const stat = await lstat(rootpath)
    const info = getFileInfo(path)
    const file = Bun.file(rootpath)
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

    return { ...info, rootpath, mtime, text, copy, write, flush }

  } catch (error) {
    console.warn(`Warning: Error reading ${path}: ${error.message}`)
    return null
  }
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

export function toURL(file) {
  let { name, base, ext, dir } = file
  if (name == 'index') name = ''
  if (ext == '.md' || base == 'index.html') ext = ''
  if (ext == '.ts') ext = '.js'
  const els = dir.split(sep)
  els.push(name + ext)

  return `/${ els.join('/') }`.replace('//', '/')
}

