/* Auto mounting of reactive components */

// currently mounted apps
let apps = []

// amount of remounts (by the hot-reloading facility)
let remounts = 0


// hmr_path argument only used by hotreload.js
async function importAll(hmr_path) {
  const comps = document.querySelector('[name="nue:components"]')?.getAttribute('content')
  if (!comps) return []

  const arr = []

  for (let path of comps.split(' ')) {
    if (path) {
      if (path == hmr_path) path += `?${++remounts}`
      const { lib } = await import(path)
      if (lib) arr.push(...lib)
    }
  }
  return arr
}

export async function mount(name, wrap, data) {
  const lib = await importAll()
  const comp = lib.find(el => el.name == name)
  if (!comp) return

  const { createApp } = await import('./nue.js')
  const app = createApp(comp, data, lib).mount(wrap)
  app.root.setAttribute('custom', name)
  return app
}

export async function mountAll(hmr_path) {
  const els = document.querySelectorAll('[custom]')
  const lib = els[0] ? await importAll(hmr_path) : []
  if (!lib[0]) return

  const { createApp } = await import('./nue.js')

  for (const node of [...els]) {
    const name = node.getAttribute('custom') // || node.tagName.toLowerCase()
    const next = node.nextElementSibling
    const data = next?.type == 'application/json' ? JSON.parse(next.textContent) : {}
    const comp = lib.find(a => a.name == name)

    if (comp) {
      const app = createApp(comp, data, lib).mount(node)
      apps.push(app)

    } else if (customElements.get(name)) {
      // web component -> do nothing

    } else {
      // console.error(`Component not defined: "${name}"`)
    }
  }
}

export async function unmountAll() {
  apps.forEach(app => app.unmount())
  apps = []
}

// unmount all before routing
// addEventListener('before:route', unmountAll)

// mount all after route
addEventListener('route', () =>
  // must give empty argument
  mountAll()
)

// initial page load
addEventListener('DOMContentLoaded', () => dispatchEvent(new Event('route')))
