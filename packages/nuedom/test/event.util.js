
import { parseNue } from '../src/compiler/document.js'
import { mountAST } from '../src/dom/render.js'


export function clickable(template, data) {
  const { lib } = parseNue(template)
  const block = mountAST(lib[0], { data, deps: lib.slice(1) })
  const { root } = block

  function click(selector='button') {
    const el = root.querySelector(selector)
    el?.dispatchEvent({ type: 'click' })
  }
  return { block, click, get html() { return root.innerHTML || '' } }
}



