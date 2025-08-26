
import { join, normalize, dirname, extname, basename, sep } from 'node:path'

const SYSTEM_DIRS = ['design', 'data', 'layout', 'ui'].map(dir => join('@system', dir))

const ASSET_TYPES = ['.html', '.js', '.ts', '.yaml', '.css']


export function listDependencies(basepath, { paths, exclude=[], include=[], central }) {

  // folder dependency
  let deps = paths.filter(path => isDep(basepath, path, paths))

  // extensions
  deps = deps.filter(path => ASSET_TYPES.includes(extname(path)))

  // central design system
  if (central) {
    deps = deps.filter(path => extname(path) != '.css' ||
      path.startsWith(join('@system', 'design'))
    )
  }

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


function isDep(basepath, path, paths) {

  // self
  if (basepath == path) return false

  // root level assets (global)
  const dir = dirname(path)
  if (dir == '.') return true

  // system folders
  if (SYSTEM_DIRS.some(dir => path.startsWith(dir + sep))) return true

  // SPA: entire app tree
  if (basename(basepath) == 'index.html') {
    const dir = dirname(basepath)
    return dir == '.' ? !paths.some(el => extname(el) == '.md') : path.startsWith(dir + sep)
  }

  // everything else: hierarchical inclusion
  return parseDirs(dirname(basepath)).some(checkDir => dir == checkDir)
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}