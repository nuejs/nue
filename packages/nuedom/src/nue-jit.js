
import { parseNue } from './compiler/document.js'
import { createNode } from './dom/node.js'

export { domdiff } from './dom/diff.js'

export function mount(template, opts={}) {
  const els = parseNue(tokenize(template)).elements
  opts.deps = [...els.slice(1), ...(opts.deps || [])]
  const node = createNode(els[0], opts)
  node.mount(opts.root)
  return node.update
}
