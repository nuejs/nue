

// hide popover menus
addEventListener('click', event => {
  const el = event.target
  const dialog = el.closest('[popover]')

  if (dialog) {
    const link = el.getAttribute('href')
    if (link) dialog.hidePopover()
  }
})




// analytics (released for public later)
if (!location.port) {
  const { ping } = await import('/@lib/ping.js')
  ping()
}