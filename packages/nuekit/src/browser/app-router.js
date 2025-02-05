
// Router for single-page applications

let curr_state = {}
let fns = []
let opts


export const router = {
  setup(path_pattern='', query_params=[]) {
    opts = { path: path_pattern.split('/'), params: query_params }
  },

  get state() {
    return isEmpty(curr_state) ? parseData(location) : curr_state
  },

  on(names, fn) {
    fns.push({ names: names.split(/\s+/), fn })
  },

  set(data) {
    if (intersect(opts.params, Object.keys(data))) data = { ...curr_state, ...data }
    const changes = fire(data)
    if (changes && history) setState(changes)
  },

  del(key) {
    router.set({ [key]: null })
  },

  start(args={}) {
    fire(parseData(location))
    init(args.root)
  }
}

function init(root=document) {

  // clicks
  root.addEventListener('click', e => {
    const a = e.target.closest('[href]')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || !matchesPath(a.pathname)) return

    e.preventDefault()
    const data = parseData(a)
    const changes = fire(a.search ? { ...curr_state, ...data } : data)
    if (changes) setState(changes)
  })

  // back button
  addEventListener('popstate', e => {
    fire(e.state || {})
  })

  // component reloads (.dhtml)
  addEventListener('hmr', e => {
    curr_state = {}
    fns = []
  })

}

export function fire(data) {
  const changes = diff(curr_state, data)
  if (!changes) return

  for (const el of fns.reverse()) {
    if (intersect(el.names, Object.keys(changes))) el.fn(data, changes)
  }

  curr_state = data
  return changes
}

export function diff(orig, data) {
  const changes = {}

  for (const key in { ...orig, ...data }) {
    if (key in data) {
      if (data[key] !== orig[key]) changes[key] = data[key]
    } else {
      changes[key] = null
    }
  }

  return isEmpty(changes) ? null : changes
}


// TODO front page:  || (!query && path == '/')
function setState(changes) {
  return hasPathData(changes) ? history.pushState(changes, 0, renderPath() + renderQuery())
    : history.replaceState(changes, 0, renderQuery() || './')
}

export function hasPathData(data) {
  for (let key of opts.path) {
    if (key[0] == ':' && data[key.slice(1)] !== undefined) return true
  }
}

export function parsePathData(path) {
  const els = path.split('/')
  const data = {}

  for (let i = 1; i < opts.path.length; i++) {
    const token = opts.path[i]
    const part = els[i]

    if (token[0] == ':') { if (part) data[token.slice(1)] = part }
    else if (token != part) return
  }
  return data
}

// anchorElement.search
export function parseQueryData(search) {
  const els = new URLSearchParams(search)
  const data = {}

  for (const [name, val] of els) {
    if (opts.params.includes(name)) data[name] = val
  }
  return data
}

function parseData({ pathname, search }) {
  const data = { ...parsePathData(pathname), ...parseQueryData(search) }
  if (!hasPathData(data)) data[getFirstPart()] = ''
  return data
}


function getFirstPart() {
  const key = opts.path.find(el => el[0] == ':')
  return key.slice(1)
}


export function matchesPath(path) {
  const prefix = opts.path[1]
  return prefix[0] == ':' || prefix == path.split('/')[1]
}

// from current state
export function renderPath() {
  let els = opts.path.map((key, i) => key[0] == ':' ? curr_state[key.slice(1)] : key)
  const i = els.findIndex(el => el == null)
  if (i > 0) els = els.slice(0, i + 1)
  return els.join('/').replaceAll('//', '/')
}

// from current state
export function renderQuery() {
  const data = {}
  opts.params.forEach(function(key) {
    const val = curr_state[key]
    if (val) data[key] = val
  })
  const query = new URLSearchParams(data)
  return query.size ? '?' + query : ''
}


function intersect(arr_a, arr_b) {
  return arr_a.filter(el => arr_b.includes(el))[0]
}

function isEmpty(obj) {
  return !obj || !Object.keys(obj)[0]
}
