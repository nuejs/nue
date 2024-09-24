
import { renderBlocks } from './src/render-blocks.js'
import { parseBlocks } from './src/parse-blocks.js'

export { elem, parseDocument } from './src/document.js'

export function renderLines(lines, opts) {
  return renderBlocks(parseBlocks(lines), opts)
}

export function nuemark(str, opts) {
  return renderLines(str.split('\n'), opts)
}