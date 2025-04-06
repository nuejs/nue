
import { glow } from 'nue-glow'

import { renderInline, renderTokens } from './render-inline.js'
import { renderTable, renderTag, wrap } from './render-tag.js'
import { parseBlocks } from './parse-blocks.js'


// for testing only
export function renderLines(lines, opts) {
  const things = parseBlocks(lines)
  return renderBlocks(things.blocks, { ...opts, ...things })
}

export function renderBlocks(blocks, opts = {}) {
  return blocks.map(b => renderBlock(b, opts)).join('\n')
}

function renderBlock(block, opts) {
  const fn = opts?.beforerender
  if (fn) fn(block)

  return block.is_content ? renderContent(block.content, opts) :
    block.is_heading ? renderHeading(block, opts) :
      block.is_quote ? elem('blockquote', renderBlocks(block.blocks, opts)) :
        block.is_tag ? renderTag(block, opts) :
          block.is_table ? renderTable(block, opts) :
            block.is_list ? renderList(block, opts) :
              block.is_code ? renderCode(block, opts) :
                block.is_newline ? '' :
                  block.is_break ? '<hr>' :
                    block.is_html ? block.html :
                      console.error('Unknown block', block)
}

// recursive
function renderList({ items, numbered }, opts) {
  const html = items.map(blocks => elem('li', renderBlocks(blocks, opts)))
  return elem(numbered ? 'ol' : 'ul', html.join('\n'))
}

export function renderHeading(h, opts = {}) {
  const attr = { ...h.attr }
  const show_id = opts.heading_ids
  if (show_id && !attr.id) attr.id = createHeadingId(h.text)

  // anchor
  const a = show_id ? elem('a', { href: `#${attr.id}`, title: h.text }) : ''

  return elem('h' + h.level, attr, a + renderTokens(h.tokens, opts))
}


export function createHeadingId(text) {
  let hash = text.slice(0, 32).replace(/'/g, '').replace(/[\W_]/g, '-').replace(/-+/g, '-').toLowerCase()
  if (hash[0] == '-') hash = hash.slice(1)
  if (hash.endsWith('-')) hash = hash.slice(0, -1)
  return hash
}

export function renderContent(lines, opts) {
  const html = lines.map(line => renderInline(line, opts)).join(' ')
  return elem('p', html)
}

function renderCode({ name, code, attr, data }, opts) {
  const { numbered } = data
  const klass = attr.class
  delete attr.class

  let html = renderTag({
      name: 'codeblock', attr, data: { code },
      blocks: [{ is_html: true, html: glow(code, { language: name, numbered }) }],
    }, opts)

  const caption = data.caption || data._

  if (caption) {
    const figcaption = elem('figcaption', renderInline(caption))
    return elem('figure', { class: klass }, figcaption + html)
  }

  return wrap(klass, html)
}

/**** utilities ****/
const SELF_CLOSING = ['img', 'source', 'meta', 'link']

export function elem(name, attr, body) {
  if (typeof attr == 'string') { body = attr; attr = null }

  const html = [`<${name}${renderAttrs(attr)}>`]

  if (body) html.push(body)
  if (!SELF_CLOSING.includes(name)) html.push(`</${name}>`)
  return html.join('')
}


function renderAttrs(attr) {
  const arr = []
  for (const key in attr) {
    const val = attr[key]
    if (val) arr.push(val === true ? key : `${key}="${val}"`)
  }
  return arr[0] ? ' ' + arr.join(' ') : ''
}





