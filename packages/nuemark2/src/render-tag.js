
import { renderBlocks, renderTable, renderContent } from './render-blocks.js'
import { renderInline } from './render-inline.js'
import { sectionize, elem } from './document.js'
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

    return elem('div', attr, html)
  },


  button(data) {
    const label = this.renderInline(data.label || data._) || this.innerHTML || ''
    return elem('a', { ...this.attr, href: data.href, role: 'button' }, label)
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
    const path = join('.', src)

    try {
      return src?.endsWith('.svg') && readFileSync(path, 'utf-8')
    } catch (e) {
      console.error('svg not found', path)
    }
  },

  table() {
    const { attr, data, blocks } = this
    let { items } = data
    if (!items && blocks && blocks[0]) items = blocks[0].content
    const table = renderTable({ attr, items, ...data }, this.opts)
    return wrap(data.wrapper, table)
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

export function renderTag(tag, opts={}) {
  const tags = opts.tags = { ...TAGS, ...opts?.tags }
  const fn = tags[tag.name || 'block']

  if (!fn) return renderIsland(tag)

  const data = extractColonVars({ ...opts.data, ...tag.data })
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


// :rows="pricing" --> rows -> data.pricing
function extractColonVars(data) {
  for (const key in data) {
    if (key.startsWith(':')) {
      data[key.slice(1)] = data[data[key]]
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

export function renderIsland({ name, attr, data }) {
  const json = !Object.keys(data)[0] ? '' :
    elem('script', { type: 'application/json' }, JSON.stringify(data))
  return elem(name, { 'custom': name, ...attr }, json)
}
