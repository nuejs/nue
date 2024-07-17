
import { $, $$ } from '/@nue/view-transitions.js'


// scroll highlight for table of contents (on the right side)
class ObservingNav extends HTMLElement {

  constructor() {
    super()

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          $('[aria-selected]', this)?.removeAttribute('aria-selected')
          $(`[href="#${el.target.id}"]`, this)?.setAttribute('aria-selected', 1)
        }
      })
    }, {
      rootMargin: '-300px'
    })

    $$('section > h2, section > h3').forEach(el => this.observer.observe(el))
  }

  disconnectedCallback() {
    this.observer.disconnect()
  }
}

customElements.define('observing-nav', ObservingNav, { extends: 'nav' })


// the "Zen switch" to toggle a more focused mode without distractions
class ZenToggle extends HTMLInputElement {
  constructor() {
    super()
    this.onchange = function() {
      document.body.classList.toggle('zen', this.checked)
    }
  }
}

customElements.define('zen-toggle', ZenToggle, { extends: 'input' })



// demo
class Counter extends HTMLDivElement {
  constructor() {
    super()
    this.innerHTML = ++sessionStorage.counter || (sessionStorage.counter = 0)
  }
}

customElements.define('view-counter', Counter, { extends: 'div' })
