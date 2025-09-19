
import { join, normalize, dirname, extname, basename, sep } from 'node:path'

// app, lib, server are @shared, but not auto-included
const AUTO_INCLUDED = ['data', 'design', 'layout', 'ui'].map(dir => join('@shared', dir))

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
  if (AUTO_INCLUDED.some(dir => asset_path.startsWith(dir + sep))) return true

  // index.md -> home dir
  const pagedir = dirname(page_path)
  if (pagedir == '.' && basename(page_path) == 'index.md') return dirname(asset_path) == 'home'

  // hierarchical inclusion (handles root ui/layout and app ui/layout)
  const page_dirs = parseDirs(dirname(page_path))
  const asset_dir = dirname(asset_path)

  // check if asset is in ui/layout of any parent directory
  return page_dirs.some(pageDir => {
    const ui_dir = pageDir ? join(pageDir, 'ui') : 'ui'
    const layout_dir = pageDir ? join(pageDir, 'layout') : 'layout'
    return asset_dir == ui_dir || asset_dir == layout_dir || asset_dir == pageDir
  })
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}