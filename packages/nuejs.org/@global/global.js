
import { $, loadPage } from '/@nue/view-transitions.js'

addEventListener('click', event => {
  const { target } = event

  // hide popover menus
  const dialog = target.closest('[popover]')
  if (dialog && target.matches('a') && target.getAttribute('href')) dialog.hidePopover()

  // .clickables
  const wrap = target.closest('.clickable')
  if (wrap) {
    const button = $('button', wrap)
    if (button) {
      const popover = window[button.getAttribute('popovertarget')]
      popover?.showPopover()
    }

    const a =$('a', wrap)
    if (a) {
      loadPage(a.getAttribute('href'))
    }
  }
})


// analytics (released for public later)
if (!location.port) {
  const { ping } = await import('/@lib/ping.js')
  ping()
}