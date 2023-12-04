
import { watch, promises as fs } from 'node:fs'
import { join, parse, sep } from 'node:path'

/*
  Super minimalistic file system watcher.

  Auto-follows new directories and symbolic links

  Simple alternative to Chokidar and Nodemon when you "just want to watch"

  TODO: symlink directory support
*/

// avoid double events and looping (seen on Bun only)
let last = {}

export async function fswatch(dir, onfile, onremove) {
  watch(dir, { recursive: true }, async function(e, path) {
    try {
      const file = parse(path)

      // skip dotfiles and files that start with "_"
      if (ignore(file.name) || ignore(file.dir)) return

      // skip double events
      if (last.path == path && Date.now() - last.ts < 50) return

      // regular flie -> callback
      const stat = await fs.lstat(join(dir, path))
      if (!stat.isDirectory()) {
        await onfile({ ...file, path, size: stat.size })
        last = { path, ts: Date.now() }
      }

    } catch (e) {
      if (e.errno == -2) await onremove(path)
      else console.info(e)
    }
  })
}

export async function fswalk(root, _dir='', _ret=[]) {
  const files = await fs.readdir(join(root, _dir), { withFileTypes: true })

  for (const f of files) {
    if (!ignore(f.name[0])) {
      const path = join(_dir, f.name)
      if (isDir(f)) await fswalk(root, path, _ret)
      else _ret.push(path)
    }
  }
  return _ret
}


function ignore(name) {
  return '._'.includes(name[0])
}

// TODO: real symdir detection
function isDir(f) {
  return f.isDirectory() || f.isSymbolicLink() && !f.name.includes('.')
}



