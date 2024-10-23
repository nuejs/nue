
/* Inline tokenizer */
import { parseTag, parseAttr } from './parse-tag.js'


export const FORMATTING = {
  '***':  'EM',
  '___':  'EM',
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

// chars to espace
export const ESCAPED = { '<': '&lt;', '>': '&gt;' }

// tested: regexp is faster than custom lookup function
const SIGNIFICANT = /[\*_\["`~\\/|•{\\<>]|!\[/


const PARSERS = [

  // \{ escaped }
  (str, char0) => {
    if (char0 == '\\') return { text: str.slice(1, 2), end: 2 }
  },

  // &lt; and &gt;
  (str, char0) => {
    const text = ESCAPED[char0]
    if (text) return { text, end: 1 }
  },

  // bold, italics, etc..
  (str, char0) => {
    for (const fmt in FORMATTING) {
      if (str.startsWith(fmt)) {
        const len = fmt.length
        const i = str.indexOf(fmt, len + 1)
        const body = str.slice(len, i)

        // no spaces before/after the body
        if (i == -1 || body.length != body.trim().length) return { text: str }

        const tag = FORMATTING[fmt]
        return { is_format: true, tag, body, end: i + len }
      }
    }
  },

  // [link](/), [tag], or [^footnote]
  (str, char0) => {
    if (char0 == '[') {
      const i = str.indexOf(']', 1)

      if (i == -1) return { text: char0 }

      // links
      if ('([]'.includes(str[i + 1])) {
        const link = parseLink(str) || parseLink(str, true)
        if (link) return link
      }

      // parse tag
      const tag = parseTag(str.slice(1, i).trim())
      const { name } = tag
      const end = i + 1

      // footnote?
      if (name[0] == '^') {
        const rel = name.slice(1)
        return rel >= 0 || isValidName(rel) ? { is_footnote: true, href: name, end } : { text: char0 }
      }

      // normal tag
      if (name == '!' || isValidName(name)) return { is_tag: true, ...tag, end }



      return { text: char0 }
    }
  },

  // ![image](/src.png)
  (str, char0) => {
    if (char0 == '!' && str[1] == '[') {
      const img = parseLink(str.slice(1))

      if (img) {
        img.end++
        return img && { is_image: true, ...img }
      }
    }
  },

  // { variables } / { #id.classNames }
  (str, char0) => {
    if (char0 == '{') {
      const i = str.indexOf('}', 2)
      if (i == -1) return { text: char0 }
      const name = str.slice(1, i).trim()

      return '.#'.includes(name[0]) ? { is_attr: true, attr: parseAttr(name), end: i + 1 } :
        { is_var: true, name, end: i + 1 }
      ;
    }
  },

  // plain text
  (text) => {
    const i = text.search(SIGNIFICANT)
    const prev = text[i - 1]
    const next = text[i + 1]
    return i >= 0 && (empty(prev) || empty(next)) ? { text: text.slice(0, i) } : { text }
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


function empty(char) {
  return !char || char == ' '
}

export function parseInline(str) {
  const tokens = []
  let breaker

  while(str) {
    if (breaker) break

    for (const fn of PARSERS) {
      const item = fn(str, str[0])
      if (item) {
        tokens.push(item)
        const beforeStr = str
        str = str.slice(item.end || item.text.length)
        if (!item.text && beforeStr === str) breaker = true
        delete item.end
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


/*** utils ****/

// function lastIndexOf()

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

  } else  {
    // links with closing bracket (ie. Wikipedia)
    if (str[j + 1] == ')') j++
  }


  // href & title
  let { href, title } = parseLinkTitle(str.slice(i + 2, j))

  return {
    href, title, label,
    is_footnote: href[0] == '^',
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



