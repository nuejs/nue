
import { elem, join, parseSize } from 'nuemark/src/tags.js'
import { renderInline } from 'nuemark'

export function parseNavItem(item) {

  // plain string
  if (typeof item == 'string') {
    return item.startsWith('---') ? { separator: item } : { label: item, url: `/${item.toLowerCase()}/`}
  }

  const keys = Object.keys(item)
  const [ char ] = keys[0]

  // [label]: string | object
  if (char == char.toUpperCase() && keys.length == 1) {
    let [label, data] = Object.entries(item)[0]
    if (typeof data == 'string') data = parseDescription(data)

    if (Array.isArray(data)) data = { items: data.map(parseNavItem) }
    return { label, ...data }
  }

  // { ... }
  const { items } = item
  if (items) item.items = items.map(parseNavItem)
  return item
}


export function renderNavItem(item, opts) {
  const { label, role, icon, items, url, image } = item
  const { icon_base='/img' } = opts || {}
  const html = []

  // hr
  if (item.separator) return '<hr>'

  // icon
  if (icon) {
    const { width = 24, height = width || 24 } = parseSize(item)
    const img = elem('img', { src: `${icon_base}/${icon}.svg`, width, height })
    html.push(img, label && elem('span', renderInline(label)))
  }

  // image
  else if (image) {
    const { width, height } = parseSize(item)
    html.push(elem('img', { src: image, width, height }))
  }

  // label
  else if (label) html.push(renderInline(label))

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


export function renderNav(items, opts={}) {
  const { label } = opts
  const html = []
  if (label) html.push(elem('h3', label))

  items.forEach(el => {
    const item = parseNavItem(el)
    const { label, items } = item
    if (items) {
      html.push(renderExpandable(label, items, opts))
    } else {
      html.push(renderNavItem(item, opts))
    }
  })

  return elem('nav', label && { 'aria-label': label }, join(html))
}


export function renderExpandable(label, items, opts={}) {
  const nav = renderNav(items, opts)

  const html = elem('a', { 'aria-expanded': 'false' }, label) + nav
  return elem('span', { 'aria-haspopup': true }, html)
}

/*
export function renderNavBlock(items, { label, expandable }) {
  const fn = expandable ? renderExpandableNav : renderNav

  const html = items.map(item => {
    return fn(item) : renderNavItem(item)
  })
  return elem(expandable ? 'nav' : 'section', { 'aria-label': label }, join(html))
}
*/