
/* Inline tokenizer */
import { parseTag, parseAttr } from './parse-tag.js'


// from long to short
export const FORMATTING = {
  '**':  'strong',
  '__':  'strong',
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

  // character escaping first
  (str, char0) => {
    if (char0 == '\\') return { text: str.slice(1, 2), end: 2 }
  },

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
        const tag = FORMATTING[fmt]
        return i == -1 || str[len] == ' ' ? { text: str.slice(0, len) } :
          { is_format: true, tag, body: str.slice(len, i), end: i + len }
      }
    }
  },

  // links (must be before formatting)
  (str, char0) => {
    if (char0 == '[') {
      return parseLink(str) || parseLink(str, true)
    }
  },

  // images
  (str, char0) => {
    if (char0 == '!' && str[1] == '[') {
      const img = parseLink(str.slice(1))

      if (img) {
        img.end++
        return img && { is_image: true, ...img }
      }
    }
  },

  // tags
  (str, char0) => {
    if (char0 == '[') {
      const i = str.indexOf(']', 2)
      if (i == -1) return { text: char0 }
      const specs = str.slice(1, i).trim()
      return { is_tag: true, ...parseTag(specs), end: i + 1 }
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

function empty(char) {
  return !char || char == ' '
}

export function parseInline(str) {
  const tokens = []

  while(str) {
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


/*** utils ****/

export function parseLink(str, is_reflink) {
  const [open, close] = is_reflink ? '[]' : '()'
  const i = str.indexOf(']', 1)
  const next = str[i + 1]

  if (next != open) return

  let j = i > 0 ? str.indexOf(close, 3 + i) : 0

  // not a link
  if (j <= 0 || str[i] == ' ') return

  // links with closing bracket (ie. Wikipedia)
  if (str[j + 1] == ')') j++

  return {
    ...parseLinkTitle(str.slice(i + 2, j)),
    label: str.slice(1, i),
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



