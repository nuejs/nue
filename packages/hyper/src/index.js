
/*
  Server-side rendering (SSR)
*/
import domino from 'domino'

import { parseTemplate, compileTemplate } from './compiler'

import { createBlock } from './block/block.js'

export function renderBlock(ast, data, opts) {
  const document = domino.createDocument()
  if (!global.document) global.document = document
  const block = createBlock(ast, data, opts)
  block.mount(document.body)
  return block
}

export function renderToString(ast, data, opts) {
  return renderBlock(ast, data, opts).root.innerHTML
}

export function render(template, data, opts={}) {
  const nodes = parseTemplate(template)
  const { lib=[] } = opts
  opts.lib = [...nodes, ...lib]
  const [ app ] = nodes

  if (app.is_custom)  {
    delete app.is_custom
    app.tag = 'div'
  }
  return renderToString(nodes[0], data, opts)
}


export { compileTemplate as compile }