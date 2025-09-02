
import { createAST } from './ast.js'
import { tokenize } from './tokenizer.js'

/*
  {
    doctype: 'html',
    script: 'imort { foo, bar } from ...',
    meta: {},
    lib: []
  }
*/
export function parseNue(template) {
  const tokens = tokenize(template)
  const blocks = parseBlocks(tokens)
  const script = []
  const page = {}
  let lib = []

  blocks.forEach((el, i) => {

    if (el.doctype) {
      page.doctype = el.doctype

    } else if (el.tag) {
      if (isScript(el)) {
        script.push(el.children[0].text.trim())

      } else {
        lib.push(el)
      }

    } else if (el.meta) {
      const next = blocks[i + 1]
      const target = next?.tag  && !isScript(next) ? next : page
      target.meta = el.meta
    }
  })

  page.script = script.join('\n')

  // reserved names
  const names = parseNames(page.script)
  lib = page.lib = lib.map(el => createAST(el, names))

  // root
  page.root = lib[0]

  // all custom elements
  const type = page.doctype || ''
  page.all_custom = lib.every(ast => ast.is_custom || ast.is)
  page.is_lib = type.endsWith('lib')

  page.is_dhtml = type.includes('dhtml')
    || lib.some(ast => ast.handlers?.length > 0)
    || page.script?.includes('import ')

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

  const low = tag.toLowerCase()

  // !doctype
  if (tag.startsWith('<!')) {
    const node = { doctype: low.slice(2, -1).replace('doctype', '').trim() }
    return { node, next: i++ }
  }

  if (low.startsWith('<?xml')) {
    const node = { xml: true }
    return { node, next: i++ }
  }

  // ignore <style> blocks
  if (low.startsWith('<style')) return { next: i }

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


export function parseNames(script) {
  const lines = script.trim().split('\n')
  const arr = []
  for (const line of lines) {
    if (line.trim().startsWith('//')) continue
    arr.push(
      ...getFunctionNames(line),
      ...getVariableNames(line)
    )
  }
  return arr
}

function getVariableNames(line) {
  // Match destructuring: import { ... } or const { ... } =
  const destructMatch = line.match(/(import|const|var|let)\s*{\s*([^}]+)\s*}/)
  if (destructMatch) {
    return destructMatch[2].split(',').map(el => {
      return el.includes(' as ') ? el.split(' as ')[1].trim() : el.trim()
    })
  }

  // Match regular declarations: const FOO =
  const regularMatch = line.match(/(const|var|let)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/)
  if (regularMatch) {
    return [regularMatch[2]]
  }

  return []
}

function getFunctionNames(line) {
  const match = line.match(/function\s*([^\(]+)\s*\(/)
  return match ? [match[1]] : []
}


