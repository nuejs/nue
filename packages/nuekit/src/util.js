/* misc stuff. think shame.css */

import { execSync } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { promises as fs } from 'node:fs'
import { sep, parse, resolve, normalize, join, isAbsolute, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const srcdir = dirname(fileURLToPath(import.meta.url))

export function openUrl(url) {
  const open = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open'
  execSync(`${open} ${url}`)
}

export function esMain(meta) {
  if (!meta || !process.argv[1]) return false;
  return realpathSync(fileURLToPath(meta.url)) === realpathSync(process.argv[1]);
}

// read from package.json
export const version = await async function() {
  const path = join(srcdir, '../package.json')
  const json = await fs.readFile(path, 'utf-8')
  return JSON.parse(json).version
}()

export async function importFromCWD(path) {
  const abs_path = resolve(process.cwd(), path)
  return import(pathToFileURL(abs_path).href)
}

export function getEngine() {
  const v = process.versions
  return process.isBun ? 'Bun ' + v.bun : 'Node ' + v.node
}

export function log(msg, extra = '') {
  console.log(colors.green('✓'), msg, extra)
}

log.error = function(msg, extra = "") {
  console.log(colors.red('!!'), msg, extra)
}

// console colors
export const colors = function() {
  const codes = { red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, gray: 90 }
  const fns = {}
  const noColor = process.env.NO_COLOR || !(process.env.TERM || process.platform == 'win32')

  for (const key in codes) {
    fns[key] = msg => noColor ? msg : `\u001b[${codes[key]}m${msg}\u001b[39m`
  }
  return fns
}()

// returns { url, dir, slug, appdir }
export function parsePathParts(path) {
  path = normalize(path)
  const { dir, name, base } = parse(path)
  const basedir = getAppDir(path)
  const url = getUrl(dir, name)
  return { filepath: path, url, dir, slug: name + '.html', basedir }
}

export function joinRootPath(root, path, abs = false) {
  return join(abs ? process.cwd() : '', isAbsolute(path) ? '' : root, path)
}

export function getAppDir(path) {
  path = normalize(path)
  const [appdir] = path.split(sep)
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
  if (name != 'index') url += name + '.html'
  return url
}

export function toPosix(path) {
  return path.replaceAll('\\', '/')
}

export function extendData(to, from = {}) {
  const include = addUnique(to.include, from.include)
  const exclude = addUnique(to.exclude, from.exclude)
  Object.assign(to, from)
  to.include = include
  to.exclude = exclude
}


function addUnique(to = [], from = []) {
  if (to.length) to = [...to]

  for (const el of from) {
    if (!to.includes(el)) to.push(el)
  }

  return to
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
