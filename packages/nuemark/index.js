import { parseDocument } from './src/parse-document.js'
import { renderLines } from './src/render-blocks.js'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

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

// Get the path to the code-copy.js file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export const CODE_COPY_SCRIPT_PATH = join(__dirname, 'src/code-copy.js')
