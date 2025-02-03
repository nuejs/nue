
import { $, $$ } from '/@nue/view-transitions.js'

const ROW = '[role=list] > a'

document.addEventListener('keydown', (evt) => {
  const { target, key } = evt
  const low = key.toLowerCase()
  const actions = {}

  if (target.oninput|| evt.defaultPrevented || evt.metaKey || evt.ctrlKey) return

  $$('[data-accesskey]').forEach(el => {
    if (el.dataset.accesskey == key) {
      el.focus()
      el.click()
      if (!el.href) evt.preventDefault()
    }
  })

  const active = document.activeElement

  // space selects
  if (key == ' ' && active.click) {
    evt.preventDefault()
    active.click()
  }

  // VIM shortcuts
  if ('jk'.includes(low)) {
    let next = $(ROW)

    if (active.matches(ROW)) {
      const go_forward = low == 'j'
      next = go_forward ? active.nextElementSibling : active.previousElementSibling
      if (next) next.focus()
      else {
        const btn = $(`[data-accesskey=${go_forward ? 'l' : 'h'}]`)
        if (!btn.disabled) {
          btn.click()
          next = $(go_forward ? ROW : '[role=list] > a:last-child')
        }
      }
    }

    next.focus()
    if (low != key) next.click()
  }
})