
import { onclick, loadPage, setSelected } from './page-router.js'

const fns = []

async function fire(path) {
  for (const { pattern, fn } of fns) {
    const data = match(pattern, path)
    if (data) await fn(data)
  }
  setSelected(path)
}

// clear existing routes
addEventListener('before:route', () => {
  fns.splice(0, fns.length)
})

export const router = {

  /****  Routing  ****/

  on(pattern, fn) {
    fns.push({ pattern, fn })
  },

  start({ path, root  }) {
    // setup links
    if (root) onclick(root, this.route)

    // path structure for data- getter function
    this.pattern = path

    // start with initial route
    fire(location.pathname)
  },


  route(path) {
    scrollTo(0, 0)
    const is_page = path.endsWith('.html')
    history.pushState({ path, is_spa: !is_page }, 0, path)

    // after pushState
    is_page ? loadPage(path) : fire(path)
  },


  /****  State management  ****/

  set(key, val) {
    const args = new URLSearchParams(location.search)
    args.set(key, val)
    history.replaceState(router.data, 0, `?${args}`)
  },

  get data() {
    const { pattern } = this
    const path_data = pattern ? match(pattern, location.pathname, true) : {}
    const args = Object.fromEntries(new URLSearchParams(location.search))
    return { ...path_data, ...args }
  }
}


export function match(pattern, path, is_global) {
  const keys = pattern.split('/').slice(1)
  const vals = path.split('/').slice(1)
  if (!is_global && keys.length != vals.length) return null

  let is_valid = true
  const data = {}

  keys.forEach((key, i) => {
    const val = vals[i]
    if (key[0] == ':') {
      if (val) data[key.slice(1)] = 1 * val || val

    } else if (!is_global && key != val) is_valid = false
  })

  return is_valid ? data : null
}




