
import { tokenize } from './tokenizer.js'
import { parseTag } from './tag.js'

/*
  {
    doctype: 'html',
    script: 'imort { foo, bar } from ...',
    meta: {},
    tags: []
  }
*/
export function parsePage(template) {
  const tokens = tokenize(template)
  const blocks = parseBlocks(tokens)
  const script = []
  const tags = []
  const page = {}

  blocks.forEach((el, i) => {

    if (el.doctype) {
      page.doctype = el.doctype

    } else if (el.tag) {
      if (isScript(el)) {
        script.push(el.children[0].text.trim())

      } else {
        tags.push(el)
      }

    } else if (el.meta) {
      const next = blocks[i + 1]
      const target = next?.tag  && !isScript(next) ? next : page
      target.meta = el.meta
    }
  })

  page.script = script.join('\n')

  const imports = parseImports(page.script)
  page.tags = tags.map(el => parseTag(el, imports))

  return page
}

function isScript(block) {
  return block.tag?.startsWith('<script')
}

export function parseBlocks(tokens) {
  const blocks = []
  let i = 0

  while (i < tokens.length) {
    if (tokens[i].meta) {
      blocks.push(tokens[i])
      i++
    } else {
      const result = parseBlock(tokens, i)
      if (result.node) blocks.push(result.node)
      i = result.next
    }
  }

  return blocks
}

function parseBlock(tokens, i) {
  const tag = tokens[i]

  if (i >= tokens.length || !tag.startsWith('<') || tag.startsWith('</')) return { next: i + 1 }
  i++

  // !doctype
  if (tag.toLowerCase().startsWith('<!doctype')) {
    const doctype = tag.slice(10, tag.indexOf('>')).trim()
    return { node: { doctype }, next: i++ }
  }

  // ignore <style> blocks
  if (tag.toLowerCase().startsWith('<style')) return { next: i }

  if (tag.endsWith('/>')) return { node: { tag, children: [] }, next: i }

  const children = []

  while (i < tokens.length && (tokens[i].meta || !tokens[i].startsWith('</'))) {
    if (tokens[i].meta) {
      i++
    } else if (tokens[i].startsWith('<') && !tokens[i].startsWith('</')) {
      const result = parseBlock(tokens, i)
      if (result.node) children.push(result.node)
      i = result.next
    } else {
      children.push({ text: tokens[i] })
      i++
    }
  }

  if (i < tokens.length) i++ // Skip closing tag

  return { node: { tag, children }, next: i }
}


export function parseImports(script) {
  const lines = script.trim().split('\n')
  const imports = []

  for (const line of lines) {
    // Skip lines that start with //
    if (line.trim().startsWith('//')) continue

    const match = line.match(/import\s*{\s*([^}]+)\s*}/)
    if (match) {
      const items = match[1].split(',').map(item => {
        const trimmed = item.trim()
        // Check if it's an alias (contains 'as')
        if (trimmed.includes(' as ')) {
          return trimmed.split(' as ')[1].trim()
        }
        return trimmed
      })
      imports.push(...items)
    }
  }
  return imports
}

