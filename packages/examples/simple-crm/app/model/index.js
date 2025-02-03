
import init, { Model } from './engine.js'

await init()
const engine = new Model()

const PAGE_SIZE = 10

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

  search(query, start=0) {
    const data = parseItems(engine.search(query, start, PAGE_SIZE))
    data.items.forEach(el => hilite(query, el.data))
    return data
  },

  all(start=0) {
    return parseItems(engine.all(start, PAGE_SIZE))
  },

  filter({ type, query, start=0 }) {
    if (!type || (type == 'search' && !query)) return model.all(start)
    if (query) return model.search(query, start)
    const str = engine.filter(pack({ type }), start, PAGE_SIZE)
    return parseItems(str)
  },

  get(id) {
    return JSON.parse(engine.get(id))
  },

}

function pack(obj) {
  return JSON.stringify(obj).slice(1, -1)
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


