
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
  const data = el.dataset
  const kbd = data?.accesskey
  const title = el.nodeType == 1 && el.title
  if (!title && !kbd) return

  if (title) {
    el.removeAttribute('title')
    data.title = title
  }

  // clear timers
  timers.forEach(clearTimeout)

  timers[0] = setTimeout(_ => {

    // tip content
    const html = [data.title || el.innerText]
    if (kbd) html.push(`<kbd>${kbd}</kbd>`)
    tip.innerHTML = html.join(' ')

    // position via anchor API
    el.style['anchor-name'] = '--tip'
    tip.classList.toggle('on-bottom', el.closest('header'))
    is_shown = true

  }, is_shown ? 50 : 750)


}, true)


function cleanup(e) {
  e.target.style?.removeProperty('anchor-name')
  timers.forEach(clearTimeout)
  timers[1] = setTimeout(() => { is_shown = false }, 250)
}

document.addEventListener('mouseleave', cleanup, true)
document.addEventListener('click', cleanup, true)


