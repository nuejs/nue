
// both args are optional
export async function mountAll(reload_path) {
  const roots = document.querySelectorAll('[nue]')
  const deps = roots.length ? await importComponents(reload_path) : []
  if (!deps.length) return

  const { mount } = await import('/@nue/nue.js')

  for (const root of [...roots]) {
    const name = root.getAttribute('nue') || root.tagName.toLowerCase()
    const comp = deps.find(a => [a.is, a.tag].includes(name))

      console.info(root, !comp)
    if (comp) {
      const node = mount(comp, { root, deps, data: getData(root) })
      node.root.setAttribute('nue', name)
    }
  }
}

function getData(root) {
  if (root.firstChild?.tagName == 'SCRIPT') root.after(root.firstChild)
  const script = root.nextElementSibling
  if (script?.type == 'application/json') return JSON.parse(script.textContent)
}

export function getImportPaths() {
  const el = document.querySelector('[name="libs"]')
  return el ? el.getAttribute('content').split(' ') : []
}

let reload_count = 0

async function importComponents(reload_path) {
  const comps = []

  for (let path of getImportPaths()) {
    const count = path == reload_path ? `?${ reload_count++ }` : ''
    const { lib } = await import(`/${path}.js${count}`)
    if (lib) comps.push(...lib)
  }

  return comps
}


// initial page load
addEventListener('route', () =>  mountAll())

addEventListener('DOMContentLoaded', () => dispatchEvent(new Event('route')))
