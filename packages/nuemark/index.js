
import { parseDocument } from './src/parse-document.js'
import { renderLines } from './src/render-blocks.js'

const EOL = /\r\n|\r|\n/

export function nuedoc(str, opts) {
  return parseDocument(str.split(EOL), opts)
}

export function nuemark(str, opts) {
  return renderLines(str.split(EOL), opts)
}

/* utilities */
export { renderInline } from './src/render-inline.js'
export { parseSize } from './src/render-tag.js'
export { elem } from './src/render-blocks.js'
