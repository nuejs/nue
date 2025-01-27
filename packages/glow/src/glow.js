
const MIXED_HTML = ['html', 'jsx', 'php', 'astro', 'dhtml', 'vue', 'svelte', 'hb']
const LINE_COMMENT = { clojure: ';;', lua: '--', python: '#' }
const PREFIXES = { '+': 'ins', '-': 'del', '>': 'dfn' }
const MARK = /(••?)([^•]+)\1/g   // ALT + q
const NL = '\n'

const COMMON_WORDS = 'null|true|false|undefined|import|from|async|await|package|begin\
|interface|class|new|int|func|function|get|set|export|default|const|var|let\
|return|yield|for|while|defer|if|then|else|elif|fi|int|string|number|def|public|static|void\
|continue|break|switch|case|final|finally|try|catch|while|super|long|float\
|throw|fun|val|use|fn|my|end|local|until|next|bool|ns|defn|puts|require|each'

// Implement most~50% of words to cover 95% of cases
const SPECIAL_WORDS = {
  cpp: 'cout|cin|using|namespace',
  python: 'None|nonlocal|lambda',
  go: 'chan|fallthrough'
}

// special rules (growing list)
const RULES = {
  css: [
    { tag: 'strong', re: /#[0-9a-f]{3,7}/gi },
    { tag: 'label', re: /!important/gi },
    { tag: 'em', re: /--[\w\d\-]+/gi },
  ],

  json: [
    { tag: 'b', re: /(".+"):/gi },
  ],
  yaml: [
    { tag: 'b', re: /([\w ]+):/gi },
  ],
}


const HTML_TAGS = [

  // line comment
  { tag: 'sup', re: /# .+/ },
  
  // inline comment
  { tag: 'sup', re: /\/\*.*?\*\//g },

  { tag: 'label', re: /\[([a-z\-]+)/g, lang: ['md', 'toml'], shift: true },

  // string value (keep second on the list)
  { tag: 'em', re: /'[^']*'|"[^"]*"/g, is_string: true },

  // HTML tag name
  { tag: 'strong', re: /<([\w\-]+ )/g, shift: true, lang: MIXED_HTML },
  { tag: 'strong', re: /<\/?([\w\-]+)>/g, shift: true, lang: MIXED_HTML },

  // ALL CAPS (constants)
  // { tag: 'b', re: /\b[A-Z]{2,}\b/g },

  // @special
  { tag: 'label', re: /\B@[\w\-]+/gi },

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
  if (!['yaml','html', 'json'].includes(lang)) {
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
  Markdown/MDX requires a special treatment, because it's so
  different from others (not a programming language)
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
export function renderRow(row, lang, mark=true) {
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
  const res = ret.join('')

  return !mark ? res : res.replace(MARK, (_, marker, content) => {
    return elem(marker[1] ? 'u' : 'mark', content)
  })
}


// comment start & end
const COMMENT = [/(\/\*|^ *{# |<!--|'''|=begin)/, /(\*\/|#}|-->|'''|=end)/]

export function parseSyntax(lines, lang, prefix = true) {
  const [comm_start, comm_end] = COMMENT
  const html = []

  // multi-line comment
  let comment

  function endComment(partial) {
    html.push({ comment, partial })
    comment = null
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (!comment) {
      const start_comm = comm_start.exec(line)
      const end_comm = comm_end.exec(line)
      if (start_comm && start_comm.index === 0 && (!end_comm || line.length === end_comm.index + end_comm[0].length)) {
        // entire line is a complete comment OR the beginning of a block comment
        comment = [line]
        if (end_comm && line?.trim() != "'''") endComment()
      } else {

        // highlighted line
        const is_md = isMD(lang)
        const c = line[0]
        let wrap = prefix && (is_md ? (c == '|' && 'dfn') : PREFIXES[c])
        if (wrap && is_md && line == '---') wrap = null
        if (wrap) line = (line[1] == ' ' ? ' ' : '') + line.slice(1)

        // escape character
        if (prefix && c == '\\') line = line.slice(1)

        html.push({ line, wrap })
      }

    } else {
      const end_comm = comm_end.exec(line)
      if (end_comm) {
        const end = end_comm.index + end_comm[0].length
        const [before, after] = [line.slice(0, end), line.slice(end)]
        comment.push(before)
        endComment(!!after.length)
        if (after) {
          lines.splice(i + 1, 0, after)
        }
      } else {
        comment.push(line)
      }
    }
  }

  return html
}


// code, { language: 'js', numbered: true }
export function glow(str, opts = { prefix: true, mark: true }) {
  if (typeof opts == 'string') opts = { language: opts }
  const lines = Array.isArray(str) ? str : str.trim().split(/\r\n|\r|\n/)

  if (!lines[0]) return ''

  // language
  let lang = opts.language
  if (!lang && lines[0][0] == '<') lang = 'html'
  const html = []

  let is_partial = false
  function push(line) {
    if (is_partial) html[html.length - 1] = html[html.length - 1] + line
    else html.push(line)
    is_partial = false
  }

  parseSyntax(lines, lang, opts.prefix).forEach(function(block) {
    let { line, comment, wrap, partial } = block
    
    // EOL comment
    if (comment) {
      comment.forEach(el => push(elem('sup', encode(el))))
      is_partial = partial
      return
      
    } else {
      line = renderRow(line, lang, opts.mark)
    }
    
    if (wrap) line = elem(wrap, line)
    push(line)
    is_partial = partial
  })

  return `<code language="${lang || '*'}">${html.map(el => opts.numbered ? elem('span', el) : el).join(NL)}</code>`
}
