
import { parse, sep, join } from 'node:path'
import { lstat } from 'node:fs/promises'

// Normalize path separators to POSIX format (forward slashes)
function toPosix(path) {
  return path.split(sep).join('/')
}

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

    return { ...info, rootpath: toPosix(rootpath), mtime, text, copy, write, flush }

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
  const url = getURL(info)
  const slug = getSlug(info)

  if (dir.includes('/')) info.basedir = dir.split('/')[0]

  return { ...info, path: toPosix(path), type, url, slug, [`is_${type}`]: true }
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
