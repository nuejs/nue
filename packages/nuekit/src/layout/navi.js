
import { elem, join, parseSize } from 'nuemark/src/tags.js'
import { renderInline } from 'nuemark'

export function parseNavItem(item) {

  // plain string
  if (typeof item == 'string') {
    return item.startsWith('---') ? { separator: item } : { label: item, url: '' }
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


export function renderNavItem(item) {
  const { label, role, icon, items, url, image } = item
  const { icon_base='/img' } = {}
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

  return elem(url != null ? 'a' : 'p', attr, join(html))
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


export function renderNavItems(items, opts={}) {
  const { heading, label } = opts
  const nav = []

  if (heading) nav.push(elem('h3', heading))

  items.forEach(el => {
    const item = parseNavItem(el)
    const { label, items } = item
    if (items) {
      nav.push(renderExpandable(label, items))
    } else {
      nav.push(renderNavItem(item))
    }
  })
  return elem('nav', label && { 'aria-label': label }, join(nav))
}


export function renderExpandable(label, items) {
  const nav = renderNavItems(items)

  const html = elem('a', { 'aria-expanded': 'false' }, label) + nav
  return elem('span', { 'aria-haspopup': true }, html)
}

// <section>
export function renderNavBlocks(data) {
  const navs = []

  for (const heading in data) {
    const nav = renderNavItems(data[heading], { heading })
    navs.push(nav)
  }

  return elem('section', join(navs))
}

export function renderNav({ items, label }) {
  return Array.isArray(items) ? renderNavItems(items, { label }) :
    typeof items == 'object' ? renderNavBlocks(items) : ''
}


export function renderTOC(data) {

  const items = data.page.headings.filter(el => [2, 3].includes(el.level))
    .map(el => elem('a', { href: '#' + el.id, class: 'level-' + el.level }, el.text))

  return elem('nav', { 'aria-label': 'Table of Contents', is: data.is }, join(items))
}
