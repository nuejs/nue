
/*
  Build-in tag library

    Why
      - Common, familiar syntax for content creators
      - No-need to re-implement the same thing accross websites
      - Radically reduces the amount of custom code
      - Shared semantics for design systems

    Features
      - Fully headless / semantic, minimal amount of class names
      - Fast, reliable, unit tested
      - Globally customizable
      - Can be combined to form more complex layouts
      - Outermost tag can change depending on use-case
      - Nuekit Error reporting
      - auto-detect attributes vs data
      - Usable outside Nuekit
      - Available on templates with "-tag" suffix: <image-tag>

*/

import { renderCodeBlock } from './render.js'
import { nuemarkdown } from '../index.js'
import { parseInline } from 'marked'

// list all tags that require a client-side Web Component
export const ISOMORPHIC = ['tabs']

export const tags = {

  // [button href="/kamaa" "Jotain"]
  button(data, opts) {
    const { attr, href="#", content=[] } = data
    const label = parseInline(data.label || data._ || content[0] || '')
    return elem('a', { ...attr, href, role: 'button' }, label || _)
  },

  icon({ _, icon_base='/img', alt }) {
    const src = `${icon_base}/${_}.svg`
    return elem('img', { src, alt: alt || `${_} icon` })
  },

  table({ attr, head, _, items=[] }) {
    const ths = toArray(head || _).map(val => elem('th', parseInline(val.trim())))
    const thead = elem('thead', elem('tr', join(ths)))

    const trs = items.map(row => {
      const tds = toArray(row).map(val => elem('td', parseInline(val.trim())))
      return elem('tr', join(tds))
    })

    return elem('table', attr, thead + elem('tbody', join(trs)))
  },

  // generic layout block
  layout(data, opts) {
    const { content=[]} = data
    // const bc = data.block_class || 'block'
    // { class: `${bc} ${bc}-${i + 1}` }
    const divs = content.map((str, i) => {
      const html = nuemarkdown(str, opts)
      return content[1] ? elem('div', html) : html
    })

    return elem(divs[1] ? 'section' : 'div', data.attr, join(divs))
  },

  /*
    # coderpad.io/blog/development/the-definitive-guide-to-responsive-images-on-the-web/

    * responsive: srcset, sizes
    * caption --> img -> <figure>
    * art direction: small, large, offset -> <picture>
    * href -> <a> wrapper
    * content -> tags.section()
  */
  image(data, opts) {
    const { attr, caption, width, href, content, loading='lazy' } = data

    const aside = caption ? elem('figcaption', parseInline(caption)) :
      content ? elem('figcaption', nuemarkdown(content[0], opts)) :
      null

    const img_attr = {
      src: data.src || data._ || data.large,
      srcset: join(data.srcset, ', '),
      sizes: join(data.sizes, ', '),
      alt: data.alt || caption,
      loading,
      width,
    }

    // img tag
    if (!aside) Object.assign(img_attr, attr)
    let img = data.small ? createPicture(img_attr, data) : elem('img', img_attr)

    // link
    if (href) img = elem('a', { href }, img)

    // figure
    return aside ? elem('figure', attr, img + aside) : img
  },


  // isomorphic later
  video(data, opts) {
    const { _, sources=[] } = data

    // inner <source> tags
    const html = sources.map(src => elem('source', { src, type: getMimeType(src) }) )

    // fallback content
    const [md] = data.content || []
    if (md) html.push(nuemarkdown(md, opts))

    return elem('video', { ...data.attr, src: _, ...getVideoAttrs(data) }, join(html))
  },

  /*
    Use CSS :target selector
      1. [tabs] (split body blocks in two)
      2. [tabs "First, Second, Third"]
  */
  tabs(data, opts) {
    const { attr, key='tab', content=[], _ } = data
    const half = Math.round(content.length / 2)
    const t = _ || data.tabs
    const tabs_arr = t ? toArray(t) : content.slice(0, half)

    const tabs = tabs_arr.map((el, i) => {
      const html = t ? el : nuemarkdown(el, opts)
      return elem('a', { href: `#${key}-${i+1}` }, html )
    })

    const panes = content.slice(t ? 0 : half).map((el, i) => {
      const html = nuemarkdown(el, opts)
      return elem('li', { id: `${key}-${i+1}` }, html )
    })

    return elem('section', { is: 'nuemark-tabs', class: 'tabs', ...attr },
      elem('nav', join(tabs)) +
      elem('ul', join(panes))
    )
  },


  /* later

  codetabs(data, opts) {
    const { content=[] } = data
    const types = toArray(data.types) || []

    // tabs are required
    if (!data._ && !data.tabs) throw 'codetabs: "tabs" attribute is required'

    // wrap content with fenced code blocks
    content.forEach((code, i) => {
      const name = types[i] || data.type || ''
      content[i] = renderCodeBlock({ name, code, attr: {} }, opts.highlight)
    })

    return tags.tabs(data, opts)
  },

  grid(data, opts) {
    const { attr, content=[], _='a'} = data
    const { cols, colspan } = getGridCols(content.length, _)
    const extra = { style: `--cols: ${cols}`, class: concat('grid', attr.class) }

    const divs = content.map((str, i) => {
      const attr = colspan && i + 1 == content.length ? { style: `--colspan: ${colspan}` } : {}
      return elem('div', attr, nuemarkdown(str, opts))
    })

    return elem('section', { ...attr, ...extra }, join(divs))
  },
  */

}

