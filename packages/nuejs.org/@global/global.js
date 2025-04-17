


addEventListener('click', event => {
  const el = event.target
  
  // hide popover menus
  const dialog = el.closest('[popover]')
  if (dialog) {
    const link = el.getAttribute('href')
    if (link) dialog.hidePopover()
  }
  // copy to clipboard
  else if (el.dataset.copy) { // is copy button
    navigator.clipboard.writeText(decodeURIComponent(el.dataset.copy))
    if (el.dataset.copied) return

    el.dataset.copied = true
    const html = el.innerHTML
    el.innerText = 'Copied'
    
    setTimeout(() => {
      el.innerHTML = html
      delete el.dataset.copied
    }, 2000)
  }
})




// analytics (released for public later)
if (!location.port) {
  const { ping } = await import('/@lib/ping.js')
  ping()
}