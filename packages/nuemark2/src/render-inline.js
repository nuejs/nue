
import { parseInline } from './parse-inline.js'
import { renderTag } from './render-tag.js'
import { elem } from './document.js'

export function renderToken(token, opts={}) {
  const { text, href, label, title } = token
  const { reflinks={}, data={} } = opts

  return text ? text :
    token.is_format ? formatText(token, opts) :
    token.is_image ? elem('img', { src: href, alt: label, title, loading: 'lazy' }) :
    href ? renderLink(renderInline(label, opts), reflinks[href] || token) :
    token.is_var ? (data[token.name] || '') :
    token.is_tag ? renderTag(token, opts) :
    ''
}

function formatText({tag, body }, opts) {
  const html = tag == 'code' ? body : renderInline(body, opts)
  return elem(tag, html)
}

function renderLink(label, link) {
  const { href, title } = link
  return elem('a', { href, title }, label)
}

export function renderTokens(tokens, opts) {
  return tokens.map(token => renderToken(token, opts)).join('').trim()
}

export function renderInline(str, opts) {
  return renderTokens(parseInline(str), opts)
}


