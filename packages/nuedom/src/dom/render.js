
import { createDocument } from './fakedom.js'
import { parseNue } from '../compiler/document.js'
import { createNode } from './node.js'

function renderAST(ast, opts={}) {
  const { root } = mountAST(ast, opts)
  return root.innerHTML
}

export function renderNue(template, opts={}) {
  if (typeof template != 'string') return renderAST(template, opts)
  const { lib } = parseNue(template)
  const { deps=[] } = opts
  opts.deps = [...lib.slice(1), ...deps]
  return renderAST(lib[0], opts)
}

// exported for testing purposes only
export function mountAST(ast, opts) {
  const dep = opts.deps?.find(c => ast.tag == (c.is || c.tag))

  if (ast.is_custom && (!dep && !ast.mount || ast == dep)) {
    ast = Object.assign({}, ast)
    delete ast.is_custom;
    ast.tag = 'div'
  }

  global.document = createDocument()
  const node = createNode(ast, opts.data, opts)
  node.mount(document.body)
  return node
}

