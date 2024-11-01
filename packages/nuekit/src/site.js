import { promises as fs, existsSync } from 'node:fs'
import { join, extname, parse as parsePath } from 'node:path'

import yaml from 'js-yaml'
import { parse as parseNue } from 'nuejs-core'
import { nuedoc } from 'nuemark'

import { fswalk } from './nuefs.js'
import {
  traverseDirsUp,
  parsePathParts,
  joinRootPath,
  extendData,
  getAppDir,
  sortCSS,
  toPosix,
  log,
} from './util.js'


// file not found error
function fileNotFound({ errno }) {
  return [-2, -4058].includes(errno)
}

export async function createSite(args) {

  const { root, is_prod, env, nuekit_version } = args
  const { is_bulk = args.cmd == 'build' || args.push } = args
  const cache = {}

  // make sure root exists
  if (!existsSync(root)) throw `Root directory does not exist: ${root}`

  /*
    Bun.file()::text() has equal performance
    caching here is unnecessary
  */
  async function read(path) {
    return (await fs.readFile(join(root, path), 'utf-8')).replace(/\r\n|\r/g, '\n')
  }

  async function readData(path) {
    try {
      const raw = await read(path)
      return yaml.load(raw)
    } catch (e) {
      if (!fileNotFound(e)) {
        const { line, column } = e.mark
        const err = { line, column, lineText: e.reason }
        throw err
      } else if (path == env) throw e
    }
  }


  async function readOpts() {
    const data = await readData('site.yaml') || {}

    // environment
    try {
      if (env) Object.assign(data, await readData(env))
    } catch {
      throw `Environment file not found: "${env}"`
    }

    return data
  }

  let site_data = await readOpts()

  const self = {
    globals: site_data.globals || [],
    libs: site_data.libs || [],
  }

  const dist = joinRootPath(root, site_data.dist || join('.dist', is_prod ? 'prod' : 'dev'))
  const port = args.port || site_data.port || (is_prod ? 8081 : 8080)


  // flag if .dist is empty
  self.is_empty = !existsSync(dist)

  async function write(content, dir, filename) {
    const todir = join(dist, dir)

    try {
      const to = join(todir, filename)
      await fs.writeFile(to, content)
      if (!is_bulk && !self.is_empty) log(join(dir, filename))
      return to

    } catch (e) {
      if (!fileNotFound(e)) throw e
      await fs.mkdir(todir, { recursive: true })
      return await write(content, dir, filename)
    }
  }

  async function copy(file) {
    const { dir, base } = file
    const to = join(dist, dir, base)

    try {
      await fs.copyFile(join(root, dir, base), to)
      if (!is_bulk && !self.is_empty) log(join(dir, base))

    } catch (e) {
      if (!fileNotFound(e)) throw e
      await fs.mkdir(join(dist, dir), { recursive: true })
      await copy(file)
    }
  }

  async function getPageAssets(page_dir) {
    const key = ':' + page_dir
    if (cache[key]) return cache[key]
    const arr = []

    for (const dir of traverseDirsUp(page_dir || '.')) {
      try {
        const paths = await fs.readdir(join(root, dir))
        paths.forEach(path => arr.push(join(dir, path)))

      } catch (e) {
        if (!fileNotFound(e)) return console.error(e)
      }
    }

    if (is_bulk) cache[key] = arr
    return arr
  }


  async function walkDirs(dirs) {
    const key = '@' + dirs
    if (cache[key]) return cache[key]
    const arr = []

    for (const dir of dirs) {
      try {
        const paths = await fswalk(join(root, dir))
        paths.forEach(path => arr.push(join(dir, path)))
      } catch (e) {
        if (!fileNotFound(e)) return console.error(e)
      }
    }

    if (is_bulk) cache[key] = arr
    return arr
  }


  async function getAssets({ dir, exts, to_ext, data = {} }) {
    const { include = [], exclude = [] } = data
    const subdirs = !dir ? [] : self.globals.map(el => join(dir, el))

    let paths = [
      ...await walkDirs(self.globals),
      ...await walkDirs(subdirs),
      ...await getPageAssets(dir)
    ]

    const ret = []

    // library files
    if (include[0]) {
      for (const path of await walkDirs(self.libs)) {
        // included only
        if (include.find(match => toPosix(path).includes(match))) paths.push(path)
      }
    }

    paths.forEach(path => {
      const ext = extname(path)
      path = '/' + toPosix(path)

      // include / exclude
      if (exts.includes(ext.slice(1)) && !exclude.find(match => path.includes(match))) {
        if (to_ext) path = path.replace(ext, '.' + to_ext)
        ret.push(path)
      }
    })

    return ret
  }


  self.update = async function() {
    site_data = await readOpts()
    const { globals = [], libs = [] } = site_data

    if ('' + self.globals != '' + globals) {
      self.globals = globals
      return true
    }

    if ('' + self.libs != '' + libs) {
      self.libs = libs
      return true
    }
  }


  async function readDirData(dir) {
    const paths = await getPageAssets(dir)
    const data = {}
    for (const path of paths) {
      if (path.endsWith('.yaml')) {
        Object.assign(data, await readData(path))
      }
    }
    return data
  }

  self.getData = async function(pagedir) {
    const data = { nuekit_version, ...site_data, is_prod }

    for (const dir of [ ...self.globals, ...traverseDirsUp(pagedir)]) {
      extendData(data, await readDirData(dir))
    }
    return data
  }

  self.walk = async function() {
    return await fswalk(root)
  }


  // get fromt matter data from all .md files on a directory
  self.getContentCollection = async function(dir) {
    const key = 'coll:' + dir
    if (cache[key]) return cache[key]
    const arr = []

    // make sure dir exists
    if (!existsSync(join(root, dir))) {
      console.error(`content collection: "${dir}" does not exist`)
      return arr
    }

    const paths = await fswalk(join(root, dir))
    const mds = paths.filter(el => el.endsWith('.md')).map(el => join(dir, el))

    for (const path of mds) {
      const document = nuedoc(await read(path))
      const { meta } = document
      if (!meta.unlisted) arr.push({ ...meta, ...parsePathParts(path) })
    }

    arr.sort((a, b) => {
      const [d1, d2] = [a, b].map(v => v.pubDate || v.date || Infinity)
      return d2 - d1
    })

    if (is_bulk) cache[key] = arr

    return arr
  }

  self.getStyles = async function(dir, data = {}) {
    let paths = await getAssets({ dir, exts: ['css'], data })

    // syntax highlighting
    if (data.syntax_highlight !== false && data.document?.codeblocks[0]) paths.push(`/@nue/syntax.css`)

    // cascading order: globals -> area -> page
    sortCSS({ paths, globals: self.globals, dir })

    return paths
  }

  self.getScripts = async function(dir, data) {
    return await getAssets({ dir, exts: ['js', 'ts'], to_ext: 'js', data })
  }

  self.getClientComponents = async function(dir, data) {
    return await getAssets({ dir, exts: ['dhtml', 'htm'], to_ext: 'js', data })
  }


  self.getServerComponents = async function(dir, data) {
    const paths = await getAssets({ dir, exts: ['html'], data })

    if (dir && dir != '.') {
      const more = await fs.readdir(join(root, dir))
      more.forEach(p => {
        if (p.endsWith('.html')) paths.unshift(p)
      })
    }

    const lib = []

    for (const path of paths) {
      try {
        const html = await read(path)
        lib.unshift(...parseNue(html))
      } catch (e) {
        if (!fileNotFound(e)) {
          log.error('parse error', path)
          console.error(e)
        }
      }
    }
    return lib
  }

  // @returns { src, path, code: 200 }
  self.getRequestPaths = async function(url) {
    let { dir, name, base, ext } = parsePath(url.slice(1))
    if (!name) name = 'index'

    const try_files = [[dir, name, 'md']]

    // SPA page
    if (!ext || name == 'index') {
      const appdir = getAppDir(url.slice(1))
      if (appdir != '.') try_files.push([appdir, 'index', 'html'])
      try_files.push(['', 'index', 'html'])
    }

    // custom 404 page
    try_files.push(['', 404, 'md'])


    for (const [dir, name, ext] of try_files) {
      const src = join(dir, `${name}.${ext}`)
      if (existsSync(join(root, src)))
        return { src, path: join(dir, `${name}.html`), name }
    }
  }


  async function getLastRun() {
    const path = join(dist, '.lastrun')

    try {
      const stat = await fs.stat(path)
      return stat.mtimeMs

    } catch {
      await fs.writeFile(path, '')
      return 0
    }
  }

  self.filterUpdated = async function(paths) {
    const since = await getLastRun()
    const arr = []

    for (const path of paths) {
      const stat = await fs.stat(path)
      if (stat.mtimeMs > since) arr.push(path)
    }

    return arr
  }

  return { ...self, dist, port, read, write, copy }
}
