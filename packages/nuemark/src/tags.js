
/*
  Build-in tag library

  Why
    - Common syntax for content teams
    - Re-usable components accross projects
    - Shared semantics for design systems

  Features
    - Can be combined to form more complex layouts
    - Fully headless & semantic = externally styleable
    - Fast, reliable, unit tested
    - Globally & local configuration
    - Usable outside Nue

  TODO
    - Available on templates with "-tag" suffix: <image-tag>
    - Nuekit Error reporting
*/
import { readFileSync } from 'node:fs'
import { nuemarkdown } from '../index.js'
import { parseInline } from 'marked'
import { glow } from 'nue-glow'
import path from 'node:path'


export const tags = {

  button(data) {
    const { attr, href="#", content=[] } = data
    const label = parseInline(data.label || data._ || content[0] || '')
    return elem('a', { ...attr, href, role: 'button' }, label || _)
  },

  table(data) {
    const { attr, head, _, items=[] } = data
    const ths = toArray(head || _).map(val => elem('th', parseInline(val.trim())))
    const thead = elem('thead', elem('tr', join(ths)))

    const trs = items.map(row => {
      const tds = toArray(row).map(val => elem('td', parseInline(val.trim())))
      return elem('tr', join(tds))
    })

    const table = elem('table', attr, thead + elem('tbody', join(trs)))

    return createWrapper(data.wrapper, table)
  },

  // generic <div> element with nested items
  block(data, opts) {
    const { content=[] } = data

    const divs = content.map((str, i) => {
      const html = nuemarkdown(str, opts)
      return content[1] ? elem('div', html) : html
    })

    return elem('div', data.attr, join(divs))
  },

  grid(data, opts) {
    const { content=[] } = data
    const items = toArray(data.items) || []
    if (!data.attr.class) data.attr.class = 'grid'

    const divs = content.map((str, i) => {
      const html = nuemarkdown(str, opts)
      const comp = data.grid_item_component
      if (comp) attr.is = comp

      const attr = { class: items[i] || data.item || data.grid_item_class }
      return content[1] ? elem('div', attr, html) : html
    })

    return elem('div', data.attr, join(divs))
  },


  image(data, opts) {
    const src = data.src || data._ || data.large

    // inline SVG
    if (data.inline && src.endsWith('.svg')) {
      return readFileSync(path.join('.', src), 'utf-8')
    }

    const { attr, caption, href, content, loading='lazy' } = data
    const { width, height } = parseSize(data)

    const img_attr = {
      srcset: join(data.srcset, ', '),
      sizes: join(data.sizes, ', '),
      alt: data.alt || caption,
      loading,
      height,
      width,
      src,
    }

    // figcaption
    const figcaption = caption ? elem('figcaption', parseInline(caption)) :
      content ? elem('figcaption', nuemarkdown(content[0], opts)) : ''

    // img tag
    let img = data.small ? createPicture(img_attr, data) : elem('img', img_attr)

    // wrap image inside a link
    if (href) img = elem('a', { href }, img)

    // always wrapped inside a figure
    return elem('figure', attr, img + figcaption)
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


  tabs(data, opts) {
    const { attr } = data

    // @depreciated: "tabs" default class name
    if (attr && !attr.class) attr.class = 'tabs'

    return createARIATabs(data, content => nuemarkdown(content, opts))
  },


  // developer.mozilla.org/en-US/docs/Web/HTML/Element/figure#code_snippets
  codetabs(data) {
    const languages = toArray(data.languages) || []

    return createARIATabs(data, (content, i) => {
      return createCodeBlock({ content, language: languages[i], numbered: data.numbered })
    })
  },

  // caption, language, numbered
  code(data) {
    const { caption, attr={} } = data
    const klass = attr.class
    delete attr.class

    const head = caption ? elem('figcaption', parseInline(caption)) : ''
    const root = head ? elem('figure', attr, head + createCodeBlock(data)) : createCodeBlock(data, attr)
    return createWrapper(klass, root)
  },

  // captions, languages, classes, numbered
  codeblocks(data) {
    const { content, attr, numbered } = data
    const captions = toArray(data.captions) || []
    const languages = toArray(data.languages) || []
    const classes = toArray(data.classes) || []

    const blocks = content.map((code, i) => {
      return tags.code({
        attr: { class: classes[i] },
        language: languages[i],
        caption: captions[i],
        content: code,
        numbered
      })
    })

    return elem('div', attr, join(blocks))
  }

}

function createTabIds(key, i) {
  return key ? [ `${key}-tab-${i+1}`, `${key}-panel-${i+1}`] : []
}

function createWrapper(className, root) {
  return className ? elem('div', { class: className }, root) : root
}

//
function createARIATabs(data, fn) {
  const { key } = data
  const captions = toArray(data.captions || data.tabs || data._) || []

  const tabs = captions.map((caption, i) => {
    const [ id, target ] = createTabIds(key, i)
    const prop = { role: 'tab', 'aria-selected': i == 0, id, 'aria-controls': target }
    return elem('a', prop, parseInline(caption))
  })

  const panes = data.content.map((content, i) => {
    const [ tabId, id ] = createTabIds(key, i)
    const prop = { role: 'tabpanel', id, 'aria-labelledby': tabId, hidden: i ? 'hidden' : null }
    return elem('li', prop, fn(content, i))
  })

  const root = elem('div', { tabs: true, is: 'aria-tabs', ...data.attr },
    elem('div', { role: 'tablist' }, tabs.join('\n')) +
    elem('ul', panes.join('\n'))
  )

  return createWrapper(data.wrapper, root)
}


// ! shortcut
tags['!'] = function(data, opts) {
  const src = data._
  const mime = getMimeType(src)
  return data.sources || mime.startsWith('video') ? tags.video(data, opts) : tags.image(data, opts)
}

// alias
tags.section = tags.layout

// alias (depreciated)
tags.layout = tags.block

export function elem(name, attr, body) {
  if (typeof attr == 'string') { body = attr; attr = {}}

  const html = [`<${name}${renderAttrs(attr)}>`]
  const closed = ['img', 'source', 'meta', 'link'].includes(name)

  if (body) html.push(body)
  if (!closed) html.push(`</${name}>`)
  return html.join('')
}


function renderAttrs(attr) {
  const arr = []
  for (const key in attr) {
    const val = attr[key]
    if (val) arr.push(val === true ? key :`${key}="${val}"`)
  }
  return arr[0] ? ' ' + arr.join(' ') : ''
}


function toArray(items) {
  return items?.split ? items.split(/ ?[;|] ?/) : items
}

export function join(els, separ='\n') {
  // do not filter away empty lines (.filter(el => !!el))
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
    return elem('source', { srcset: src, media, type: getMimeType(src) })
  })

  sources.push(elem('img', img_attr))
  return elem('picture', null, join(sources))
}

export function parseSize(data) {
  const { size='' } = data
  const [ w, h ] = size.trim().split(/\s*\D\s*/)
  return { width: w || data.width, height: h || data.height }
}

function createCodeBlock({ content, language='', numbered }, attr={}) {
  const code = glow(join(content), { language: language?.trim(), numbered })
  return elem('pre', attr, code)
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

