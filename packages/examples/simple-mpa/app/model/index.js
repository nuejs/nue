
import { loadChunks } from './event-sourcing.js'
import { fetchWithAuth, login } from './auth.js'
import { createUser } from './users.js'

const use_rust = sessionStorage.rust || location.search.includes('rust')
if (use_rust) sessionStorage.rust = true

async function loadRustEngine() {
  const module = await import('./wasm/engine.js')
  const init = module.default
  const { Engine } = module
  await init()
  return new Engine()
}

async function loadEngine() {
  return use_rust ? await loadRustEngine() : await import('./engines/javascript.js')
}

const engine = await loadEngine()
const handlers = []
const CACHE = {}

export const model = {

  on(event, fn) {
    handlers.push({ event, fn })
  },

  search(query, params) {
    const data = parseItems(engine.search(query, params))
    data.items.forEach(el => searchHilite(query, el))
    return data
  },

  filter(args) {

    // filtering parameters
    const { type, query, filter } = args

    // query parameters
    const params = {
      ascending: !!args.asc || undefined,
      start: parseInt(args.start) || 0,
      sort_by: args.sort,
      length: 12,
    }

    if (!type || (type == 'search' && !query)) return model.all(params)
    if (query) return model.search(query, params)

    // model.filter({ type: "question", cc: "cn" }, { start: 0, length: 10 })
    const opts = filter ? { [type]: filter } : { type }
    const str = engine.filter(opts, params)
    return parseItems(str)
  },

  // caching persists discussion replies until reloaded
  get(id) {
    if (CACHE[id]) return CACHE[id]
    const item = engine.get(id)
    if (item) return CACHE[id] = createUser(JSON.parse(item), model.total)
  },

  all(params) {
    return parseItems(engine.all(params))
  },

  // authentication API

  get authenticated() {
    return !!localStorage.sid
  },

  async login(email, password) {
    const { sessionId, user } = await login(email, password)
    localStorage.sid = sessionId
    model.user = user
    emit('authenticated', user)
  },

  logout() {
    delete localStorage.sid
    delete model.user
    emit('logout')
  },

  // fetch people data with event sourcing
  async load() {
    const total = engine.get_total()
    if (total > 0) return model.total = total
    const chunks = await loadChunks()
    chunks.forEach(chunk => engine.add_events(chunk))
    model.total = engine.get_total()
  },

  // fetch application data
  async initialize() {
    if (model.authenticated) {
      if (!model.user) model.user = await fetchWithAuth('user.json')
      emit('authenticated')
    }
  }
}

function emit(event, data) {
  handlers.forEach(h => { if (h.event === event) h.fn(data) })
}


function searchHilite(query, data) {
  const re = new RegExp(`(${query})`, 'gi')
  'name email message'.split(' ').forEach(key => {
    data[key] = data[key].replace(re, '<mark>$1</mark>')
  })
}

function parseItems(str) {
  const data = JSON.parse(str)
  data.items = data.items.map(item => createUser(item, model.total))
  return data
}
