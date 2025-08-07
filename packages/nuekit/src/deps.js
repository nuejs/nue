
import { join, normalize, dirname, extname, basename, sep } from 'node:path'

const ASSETS = ['.html', '.js', '.ts', '.yaml', '.css']
const SYSTEM_DIRS = ['design', 'data', 'layout', 'controller', 'ui'].map(dir => join('@system', dir))


export function listDependencies(basepath, { paths, exclude=[], strict }) {

  // folder dependency
  let deps = paths.filter(path => isDep(basepath, path))

  // extensions
  deps = deps.filter(path => ASSETS.includes(extname(path)))

  // strict design system
  if (strict) {
    deps = deps.filter(path => extname(path) != '.css' || path.startsWith(SYSTEM_DIRS[0]))
  }

  // Exclusions
  exclude.forEach(pattern => {
    const glob = new Bun.Glob(pattern)
    deps = deps.filter(path => !glob.match(path))
  })

  return [...new Set(deps)]
}


function isDep(basepath, path) {

  // self
  // if (basepath == path) return false

  // Root level assets (global)
  const dir = dirname(path)
  if (dir == '.') return true

  // System folders
  if (SYSTEM_DIRS.some(dir => path.startsWith(dir + sep))) return true

  // SPA: entire app tree
  if (basename(basepath) == 'index.html') return path.startsWith(dirname(basepath) + sep)

  // Everything else: hierarchical inclusion
  return parseDirs(dirname(basepath)).some(checkDir => dir == checkDir)
}


// parseDirs('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function parseDirs(dir) {
  const els = normalize(dir).split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join('/'))
}