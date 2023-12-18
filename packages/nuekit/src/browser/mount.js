
/* Auto mounting of reactive components */

// currently mounted apps
let apps = []

// amount of remounts (by the hot-reloading facility)
let remounts = 0

async function importAll(reload_path) {
  const comps = document.querySelector('[name="nue:components"]')?.getAttribute('content')
  if (!comps) return []

  const arr = []

  for (let path of comps.split(' ')) {
    if (path == reload_path) path += `?${++remounts}`
    const { lib } = await import(path)
    if (lib) arr.push(...lib)
  }
  return arr
}


export async function mountAll(reload_path) {
  const els = document.querySelectorAll('[island]')
  const lib = els[0] ? await importAll(reload_path) : []
  if (!lib[0]) return

  const { createApp } = await import('./nue.js')

  for (const node of [...els]) {
    const name = node.getAttribute('island')
    const next = node.nextElementSibling
    const data = next?.type == 'application/json' ? JSON.parse(next.textContent) : {}
    const comp = lib.find(a => a.name == name)
    if (comp) {
      const app = createApp(comp, data, lib).mount(node)
      apps.push(app)
    } else {
      console.error('Component not defined:', name)
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
addEventListener('route', mountAll)

// initial page load
addEventListener('DOMContentLoaded', mountAll)

