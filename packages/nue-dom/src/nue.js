
import { createNode } from './dom/node.js'

export function createApp(ast, data, opts) {
  if (ast.is_custom)  {
    ast.is_custom = false
    ast.tag = 'div'
  }
  const { update, mount } = createNode(ast, data, opts)
  return { update, mount }
}