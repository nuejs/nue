
import { renderInline, renderTokens } from './render-inline.js'
import { parseLinkTitle } from './parse-inline.js'
import { parseBlocks } from './parse-blocks.js'
import { renderTag, wrap } from './render-tag.js'
import { elem } from './document.js'
import { glow } from 'glow'


export function renderLines(lines, opts) {
  return renderBlocks(parseBlocks(lines), opts)
}

export function renderBlocks(blocks, opts={}) {
  opts.reflinks = parseReflinks({ ...blocks.reflinks, ...opts?.data?.links })
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
    block.code ? renderCode(block) :
    block.is_newline ? '' :
    block.is_hr ? '<hr>' :
    console.error('Unknown block', block)
}


// recursive
function renderList({ items, numbered }, opts) {
  const html = items.map(blocks => elem('li', renderBlocks(blocks, opts)))
  return elem(numbered ? 'ol' : 'ul', html.join('\n'))
}

function parseReflinks(links) {
  for (const key in links) {
    links[key] = parseLinkTitle(links[key])
  }
  return links
}

export function renderHeading(h, opts={}) {
  const ids = opts.heading_ids
  const a = ids ? elem('a', { href: `#${ h.attr.id }`, title: h.text }) : ''
  if (!ids) delete h.attr.id

  return elem('h' + h.level, h.attr, a + renderTokens(h.tokens, opts))
}

export function renderContent(lines, opts) {
  const html = lines.map(line => renderInline(line, opts)).join('\n')
  return elem('p', html)
}

function renderCode({ name, code, attr, data }) {
  const { numbered } = data
  const klass = attr.class
  delete attr.class
  const pre = elem('pre', attr, glow(code, { language: name, numbered}))
  return wrap(klass, pre)
}

export function renderTable({ rows, attr, head=true }, opts) {

  const html = rows.map((row, i) => {
    const cells = row.map(td => elem(head && !i ? 'th' : 'td', renderInline(td, opts)))
    return elem('tr', cells.join(''))
  })

  return elem('table', attr, html.join('\n'))
}

