
// cross-platform walk & file watching library (Nue specific)

import { watch, promises as fs } from 'node:fs'
import { join, parse } from 'node:path'


// for avoiding double events
let last = {}

export async function fswatch(root, callback, onremove) {

  const watchers = {}

  async function watchLink(link) {
    const real = await fs.realpath(link.path)
    const is_dir = (await fs.lstat(real)).isDirectory()

    const watcher = watch(real, { recursive: is_dir }, (e, path) => {
      if (is_dir) {
        path = join(link.name, path)
        const file = parse(path)
        callback({ path, ...file })

      } else {
        callback(link)
      }
    })

    watchers[link.path] = watcher
  }

  // watch symlinks
  const paths = await fswalk({ root, symdirs: false })

  for (const path of paths) {
    const file = parse(path)

    if (isLegit(file)) {
      const stat = await fs.lstat(join(root, path))
      if (stat.isSymbolicLink()) {
        watchLink({ ...file, path })
      }
    }
  }

  return watch(root, { recursive: true }, async function(e, path) {
    // handle (neo)vim file saves
    if (path.endsWith('~')) path = path.slice(0, -1)
    // handle helix file saves
    else if (path.endsWith('.bck')) path = path.slice(0, -10) // 6 char hash + 4 char ext

    try {
      const file = parse(path)
      file.path = path

      // skip paths (files and dirs) that start with _ or .
      if (!isLegit(file)) return

      // skip double events (not needed anymore?)
      if (last.path == path && Date.now() - last.ts < 50) return

      const stat = await fs.lstat(join(root, path))

      // deploy everything on a directory
      if (stat.isDirectory() || stat.isSymbolicLink() && await isSymdir(path)) {
        const paths = await fswalk(root, path)

        for (const path of paths) {
          const file = parse(path)
          if (isLegit(file)) await callback(file)
        }

      } else if (file.ext) {
        if (stat.isSymbolicLink()) await watchLink(file)
        await callback(file)
      }

      last = { path, ts: Date.now() }

    } catch (e) {
      if (e.errno != -2) return console.error(e)
      await onremove(path)

      // unwatch symlink
      const watcher = watchers[path]
      if (watcher) watcher.close()
    }
  })
}


export async function fswalk(opts, _dir = '', _ret = []) {
  if (typeof opts == 'string') opts = { root: opts }
  const { root, symdirs = true } = opts


  const files = await fs.readdir(join(root, _dir), { withFileTypes: true })

  for (const f of files) {
    if (isLegit(f)) {
      const path = join(_dir, f.name)
      const is_symdir = symdirs && f.isSymbolicLink() && await isSymdir(join(root, path))

      if (f.isDirectory() || is_symdir) await fswalk(opts, path, _ret)
      else _ret.push(path)
    }
  }
  return _ret
}

const IGNORE = ['node_modules', 'functions', 'package.json', 'bun.lockb', 'pnpm-lock.yaml', 'README.md', 'model-rs']
const IGNORE_EXT = ['.toml', '.rs', '.lock']

function ignore(name = '') {
  return '._'.includes(name[0]) || IGNORE.includes(name)
}

function isLegit(file) {
  let is_bad = ignore(file.name) || ignore(file.base) || ignore(file.dir)
  if (file.name && !file.ext) {
    const { ext, base } = parse(file.name)
    if (IGNORE_EXT.includes(ext) || base.endsWith('.test.js')) is_bad = true
  }
  return !is_bad
}


async function isSymdir(linkpath) {
  const real = await fs.realpath(linkpath)
  return (await fs.lstat(real)).isDirectory()
}
