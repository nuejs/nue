
import { elem, parseSize, renderInline, renderIcon } from 'nuemark'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

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

  return Array.isArray(items) ? renderNav({ items, icon_dir }) :
    typeof items == 'object' ? renderMultiNav(items, data) : ''
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
    { name: 'markdown', create: ({ content }) => renderInline(content) },
    { name: 'pretty-date', create: ({ date }) => renderPrettyDate(date) },
    { name: 'icon', create: (data) => renderIcon(data.src, data.symbol, data.icon_dir) },
  ]
}

/****** utilities ********/

export function renderPage(page) {
  const { title, url } = page
  const desc =  page.desc || page.description
  const thumb = toAbsolute(page.thumb, page.dir)

  // date
  let date = page.date || page.pubDate || new Date()
  if (!date.getDate) date = new Date(date)

  const time = date ? renderPrettyDate(date) : ''
  const h2 = title ? elem('h2', renderInline(title)) : ''
  const p = desc ? elem('p', renderInline(desc)) : ''

  const body = !thumb ? time + elem('a', { href: url }, h2 + p) :

    // figure
    elem('a', { href: url }, elem('figure',
      elem('img', { src: thumb, loading: 'lazy' }) + elem('figcaption', time + h2 + p))
  )

  return elem('li', { class: isNew(date) && 'is-new' }, body)
}


function isNew(date, offset=4) {
  const diff = new Date() - date
  return diff < offset * 24 * 3600 * 1000
}

function prettyDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function toAbsolute(path, dir) {
  return path && path[0] != '/' ? `/${dir}/${path}`: path
}

export function parseLink(item) {
  if (item.image || item.label) return item

  if (typeof item == 'string') {
    return item.startsWith('---') ? { separator: item } : { label: item, url: '' }
  }
  const [ label, url ] = Object.entries(item)[0]
  return { label, ...parseClass(url) }
}


export function renderLink(item, icon_dir) {
  const img = item.image ? renderImage(item) : ''
  const icon = renderIcon(item.icon, item.symbol, icon_dir)
  const icon_right = renderIcon(item.icon_right, item.symbol_right)
  const kbd = item.kbd ? elem('kbd', item.kbd) : ''

  const link = parseLink(item)

  const attr = { href: link.url, class: link.class, role: item.role }
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


export function renderNav({ items, icon_dir, heading='' }) {
  const html = items.map(item => renderLink(item, icon_dir))
  return elem('nav', heading + html.join('\n'))
}


export function renderMultiNav(cats, data={}) {
  const { icon_dir } = data
  const html = []

  for (const cat in cats) {
    const heading = elem('h3', cat)
    const nav = renderNav({ items: cats[cat], icon_dir, heading })
    html.push(nav)
  }

  return elem('div', { class: data.class }, html.join('\n'))
}

