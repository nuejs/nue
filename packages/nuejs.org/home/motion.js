
import { $$ } from '/@nue/view-transitions.js'

let sections = []

const observer = new IntersectionObserver(entries => {
  entries.forEach(el =>
    el.target.classList.toggle('outside-viewport', !el.isIntersecting)
  )
})

addEventListener('route', function() {

  // unobserve
  sections.forEach(el => observer.unobserve(el))

  // observe
  if (location.pathname == '/') {
    sections = $$('section').filter(el => {
      observer.observe(el)
      return true
    })
  }
})


