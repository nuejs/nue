
import domino from 'domino'

import { compileTemplate } from './compiler/compiler.js'
import { parsePage } from './compiler/page.js'
import { createNode } from './dom/node.js'


export function renderBlock(ast, data, opts) {
  const document = domino.createDocument()
  if (!global.document) global.document = document
  const block = createNode(ast, data, opts)
  block.mount(document.body)
  return block
}

export function renderToString(ast, data, opts) {
  if (ast.is_custom && !opts.lib?.length) { delete ast.is_custom; ast.tag = 'div' }
  return renderBlock(ast, data, opts).root.innerHTML
}


export function render(template, data, opts={}) {
  const { tags } = parsePage(template)
  const { lib=[] } = opts
  opts.lib = [...tags, ...lib]
  return renderToString(tags[0], data, opts)
}

export function renderNue(lib, data, opts={}) {
  opts.lib = lib.slice(1)
  return renderToString(lib[0], data, opts)
}

export { compileTemplate as compileNue }

export { parsePage as parseNue }