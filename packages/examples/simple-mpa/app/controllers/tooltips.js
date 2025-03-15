
// singleton tip element
const tip = document.createElement('span')
document.body.append(tip)
// tip.classList.add('ui')
tip.role = 'tooltip'
tip.id = 'tip'

// tip hover state
let is_shown = false
const supportsAnchors = CSS.supports('anchor-name: --tip')


function setTooltip(el, title, accesskey) {
  // on multiple access keys use last
  const kbd = accesskey && accesskey.split(' ').pop()
  // build tooltip: html / text
  const text = [title, kbd && (supportsAnchors ? `<kbd>${kbd}</kbd>` : `[${kbd}]`)]
    .filter(Boolean).join(' ')

  // fallback to simple title
  if (!supportsAnchors) {
    el.title = text
    el.dataset.titled = true
  }
  // rich tooltip
  else {
    tip.innerHTML = text
  }
}


document.addEventListener('mouseenter', e => {
  const el = e.target
  if (el.nodeType != 1) return
  const dataset = el.dataset

  // forced simple title
  if (dataset.titled) return

  // remove title attribute
  if (el.title) {
    dataset.title = el.title
    el.removeAttribute('title')
  }

  // no title attribute
  if (!dataset.title) return

  // set tooltip / title
  setTooltip(el, dataset.title, dataset.accesskey)
  if (!supportsAnchors) return

  // show tooltip
  // position via anchor API
  el.style['anchor-name'] = '--tip'
  tip.classList.toggle('on-bottom', el.closest('header'))
  is_shown = true

}, true)


function cleanup(e) {
  e.target.style?.removeProperty('anchor-name')
  is_shown = false
}


document.addEventListener('mouseleave', cleanup, true)
document.addEventListener('click', cleanup, true)
