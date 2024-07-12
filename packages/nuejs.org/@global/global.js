
addEventListener('click', e => {
  const el = e.target

  // hide popover menus
  const menu = el.closest('[popover]')
  if (menu && el.matches('a')) menu.hidePopover()

  // make cards clickable
  const card = el.closest('.card')
  if (card) {
    const a = card.querySelector('p a')
    console.info(a.getAttribute('href'))
    if (a) location.href = a.getAttribute('href')
  }
})


