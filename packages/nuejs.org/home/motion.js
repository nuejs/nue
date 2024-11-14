
// array of sections on the active page
let sections = []

// an observer instance to toggle "outside-viewport" class name for the sections
const observer = new IntersectionObserver(entries => {
  entries.forEach(el =>
    el.target.classList.toggle('outside-viewport', !el.isIntersecting)
  )
})

// when routed/transitioned to a new page
addEventListener('route:home', function() {

  // cleanup previoius observers
  sections.forEach(el => observer.unobserve(el))

  // observe the sections on a new page
  sections = [...document.querySelectorAll('section')].filter(el => {
    observer.observe(el)
    return true
  })

})

