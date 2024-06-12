
import { $, $$ } from '/@nue/page-router.js'


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
      rootMargin: '-50px'
    })

    $$('article > h2, article > h3').forEach(el => this.observer.observe(el))
  }

  disconnectedCallback() {
    this.observer.disconnect()
  }
}

customElements.define('observing-nav', ObservingNav, { extends: 'nav' })


class ZenSwitch extends HTMLInputElement {
  constructor() {
    super()
    this.onchange = function() {
      document.body.classList.toggle('zen', this.checked)
    }
  }
}

customElements.define('zen-switch', ZenSwitch, { extends: 'input' })

