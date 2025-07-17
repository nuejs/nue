
import { createNode } from './dom/node.js'
import { tokenize } from './compiler/tokenizer.js'
import { parseTag } from './compiler/tag.js'


export function createApp(template, data, opts={}) {
  const lib = parseTag(tokenize(template))
  const more = opts.lib || []
  const { update, mount } = createNode(lib[0], data, { lib: [...lib, ...more] })
  return { update, mount }
}
