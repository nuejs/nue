
import { elem } from 'nuemark'
import { version } from './system'

export async function renderHead(data, assets, libs) {
  const { title, imports } = data
  const head = []

  if (title) head.push(elem('title', data.title))

  // meta
  head.push(...renderMeta(data, libs))

  // styles
  head.push(...await renderStyles(assets, data))

  // scripts
  const scripts = renderScripts(assets)

  if (scripts.length || libs.length) {
    head.push(...scripts)
    head.push(importMap(imports))
  }

  return head
}

export function renderMeta(data, libs) {
  const desc = data.desc || data.description

  const meta = {
    charset:  'utf-8',
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

  return Object.entries(meta).map(([key, val]) => {
    const content = val || data[key]
    return content && elem('meta', { name: key, content })

  }).filter(el => !!el)
}


export function renderScripts(assets) {
  return assets.filter(file => ['.js', '.ts'].includes(file.ext))
    .map(file => elem('script', { src: `/${file.dir}/${file.name}.js`, type: 'module' }))
}

export async function renderStyles(assets, opts={}) {
  const { base='base.css', inline_css } = opts?.design || {}
  const css = assets.filter(file => file.is_css)

  css.sort((a, b) => {
    if (a.base == base) return -1
    if (b.base == base) return 1
    return a.path.localeCompare(b.path)
  })

  if (opts.is_prod && inline_css) {
    return elem('style', await inlineCSS(css, true))
  }

  return css.map(file => elem('link', { rel: 'stylesheet', href: `/${file.path}` }))
}

export async function inlineCSS(assets, minify) {
  const css_files = assets.filter(el => el.is_css)
  const css = await Promise.all(css_files.map(file => file.text()))
  return css.join('\n').trim()
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

