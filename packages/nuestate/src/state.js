
if (typeof global == 'object') global.window = null

const CONTEXTS = ['path_params', 'query', 'session', 'local', 'emit_only', 'memory']

let memory = {}
let fns = []
let opts

export const api = {

  setup(args={}) {
    const { route='', query=[], memory=[] } = args
    opts = {...args, path_params: getRouteParams(route), route, query, memory }
    if (window) {
      if (opts.autolink) autolink()
      addEventListener('popstate', onpopstate)
    }
  },

  get data() {
    return translate(!window ? memory : {
      ...getStoreData(sessionStorage),
      ...getStoreData(localStorage),
      ...getURLData(location),
      ...memory
    })
  },

  on(names, fn) {
    const i = getFnIndex(names, fn)
    fns[i >= 0 ? i : fns.length] = { names, fn }
  },

  off(names, fn) {
    const i = getFnIndex(names, fn)
   if (i >= 0) fns.splice(i, 1)
  },

  emit(name, val) {
    if (opts.emit_only?.includes(name)) {
      fire({ [name]: val })
    }
  },

  set(data, is_popstate) {
    const { changes, at } = getChanges(this.data, data)

    if (at.size) {
      save(changes)
      fire(changes)
      if (window && !is_popstate) pushURLState(at, { ...api.data, ...changes })
    }
  },

  init() {
    fire(getURLData(location))
  },

  clear() {
    memory = {}
    fns = []
  },
}


// proxy
export const state = new Proxy(api, {
  get(api, prop) {
    return api[prop] || api.data[prop]
  },

  set(api, prop, val) {
    if (api[prop]) console.error(`(fail) cannot override state.${prop}`)
    api.set({ [prop]: val })
    return true
  }
})


function translate(obj) {
  for (const key in obj) {
    const val = obj[key]
    if (val == null) delete obj[key]
    else if (val == 'true') obj[key] = true
    else if (val == 'false') obj[key] = false
    else if (typeof val == 'string' && val != '' && !isNaN(+val)) obj[key] = +val
  }
  return obj
}

function pushURLState(at, data) {
  const search = opts.query[0] ? renderQuery(opts.query, data) : ''

  if (at.has('path_params')) {
    history.pushState(true, 0, renderPath(opts.route, data) + search)

  } else if (at.has('query')) {
    history.replaceState(true, 0, search || './')
  }
}

function onpopstate({ state }) {
  state ? api.set(getURLData(location), true) : api.init()
}


// start automatic linking
function autolink(root=document) {

  // clicks
  root.addEventListener('click', e => {
    const link = e.target.closest('a[href]')
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || !getPathData(opts.route, link.pathname)) return
    api.set(getURLData(link))
    e.preventDefault()
  })
}

function getChanges(orig, data) {
  const at = new Set()
  const changes = {}

  for (const key in data) {
    for (const ctx of CONTEXTS) {
      if (opts[ctx]?.includes(key) && orig[key] !== data[key]) {
        changes[key] = data[key]
        at.add(ctx)
      }
    }
  }
  return { changes, at }
}

function fire(changes) {
  for (const el of fns) {
    if (el.names.split(' ').some(name => name in changes)) {
      el.fn(changes)
    }
  }
}


function save(changes) {
  for (const key in changes) {
    const val = changes[key]

    if (opts.session?.includes(key)) {
      setStoreValue(sessionStorage, key, val)

    } else if (opts.local?.includes(key)) {
      setStoreValue(localStorage, key, val)

    } else if ([...opts.memory, ...opts.path_params, ...opts.query].includes(key)) {
      memory[key] = val
    }
  }
}


function getFnIndex(names, fn) {
  return fns.findIndex(el => el.names == names && el.fn.toString() == fn.toString())
}

function getRouteParams(route) {
  return route.split('/').filter(el => el[0] == ':').map(el => el.slice(1))
}

export function getPathData(route, pathname) {
  const tokens = route.split('/')
  const els = pathname.split('/')
  const data = {}

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]
    const el = els[i]

    if (token[0] == ':') { data[token.slice(1)] = el || null }
    else if (token != el) return
  }
  return data
}

export function getQueryData(params, search) {
  const args = new URLSearchParams(search)
  const data = {}

  params.forEach(key => {
    data[key] = args.get(key) || null
  })
  return data
}

function getURLData({ pathname, search }) {
  return {
    ...getPathData(opts.route, pathname),
    ...getQueryData(opts.query, search),
  }
}


export function renderPath(route, data={}) {
  const els = route.split('/').map(token => token[0] == ':' ? data[token.slice(1)] : token)
  const i = els.indexOf(undefined)
  return (i > 0 ? els.slice(0, i + 1) : els).join('/').replace('//', '/')
}

export function renderQuery(params, data={}) {
  const query_data = {}

  params.forEach(function(key) {
    const val = data[key]
    if (val) query_data[key] = val
  })

  const query = new URLSearchParams(query_data)
  return query.size ? '?' + query : ''
}


// storage
const KEY = '$state'

function getStoreData(store) {
  return JSON.parse(store[KEY] || '{}')
}

function setStoreValue(store, key, val) {
  const data = getStoreData(store)
  if (data[key] != val) {
    data[key] = val
    store[KEY] = JSON.stringify(data)
    return true
  }
}
