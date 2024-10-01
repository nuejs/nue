
import { renderInline, elem } from 'nuemark2'


export function renderPageList(data) {
  const key = data.collection_name || data.content_collection
  const items = key ? data[key] : data.itmes || data

  if (!items?.length) {
    console.error('Gallery tag: no data or content collection defined')
    return ''
  }

  const pages = items.map(renderPageListItem)
  return elem('ul', pages.join('\n'))
}

export function renderPageListItem(page) {
  const { title, desc, url } = page
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

export function renderPrettyDate(date) {
  if (!date) date = new Date()
  if (!date.getDate) date = new Date(date)
  return elem('time', { datetime: date.toISOString() }, prettyDate(date))
}

export function toAbsolute(path, dir) {
  return path && path[0] != '/' ? `/${dir}/${path}`: path
}





