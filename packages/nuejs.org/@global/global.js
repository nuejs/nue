
addEventListener('click', e => {
  const el = e.target

  // hide popover menus
  const menu = el.closest('[popover]')
  if (menu && el.matches('a')) menu.hidePopover()

  // make cards clickable
  const wrap = el.closest('.card, .features div')
  if (wrap) {
    const a = wrap.querySelector('p a')
    console.info(a.getAttribute('href'))
    if (a) location.href = a.getAttribute('href')
  }
})


// analytics (released later)
if (!location.port) {
  const { ping } = await import('/@lib/ping.js')
  ping()
}