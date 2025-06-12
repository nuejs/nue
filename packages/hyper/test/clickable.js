
import { parseHyper, renderBlock } from '../src/index.js'


export function clickable(template, data) {
  const lib = parseHyper(template)
  const block = renderBlock(lib[0], data, { lib })
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