// ! shortcut
tags['!'] = function(data, opts) {
  const src = data._
  const mime = getMimeType(src)

  return data.sources || mime.startsWith('video') ? tags.video(data, opts) :
    src?.indexOf('.') == -1 ? tags.icon(data) :
    tags.image(data, opts)
}


export function elem(name, attr, body) {
  if (typeof attr == 'string') { body = attr; attr = {}}

  const html = [`<${name}${renderAttrs(attr)}>`]
  const closed = ['img', 'source'].includes(name)

  if (body) html.push(body)
  if (!closed) html.push(`</${name}>`)
  return html.join('')
}

function renderAttrs(attr) {
  const arr = []
  for (const key in attr) {
    const val = attr[key]
    if (val) arr.push(`${key}="${val}"`)
  }
  return arr[0] ? ' ' + arr.join(' ') : ''
}


function toArray(items) {
  return items?.split ? items.split(/ ?[,;|] ?/) : items
}

export function join(els, separ='\n') {
  return els?.join ? els.join(separ) : els
}

// concat two strings (for class attribute)
export function concat(a, b) {
  return join([a || '', b || ''], ' ').trim()
}

export function createPicture(img_attr, data) {
  const { small, offset=750 } = data

  const sources = [small, img_attr.src].map(src => {
    const prefix = src == small ? 'max' : 'min'
    const media = `(${prefix}-width: ${parseInt(offset)}px)`
    return elem('source', { src, media, type: getMimeType(src) })
  })

  sources.push(elem('img', img_attr))
  return elem('picture', !data.caption && data.attr, join(sources))
}


/* more complex grids later
const GRID = {
  a: [2, 3, 2, '2/2', 3, '3/3', 4, 3],
  b: [2, '2/2', '3/3']
}

export function getGridCols(am, variant='a') {
  const val = GRID[variant][am -2]
  if (!val) return { cols: '1fr 1fr' }
  const [count, span] = val.toString().split('/')
  return { cols: Array(1 * count).fill('1fr').join(' '), colspan: 1 * span }
}
*/


function getVideoAttrs(data) {
  const keys = 'autoplay controls loop muted poster preload src width'.split(' ')
  const attr = {}
  for (const key of keys) {
    const val = data[key]
    if (val) attr[key] = val === true ? key : val
  }
  return attr
}

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

