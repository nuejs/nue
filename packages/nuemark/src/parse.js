
import { loadAll, load as parseYAML } from 'js-yaml'
import { parseComponent } from './component.js'
import { marked } from 'marked'


export function parsePage(lines) {
  const sections = [], headings = [], links = {}
  const { meta, rest } = parseMeta(lines)

  for (const block of parseBlocks(rest)) {
    const { name, data, body } = block

    if (body) {
      const content = body.join('\n')
      if (name) Object.assign(data, getNestedData(content))
      else data.content = content.split('---')
      delete block.body
    }

    // component
    if (data) {
      sections.push(block)

    // markdown
    } else {
      const tokens = marked.lexer(block.join('\n'))
      Object.assign(links, tokens.links)
      headings.push(...tokens.filter(el => el.type == 'heading').map(parseHeading))
      sections.push({ md: block, tokens })
    }
  }

  if (!meta.title) {
    const h1 = headings.find(el => el.level == 1)
    meta.title = h1?.text
  }

  return { meta, sections, headings, links }
}


export function parseHeading({ depth, text, id }) {
  const i = text.indexOf(' {#')
  if (i > 0 && text.endsWith('}')) {
    id = text.slice(i + 3, -1)
    text = text.slice(0, i)
  }
  return { level: depth, text, id: id || createHeaderId(text) }
}

export function createHeaderId(text) {
  let hash = text.replace(/\W/g, '-').replace(/-+/g, '-').toLowerCase()
  if (hash[0] == '-') hash = hash.slice(1)
  if (hash.endsWith('-')) hash = hash.slice(0, -1)
  return hash
}

// front matter
export function parseMeta(lines) {
  const isFront = (line) => line == '---'
  var start = 0, end = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!start) { if (isFront(line)) start = i + 1 }
    else if (isFront(line)) { end = i; break }
  }

  const front = start ? lines.slice(start, end).join('\n') : ''

  return {
    meta: front ? parseYAML(front) : {},
    rest: lines.slice(end + 1)
  }
}


function getNestedData(body) {
  if (isYAML(body)) {
    const items = loadAll(body)
    const [ item ] = items
    return items[1] ? { items } : Array.isArray(item) ? { items: item } : item
  }

  return { content: body.split('---') }
}

function isYAML(str) {
  if (str.trimLeft()[0] == '-') return true
  const i = str.indexOf(':')
  return i > 0 && /^\w+$/.test(str.slice(0, i))
}

export function parseBlocks(lines) {
  const blocks = []
  let md, comp
  let spacing

  lines.forEach((line, i) => {

    // fenced code start
    const ltrim = line.trimStart()

    // comment
    if (ltrim.startsWith('//# ')) return

    // component
    if (line[0] == '[' && line.slice(-1) == ']' && !line.includes('][')) {
      comp = parseComponent(line.slice(1, -1))
      blocks.push(comp)
      md = null

    // component args
    } else if (comp) {
      const next = getNext(lines, i)
      const indent = getIndent(next)

      if (indent) {
        if (!spacing) spacing = indent
        comp.body = comp.body || []
        comp.body.push(line.slice(spacing))
      }

      if (!ltrim) comp.body?.push(line)
      else if (!getIndent(line)) comp = null
    }

    // markdown
    if (!comp) {
      if (!md) blocks.push(md = [])
      md.push(line)
    }
  })

  return blocks
}

function getIndent(line='') {
  const ltrim = line.trimStart()
  return line.length - ltrim.length
}

function getNext(lines, i) {
  while (lines[i]) {
    const line = lines[i]
    if (line && line.trim()) return line
    i++
  }
}
