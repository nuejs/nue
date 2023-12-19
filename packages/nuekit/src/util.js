
/* misc stuff. think shame.css */
import { sep, parse } from 'node:path'
import { marked } from 'marked'
import yaml from 'js-yaml'


// .md stuff will be lot cooler with Nuemark
export function parseMarkdown(raw, meta_only) {
  const [_, front, md] = raw.split(/---+\n/)
  const matter = front?.endsWith('---') ? front.slice(0, -3) : front
  const meta = front && yaml.load(matter) || {}

  if (!meta.title) {
    marked.use({ walkTokens: function({ type, text }) {
      if (!meta.title && type == 'heading') meta.title = text
    }})
  }

  return meta_only ? meta : { meta, content: marked(md || _) }
}

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



/* path parts */

export function getParts(path) {
  const { dir, name, base } = parse(path)
  const appdir = getAppDir(path)
  const url = getUrl(dir, name)
  return { url, dir, slug: name + '.html', appdir }
}


export function getAppDir(path) {
  const [ appdir ] = path.split(sep)
  return appdir == path ? '.' : appdir
}

export function getDirs(dir) {
  if (!dir) return []
  const els = dir.split(sep)
  return els.map((el, i) => els.slice(0, i + 1).join(sep))
}

export function getUrl(dir, name) {
  let url = dir.replace('\\', '/') + '/'
  if (url[0] != '/') url = '/' + url
  // if (name != 'index')
  url += name + '.html'
  return url
}
