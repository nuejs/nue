
import { renderLines } from './src/render.js'


// returns { html, meta, sections, headings, links }
export function nuemark(str, opts) {
  return renderLines(str.split('\n'), opts)
}

// returns HTML
export function nuemarkdown(str, opts) {
  delete opts?.data?.draw_sections
  return nuemark(str, opts).html
}

// returns { meta, sections, headings, links }
export { parsePage } from './src/parse.js'


export { renderPage } from './src/render.js'
