
import { parse, sep } from 'node:path'

import { minifyCSS } from '../tools/css'
import { version } from '../cli'
import { elem } from 'nuemark'

export async function renderHead({ conf={}, data={}, deps=[] }) {
  const { title, favicon } = data
  const arr = []

  if (title) arr.push(elem('title', renderTitle(title, data.title_template)))

  if (favicon) arr.push(elem('link', { rel: 'icon', href: favicon }))

  // meta
  arr.push(...renderMeta(data))

  // og image
  const og = ogImage(conf, data)
  if (og) arr.push(elem('meta', { property: 'og:image', content: og }))


  // libs
  const libs = await getLibs(deps)
  if (libs.length) arr.push(elem('meta', { name: 'libs', content: libs?.join(' ') }))

  // @layers
  const layers = conf.design?.layers
  if (layers) arr.push(elem('style', `@layer ${layers.join(', ')}`))

  // styles
  arr.push(...await renderStyles(deps, conf))

  // system scripts
  const addJS = name => deps.push(parse(`@nue/${name}.js`))
  if (conf.site?.view_transitions) addJS('transitions')
  if (libs.length) addJS('mount')
  if (!conf.is_prod) addJS('hmr')

  // all scripts
  const scripts = renderScripts(deps)


  if (scripts.length || libs.length) {
    arr.push(...scripts)
    arr.push(importMap(conf.import_map))
  }

  // RSS feed
  if (conf.rss?.enabled) {
    const { title } = conf.rss
    const link = elem('link', { rel: 'alternate', type: 'application/rss+xml', title, href: '/feed.xml' })
    arr.push(link)
  }

  return '\t' + arr.join('\n\t')
}

export function renderMeta(data) {
  const desc = data.desc || data.description

  const props = {
    viewport: 'width=device-width,initial-scale=1',
    'article:published_time': data.date || data.pubDate,
    generator: `Nue v${version} (nuejs.org)`,
    'date.updated': new Date().toISOString().slice(0, 16) + 'Z',

    'og:title': renderTitle(data.title, data.title_template),
    'og:description': desc,

    description: desc,
    'theme-color': '',
    author: '',
    robots: '',
  }

  const meta = [elem('meta', { charset: 'utf-8'})]

  Object.entries(props).map(([key, val]) => {
    const content = data[key] || val
    if (content && data[key] !== false) meta.push(elem('meta', { name: key, content }))
  })

  return meta
}

function renderTitle(title, template) {
  if (title) {
    const str = template ? template.replace('%s', title) : title

    // Strip Markdown formatting (bold only for now)
    return str?.replaceAll('**', '')
  }
}

export function renderScripts(deps) {
  const scripts = deps.filter(f => ['.js', '.ts'].includes(f.ext) && f.dir != `@shared${sep}data`)
  return scripts.map(s => elem('script', { src: `/${s.dir}/${s.name}.js`, type: 'module' }))
}

export async function renderStyles(deps, conf={}) {
  const css_files = deps.filter(file => file.is_css)
  const { inline_css } = conf?.design || {}
  const { is_prod } = conf

  if (is_prod && inline_css) {
    const css = await inlineCSS(css_files, is_prod)
    return [ elem('style', css) ]
  }

  return css_files.map(file => elem('link', { rel: 'stylesheet', href: `/${file.path}` }))
}

export async function inlineCSS(deps, minify=true) {
  const css_files = deps.filter(el => el.is_css)
  if (!css_files.length) return ''

  const css = await Promise.all(css_files.map(file => file.text()))
  const str = css.join('\n').trim()
  return minifyCSS(str)
}


function importMap(imports) {
  return !Object.keys(imports || {})[0] ? ''
    : elem('script', { type: 'importmap' }, JSON.stringify({ imports }))
}

function ogImage(conf, data) {
  const og = data.og_image || data.og
  const origin = conf.site?.origin || ''

  if (og) {
    const path = og[0] == '/' ? og : `/${data.dir}/${og}`
    return (conf.is_prod ? origin : '') + path
  }
}

async function getLibs(deps) {
  const paths = []
  for (const asset of deps.filter(el => el.is_html)) {
    const doc = await asset.parse()
    if (doc.is_dhtml && doc.is_lib) paths.push(asset.path)
  }
  return paths
}

