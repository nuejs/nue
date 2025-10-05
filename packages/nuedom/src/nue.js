
// The browser API
import { createNode } from './dom/node.js'

export { domdiff } from './dom/diff.js'

export function mount(ast, opts) {
  if (ast.is_custom) ast = { ...ast, is_custom: false, tag: 'div' }
  const node = createNode(ast, opts.data, opts)
  node.mount(opts.root)
  return node
}