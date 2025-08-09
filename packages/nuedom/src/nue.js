
import { createNode } from './dom/node.js'

export { domdiff } from './dom/diff.js'

export function mount(ast, opts) {
  if (ast.is_custom) { ast.is_custom = false; ast.tag = 'div' }
  const node = createNode(ast, opts.data, opts)
  node.mount(opts.root)
  return node
}