
import { parseAttr, parseSpecs, parseComponent } from './component.js'
import { loadAll, load as parseYAML } from 'js-yaml'
import { marked } from 'marked'
const NL = '\n'

// returns { meta, sections, headings, links }
export function parsePage(lines) {
  if (typeof lines == 'string') lines = lines.split(NL)

  const { meta, rest } = parseMeta(lines)

  const sections = parseSections(rest)
  const headings = [], links = {}
  let has_code_blocks
  let isomorphic

  for (const section of sections) {
    const blocks = section.blocks = []

    for (const block of parseBlocks(section.lines)) {
      const { name, data, body, is_code } = block

      if (name?.includes('tabs')) isomorphic = true
      if (name?.startsWith('code') || is_code) has_code_blocks = true

      // component body
      if (body) {
        const content = body.join(NL)
        if (name) Object.assign(data, getNestedData(content))
        else data.content = content.split(/\n---/)
        delete block.body
      }

      // component or fenced code block
      if (data || is_code) {
        if (is_code) has_code_blocks = true
        blocks.push(block)

      // markdown
      } else {
        const tokens = marked.lexer(block.join(NL))
        Object.assign(links, tokens.links)

        headings.push(...tokens.filter(el => el.type == 'heading').map(el => {
          return { level: el.depth, ...parseHeading(el.text) }
        }))

        blocks.push({ md: block, tokens })
      }
    }
  }

  if (!meta.title) {
    const h1 = headings.find(el => el.level == 1)
    if (h1) meta.title = h1?.text
  }

  return { meta, sections, headings, links, isomorphic, has_code_blocks }
}


export function parseHeading(text) {
  const i = text.indexOf('{')

  if (i > 0 && text.endsWith('}')) {
    const attr = parseAttr(text.slice(i+1, -1).trim())
    return { text: text.slice(0, i).trim(), ...attr }
  }

  return { text, id: text[30] ? null : createHeaderId(text) }
}

export function createHeaderId(text) {
  let hash = text.replace(/'/g, '').replace(/[\W_]/g, '-').replace(/-+/g, '-').toLowerCase()
  if (hash[0] == '-') hash = hash.slice(1)
  if (hash.endsWith('-')) hash = hash.slice(0, -1)
  return hash
}

// front matter
export function parseMeta(lines) {
  var start = 0, end = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const is_front = line == '---'
    if (!start) {
      if (is_front) start = i + 1
      else if (line.trim()) return { rest: lines, meta: {} }
    }
    else if (is_front) { end = i; break }
  }

  const front = start ? lines.slice(start, end).join(NL) : ''

  return {
    meta: front ? parseYAML(front) || {} : {},
    rest: lines.slice(end + 1)
  }
}


function getNestedData(body) {
  if (isYAML(body)) {
    const items = loadAll(body)
    const [ item ] = items
    return items[1] ? { items } : Array.isArray(item) ? { items: item } : item
  }
  return { content: body.split(/\n-{3,}/) }
}

function isYAML(str) {
  if (str.trimLeft()[0] == '-') return true
  const i = str.indexOf(':')
  return i > 0 && /^\w+$/.test(str.slice(0, i))
}


export function parseSections(lines) {
  const len = lines.length
  const sections = []
  let section = []

  function push(attr) {
    sections.push({ lines: section, attr })
  }
  push()

  lines.forEach(line => {
    if (line.startsWith('---')) {
      section = [] // must be before push
      const i = line.indexOf('- ')
      push(i > 0 ? parseAttr(line.slice(i + 2).trim()) : null)

    } else {
      section.push(line)
    }
  })

  return sections
}

export function parseBlocks(lines) {
  const blocks = []
  let md, fenced, comp
  let spacing

  lines.forEach((line, i) => {

    // fenced code start/end
    if (line.startsWith('```')) {
      if (!fenced) {
        fenced = { is_code: true, content: [], ...parseSpecs(line.slice(3).trim()) }
        md = null
      } else {
        blocks.push(fenced)
        fenced = null
      }
      return
    }

    // code line
    if (fenced) return fenced.content.push(line)


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

      if (!line.trimStart()) comp.body?.push(line)
      else if (!getIndent(line)) comp = null
    }

    // markdown
    if (!comp) {
      if (line.trimStart().startsWith('//')) return
      if (!md) blocks.push(md = [])
      md.push(line)
    }

  })


  return blocks
}

function getIndent(line='') {
  const trim = line.trimStart()
  return line.length - trim.length
}

function getNext(lines, i) {
  while (lines[i]) {
    const line = lines[i]
    if (line && line.trim()) return line
    i++
  }
}
