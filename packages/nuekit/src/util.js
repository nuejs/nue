
/* misc stuff. think shame.css */
import { sep, parse, normalize, join, isAbsolute } from 'node:path'

export function log(msg, extra='') {
  console.log(colors.green('✓'), msg, extra)
}

log.error = function(msg, extra="") {
  console.log(colors.red('!!'), msg, extra)
}

function getColorFunctions() {
  const codes = { red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, gray: 90 }
  const fns = {}

  for (const key in codes) {
    fns[key] = msg => `\u001b[${codes[key]}m${msg}\u001b[39m`
  }
  return fns
}

// console colors
export const colors = getColorFunctions()


// returns { url, dir, slug, appdir }
export function parsePathParts(path) {
  path = normalize(path)
  const { dir, name, base } = parse(path)
  const appdir = getAppDir(path)
  const url = getUrl(dir, name)
  return { url, dir, slug: name + '.html', appdir }
}

export function joinRootPath(root, path, abs = false) {
  return join(abs ? process.cwd() : '', isAbsolute(path) ? '' : root, path)
}

export function getAppDir(path) {
  path = normalize(path)
  const [ appdir ] = path.split(sep)
  return appdir == path ? '' : appdir
}

// traverseDirsUp('a/b/c') --> ['a', 'a/b', 'a/b/c']
export function traverseDirsUp(dir) {
  if (!dir) return []
  dir = normalize(dir)
  const els = dir.split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join(sep))
}

export function getUrl(dir, name) {
  let url = toPosix(dir) + '/'
  if (url[0] != '/') url = '/' + url
  // if (name != 'index')
  url += name + '.html'
  return url
}

export function toPosix(path) {
  return path.replaceAll('\\', '/')
}

export function extendData(to, from={}) {
  const { include = [], exclude = [] } = to
  if (from.include) include.push(...from.include)
  if (from.exclude) exclude.push(...from.exclude)
  Object.assign(to, from)
  to.include = include
  to.exclude = exclude
}


export function sortCSS({ paths, globals, dir }) {
  function score(path) {
    if (path[0] == '/') path = path.slice(1)
    const appdir = getAppDir(path)
    const els = path.split(sep)
    return globals.includes(appdir) ? 0 : dir == appdir ? (els[2] ? 3 : 2) : 1
  }

  // alphabetical first
  paths.sort()

  // then by directory
  paths.sort((a, b) => score(a) - score(b))
}


