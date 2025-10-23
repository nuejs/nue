
import { posix, parse } from 'node:path'
import { lstat } from 'node:fs/promises'

export async function createFile(root, path) {
  try {
    const rootpath = posix.join(root, path)
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
      const to = posix.join(dist, path)
      await Bun.write(to, file)
      return to
    }

    async function write(dist, content, ext) {
      const toname = ext ? info.base.replace(info.ext, ext) : info.base
      const to = posix.join(dist, info.dir, toname)
      await Bun.write(to, content)
      return to
    }

    return { ...info, rootpath: posix.normalize(rootpath), mtime, text, copy, write, flush }

  } catch (error) {
    console.warn(`Warning: Error reading ${path}: ${error.message}`)
    return null
  }
}

export function getFileInfo(path) {
  const info = parse(posix.normalize(path))
  delete info.root

  const { ext, dir } = info
  const type = info.ext.slice(1)
  const url = getURL(info)
  const slug = getSlug(info)

  if (dir.includes('/')) info.basedir = dir.split('/')[0]

  return { ...info, path: posix.normalize(path), type, url, slug, [`is_${type}`]: true }
}

export function getURL(file) {
  let { name, base, ext, dir } = file

  if (['.md', '.html'].includes(ext)) {
    if (name == 'index') name = ''
    ext = ''
  }

  if (ext == '.ts') ext = '.js'
  const els = dir ? dir.split('/') : []
  els.push(name + ext)

  return `/${ els.join('/') }`.replace('//', '/')
}

export function getSlug(file) {
  let { name, base, ext } = file
  return name == 'index' ? '' : ext == '.md' ? name : base
}
