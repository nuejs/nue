
// singleton tip element
const tip = document.createElement('span')
document.body.append(tip)
tip.classList.add('ui')
tip.role = 'tooltip'
tip.id = 'tip'

// tip hover state
const timers = []
let is_shown


document.addEventListener('mouseenter', e => {
  const el = e.target
  if (el.nodeType != 1) return
  const dataset = el.dataset

  // remove title attribute
  if (el.title) {
    dataset.title = el.title
    el.removeAttribute('title')
  }

  // no title attribute
  if (!dataset.title) return

  // clear timers
  timers.forEach(clearTimeout)


  timers[0] = setTimeout(_ => {
    const kbd = dataset.accesskey

    // tip content
    const html = [dataset.title || el.innerText, kbd && `<kbd>${kbd}</kbd>`]
    tip.innerHTML = html.filter(Boolean).join(' ')

    // position via anchor API
    el.style['anchor-name'] = '--tip'
    tip.classList.toggle('on-bottom', el.closest('header'))
    is_shown = true

  }, is_shown ? 50 : 500)


}, true)


function cleanup(e) {
  e.target.style?.removeProperty('anchor-name')
  timers.forEach(clearTimeout)
  timers[1] = setTimeout(() => { is_shown = false }, 250)
}

document.addEventListener('mouseleave', cleanup, true)
document.addEventListener('click', cleanup, true)


