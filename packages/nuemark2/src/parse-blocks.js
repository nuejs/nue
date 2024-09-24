
import { load as parseYAML } from 'js-yaml'
import { parseInline } from './parse-inline.js'
import { parseTag } from './parse-tag.js'

export function parseBlocks(lines) {
  let spaces, block

  const blocks = []
  blocks.reflinks = {}


  lines.forEach(line => {
    const c = line[0]
    const trimmed = line.trim()
    const indent = line.length - line.trimStart().length
    if (!spaces) spaces = indent


    // fenced code
    if (c == '`' && line.startsWith('```')) {
      // new code block
      if (!block?.code) {
        const specs = line.slice(line.lastIndexOf('`') + 1).trim()
        block = { ...parseTag(specs), code: [] }
        return blocks.push(block)

      // end of code
      } else {
        return block = null
      }
    }

    // fenced code lines first
    if (block?.code) return block.code.push(line)


    // skip HTML and line comments
    if (c == '<' || trimmed.startsWith('//')) return


    // list
    const list = getListStart(line)

    if (list) {
      const { line, numbered } = list

      // new list
      if (!block?.is_list) {
        block = { is_list: true, numbered, entries: [[ line ]] }
        return blocks.push(block)

      // new list item
      } else {
        return block.entries.push([line])
      }
    }

    // blockquote
    if (c == '>') {
      line = line.slice(2)

      // new quote
      if (!block?.is_quote) {
        block = { is_quote: true, content: [line] }
        return blocks.push(block)
      } else {
        return block.content.push(line)
      }
    }

    // reflink (can be nested on any level)
    const ref = parseReflink(trimmed)
    if (ref) return blocks.reflinks[ref.key] = ref.link


    // tag
    if (c == '[' && trimmed.endsWith(']') && !trimmed.includes('][')) {
      const tag = parseTag(line.slice(1, -1))
      block = { is_tag: true, ...tag, body: [] }
      return blocks.push(block)
    }



    // table
    if (c == '|' && trimmed.endsWith('|')) {

      // new table
      if (!block?.is_table) {
        block = { is_table: true, head: false, rows: [] }
        blocks.push(block)
      }
      const row = parseTableRow(line)

      return block.rows.length == 1 && row[0].includes('---') ?
        block.head = true : block.rows.push(row)
    }

    // thematic break (HR)
    if (isHR(line)) return blocks.push({ is_hr: true })



    if (indent) {
      const { body, entries } = block
      line = line.slice(spaces)

      if (body) {
        body.push(line)

      } else {
        const last = entries[entries.length -1]
        last.push(line)
      }

    // heading (must be before the last two if clauses)
    } else if (c == '#') {
      blocks.push(parseHeading(line))
      block = null

    } else if (!trimmed) {
      blocks.push({ is_newline: true })
      block = null

    } else if (block?.content) {
      block.content.push(line)

    // content / paragraphs
    } else {
      block = { is_content: true, content: [line] }
      blocks.push(block)
    }

  })

  /* tokenize lists and quotes. parse component data */
  blocks.forEach(postProcess)

  return blocks
}


/*** utils ***/

function postProcess(block) {
  if (block.is_list) {
    block.items = block.entries.map(parseBlocks)

  } else if (block.is_quote) {
    block.blocks = parseBlocks(block.content)


  } else if (block.is_tag) {
    const body = block.body.join('\n')

    try {
      if (body && block.name != '.' && isYAML(body)) {
        Object.assign(block.data, parseYAML(body))
        block.has_data = true
      }
    } catch (e) {
      console.error('YAML parse error', body, e)
    }

    if (!block.has_data) block.blocks = parseBlocks(block.body)
    delete block.body
  }
}

export function parseHeading(str) {
  const level = str.search(/[^#]/)
  const tokens = parseInline(str.slice(level).trim())
  const text = tokens.map(el => el.text || el.body || '').join('').trim()
  const specs = tokens.find(el => el.is_attr)
  const attr = specs?.attr || { id: createId(text) }
  return { is_heading: true, level, tokens, text, attr }
}

function createId(text) {
  let hash = text.slice(0, 32).replace(/'/g, '').replace(/[\W_]/g, '-').replace(/-+/g, '-').toLowerCase()
  if (hash[0] == '-') hash = hash.slice(1)
  if (hash.endsWith('-')) hash = hash.slice(0, -1)
  return hash
}


function parseReflink(str) {
  if (str[0] == '[') {
    const i = str.indexOf(']:')
    if (i > 1) {
      return { key: str.slice(1, i), link: str.slice(i + 2).trim() }
    }
  }
}

function getListStart(line) {
  if (line[1] == ' ' && '-*'.includes(line[0])) return { line: line.slice(1).trim() }
  const num = /^\d+\. /.exec(line)
  if (num) return { line: line.slice(num[0].length).trim(), numbered: true }
}

export function isHR(str) {
  const HR = ['***', '___', '- - -']
  for (const hr of HR) {
    if (str.startsWith(hr) && !/[^\*\-\_ ]/.test(str)) return true
  }
}

function isYAML(str) {
  if (str.trimLeft()[0] == '-') return true
  const i = str.indexOf(':')
  return i > 0 && /^\w+$/.test(str.slice(0, i))
}

function parseTableRow(line) {
  return line.slice(1, -2).split('|').map(el => el.trim())
}

