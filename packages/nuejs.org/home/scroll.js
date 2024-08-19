

const observer = new IntersectionObserver(entries => {
  entries.forEach(el =>
    el.target.classList.toggle('in-viewport', el.isIntersecting)
  )
}, { rootMargin: '-100px' })

class ScrollTransition extends HTMLElement {
  constructor() {
    super()
    observer.observe(this)
  }
  disconnectedCallback() {
    observer.unobserve(this)
  }
}

customElements.define('scroll-transition', ScrollTransition, { extends: 'section' })
