
import { $, $$ } from '/@nue/page-router.js'

const observer = new IntersectionObserver(entries => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      $('.toc [aria-selected]')?.removeAttribute('aria-selected')
      $(`.toc [href="#${el.target.id}"]`)?.setAttribute('aria-selected', 1)
    }
  })
}, {
  rootMargin: '-50px'
})

function getHeaders() {
  return $$('article > h2, article > h3')
}

addEventListener('route', function() {
  if (location.pathname.startsWith('/docs')) {
    getHeaders().forEach(el => observer.observe(el))

    // zen mode
    $('.switch input').onchange = function() {
      document.body.classList.toggle('zen', this.checked)
    }
  }
})

// addEventListener('before:route', () => {
//   getHeaders().forEach(el => observer.unobserve(el))
// })

