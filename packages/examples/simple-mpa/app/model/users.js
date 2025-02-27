
// limited list on the demo
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
  l:  { label: 'Large',   desc: '50 – 100' },
  m:  { label: 'Medium', desc: '10 – 50' },
  s:  { label: 'Small', desc: '0 – 10' },
}

export function createUser(item, total) {
  const { type, ts, data } = item
  const created = fakeDate(ts, total)
  const country = COUNTRIES[data.cc]
  const thread = fakeDiscussion(created, data.message)
  return { ...data, type, created, thread, country, size: SIZES[data.size] }
}


function fakeDiscussion(created, body) {
  const thread = [{ created, body }]

  thread.reply = function(body) {
    thread.push({ created: new Date(), body, is_reply: true })
  }

  // temporary
  thread.reply('Can you provide me your system information? Thanks.')

  thread.push({ created: new Date(), body: '👍' })

  return thread
}


function fakeDate(index, total) {
  const now = Date.now()
  const twoYearsAgo = now - (2 * 365 * 24 * 60 * 60 * 1000)
  const progress = Math.log(index) / Math.log(total)
  const baseTime = twoYearsAgo + (now - twoYearsAgo) * progress
  const jitter = (Math.random() - 0.5) * 12 * 60 * 60 * 1000 // ±12 hours
  return new Date(baseTime + jitter)
}


