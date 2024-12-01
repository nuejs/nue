
import { renderBlocks, renderContent } from './render-blocks.js'
import { sectionize,  } from './parse-document.js'
import { renderInline } from './render-inline.js'
import { elem } from './render-blocks.js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'


// built-in tags
const TAGS = {

  accordion({ name, open }) {
    const html = this.sections?.map((blocks, i) => {
      const head = elem('summary', blocks[0].text)
      const body = elem('div', this.render(blocks.slice(1)))
      const opened = open === true && i == 0 || i === open
      return elem('details', { name, open: opened }, head + body)
    })

    return html && elem('div', this.attr, html.join('\n'))
  },

  block() {
    const { render, attr, blocks } = this
    const divs = sectionize(blocks)

    const html = !divs || !divs[1] ? render(blocks) :
      divs.map(blocks => elem('div', render(blocks))).join('\n')

    return elem(attr.popover ? 'dialog' : 'div', attr, html)
  },


  button(data) {
    const { href } = data
    const label = this.renderInline(data.label || data._) || this.innerHTML || ''

    return href ? elem('a', { ...this.attr, href, role: 'button' }, label) :
      elem('button', this.attr, label)
  },

  define() {
    const html = this.sections?.map((blocks, i) => {
      const { attr, text } = blocks[0]
      const title = attr.id ? elem('a', { name: `^${attr.id}` }, text) : text
      const dt = elem('dt', { class: attr.class }, title)
      const dd = elem('dd', this.render(blocks.slice(1)))
      return dt + dd
    })

    return html && elem('dl', this.attr, html.join('\n'))
  },


  image() {
    const { attr, data } = this
    const { caption, href, loading='lazy' } = data
    const src = data.src || data._ || data.large
    const alt = data.alt || caption

    // img tag
    const img_attr = { alt, loading, src, ...parseSize(data) }
    let img = data.small ? createPicture(img_attr, data) : elem('img', img_attr)

    // wrap image inside a link
    if (href) img = elem('a', { href }, img)

    // figcaption
    const figcaption = caption ? this.renderInline(caption) : this.innerHTML
    if (figcaption) img += elem('figcaption', figcaption)

    // always wrapped inside a figure
    return elem('figure', attr, img)
  },


  list() {
    const items = this.sections || getListItems(this.blocks)
    const item_attr = { class: this.data.items }
    const html = items.map(blocks => elem('li', item_attr, this.render(blocks)))
    const ul = elem('ul', this.attr, html.join('\n'))
    return wrap(this.data.wrapper, ul)
  },

  svg(data) {
    const src = data.src || data._
    return src ? readIcon(src) : ''
  },

  table() {
    const { attr, data, body, opts } = this
    let table = { rows: data.rows || data.items }
    if (!table.rows && body) table = parseTable(body)

    const html = renderTable({ attr, ...data, ...table }, opts)
    return wrap(data.wrapper, html)
  },

  video() {
    const { data } = this
    const src = data.src || data._
    const type = getMimeType(src)
    const attr = { ...this.attr, src, type, ...getVideoAttrs(data) }
    return elem('video', attr, this.innerHTML)
  },


  // shortcut
  '!': function() {
    const tag = getMimeType(this.data._).startsWith('video') ? TAGS.video : TAGS.image
    return tag.call(this)
  }
}


export function readIcon(path, icon_dir) {
  if (!path.endsWith('.svg')) {
    path += '.svg'
    if (icon_dir && path[0] != '/') path = join(icon_dir, path)
  }

  path = join('.', path)

  try {
    return readFileSync(path, 'utf-8')
  } catch (e) {
    console.error('svg not found', path)
    return ''
  }
}

export function renderTag(tag, opts={}) {
  const tags = { ...TAGS, ...opts.tags }
  const fn = tags[tag.name || 'block']

  if (!fn) return renderIsland(tag, opts.data)

  const data = { ...opts.data, ...extractData(tag.data, opts.data) }
  const { blocks } = tag

  const api = {
    ...tag,
    get innerHTML() { return getInnerHTML(this.blocks, opts) },
    render(blocks) { return renderBlocks(blocks, opts) },
    renderInline(str) { return renderInline(str, opts) },
    sections: sectionize(tag.blocks),
    data,
    opts,
    tags,
  }

  return fn.call(api, data)
}


