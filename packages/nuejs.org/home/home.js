
import { $$ } from '/@nue/page-router.js'

const observer = new IntersectionObserver(entries => {
  entries.forEach(el =>
    el.target.classList.toggle('in-viewport', el.isIntersecting)
  )

}, {
  rootMargin: '-100px'
})


// addEventListener('reload', () => $$('.grid').forEach(show))


class Observer extends HTMLElement {
  constructor() {
    super()
    observer.observe(this)
  }

  disconnectedCallback() {
    observer.unobserve(this)
  }
}

customElements.define('observable-item', Observer, { extends: 'section' })



