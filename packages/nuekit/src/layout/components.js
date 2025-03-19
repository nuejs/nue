
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { elem, parseSize, renderInline, renderIcon } from 'nuemark'

export function renderPageList(data) {
  const key = data.collection_name || data.content_collection
  const items = key ? data[key] : data.items || data

  if (!items?.length) {
    console.error('<page-list>: no content collection data')
    return ''
  }

  const pages = items.map(renderPage)
  return elem('ul', this.attr, pages.join('\n'))
}

// the "main" method called by the <navi/> tag
export function renderNavi(data) {
  const { items, icon_dir } = data

  return Array.isArray(items)
    ? renderNav({ items, icon_dir })
    : typeof items == 'object'
      ? renderMultiNav(items, data)
      : ''
}

function toSymbol(svg, name='x', size=24) {
  const id = `${name}-symbol`
  const attr = { id, viewBox: `0 0 ${size} ${size}` }
  const body = svg.slice(svg.indexOf('>') + 1, -6)
  return elem('symbol', attr, body)
}

export function renderSymbols({ args, dir, files }) {
  const pth = join(args.root, dir)
  try {
    if (files) files = files.split(' ').map(name => `${name}.svg`)
    else files = readdirSync(pth)
  } catch (e) {
    console.info('Could not find dir', dir)
    return ''
  }
  const html = []

  for (const name of files) {
    try {
      if (name.endsWith('.svg')) {
        const svg = readFileSync(join(pth, name), 'UTF-8')
        html.push(toSymbol(svg, name.replace('.svg', '')))
      }
    } catch (e) {
      console.info('Could not find icon', name, 'from', dir)
    }
  }

  return elem('svg', html.join('\n'))
}

function renderTOC(data) {
  const { document, attr } = data
  return document.renderTOC(attr)
}

function renderPrettyDate(date) {
  if (!date) date = new Date()
  if (!date.getDate) date = new Date(date)
  return elem('time', { datetime: date.toISOString() }, prettyDate(date))
}

// in Nue JS component format
export function getLayoutComponents() {
  return [
    { name: 'navi', create: renderNavi },
    { name: 'page-list', create: renderPageList },
    { name: 'toc', create: renderTOC },
    { name: 'symbols', create: renderSymbols },
    { name: 'markdown', create: ({ content }) => renderInline(content) },
    { name: 'pretty-date', create: ({ date }) => renderPrettyDate(date) },
    { name: 'icon', create: data => renderIcon(data.src, data.symbol, data.icon_dir) },
  ]
}

/****** utilities ********/

export function renderPage(page) {
  const { title, url } = page
  const desc = page.desc || page.description
  const thumb = toAbsolute(page.thumb, page.dir)

  // date
  let date = page.date || page.pubDate || new Date()
  if (!date.getDate) date = new Date(date)

  const time = date ? renderPrettyDate(date) : ''
  const h2 = title ? elem('h2', renderInline(title)) : ''
  const p = desc ? elem('p', renderInline(desc)) : ''

  const body = !thumb
    ? time + elem('a', { href: url }, h2 + p)
    // figure
    : elem('a', { href: url }, elem('figure',
        elem('img', { src: thumb, loading: 'lazy' }) + elem('figcaption', time + h2 + p)
      )
    )

  return elem('li', { class: isNew(date) && 'is-new' }, body)
}

function isNew(date, offset = 4) {
  const diff = new Date() - date
  return diff < offset * 24 * 3600 * 1000
}

function prettyDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function toAbsolute(path, dir) {
  return path && path[0] != '/' ? `/${dir}/${path}` : path
}

export function parseLink(item) {
  if (item.image || item.label) return item

  if (typeof item == 'string') {
    return item.startsWith('---') ? { separator: item } : { label: item, url: '' }
  }
  const [label, url] = Object.entries(item)[0]
  return { label, ...parseClass(url) }
}

export function renderLink(item, icon_dir) {
  const img = item.image ? renderImage(item) : ''
  const icon = renderIcon(item.icon, item.symbol, icon_dir)
  const icon_right = renderIcon(item.icon_right, item.symbol_right)
  const kbd = item.kbd ? elem('kbd', item.kbd) : ''

  const link = parseLink(item)

  // Attributes supported by <a> in addition to "class" and "role"
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes
  const attr = {
    class: link.class,
    download: item.download,
    href: link.url,
    hreflang: item.hreflang,
    ping: item.ping,
    referrerpolicy: item.referrerpolicy,
    rel: item.rel,
    role: item.role,
    target: item.target,
    type: item.type,
  }
  return elem('a', attr, icon + img + renderInline(link.label) + icon_right + kbd)
}

export function renderImage(data) {
  const { width, height } = parseSize(data)
  return elem('img', { src: data.image, width, height, alt: data.alt })
}

export function parseClass(url) {
  const data = { url }
  const i = url.indexOf('"')
  if (i > 0) {
    data.url = url.slice(0, i).trim()
    data.class = url.slice(i + 1, -1).trim()
  }
  return data
}

export function renderNav({ items, icon_dir, heading = '' }) {
  const html = items.map(item => renderLink(item, icon_dir))
  return elem('nav', heading + html.join('\n'))
}

export function renderMultiNav(cats, data = {}) {
  const { icon_dir } = data
  const html = []

  for (const cat in cats) {
    const items = cats[cat]
    const heading = items[0] ? elem('h4', cat) : ''
    const nav = renderNav({ items, icon_dir, heading })
    html.push(nav)
  }

  return elem('div', { class: data.class }, html.join('\n'))
}
