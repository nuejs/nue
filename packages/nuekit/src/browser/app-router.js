
// Router for single-page applications

const fns = []
let state = {}
let path_tokens
let params

export function fireRoute(path, search) {
  const data = { ...parsePath(path), ...parseSearch(search) }
  const changes = diff(state, data)

  if (has(changes)) {
    state = data
    for (const name in changes) fire(name)
    return changes
  }
}

function has(obj) {
  return Object.keys(obj).length
}

export function fire(name) {
  for (const el of fns) {
    if (el.names.includes(name)) el.fn(router.state)
  }
}

function diff(a, b) {
  const changes = {}
  for (const key in b) {
    if (a[key] !== b[key]) changes[key] = b[key]
  }
  return changes
}

export function parsePath(path) {
  const els = path.split('/')
  const data = {}

  for (let i = 1; i < path_tokens.length; i++) {
    const token = path_tokens[i]
    const part = els[i]

    if (token[0] == ':') { if (part) data[token.slice(1)] = part }
    else if (token != part) return
  }
  return data
}

// anchorElement.search
export function parseSearch(search) {
  const els = new URLSearchParams(search)
  const data = {}

  for (const [name, val] of els) {
    if (params.includes(name)) data[name] = val
  }
  return data
}


function replaceState(name, val) {
  const args = new URLSearchParams(location.search)
  args.set(name, val)
  history.replaceState(null, 0, `?${args}`)
}

// export function()

export const router = {
  setup(path_pattern='', query_params=[]) {
    path_tokens = path_pattern.split('/')
    params = query_params
  },

  get state() {
    return has(state) ? state :
      { ...parsePath(location.pathname), ...parseSearch(location.search) }
  },

  on(names, fn) {
    if (typeof names == 'string') names = names.split(/\s+/)
    fns.push({ names, fn })
    return fn
  },

  route(path, params) {
    const search = new URLSearchParams(params)
    if (fireRoute(path, `?${search}`)) {
      history.pushState(null, 0, `${path}?${search}`)
    }
  },

  set(name, val) {
    if (state[name] !== val) {
      state[name] = val
      fire(name)
      if (params.includes(name)) replaceState(name, val)
      // TODO: else set path
    }
  },

  start(args={}) {
    const { pathname=location.pathname, search=location.search, root=document } = args

    root.addEventListener('click', e => {
      const a = e.target.closest('[href]')

      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return

      const changes = fireRoute(a.pathname, a.search)

      if (changes && parsePath(a.pathname)) {
        history.pushState(changes, 0, a.getAttribute('href'))
        e.preventDefault()
      }

    })

    addEventListener('popstate', e => {
      fireRoute(location.pathname, location.search)
    })

    fireRoute(pathname, search)
  },
}




