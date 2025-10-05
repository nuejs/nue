
// The browser API with compiler
import { parseNue } from './compiler/document.js'
import { createNode } from './dom/node.js'

const template = document.querySelector('template')?.innerHTML

if (template) {
  const { root, lib } = parseNue(template)
  const app = createNode(root, {}, { deps: lib })
  const wrap = document.createElement('div')
  document.body.appendChild(wrap)
  app.mount(wrap)
}
