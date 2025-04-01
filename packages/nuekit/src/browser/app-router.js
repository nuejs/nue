
// Router for single-page applications
let curr_state = {}
let fns = []
let opts


export function cleanup() {
  curr_state = {}
  fns = []
}

export const router = {
  configure(args) {
    const {
      route='/',
      url_params=[],
      session_params=[],
      persistent_params=[],
    } = args

    opts = { route: route.split('/'), url_params, session_params, persistent_params }
  },

  get state() {
    const data = isEmpty(curr_state) ? parseData(location) : curr_state
    return { ...data, ...getStoreData() }
  },

  on(names, fn) {
    fns.push({ names, fn })
  },

  bind(key, fn) {
    const [ names, namespace ] = key.split(':')
    fns = fns.filter(el => !(el.namespace == namespace && el.names == names))
    fns.push({ names, fn, namespace })
  },

  set(data, _val) {
    if (typeof data == 'string') data = { [data]: _val }

    if (contains(data, [...opts.url_params, ...opts.session_params, ...opts.persistent_params])) {
      data = { ...curr_state, ...data }
    }

    const changes = fire(data)
    if (changes && history) pushURLState(changes)
  },

  toggle(name, flag) {
    if (flag === undefined) flag = !router.state[name]
    router.set({ [name]: flag })
    return flag
  },

  del(key) {
    router.set({ [key]: null })
  },

  initialize(args={}) {
    fire(parseData(location))
    init(args.root)
  },

  cleanup
}

function init(root=document) {

  // clicks
  root.addEventListener('click', e => {
    const a = e.target.closest('[href]')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || !matchesPath(a.pathname)) return

    e.preventDefault()
    const data = parseData(a)

    const changes = fire(a.search ? { ...curr_state, ...data } : data)
    if (changes) pushURLState(changes)
  })
}

// back button
addEventListener('popstate', e => {
  const path = e.state?.path
  if (path && !matchesPath(path)) cleanup()
  fire(e.state || {})
})

// component reloads (.dhtml)
addEventListener('hmr', cleanup)


export function fire(data) {
  const changes = {...setStoreData(data), ...diff(curr_state, data) }
  if (!changes) return

  curr_state = data

  for (const el of fns.reverse()) {
    if (contains(changes, el.names.split(' '))) {
      el.fn(data, { path: renderPath(data) })
    }
  }

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


function pushURLState(changes) {
  if (hasPathData(changes)) {
    history.pushState(curr_state, 0, renderPath() + renderQuery())

  } else {
    // TODO: make replaceState work
    history.pushState(curr_state, 0, renderQuery() || './')
  }
}

export function hasPathData(data) {
  for (let key of opts.route) {
    if (key[0] == ':' && data[key.slice(1)] !== undefined) return true
  }
}

export function parsePathData(path) {
  const els = path.split('/')
  const data = {}

  for (let i = 1; i < opts.route.length; i++) {
    const token = opts.route[i]
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
    if (opts.url_params.includes(name)) data[name] = val
  }
  return data
}

function parseData({ pathname, search }) {
  const data = { ...parsePathData(pathname), ...parseQueryData(search) }
  if (!hasPathData(data)) data[getFirstPart()] = ''
  return data
}

function getFirstPart() {
  const key = opts.route.find(el => el[0] == ':')
  return key.slice(1)
}


export function matchesPath(path='') {
  const prefix = opts.route[1]
  return prefix[0] == ':' || prefix == path.split('/')[1]
}

// from current state
export function renderPath(data=curr_state) {
  let els = opts.route.map((key, i) => key[0] == ':' ? data[key.slice(1)] : key)
  const i = els.findIndex(el => el == null)
  if (i > 0) els = els.slice(0, i + 1)
  return els.join('/').replaceAll('//', '/')
}

// from current state
export function renderQuery() {
  const data = {}
  opts.url_params.forEach(function(key) {
    const val = curr_state[key]
    if (val) data[key] = val
  })
  const query = new URLSearchParams(data)
  return query.size ? '?' + query : ''
}


function contains(data, params) {
  const keys = Object.keys(data)
  return params.filter(el => keys.includes(el))[0]
}

function isEmpty(obj) {
  return !obj || !Object.keys(obj)[0]
}


/* localStorage || sessionStorage */
const STORE_KEY = '$nue_state'

function setStoreData(data) {
  const changes = {}

  for (const [key, value] of Object.entries(data)) {
    const changed = opts.session_params.includes(key) && setStoreValue(sessionStorage, key, value) ||
      opts.persistent_params.includes(key) && setStoreValue(localStorage, key, value)

    if (changed) changes[key] = value
  }
  return changes
}

function getStoreData() {
  const data = {}
  for (const store of [sessionStorage, localStorage]) {
    const val = store[STORE_KEY]
    if (val) Object.assign(data, JSON.parse(val))
  }
  return data
}

function setStoreValue(store, key, val) {
  const data = JSON.parse(store[STORE_KEY] || '{}')
  if (data[key] != val) {
    data[key] = val
    store[STORE_KEY] = JSON.stringify(data)
    return true
  }
}