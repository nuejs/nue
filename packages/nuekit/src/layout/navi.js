
import { elem, join, parseSize } from 'nuemark/src/tags.js'
import { renderInline } from 'nuemark'

export function parseNavItem(item) {

  // plain string
  if (typeof item == 'string') {
    return item.startsWith('---') ? { separator: item } : { text: item, url: `/${item.toLowerCase()}/`}
  }

  const keys = Object.keys(item)
  const [ char ] = keys[0]

  // [label]: string | object
  if (char == char.toUpperCase() && keys.length == 1) {
    let [text, data] = Object.entries(item)[0]
    if (typeof data == 'string') data = parseDescription(data)
    if (Array.isArray(data)) data = { items: data.map(parseNavItem) }
    return { text, ...data }
  }

  // { ... }
  const { items } = item
  if (items) item.items = items.map(parseNavItem)
  return item
}


export function renderNavItem(item, opts) {
  const { text, role, icon, items, url, image } = item
  const { icon_base='/img' } = opts || {}
  const html = []

  // hr
  if (item.separator) return '<hr>'

  // icon
  if (icon) {
    const { width = 24, height = width || 24 } = parseSize(item)
    const img = elem('img', { src: `${icon_base}/${icon}.svg`, width, height })
    html.push(img, text && elem('span', renderInline(text)))
  }

  // image
  else if (image) {
    const { width, height } = parseSize(item)
    html.push(elem('img', { src: image, width, height }))
  }

  // text
  else if (text) html.push(renderInline(text))

  // attributes
  const attr = { href: url, role }
  if (item.class) attr.class = item.class

  return elem(url ? 'a' : 'p', attr, join(html))
}


export function parseDescription(url) {
  const data = { url }
  const i = url.indexOf('"')
  if (i > 0) {
    data.url = url.slice(0, i).trim()
    data.desc = url.slice(i + 1, -1).trim()
  }
  return data
}


export function renderNav({ text, items }, opts) {
  const html = []
  if (text) html.push(elem('h3', text))
  items.forEach(item => html.push(renderNavItem(parseNavItem(item), opts)))
  return elem('nav', text && { 'aria-label': text }, join(html))
}

export function renderNavBlock(items, { label, expandable }) {
  const fn = expandable ? renderExpandableItem : renderNav

  const html = parseNavItems(items).map(item => {
    return item.items ? fn(item) : renderNavItem(item)
  })
  return elem(expandable ? 'nav' : 'section', { 'aria-label': label }, join(html))
}

export function renderExpandableItem({ text, items}, opts) {
  const nav = renderNav({ items })
  const html = elem('a', { 'aria-expanded': 'false' }, text) + nav
  return elem('span', { 'aria-haspopup': true }, html)
}