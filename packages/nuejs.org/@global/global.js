
import { $, $$ } from '/@nue/page-router.js'

$$('[popover]').forEach(root => {

  root.onclick = function(e) {
    if (e.target.matches('a')) root.hidePopover()
  }
})

class Clickable extends HTMLDivElement {
  constructor() {
    super()

    const a = $('p a', this)
    if (a) {
      a.parentNode.remove()
      this.classList.add('clickable')
      this.onclick = function() {
        location.href = a.getAttribute('href')
      }
    }
  }
}

customElements.define('clickable-item', Clickable, { extends: 'div' })




