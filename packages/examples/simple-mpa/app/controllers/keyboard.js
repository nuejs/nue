
/* Application specific keyboard controller */

import { $, $$ } from '/@nue/view-transitions.js'
import { router } from '/@nue/app-router.js'

// list item query
const ITEM = 'a.list-item'

document.addEventListener('keydown', (evt) => {
  const { target, key } = evt
  const actions = {}
  const first = $(ITEM)


  // search blur/focus
  const search = $('[type=search]')

  if (key == 'Tab') {
    if (target == search && search.value) {
      evt.preventDefault()
      first.focus()
    }
    if (evt.shiftKey && first == document.activeElement) {
      evt.preventDefault()
      search.focus()
    }
  }

  // Command (⌘) + K
  if (key == 'k' && evt.metaKey) search.focus()


  if (target.oninput || target.form || evt.defaultPrevented || evt.metaKey || evt.ctrlKey) return


  // escape
  if (key == 'Escape' && !$(':popover-open')) router.del('id')

  // don't write "/" to search input
  if (key == '/') evt.preventDefault()

  // check for accesskey element
  $$('[data-accesskey]').filter(el => !el.disabled && !el.ariaPressed).forEach(el => {
    if (el.dataset.accesskey.split(' ').includes(key)) {
      el.focus()
      el.click()
    }
  })

  // next/prev seek
  if (['ArrowDown', 'j', 'ArrowUp', 'k'].includes(key)) {
    const next = getNext(['ArrowDown', 'j'].includes(key))
    next?.focus()
    if (router.state.id) next?.click()
    evt.preventDefault()
  }
})


function getNext(go_forward) {
  const active = document.activeElement
  if (!active || !active.matches(ITEM)) return $(ITEM)

  // get next focused
  const links = $$(ITEM)
  const next = links[links.indexOf(active) + (go_forward ? 1 : -1)]
  if (next) return next

  // seek to next page
  const btn = $(`[data-accesskey="${go_forward ? 'ArrowRight l' : 'ArrowLeft h'}"]`)

  if (!btn.disabled) {
    btn.click()
    const links = $$(ITEM)
    return links[go_forward ? 0 : links.length -1]
  }
}


