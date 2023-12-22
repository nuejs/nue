
import { render } from './src/render.js'

// returns { html, meta, sections, headings, links }
export function nuemark(str, opts) {
  return render(str.split('\n'), opts)
}

// returns HTML
export function nuemarkdown(str, opts) {
  return nuemark(str, opts).html
}

