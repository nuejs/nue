
export function $$(query, root=document) {
  return [ ...root.querySelectorAll(query)]
}

class Tabs extends HTMLElement {
  constructor() {
    super()
    const tabs = $$('[role=tab]', this)
    const panels = $$('[role=tabpanel]', this)

    tabs.forEach((tab, i) => {
      tab.onclick = () =>  {
        tabs.forEach(el => el.removeAttribute('aria-selected'))
        tab.setAttribute('aria-selected', 'true')

        panels.forEach(el => el.hidden = true)
        panels[i].hidden = null
      }
    })
  }
}

customElements.define('aria-tabs', Tabs, { extends: 'section' })
