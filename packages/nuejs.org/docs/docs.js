
import { $, $$ } from '/@nue/view-transitions.js'

// scroll highlight for table of contents (on the right side)
let headings = []
let clicked

function setSelected(href, attr='aria-selected') {
  $(`aside [${attr}]`)?.removeAttribute(attr)
  $(`aside [href="${href}"]`)?.setAttribute(attr, 1)
}

const observer = new IntersectionObserver(arr => {
  arr.forEach(el => {
    if (el.isIntersecting && !clicked) setSelected('#' + el.target.id)
  })

// annoying option. too much trial & error needed
}, { rootMargin: `0px 0px -500px 0px`})


$$('article + aside a').forEach(el => {
  el.onclick = function({ target }) {
    if (target.href) {
      clicked = true
      setSelected(target.getAttribute('href'))
      setTimeout(() => clicked = false, 2000)
    }
  }
})

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

  $$('article > h2, article > h3').forEach(el => observer.observe(el))
})

// demo
class Counter extends HTMLDivElement {
  constructor() {
    super()
    this.innerHTML = ++sessionStorage.counter || (sessionStorage.counter = 0)
  }
}

customElements.define('view-counter', Counter, { extends: 'div' })
