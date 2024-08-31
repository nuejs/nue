
import { watch, promises as fs } from 'node:fs'
import { join, parse } from 'node:path'

/*
  Super minimalistic file system watcher.

  Auto-follows new directories and symbolic (file) links

  Simple alternative to Chokidar and Nodemon when you "just want to watch"

  TODO: symlink directory support
*/

// avoid double events and looping (seen on Bun only)
let last = {}


export function fswatch(dir, onfile, onremove) {
  return watch(dir, { recursive: true }, async function(e, path) {
    try {
      const file = parse(path)

      // skip paths (files and dirs) that start with _ or .
      if (!isLegit(file)) return

      // skip double events
      if (last.path == path && Date.now() - last.ts < 50) return

      // regular flie -> callback
      const stat = await fs.lstat(join(dir, path))

      if (stat.isDirectory()) {
        const paths = await fswalk(dir, path)

        // deploy everything on the directory
        for (const path of paths) {
          const file = parse(path)
          if (isLegit(file)) await onfile({ ...file, path })
        }

      } else {
        if (file.ext) await onfile({ ...file, path, size: stat.size })
      }

      last = { path, ts: Date.now() }

    } catch (e) {
      if (e.errno == -2) await onremove(path)
      else console.error(e)
    }
  })
}


export async function fswalk(root, _dir='', _ret=[]) {
  const files = await fs.readdir(join(root, _dir), { withFileTypes: true })

  for (const f of files) {
    if (isLegit(f)) {
      const path = join(_dir, f.name)
      if (isDir(f)) await fswalk(root, path, _ret)
      else _ret.push(path)
    }
  }
  return _ret
}

const IGNORE = ['node_modules', 'functions', 'package.json', 'bun.lockb', 'pnpm-lock.yaml', 'yarn.lock', 'package-lock.json', 'marked.config.js', 'README.md']

function ignore(name='') {
  return '._'.includes(name[0]) || IGNORE.includes(name)
}

function isLegit(file) {
  return !ignore(file.name) && !ignore(file.base) && !ignore(file.dir)
}

// TODO: real symdir detection
function isDir(f) {
  return f.isDirectory() || f.isSymbolicLink() && !f.name.includes('.')
}



