
const MIXED_HTML = ['html', 'jsx', 'php', 'astro', 'nue', 'vue', 'svelte', 'hb']
const LINE_COMMENT = { clojure: ';;', lua: '--', python: '#' }
const PREFIXES = {'+': 'ins', '-': 'del', '>': 'dfn' }
const MARK = /(••?)([^•]+)\1/g   // ALT + q
const NL = '\n'

const COMMON_WORDS = 'null|true|false|undefined|import|from|async|await|package|begin\
|interface|class|new|int|func|function|get|set|export|default|const|var|let\
|return|for|while|defer|if|then|else|elif|fi|int|string|number|def|public|static|void\
|continue|break|switch|case|final|finally|try|catch|while|super|long|float\
|throw|fun|val|use|fn|my|end|local|until|next|bool|ns|defn|puts|require|each'

// Implement most~50% of words to cover 95% of cases
const SPECIAL_WORDS = {
  cpp: 'cout|cin|using|namespace',
  python: 'None|nonlocal|lambda',
  go: 'chan|fallthrough',
  css: 'important'
}

// special rules (growing list)
const RULES = {
  css: [
    { tag: 'strong', re: /#[0-9a-f]{3,7}/gi },
  ]
}


const HTML_TAGS = [

  // line comment
  { tag: 'sup', re: /# .+/ },

  { tag: 'label', re: /\[([a-z\-]+)/g, lang: ['md', 'toml'], shift: true },

  // string value (keep second on the list)
  { tag: 'em', re: /'[^']*'|"[^"]*"/g, is_string: true },

  // HTML tag name
  { tag: 'strong', re: /<([\w\-]+ )/g, shift: true, lang: MIXED_HTML },

  { tag: 'strong', re: /<\/?([\w\-]+)>/g, shift: true, lang: MIXED_HTML },

  // ALL CAPS (constants)
  { tag: 'b', re: /\b[A-Z]{2,}\b/g },

  // @special
  { tag: 'label', re: /\B@[\w]+/gi },

  // char
  { tag: 'i', re: /[^\w •]/g },

  // variable name
  { tag: 'b', re: /\b([a-z][\w\-]+)\s*[:=\(!\[]/gi },

  // property name
  { tag: 'b', re: /"\w+":/g },

  // function name
  { tag: 'b', re: /([\w]+)\(/gi },

  // numeric value
  { tag: 'em', re: /\b\d+\.?[%\w\b]*/g },

  // variable name
  { tag: 'b', re: /([\w]+)\./g, lang: ['js'] },
]


function getTags(lang) {
  const tags = HTML_TAGS.filter(el => !el.lang || el.lang.includes(lang))

  // custom keywords
  if (lang != 'html') {
    const w = SPECIAL_WORDS[lang]
    const words = (w ? w + '|' : '') + COMMON_WORDS
    const re = new RegExp(`\\b(${words})\\b`, 'gi')
    tags.splice(4, 0, { tag: 'strong', re })
  }

  // custom rules
  const rules = RULES[lang]
  if (rules) tags.unshift(...rules)

  return tags
}

function encode(str) {
  return str.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

// wrap token
function elem(name, str) {
  if (str == '<') str = '&lt;'
  else if (str == '>') str = '&gt;'
  return `<${name}>${str}</${name}>`
}

/*
  Markdown code block inside Markdown is so different,
  that it requires a special treatment
*/
function isMD(lang) {
  return ['md', 'mdx', 'nuemark'].includes(lang)
}

function getMDTags(str) {
  const s = str.trim()
  const c = s[0]

  // divider
  if (s.startsWith('---')) return [{ tag: 'i', re: /-+/ }]

  // line comment
  if (s.startsWith('// ')) return [{ tag: 'sup', re: /.+/ }]

  if (['![', '[!'].includes(s.slice(0, 2))) return [{ tag: 'em', re: /.+/ }]

  if (['import', 'export'].includes(s.slice(0, 6))) return getTags('js')

  // HTML
  if (c == '<') return getTags('html')

  // heading
  if (c == '#') return [{ tag: 'label', re: /.+/ }]

  // quote
  if (c == '>') return [{ tag: 'i', re: />/ }, { tag: 'sup', re: / .+/ }]

  // front matter / yaml
  if (/^\w+: /.exec(s)) return getTags('yaml')

  // component
  if (c == '[' && s.endsWith(']')) {
    return s[1] == '.' ? [{ tag: 'label', re: /\w+/g }] : getTags('md')
  }

  // lists, links, images, fenced code
  return [
    // inline code
    { tag: 'strong', re: /\`.+\`/g },

    // image
    { tag: 'em', re: /^(!.+)/g, shift: true },

    // list
    { tag: 'b', re: /[\*\_\[\]\(\)<>]+/g },
  ]
}


export function parseRow(row, lang) {
  const tags = isMD(lang) ? getMDTags(row) : getTags(lang)
  const tokens = []

  // line comment (language specific)
  const re = new RegExp(`${LINE_COMMENT[lang] || '//'} .+`)
  tags.unshift({ tag: 'sup', re })


  for (const el of tags) {
    const { re, shift } = el

    row.replace(re, function(match, start, n) {
      if (arguments.length == 4) {
        const more = shift ? match.indexOf(start) : 0
        match = start; start = n + more
      }
      const end = start + match.length
      tokens.push({ start, end, ...el })
    })
  }
  return tokens.sort((a, b) => a.start - b.start)
}

function renderString(str) {
  return encode(str).replace(/\$?\{([^\}]+)\}/g, function(_, content) {
    return elem('i', _.replace(content, elem('b', content)))
  })
}


// exported for testing purposes
export function renderRow(row, lang) {
  if (!row) return ''

  const els = parseRow(row, lang)
  const ret = []
  var index = 0

  for (var i = 0, max = 0, len = els.length, el, next; (el = els[i]); i++) {
    const { start, end } = el
    next = els[i + 1] || []

    // skip overlappings
    if (start < max) continue
    if (start == next[0] && next[1] > end) continue
    if (end > max) max = end; else continue

    // construct final result
    ret.push(row.substring(index, start))
    const code = row.substring(start, end)
    ret.push(elem(el.tag, el.is_string ? renderString(code) : code))

    index = end
  }

  ret.push(row.substring(index))

  return ret.join('').replace(MARK, (_, a, b, c) => {
    return elem(a[1] ? 'u' : 'mark',  b)
  })
}


// comment start & end
const COMMENT = [/(\/\*|^ *{# |<!--|'''|=begin)/, /(\*\/|#}|-->|'''|=end)$/]

export function parseSyntax(str, lang) {
  const [comm_start, comm_end] = COMMENT
  const lines = []

  // multi-line comment
  let comment

  function endComment() {
    lines.push({ comment })
    comment = null
  }

  str.split(/\r\n|\r|\n/).forEach((line, i) => {

    // hack to join lines when there was newline in the middle of a line
    const quote = /^("|')/.exec(line)
    if (quote && line[1] != quote[0]) {
      const prev = lines[lines.length -1]
      if (prev?.line) prev.line += '\\n' + line
      return
    }

    if (!comment) {
      if (comm_start.test(line)) {
        comment = [line]
        if (comm_end.test(line) && line?.trim() != "'''") endComment()
      } else {

        // highlighted line
        const c = line[0]
        const wrap = isMD(lang) ? (c == '|' && 'dfn') : PREFIXES[c]
        if (wrap) line = (line[1] == ' ' ? ' ' : '') + line.slice(1)

        // escape character
        if (c == '\\') line = line.slice(1)

        lines.push({ line, wrap })
      }

    } else {
      comment.push(line)
      if (comm_end.test(line)) endComment()
    }
  })

  return lines
}


// code, { language: 'js', numbered: true }
export function glow(str, opts={}) {
  if (typeof opts == 'string') opts = { language: opts }

  // language
  let lang = opts.language
  if (!lang && str.trim()[0] == '<') lang = 'html'
  const lines = []

  function push(line) {
    lines.push(opts.numbered ? elem('span', line) : line)
  }

  parseSyntax(str.trim(), lang).forEach(function(block) {
    let { line, comment, wrap } = block

    // EOL comment
    if (comment) {
      return comment.forEach(el => push(elem('sup', encode(el))))

    } else {
      line = renderRow(line, lang)
    }

    if (wrap) line = elem(wrap, line)
    push(line)
  })

  return `<code language="${lang || '*'}">${lines.join(NL)}</code>`
}


