
import { createBlock } from './block/block.js'

export function createApp(ast, data, opts) {
  if (ast.is_custom)  {
    ast.is_custom = false
    ast.tag = 'div'
  }
  const { update, mount } = createBlock(ast, data, opts)
  return { update, mount }
}