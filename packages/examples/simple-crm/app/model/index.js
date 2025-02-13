
import init, { Model } from './engine.js'

await init()
const engine = new Model()

const handlers = []

function emit(event, data) {
  handlers.forEach(h => { if (h.event === event) h.fn(data) })
}

export const model = {

  on(event, fn) {
    handlers.push({ event, fn })
  },

  search(query, params) {
    const data = parseItems(engine.search(query, params))
    data.items.forEach(el => hilite(query, el))
    return data
  },

  filter(args) {

    // filtering parameters
    const { type, query } = args

    // query parameters
    const params = {
      ascending: !!args.asc || undefined,
      start: parseInt(args.start) || 0,
      sort_by: args.sort,
      length: 10,
    }

    if (!type || (type == 'search' && !query)) return model.all(params)
    if (query) return model.search(query, params)

    // model.filter({ type: "question", cc: "cn" }, { start: 0, length: 10 })
    const str = engine.filter(getFilter(type, args.filter), params)
    return parseItems(str)
  },

  get(id) {
    if (CACHE[id]) return CACHE[id]
    const item = engine.get(id)
    if (item) return CACHE[id] = setup(JSON.parse(item))
  },

  all(params) {
    return parseItems(engine.all(params))
  },

  // authentication API

  get authenticated() {
    return !!sessionStorage.sid
  },

  async login(email, password) {
    const response = await fetch('/mocks/login.json', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      method: 'POST',
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const { sessionId, user } = await response.text()
    sessionStorage.sid = sessionId
    model.user = user
    emit('authenticated', user)
  },

  async load() {
    // engine.clear()
    engine.add_events(await loadChunk())

    const ts = localStorage.getItem('_ts') || 0

    if (ts) engine.add_events(await loadChunk(ts))

    model.total = engine.get_total()

    localStorage.setItem('_ts', Date.now())
  },

  async initialize() {
    if (model.authenticated) {
      if (!model.user) model.user = await fetchData('user.json')
      emit('authenticated')
    }
  }
}

/* fetch and auth */
async function fetchData(path, as_text) {
  const { sid } = sessionStorage
  if (!sid) throw new Error('No active session')

  const res = await fetch('/mocks/' + path, {
    headers: { 'Authorization': `Bearer ${sid}` }
  })

  return as_text ? await res.text() : await res.json()
}

async function loadChunk(ts) {
  return await fetchData(ts ? `updates.json?ts=${ts}` : 'init.json', true)
}

const CACHE = {}

function getFilter(type, filter) {
  return filter ? { [type]: filter } : { type }
}



function hilite(query, data) {
  const re = new RegExp(`(${query})`, 'gi')
  'name email message'.split(' ').forEach(key => {
    data[key] = data[key].replace(re, '<mark>$1</mark>')
  })
}

// limited demo list
const COUNTRIES = {
  cn: 'China',
  de: 'Germany',
  fr: 'France',
  jp: 'Japan',
  uk: 'UK',
  us: 'USA',
}

const SIZES = {
  xl: { label: 'Very large', desc: '100 or more' },
  s:  { label: 'Large',   desc: '50 – 100' },
  m:  { label: 'Medium', desc: '10 – 50' },
  l:  { label: 'Small', desc: '0 – 10' },
}

function createThread(created, body) {
  const thread = [{ created, body }]

  thread.reply = function(body) {
    thread.push({ created: new Date(), body, is_reply: true })
  }

  // temporary
  thread.reply('Can you provide me your system information? Thanks.')

  thread.push({ created: new Date(), body: '👍' })

  return thread
}

function setup(item) {
  const { type, ts, data } = item
  const created = toDate(ts, model.total)
  const country = COUNTRIES[data.cc]
  const thread = createThread(created, data.message)
  return { ...data, type, created, thread, country, size: SIZES[data.size] }
}

function parseItems(str) {
  const data = JSON.parse(str)
  data.items = data.items.map(setup)
  return data
}

function toDate(index, total) {
  const now = Date.now()
  const twoYearsAgo = now - (2 * 365 * 24 * 60 * 60 * 1000)
  const progress = Math.log(index) / Math.log(total)
  const baseTime = twoYearsAgo + (now - twoYearsAgo) * progress
  const jitter = (Math.random() - 0.5) * 12 * 60 * 60 * 1000 // ±12 hours
  return new Date(baseTime + jitter)
}


