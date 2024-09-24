
import { renderLines } from './src/render-blocks.js'
import { parseDocument } from './src/document.js'
import { EOL } from 'node:os'


export function nuemark(str, opts) {
  return renderLines(str.split(EOL), opts)
}

export function nuedoc(str) {
  return parseDocument(str.split(EOL))
}

/* utilities */
export { renderInline } from './src/render-inline.js'
export { parseSize } from './src/render-tag.js'
export { elem } from './src/document.js'