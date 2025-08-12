
import { join, normalize, dirname, extname, basename, sep } from 'node:path'

const SYSTEM_DIRS = ['design', 'data', 'layout', 'ui'].map(dir => join('@system', dir))

const ASSET_TYPES = ['.html', '.js', '.ts', '.yaml', '.css']


export function listDependencies(basepath, { paths, exclude=[], strict }) {

  // folder dependency
  let deps = paths.filter(path => isDep(basepath, path, paths))

  // extensions
  deps = deps.filter(path => ASSET_TYPES.includes(extname(path)))

  // strict design system
  if (strict) {
    deps = deps.filter(path => extname(path) != '.css' ||
      path.startsWith(join('@system', 'design'))
    )
  }

  // Exclusions
  exclude.forEach(pattern => {
    deps = deps.filter(path => !path.includes(pattern))
  })

  return [...new Set(deps)]
}


function isDep(basepath, path, paths) {

  // self
  // if (basepath == path) return false

  // Root level assets (global)
  const dir = dirname(path)
  if (dir == '.') return true

  // System folders
  if (SYSTEM_DIRS.some(dir => path.startsWith(dir + sep))) return true

  // SPA: entire app tree
  if (basename(basepath) == 'index.html') {
    const dir = dirname(basepath)
    return dir == '.' ? !paths.some(el => extname(el) == '.md') : path.startsWith(dir + sep)
  }

  // Everything else: hierarchical inclusion
  return parseDirs(dirname(basepath)).some(checkDir => dir == checkDir)
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}