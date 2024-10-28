
addEventListener('click', event => {
  const { target } = event

  // hide popover menus
  const dialog = target.closest('[popover]')
  if (dialog && target.matches('a')) dialog.hidePopover()

  // make cards clickable
  const card = target.closest('.card')
  if (card) {
    const button = card.querySelector('button')
    if (button) {
      const popover = window[button.getAttribute('popovertarget')]
      popover?.showPopover()
    }
  }
})


// analytics (released for public later)
if (!location.port) {
  const { ping } = await import('/@lib/ping.js')
  ping()
}