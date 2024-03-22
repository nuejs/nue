
import { log, getParts, getAppDir, getDirs, colors, toPosix, sortCSS, joinRootPath } from './util.js'
import { join, extname, basename, sep, parse as parsePath } from 'node:path'
import { parse as parseNue } from 'nuejs-core'
import { promises as fs } from 'node:fs'
import { fswalk } from './nuefs.js'
import { nuemark } from 'nuemark'
import yaml from 'js-yaml'


// file not found error
function fileNotFound({ errno }) {
  return [-2, -4058].includes(errno)
}

export async function createSite(args) {

  const { root, is_prod, env, nuekit_version } = args
  const { is_bulk = args.cmd == 'build' || args.push } = args
  const cache = {}

  // make sure root exists
  try {
    await fs.stat(root)
  } catch (e) {
    console.info(e)
    throw `Root directory does not exist: ${root}`
  }


  /*
    Bun.file()::text() has equal performance
    caching here is unnecessary
  */
  async function read(path) {
    return await fs.readFile(join(root, path), 'utf-8')
  }

  async function readData(path) {
    try {
      const raw = await read(path)
      return yaml.load(raw)
    } catch (e) {
      if (!fileNotFound(e)) {
        throw `YAML parse error in ${path}`
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

  const {
    dist: rawDist,
    port = is_prod ? 8081 : 8080
  } = site_data

  const dist = joinRootPath(root, rawDist || join('.dist', is_prod ? 'prod' : 'dev'))

  // flag if .dist is empty
  try {
    await fs.stat(dist)
  } catch {
    self.is_empty = true
  }

  async function write(content, dir, filename) {
    const todir = join(dist, dir)

    try {
      const to = join(todir, filename)
      await fs.writeFile(to, content)
      !is_bulk && !self.is_empty && log(join(dir, filename))
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
      !is_bulk && !self.is_empty && log(join(dir, base))

    } catch (e) {
      if (!fileNotFound(e)) throw e
      await fs.mkdir(join(dist, dir), { recursive: true })
      await copy(file)
    }
  }

  async function getPageFiles(page_dir) {
    const key = ':' + page_dir
    if (cache[key]) return cache[key]
    const arr = []

    for (const dir of getDirs(page_dir || '.')) {
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


  async function getAllFiles(from_dirs) {
    const key = '@' + from_dirs
    if (cache[key]) return cache[key]
    const arr = []

    for (const dir of from_dirs) {
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


  async function getAssets({ dir, exts, to_ext, data={} }) {
    const { include=[], exclude=[] } = data
    let paths = [...await getAllFiles(self.globals), ...await getPageFiles(dir)]
    const ret = []

    // library files
    if (include[0]) {
      for (const path of await getAllFiles(self.libs)) {

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
    const { globals=[], libs=[] } = site_data

    if ('' + self.globals != '' + globals) {
      self.globals = globals
      return true
    }

    if ('' + self.libs != '' + libs) {
      self.libs = libs
      return true
    }
  }

  self.getData = async function(pagedir) {
    const data = { nuekit_version, ...site_data }
    for (const dir of getDirs(pagedir)) {
      Object.assign(data, await readData(`${dir}/app.yaml`))
    }
    return data
  }

  self.walk = async function() {
    return await fswalk(root)
  }

  self.getScripts = async function(dir, main=['main.js']) {
    const arr = await getAssets({ dir, exts: ['js', 'ts'], to_ext: 'js' })
    return arr.filter(path => main.includes(basename(path)))
  }

  self.getComponents = async function(dir) {
    return await getAssets({ dir, exts: ['nue'], to_ext: 'js' })
  }


  // get fromt matter data from all .md files on a directory
  self.getContentCollection = async function(dir) {
    const key = 'coll:' + dir
    if (cache[key]) return cache[key]

    const paths = await fswalk(join(root, dir))
    const mds = paths.filter(el => el.endsWith('.md')).map(el => join(dir, el))

    const arr = []
    for (const path of mds) {
      const raw = await read(path)
      const { meta } = nuemark(raw)
      arr.push({ ...meta, ...getParts(path) })
    }

    arr.sort((a, b) => {
      const [d1, d2] = [a, b].map(v => v.pubDate || Infinity)
      return d2 - d1
    })
    if (is_bulk) cache[key] = arr
    return arr
  }



  self.getStyles = async function(dir, data={}) {
    let paths = await getAssets({ dir, exts: ['css'], data })

    // syntax highlighting
    if (data.page?.has_code_blocks && data.glow_css !== false) paths.push(`/@nue/glow.css`)

    // cascading order: globals -> area -> page
    sortCSS({ paths, globals: self.globals, dir })

    return paths
  }


  self.getLayoutComponents = async function(pagedir) {
    const lib = []

    for (const dir of ['.', ...getDirs(pagedir)]) {
      const path = join(dir, `layout.html`)
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
      try {
        const src = join(dir, `${name}.${ext}`)
        await fs.stat(join(root, src))
        return { src, path: join(dir, `${name}.html`), name }
      } catch {}
    }
  }

  return { ...self, dist, port, read, write, copy }

}
