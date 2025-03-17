
if (CSS.supports('anchor-name: --tip')) {

  // singleton tip element
  const tip = document.createElement('span')
  document.body.append(tip)

  tip.role = 'tooltip'
  tip.id = 'tip'

  document.addEventListener('mouseenter', e => {
    let el = e.target
    if (el.nodeType != 1) return
    const data = el.dataset

    // remove title attribute
    if (el.title) {
      data.title = el.title
      el.removeAttribute('title')
    }

    // show tip
    if (data.title) {
      const kbd = data.accesskey?.split(' ').pop()
      tip.innerHTML = data.title + (kbd ? ` <kbd>${kbd}</kbd>` : '')
      el.style['anchor-name'] = '--tip'
      tip.classList.add('is-shown')
      tip.classList.toggle('on-bottom', el.closest('header'))
      el.onmouseleave = cleanup
    }

  }, true)

  function cleanup(e) {
    e.target.style?.removeProperty('anchor-name')
    tip.classList.remove('is-shown')
  }

  document.addEventListener('click', cleanup, true)
} else {
  // fallback: add accesskey to title, if no anchor support
  document.addEventListener('mouseenter', ({ target: el }) => {
    if (el.nodeType == 1 && !el.dataset.titled && el.title && el.dataset.accesskey) {
      el.title = `${el.title} [${el.dataset.accesskey.split(' ').pop()}]`
      el.dataset.titled = true
    }
  }, true)
}
