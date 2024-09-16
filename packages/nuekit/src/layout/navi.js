import { elem, join, parseSize } from 'nuemark/src/tags.js'
import { renderInline } from 'nuemark'


export function parseNavItem(item) {
  // plain string
  if (typeof item == 'string') {
    return item.startsWith('---') ? { separator: item } : { text: item, url: '' }
  }

  const keys = Object.keys(item)
  const [char] = keys[0]

  // [text]: string | object
  if (char == char.toUpperCase() && keys.length == 1) {
    let [text, data] = Object.entries(item)[0]
    if (typeof data == 'string') data = parseClass(data)

    if (Array.isArray(data)) data = { items: data.map(parseNavItem) }
    return { text, ...data }
  }

  // { ... }
  const { items } = item
  if (items) item.items = items.map(parseNavItem)
  return item
}


export function renderNavItem(item) {
  const { text, role, url, image, alt } = item
  const html = []

  // hr
  if (item.separator) return '<hr>'

  // image
  if (image) {
    const { width, height } = parseSize(item)
    html.push(elem('img', { src: image, width, height, alt }))
  }

  // text
  if (text) {
    const formatted = renderInline(text)
    html.push(image ? elem('strong', formatted) : formatted)
  }

  // attributes
  const attr = { href: url, role }
  if (item.class) attr.class = item.class

  return elem(url != null ? 'a' : 'span', attr, join(html))
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


export function renderNavItems(items, opts = {}) {
  const { heading, label } = opts
  const nav = []

  if (heading) nav.push(elem('h3', heading))

  items.forEach(el => {
    const item = parseNavItem(el)
    const { text, items } = item
    if (items) {
      nav.push(renderExpandable(text, items))
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
export function renderNavBlocks(data, label) {
  const navs = []

  for (const heading in data) {
    const nav = renderNavItems(data[heading], { heading })
    navs.push(nav)
  }

  return elem('div', { 'aria-label': label }, join(navs))
}


// the "main" method called by the <navi/> tag
export function renderNav({ items, label }) {
  return Array.isArray(items) ? renderNavItems(items, { label }) :
    typeof items == 'object' ? renderNavBlocks(items, label) : ''
}


export function renderTOC(data) {

  const items = data.page.headings.filter(el => [2, 3].includes(el.level))
    .map(el => elem('a', { href: '#' + el.id, class: 'level-' + el.level }, el.html))

  return elem('nav', { 'aria-label': 'Table of contents', is: data.is }, join(items))
}
