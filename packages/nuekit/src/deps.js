
import { join, dirname, extname, basename, sep } from 'node:path'

// Normalize path separators to POSIX format
function toPosix(path) {
  return path.split(sep).join('/')
}

// app, lib, server are @shared, but not auto-included
const AUTO_INCLUDED = ['data', 'design', 'ui'].map(dir => toPosix(join('@shared', dir)))

const ASSET_TYPES = ['.html', '.js', '.ts', '.yaml', '.css']


export function listDependencies(basepath, { paths, exclude=[], include=[] }) {

  // folder dependency
  let deps = paths.filter(path => isDep(basepath, path, paths))

  // extensions
  deps = deps.filter(path => ASSET_TYPES.includes(extname(path)))

  // exclusions
  exclude.forEach(pattern => {
    deps = deps.filter(path => !path.includes(pattern))
  })

  // Re-inclusions
  include.forEach(pattern => {
    paths.forEach(path => {
      if (path.includes(pattern)) deps.push(path)
    })
  })

  return [...new Set(deps)]
}


function isDep(page_path, asset_path, all_paths) {
  // self
  if (page_path == asset_path) return false

  // root level assets (global)
  const dir = dirname(asset_path)
  if (dir == '.') return true

  // shared dir -> auto-included
  if (AUTO_INCLUDED.some(dir => asset_path.startsWith(dir + '/'))) return true

  // SPA: entire app tree
  if (basename(page_path) == 'index.html') {
    const dir = dirname(page_path)
    return dir == '.' ? !all_paths.some(el => extname(el) == '.md') : asset_path.startsWith(dir + '/')
  }

  // index.md -> home dir
  const pagedir = dirname(page_path)
  if (pagedir == '.' && basename(page_path) == 'index.md') return dirname(asset_path) == 'home'

  // hierarchical inclusion (handles root ui and app ui)
  const page_dirs = parseDirs(dirname(page_path))
  const asset_dir = dirname(asset_path)

  // check if asset is in ui of any parent directory
  return page_dirs.some(pageDir => {
    const ui_dir = pageDir ? toPosix(join(pageDir, 'ui')) : 'ui'
    return asset_dir == ui_dir || asset_dir == pageDir
  })
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = dir.split('/')
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}