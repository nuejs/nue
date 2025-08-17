
import { parseNue } from '../src/compiler/document.js'
import { mountAST } from '../src/dom/render.js'


export function clickable(template, data) {
  const { lib } = parseNue(template)
  const block = mountAST(lib[0], { data, deps: lib.slice(1) })
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