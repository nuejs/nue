
// paths is optional
export async function mountAll(paths) {
  const roots = document.querySelectorAll('[custom]')
  const deps = roots.length ? await importComponents(paths) : []
  if (!deps.length) return

  const { mount } = await import('nue')

  for (const root of [...roots]) {
    const name = root.getAttribute('custom')
    const next = root.nextElementSibling
    const data = next?.type == 'application/json' ? JSON.parse(next.textContent) : {}
    const comp = deps.find(a => [a.is, a.tag].includes(name))

    if (comp) {
      mount(comp, { root, data, deps })
      root.setAttribute('custom', name)
    }
  }
}

export function getImportPaths() {
  const el = document.querySelector('[name="libs"]')
  return el ? el.getAttribute('content').split(' ') : []
}

async function importComponents(paths) {
  if (!paths) paths = getImportPaths()
  const comps = []

  for (let path of paths) {
    const { lib } = await import(path)
    if (lib) comps.push(...lib)
  }
  return comps
}


// initial page load
addEventListener('route', () =>  mountAll())

addEventListener('DOMContentLoaded', () => dispatchEvent(new Event('route')))
