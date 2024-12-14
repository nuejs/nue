
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
export { parseSize, renderIcon } from './src/render-tag.js'
export { renderInline } from './src/render-inline.js'
export { elem } from './src/render-blocks.js'
