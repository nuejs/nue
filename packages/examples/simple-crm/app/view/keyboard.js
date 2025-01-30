
import { $, $$ } from '/@nue/view-transitions.js'


document.addEventListener('keydown', (evt) => {
  const { target, key } = evt
  const low = key.toLowerCase()

  if (target.oninput) return

  $$('[data-accesskey]').forEach(el => {
    if (el.dataset.accesskey == key) {
      el.focus()
      el.click()
      if (!el.href) evt.preventDefault()
    }
  })

  const active = document.activeElement
  const first = $('.row')

  // space selects
  if (key == ' ' && active.click) {
    evt.preventDefault()
    active.click()
  }

  // VIM shortcuts
  if ('jk'.includes(low)) {

    if (active.matches('.row')) {
      const next = (low == 'j' ? active.nextElementSibling : active.previousElementSibling) || first
      next.focus()

      if (low != key) next.click()

    } else {
      first.focus()
    }
  }


})