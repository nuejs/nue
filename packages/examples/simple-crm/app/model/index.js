
import init, { Model } from './engine.js'

await init()
const engine = new Model()


export const model = {

  async init() {

    // might be cached via immutable header
    engine.add_events(await loadChunk())

    const ts = localStorage.getItem('_ts') || 0

    if (ts) engine.add_events(await loadChunk(ts))

    localStorage.setItem('_ts', Date.now())
  },

  search(query, start=0) {
    const data = JSON.parse(engine.search(query, start, 10))
    data.items.forEach(el => hilite(query, el.data))
    return data
  },

  filter({ type, query, start=0 }) {
    if (query) return model.search(query, start)
    if (type == 'search') type = 'question' // TODO: all
    const str = engine.filter(pack({ type }), start, 10)
    return JSON.parse(str)
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
