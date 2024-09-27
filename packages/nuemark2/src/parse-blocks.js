
import { load as parseYAML } from 'js-yaml'
import { parseInline } from './parse-inline.js'
import { parseTag } from './parse-tag.js'

export function parseBlocks(lines, reflinks={}) {
  let spaces, block
  const blocks = []

  lines.forEach(line => {
    const c = line[0]
    const trimmed = line.trim()
    const indent = trimmed && line.length - line.trimStart().length
    if (!spaces) spaces = indent


    // fenced code
    if (c == '`' && line.startsWith('```')) {
      // new code block
      if (!block?.is_code) {
        const specs = line.slice(line.lastIndexOf('`') + 1).trim()
        block = { is_code: true, ...parseTag(specs), code: [] }
        return blocks.push(block)

      // end of code
      } else {
        return block = null
      }
    }

    // fenced code lines first
    if (block?.is_code) return block.code.push(line)


    // skip HTML and line comments
    if (c == '<' || trimmed.startsWith('//')) return

    // empty line
    if (!trimmed) {
      if (!block) return
      if (block.is_tag) return block.body.push(line)
      if (block.is_list) return addListEntry(block, line)
      if (block.is_content) return block = null
    }


    // heading (must be before the last two if clauses)
    if (c == '#') {
      blocks.push(parseHeading(line))
      return block = null
    }


    // thematic break (before list)
    const hr = getBreak(line)
    if (hr) {
      blocks.push(hr)
      return block = null
    }


    // list item
    const item = getListItem(line)

    if (item) {
      const { line, numbered } = item

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
    if (ref) return reflinks[ref.key] = ref.link


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


    // nested content or data
    if (indent) {
      line = line.slice(spaces)

      if (block?.is_tag) block.body.push(line)
      else if (block?.is_list) addListEntry(block, line)

    // blockquotes
    } else if (block?.is_quote && c) {
      if (c) block.content.push(line)

    // content (append)
    } else if (block?.is_content) {
      block.content.push(line)

    // new content block
    } else {
      block = c ? { is_content: true, content: [line] } : { is_newline: true }
      blocks.push(block)
    }

  })


  /* tokenize lists and quotes. parse component data */
  blocks.forEach(block => processNestedBlocks(block, reflinks))
  blocks.reflinks = reflinks

  return blocks
}



// recursive processing of nested blocks
function processNestedBlocks(block, reflinks) {
  if (block.is_list) {
    block.items = block.entries.map(blocks => parseBlocks(blocks, reflinks))

  } else if (block.is_quote) {
    block.blocks = parseBlocks(block.content, reflinks)


  } else if (block.is_tag) {
    const body = block.body.join('\n')

    try {
      if (body && block.name != '.' && isYAML(body.trim())) {
        Object.assign(block.data, parseYAML(body))
        block.has_data = true
      }
    } catch (e) {
      console.error('YAML parse error', body, e)
    }

    if (!block.has_data) block.blocks = parseBlocks(block.body, reflinks)
    delete block.body
  }
}


/******* UTILS ********/


export function parseHeading(str) {
  const level = str.search(/[^#]/)
  const tokens = parseInline(str.slice(level).trim())
  const text = tokens.map(el => el.text || el.body || '').join('').trim()
  const specs = tokens.find(el => el.is_attr)
  const attr = specs?.attr || {}
  return { is_heading: true, level, tokens, text, attr }
}

function parseReflink(str) {
  if (str[0] == '[') {
    const i = str.indexOf(']:')
    if (i > 1) {
      return { key: str.slice(1, i), link: str.slice(i + 2).trim() }
    }
  }
}

function getListItem(line) {
  if (line[1] == ' ' && '-*'.includes(line[0])) return { line: line.slice(1).trim() }
  const num = /^\d+\. /.exec(line)
  if (num) return { line: line.slice(num[0].length).trim(), numbered: true }
}

export function getBreak(str) {
  const HR = ['---', '***', '___', '- - -', '* * *']

  for (const hr of HR) {
    if (str.startsWith(hr) && !/[^\*\-\_ ]/.test(str)) {
      return { is_break: true, is_separator: hr == '---' }
    }
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

function addListEntry({ entries }, line) {
  const last = entries[entries.length - 1]
  last.push(line)
}


