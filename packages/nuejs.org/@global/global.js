

// hide popover menus
addEventListener('click', event => {
  const el = event.target
  const dialog = el.closest('[popover]')

  if (dialog) {
    const link = el.getAttribute('href')
    if (link) dialog.hidePopover()
  }
  else if (el.dataset.copy) { // is copy button
    navigator.clipboard.writeText(decodeURIComponent(el.dataset.copy))
    const html = el.innerHTML
    el.innerText = 'Copied'
    setTimeout(() => el.innerHTML = html, 1500)
  }
})




// analytics (released for public later)
if (!location.port) {
  const { ping } = await import('/@lib/ping.js')
  ping()
}