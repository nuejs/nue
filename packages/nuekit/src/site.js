
import { log, parseMarkdown, getParts, getAppDir, getDirs, colors } from './util.js'
import { join, extname, basename, sep, parse as parsePath } from 'node:path'
import { parse as parseNue } from 'nuejs-core/index.js'
import { promises as fs } from 'node:fs'
import { fswalk } from './nuefs.js'
import yaml from 'js-yaml'


// file not found error code
const NOT_FOUND = -2

export async function createSite(args) {

  const { root, is_prod, env } = args
  const { is_bulk = args.cmd == 'build' } = args
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
      if (e.errno != NOT_FOUND) {
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
  const self = { globals: site_data.globals || [] }

  const {
    dist = `${root}/.dist/${is_prod ? 'prod' : 'dev'}`,
    port = is_prod ? 8081 : 8080

  } = site_data

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
      if (e.errno != NOT_FOUND) throw e
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
      if (e.errno != NOT_FOUND) throw e
      await fs.mkdir(join(dist, dir), { recursive: true })
      await copy(file)
    }
  }


  async function getAssets(dir, exts, to_ext) {
    const dirs = [...self.globals, ...getDirs(dir)]
    const key = ':' + dir + exts
    const arr = []

    if (cache[key]) return cache[key]

    for (const dir of dirs) {
      try {
        const paths = self.globals.includes(dir) ? await fswalk(join(root, dir)) : await fs.readdir(join(root, dir))

        paths.filter(path => {
          const ext = extname(path).slice(1)
          return exts.includes(ext)

        }).forEach(path => {
          const ext = extname(path)
          arr.push('/' + join(dir, to_ext ? path.replace(ext, '.' + to_ext) : path))
        })

      } catch (e) {
        if (e.errno != NOT_FOUND) return console.error(e)
      }
    }

    if (is_bulk) cache[key] = arr
    return arr
  }

  self.update = async function() {
    site_data = await readOpts()
    const { globals=[] } = site_data

    if ('' + self.globals != '' + globals) {
      self.globals = globals
      return true
    }
  }

  self.getData = async function (appdir) {
    if (!appdir || appdir == '.') return site_data

    const app_data = await readData(`${appdir}/app.yaml`)
    return { ...site_data, ...app_data }
  }

  self.walk = async function() {
    return await fswalk(root)
  }

  self.getScripts = async function (dir, include=['main.js']) {
    const arr = await getAssets(dir, ['js', 'ts'], 'js')
    return arr.filter(path => include.includes(basename(path)))
  }

  // get fromt matter data from all .md files on a directory
  self.getContentCollection = async function (appdir) {
    const key = 'coll:' + appdir
    if (cache[key]) return cache[key]


    const paths = await fswalk(join(root, appdir))
    const mds = paths.filter(el => el.endsWith('.md')).map(el => join(appdir, el))

    const arr = []
    for (const path of mds) {
      const raw = await read(path)
      const meta = parseMarkdown(raw, true)
      arr.push({ ...meta, ...getParts(path) })
    }

    arr.sort((a, b) => b.pubDate - a.pubDate)
    if (is_bulk) cache[key] = arr
    return arr
  }


  self.getStyles = async function (dir) {
    return await getAssets(dir, ['style', 'css'], 'css')
  }

  self.getLayoutComponents = async function (appdir) {
    const dirs = ['.']
    if (appdir && appdir != '.') dirs.unshift(appdir)
    const lib = []

    for (const dir of dirs) {
      const path = join(dir, `layout.html`)
      try {
        const html = await read(path)
        lib.push(...parseNue(html))
      } catch (e) {
        if (e.errno != NOT_FOUND) {
          log.error('parse error', path)
          console.error(e)
        }
      }
    }

    return lib
  }

  // @returns { src, path, code: 200 }
  self.getRequestPaths = async function (url) {
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

  return { ...self, dist, port, read, write, copy, getAssets }

}

