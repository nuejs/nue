
import domino from 'domino'

import { parseTemplate, compileTemplate } from './compiler/index.js'
import { createBlock } from './block/block.js'


export function renderBlock(ast, data, opts) {
  const document = domino.createDocument()
  if (!global.document) global.document = document
  const block = createBlock(ast, data, opts)
  block.mount(document.body)
  return block
}

export function renderToString(ast, data, opts) {
  if (ast.is_custom && !opts.lib?.length) { delete ast.is_custom; ast.tag = 'div' }
  return renderBlock(ast, data, opts).root.innerHTML
}


export function render(template, data, opts={}) {
  const nodes = parseTemplate(template)
  const { lib=[] } = opts
  opts.lib = [...nodes, ...lib]
  return renderToString(nodes[0], data, opts)
}


export function renderHyper(lib, data, opts={}) {
  opts.lib = lib.slice(1)
  return renderToString(lib[0], data, opts)
}

export { compileTemplate as compileHyper }

export { parseTemplate as parseHyper }