export function renderIsland(tag, all_data) {
  const { name, attr } = tag
  const data = extractData(tag.data, all_data)

  const json = !Object.keys(data)[0] ? '' :
    elem('script', { type: 'application/json' }, JSON.stringify(data))
  return elem(name, { 'custom': name, ...attr }, json)
}




/******* utilities *******/

const MIME = {
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
  mov: 'video/mov',
  webm: 'video/webm',
  mp4: 'video/mp4',
}

function getMimeType(path='') {
  const type = path.slice(path.lastIndexOf('.') + 1)
  return MIME[type] || `image/${type}`
}

export function createPicture(img_attr, data) {
  const { small, offset=750 } = data

  const sources = [small, img_attr.src].map(src => {
    const prefix = src == small ? 'max' : 'min'
    const media = `(${prefix}-width: ${parseInt(offset)}px)`
    return elem('source', { srcset: src, media, type: getMimeType(src) })
  })

  sources.push(elem('img', img_attr))
  return elem('picture', sources.join('\n'))
}

function getListItems(arr) {
  if (arr && arr[0]) return arr[0].items || arr.map(el => [el])
}

export function parseSize(data) {
  const { size='' } = data
  const [ w, h ] = size.trim().split(/\s*\D\s*/)
  return { width: w || data.width, height: h || data.height }
}


// :rows="pricing" --> rows -> all_data.pricing
function extractData(data, all_data) {
  for (const key in data) {
    if (key.startsWith(':')) {
      data[key.slice(1)] = all_data[data[key]]
      delete data[key]
    }
  }
  return data
}

function getVideoAttrs(data) {
  const keys = 'autoplay controls loop muted poster preload src width'.split(' ')
  const attr = {}
  for (const key of keys) {
    const val = data[key]
    if (val) attr[key] = val
  }
  return attr
}

export function wrap(name, html) {
  return name ? elem('div', { class: name }, html) : html
}



function getInnerHTML(blocks = [], opts) {
  const [ first, second ] = blocks
  if (!first) return ''
  const { content } = first
  return content && !second ? renderInline(content.join(' '), opts) : renderBlocks(blocks, opts)
}


// table helpers
export function renderTable(table, opts) {
  const { rows, attr, head=true } = table
  if (!rows) return ''

  // column count
  let colcount

  const html = rows.map((row, i) => {
    if (typeof row == 'string') row = row.split(/\s*\|\s*/)
    if (!i) colcount = row.length

    const is_head = head && i == 0 && rows.length > 1
    const is_foot = table.foot && i > 1 && i == rows.length - 1
    const colspan = colcount - row.length + 1

    const cells = row.map(td => {
      const attr = colspan > 1 ? { colspan } : null
      return elem(is_head || is_foot ? 'th' : 'td', attr, renderInline(td, opts))
    })

    const tr = elem('tr', cells.join(''))
    return is_head ? elem('thead', tr) : is_foot ? elem('tfoot', tr) : tr
  })

  const caption = table.caption ? elem('caption', renderInline(table.caption, opts)) : ''

  return elem('table', attr, caption + html.join('\n'))
}

export function parseTable(lines) {
  const rows = []
  const specs = {}

  lines.forEach((line, i) => {
    if (!line.trim()) return


    if (line.startsWith('---')) {
      if (rows.length == 1) specs.head = true
      else if (i == lines.length -2) specs.foot = true
      return
    }

    // split to cells
    let els = line.split(/\s*[;|]\s/)
    if (i == 0) specs.cols = els.length

    // append to previous row
    if (els.length < specs.cols) {
      const prev = rows[rows.length -1]
      if (prev.length < specs.cols) return prev.push(...els)
    }

    rows.push(els)
  })

  return { rows, ...specs }
}