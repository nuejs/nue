
import { $, $$, loadPage } from '/@nue/view-transitions.js'

document.onclick = function(e) {

  const el = e.target

  // reveals
  const reveal = el.closest('.reveal')
  if (reveal) reveal.classList.remove('reveal')

  // stack item clicks
  const div = el.closest('.stack > div')
  if (div) {
    const a = $('a', div)
    loadPage(a.getAttribute('href'))

  }
}


addEventListener('route', () => {
  const done = 1 * location.search.slice(1)

  if (done) {
    $$('.stack > div').forEach((el, i) => {
      if (i < done) el.classList.add('done')
    })
  }
})