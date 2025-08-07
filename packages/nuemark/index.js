
import { parseDocument } from './src/parse-document.js'
import { renderLines } from './src/render-blocks.js'

const EOL = /\r\n|\r|\n/

export function nuemark(content, opts) {
  return renderLines(content.split(EOL), opts)
}

export function parseNuemark(content) {
  return parseDocument(content.split(EOL))
}

/* utilities */
export { elem } from './src/render-blocks.js'
export { renderInline } from './src/render-inline.js'
export { parseSize, renderIcon } from './src/render-tag.js'
