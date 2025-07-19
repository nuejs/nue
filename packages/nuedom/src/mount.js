
import { createNode } from './dom/node.js'

export function mount(ast, opts) {
  if (ast.is_custom) { ast.is_custom = false; ast.tag = 'div' }
  const node = createNode(ast, opts)
  mode.mount(opts.root)
  return node.update
}