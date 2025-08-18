
import { parse } from 'node:path'

import { elem } from 'nuemark'
import { version } from '../system'
import { minifyCSS } from '../tools/css'

export async function renderHead(data, assets, libs=[]) {
  const { title } = data
  const head = []

  if (title) head.push(elem('title', data.title))

  // meta
  head.push(...renderMeta(data, libs))

  // styles
  head.push(...await renderStyles(assets, data))

  // system scripts
  const addJS = name => assets.push(parse(`@nue/${name}.js`))
  if (data.view_transitions) addJS('transitions')
  if (libs.length) addJS('mount')
  if (!data.is_prod) addJS('hmr')


  // all scripts
  const scripts = renderScripts(assets)

  if (scripts.length || libs.length) {
    head.push(...scripts)
    head.push(importMap(data.import_map))
  }

  return head
}

export function renderMeta(data, libs) {
  const desc = data.desc || data.description

  const props = {
    viewport: 'width=device-width,initial-scale=1',
    'article:published_time': data.date || data.pubDate,
    generator: `Nue v${version} (nuejs.org)`,
    'date.updated': new Date().toISOString(),

    'og:title': data.title,
    'og:description': desc,
    'og:image': ogImage(data),
    libs: libs?.join(' '),

    description: desc,
    'theme-color': '',
    author: '',
    robots: '',
  }

  const meta = [elem('meta', { charset: 'utf-8'})]

  Object.entries(props).map(([key, val]) => {
    const content = val || data[key]
    if (content) meta.push(elem('meta', { name: key, content }))
  })

  return meta
}


export function renderScripts(assets) {
  return assets.filter(file => ['.js', '.ts'].includes(file.ext))
    .map(file => elem('script', { src: `/${file.dir}/${file.name}.js`, type: 'module' }))
}

export async function renderStyles(assets, data={}) {
  const { base, inline_css } = data?.design || {}
  const css = assets.filter(file => file.is_css)

  sortCSS(css, base)

  if (data.is_prod && inline_css) {
    return elem('style', await inlineCSS(css))
  }

  return css.map(file => elem('link', { rel: 'stylesheet', href: `/${file.path}` }))
}

export function sortCSS(arr, base='base.css') {
  arr.sort((a, b) => {
    if (a.base == base) return -1
    if (b.base == base) return 1
    return a.path.localeCompare(b.path)
  })
}

export async function inlineCSS(assets, minify=true) {
  const css_files = assets.filter(el => el.is_css)
  if (!css_files.length) return ''

  const css = await Promise.all(css_files.map(file => file.text()))
  const str = css.join('\n').trim()
  return minifyCSS(str)
}


function importMap(map) {
  const imports = { nue: '/@nue/nue.js', ...map }
  return elem('script', { type: 'importmap' }, JSON.stringify({ imports }))
}

function ogImage(data) {
  const og = data.og_image || data.og
  if (og) {
    const img = og[0] == '/' ? og : `/${data.dir}/${og}`
    return (data.origin || '') + img
  }
}

