
/* Inline tokenizer */
import { parseTag, parseAttr } from './parse-tag.js'


export const FORMATTING = {
  '***': 'EM',
  '___': 'EM',
  '**':  'strong',
  '__':  'strong',

  // after strongs
  '*':   'em',
  '_':   'em',
  '"':   'q',
  '`':   'code',
  '~':   's',
  '|':   'mark',
  '/':   'i',
  '•':   'b',
}

// chars to escape
export const ESCAPED = { '<': '&lt;', '>': '&gt;' }

// tested: regexp is faster than custom lookup function
const SIGNIFICANT = /[\*_\["`~\\/|•{\\<>]|!\[/


// c == first character (for quick tests)
const PARSERS = [

  // \{ escaped }
  (str, c) => {
    if (c == '\\') return { text: str.slice(1, 2), end: 2 }
  },

  // &lt; and &gt;
  (str, c) => {
    const text = ESCAPED[c]
    return text ? { text, end: 1 } : null
  },


  // bold, italics, etc..
  (str, c) => {
    for (const fmt in FORMATTING) {
      if (str.startsWith(fmt)) {
        const len = fmt.length
        const i = str.indexOf(fmt, len)
        const next = str[i + len]

        // if next char is a word -> no formatting
        if (i == -1 || next && /\w/.test(str[i + len])) return { text: fmt }

        // no spaces before/after the body
        const body = str.slice(len, i)
        if (!body || body.length != body.trim().length) return { text: fmt }

        return { is_format: true, tag: FORMATTING[fmt], body, end: i + len }
      }
    }
  },

  // [link](/), [tag], or [^footnote]
  (str, c) => {
    if (c == '[') {
      const i = str.indexOf(']', 1)

      if (i == -1) return { text: c }

      // links
      if ('([]'.includes(str[i + 1])) {
        const link = parseLink(str) || parseLink(str, true)
        if (link) return link
      }

      // parse tag
      const tag = parseTag(str.slice(1, i).trim())
      const { name } = tag
      const is_footnote = name && name[0] == '^'
      const end = i + 1

      // footnote?
      if (is_footnote) {
        const rel = name.slice(1)
        return rel >= 0 || isValidName(rel) ? { is_footnote, href: '#' + name, end } : { text: c }
      }

      // normal tag
      if (name == '!' || isValidName(name)) return { is_tag: true, ...tag, end }
      // span
      if (!name) return { is_span: true, ...tag, end }

      return { text: c }
    }
  },

  // ![image](/src.png)
  (str, c) => {
    if (c == '!' && str[1] == '[') {
      const img = parseLink(str.slice(1))

      if (img) {
        img.end++
        return img && { is_image: true, ...img }
      } else {
        return { text: c }
      }
    }
  },

  // { variables } / { #id.classNames }
  (str, c) => {
    if (c == '{') {
      const i = str.indexOf('}', 2)
      if (i == -1) return { text: c }
      const name = str.slice(1, i).trim()

      return '.#'.includes(name[0])
        ? { is_attr: true, attr: parseAttr(name), end: i + 1 }
        : { is_var: true, name, end: i + 1 }
    }
  },

  // plain text
  (text) => {
    const i = text.search(SIGNIFICANT)
    return i >= 0 ? { text: text.slice(0, i) } : { text }
  }
]


function isValidName(name) {

  // cannot be a number
  if (name >= 0) return false

  // cannot contain special characters
  const i = name.search(/\W/)
  const char = name[i]
  return i == -1 || i > 0 && char == '-'
}



export function parseInline(str) {
  const tokens = []

  while (str) {
    for (const fn of PARSERS) {
      const item = fn(str, str[0])
      if (item) {
        tokens.push(item)
        str = str.slice(item.end || item.text.length)
        delete item.end; break
      }
    }

    // if (iter++ > 3) { console.info('loop'); break }
  }

  // merge text siblings into one
  return tokens.filter(({ text }, i) => {
    const next = tokens[i + 1]
    if (text && next?.text) next.text = text + next.text
    else return true
  })
}


/*** link / image parsing ****/


export function parseLink(str, is_reflink) {
  const [open, close] = is_reflink ? '[]' : '()'
  let i = str.indexOf(']' + open, 1)

  // not a link
  // const next = str[i + 1]
  if (i == -1) return

  let j = i > 0 ? str.indexOf(close, i + 2) : 0

  // not a link
  if (j == -1) return

  // label
  let label = str.slice(1, i)

  // image inside label
  if (label.includes('![')) {
    i = str.indexOf(']' + open, j)
    label = str.slice(1, i)
    j = str.indexOf(close, i + 2)
    if (i == -1 || j == -1) return

  } else {
    // links with closing bracket (ie. Wikipedia)
    if (str[j + 1] == ')') j++
  }

  // href & title
  let { href, title } = parseLinkTitle(str.slice(i + 2, j))

  // footnote reference
  const is_footnote = href[0] == '^'
  if (is_footnote) {
    is_reflink = null
    href = '#' + href
  }

  return {
    href, title, label,
    is_footnote,
    is_reflink,
    end: j + 1
  }
}

export function parseLinkTitle(href) {
  const i = href.indexOf('"')
  if (i > 0) {
    const j = href.indexOf('"', i + 1)
    if (j > 0) return {
      href: href.slice(0, i).trim(),
      title: href.slice(i + 1, -1)
    }
  }
  return { href }
}



