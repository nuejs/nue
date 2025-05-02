
import { parseTemplate, renderBlock } from '../src'

export function clickable(template, data) {
  const lib = parseTemplate(template)
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