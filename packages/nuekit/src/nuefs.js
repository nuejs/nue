
import { watch, promises as fs } from 'node:fs'
import { join, parse, relative } from 'node:path'

/*
  Super minimalistic file system watcher

  TODO: symdir support
*/

// for avoiding double events
// let last = {}

export async function fswatch(dir, paths, callback, onremove) {

  const watchers = {}

  async function watchLink(file) {
    const real = await fs.realpath(file.path)
    const watcher = watch(real, () => callback(file))
    watchers[file.path] = watcher
  }

  // watch symlinks
  for (const path of paths) {
    const file = parse(path)

    if (isLegit(file) && file.ext) {
      const stat = await fs.lstat(join(dir, path))
      if (stat.isSymbolicLink()) {
        watchLink({ ...file, path })
      }
    }
  }

  return watch(dir, { recursive: true }, async function(e, path) {
    try {
      const file = parse(path)
      file.path = path

      // skip paths (files and dirs) that start with _ or .
      if (!isLegit(file)) return

      // skip double events (not needed anymore?)
      // if (last.path == path && Date.now() - last.ts < 50) return

      const stat = await fs.lstat(join(dir, path))

      // deploy everything on a directory
      if (stat.isDirectory()) {
        const paths = await fswalk(dir, path)

        for (const path of paths) {
          const file = parse(path)
          if (isLegit(file)) await callback(file)
        }

      } else if (file.ext) {
        if (stat.isSymbolicLink()) await watchLink(file)
        await callback(file)
      }

      // last = { path, ts: Date.now() }

    } catch (e) {
      if (e.errno != -2) return console.error(e)
      await onremove(path)

      // unwatch symlink
      const watcher = watchers[path]
      if (watcher) watcher.close()
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

const IGNORE = ['node_modules', 'functions', 'package.json', 'bun.lockb', 'pnpm-lock.yaml', 'README.md']

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



