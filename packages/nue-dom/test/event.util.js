
import { parsePage } from '../src/compiler/page.js'
import { renderBlock } from '../src/index.js'


export function clickable(template, data) {
  const { tags } = parsePage(template)
  const block = renderBlock(tags[0], data, { lib: tags })
  const { root } = block

  function click(selector='button') {
    const el = root.querySelector(selector)
    if (el) {
      const e = document.createEvent('Event')
      e.initEvent('click', true, true)
      el.dispatchEvent(e)
    }
  }

  return { block, click, get html() { return root.innerHTML || '' } }
}