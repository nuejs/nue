
import { $, $$ } from '/@nue/page-router.js'

$$('[popover]').forEach(root => {

  root.onclick = function(e) {
    if (e.target.matches('a')) root.hidePopover()
  }
})


addEventListener('route', function() {

  $$('.grid .card').forEach(card => {
    const a = $('p a', card)
    if (a) {
      a.parentNode.remove()
      card.classList.add('clickable')
      card.onclick = function() {
        location.href = a.getAttribute('href')
      }
    }
  })


})