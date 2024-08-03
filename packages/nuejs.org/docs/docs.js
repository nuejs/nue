
import { $, $$ } from '/@nue/view-transitions.js'


// scroll highlight for table of contents (on the right side)

function setSelected(root, el) {
  $('[aria-selected]', root)?.removeAttribute('aria-selected')
  el?.setAttribute('aria-selected', 1)
}

class ObservingNav extends HTMLElement {

  constructor() {
    super()

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          if (!this.disabled) setSelected(this, $(`[href="#${el.target.id}"]`, this))
        }
      })
    }, {

      // the craziest option i've seen. makes no sense
      rootMargin: `0px 0px -500px 0px`,

    })

    $$('section > h2, section > h3').forEach(el => this.observer.observe(el))

    this.onclick = function(e) {
      if (e.target.href) {
        this.disabled = true
        setSelected(this, e.target)
        setTimeout(() => delete this.disabled, 2000)
      }

      // console.info(this, )
      // setSelected
    }
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
      $('html').classList.toggle('zen', this.checked)
    }
  }
}

customElements.define('zen-toggle', ZenToggle, { extends: 'input' })


// remember the zen state after the view transition
addEventListener('route', function() {
  const el = $('[is=zen-toggle]')
  if (el) el.checked = !!$('.zen')
})


// demo
class Counter extends HTMLDivElement {
  constructor() {
    super()
    this.innerHTML = ++sessionStorage.counter || (sessionStorage.counter = 0)
  }
}

customElements.define('view-counter', Counter, { extends: 'div' })
