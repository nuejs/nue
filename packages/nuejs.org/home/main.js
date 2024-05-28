
import { $$ } from '/@nue/page-router.js'


function show(el) {
  if (el) el.classList.add('in-viewport')
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(el => el.isIntersecting && show(el.target))

}, { rootMargin: '-100px' })


addEventListener('route', function() {
  if (location.pathname == '/') {
    $$('.grid').forEach(el => observer.observe(el))
  }
})

addEventListener('reload', () => $$('.grid').forEach(show))