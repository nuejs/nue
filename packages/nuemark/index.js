import { renderLines } from './src/render.js'

export { parseInline as renderInline } from 'marked'

// returns { html, meta, sections, headings, links }
export function nuemark(str, opts) {
  return renderLines(str.split(/\r\n|\r|\n/), opts)
}

// returns HTML
export function nuemarkdown(str, opts) {
  return nuemark(str, opts).html
}

// returns { meta, sections, headings, links }
export { parsePage } from './src/parse.js'

export { renderPage } from './src/render.js'
