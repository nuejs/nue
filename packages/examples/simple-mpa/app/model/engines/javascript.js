

/*
  Entry format:

  type: "question"

  data: {
    cc: "fr"
    email: "chloép15@gmail.com"
    id: 16538
    message: "..."
    name: "Chloé Petit"
  }
*/
const events = []

export function add_events(input) {
  const arr = input.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => JSON.parse(line))
  events.push(...arr)
}

export function get_total() {
  return events.length
}

export function clear() {
  events.splice(0, events.length)
}


export function all(params) {
  const entries = sortEntries(params.sort_by, params.ascending)
  return paginate(entries, params.start, params.length)
}


export function filter(filters, params) {
  const { start, length, sort_by, ascending } = params
  const { type, plan, size } = filters

  let matches = type ? events.filter(el => el.type == type) : events
  if (plan) matches = events.filter(el => el.data.plan == plan)
  if (size) matches = events.filter(el => el.data.size == size)

  // sortEntries(matches, sort_by, ascending == false ? false : true)
  return paginate(matches, start, length)
}


export function search(query, params) {
  const { start, length, sort_by, ascending } = params
  const q = query.toLowerCase()

  let matches = events.filter(event => {
    const message = (event.data.message || '').toLowerCase()
    const name = (event.data.name || '').toLowerCase()
    const email = (event.data.email || '').toLowerCase()
    return (message && message.includes(q)) ||
           (name && name.includes(q)) ||
           (email && email.includes(q))
  })
  // sortEntries(matches, sort_by, ascending == false ? false : true)
  return paginate(matches, start, length)
}


export function get(id) {
  const el = events.find(event => event.data.id == id)
  return el ? JSON.stringify(el) : null
}


function paginate(events, start, length) {
  const total = events.length
  const end = Math.min(start + length, total)

  /*
    The programming language-independent model expects strings
    This is not an performance issue, since only {length} entries
  */

  const items = events.slice(start, end).map(item => JSON.stringify(item)).join(',')
  return `{"total":${total},"start":${start},"length":${length},"items":[${items}]}`
}

const planOrder = ['free', 'pro', 'enterprise']
const sizeOrder = ['s', 'm', 'l', 'xl']

// id, cc, size, plan
function sortEntries(sort_by, ascending) {
  return [...events].sort((a, b) => {

    const field = sort_by || 'id'
    let compare = 0
    if (field == 'id') compare = a.data.id - b.data.id
    else if (field == 'cc') compare = a.data.cc.localeCompare(b.data.cc)
    else if (field == 'size') compare = sizeOrder.indexOf(a.data.size || 's') - sizeOrder.indexOf(b.data.size || 's')
    else if (field == 'plan') compare = planOrder.indexOf(a.data.plan) - planOrder.indexOf(b.data.plan)
    return ascending ? compare : -compare
  })
}
