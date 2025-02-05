
import init, { Model } from './engine.js'

await init()
const engine = new Model()

export const model = {

  async init() {

    // might be cached via immutable header
    engine.clear()
    engine.add_events(await loadChunk())

    const ts = localStorage.getItem('_ts') || 0

    if (ts) engine.add_events(await loadChunk(ts))

    model.total = engine.get_total()

    localStorage.setItem('_ts', Date.now())
  },

  all(params) {
    return parseItems(engine.all(params))
  },

  search(query, params) {
    const data = parseItems(engine.search(query, params))
    data.items.forEach(el => hilite(query, el.data))
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
    console.info(getFilter(type, args.filter), params)
    const str = engine.filter(getFilter(type, args.filter), params)
    return parseItems(str)
  },

  get(id) {
    const item = engine.get(id)
    if (item) {
      const { type, ts, data } = JSON.parse(item)
      const created = toDate(ts, model.total)
      return { type, created, ...data }
    }
  },
}

function getFilter(type, filter) {
  return type == 'size' ? { company_size: filter } : type == 'plan' ? { plan: filter } : { type }
}

async function loadChunk(ts) {
  const path = ts ? `updates.json?ts=${ts}` : 'init.json'
  const res = await fetch('/mocks/' + path)
  return await res.text()
}


function hilite(query, data) {
  const re = new RegExp(`(${query})`, 'gi')
  'name email message'.split(' ').forEach(key => {
    data[key] = data[key].replace(re, '<mark>$1</mark>')
  })
}

function parseItems(str) {
  const data = JSON.parse(str)
  data.items.forEach(el => el.data.created = toDate(el.ts, model.total))
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


