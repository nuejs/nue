
export function $(query, root=document) {
  return root.querySelector(query)
}

export function $$(query, root=document) {
  return [ ...root.querySelectorAll(query)]
}

function toggleClass(all, item, name='selected') {
  all.forEach(el => {
    if (el == item) el.classList.add(name)
    else el.classList.remove(name)
  })
}

class Tabs extends HTMLElement {
  constructor() {
    super()
    const links = $$('nav a', this)
    const items = $$('li', this)

    function toggle(i) {
      toggleClass(links, links[i])
      toggleClass(items, items[i])
    }

    links.forEach((link, i) => {
      link.onclick = (e) => {
        e.preventDefault()
        toggle(i)
      }
    })

    toggle(0)
  }
}

customElements.define('nuemark-tabs', Tabs, { extends: 'section' })
