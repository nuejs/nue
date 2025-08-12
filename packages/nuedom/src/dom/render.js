
import domino from 'domino'

import { parseNue } from '../compiler/document.js'
import { createNode } from './node.js'


function renderAST(ast, opts={}) {
  return mountAST(ast, opts).root.innerHTML
}

export function renderNue(template, opts={}) {
  if (typeof template != 'string') return renderAST(template, opts)
  const { elements } = parseNue(template)
  const { deps=[] } = opts
  opts.deps = [...elements.slice(1), ...deps]
  return renderAST(elements[0], opts)
}

// exported for testing purposes only
export function mountAST(ast, opts) {
  const dep = opts.deps?.find(c => ast.tag == (c.is || c.tag))

  if (ast.is_custom && (!dep && !ast.mount || ast == dep)) {
    ast = Object.assign({}, ast)
    delete ast.is_custom;
    ast.tag = 'div'
  }

  const document = domino.createDocument()
  if (!global.document) global.document = document
  const node = createNode(ast, opts.data, opts)
  node.mount(document.body)
  return node
}

