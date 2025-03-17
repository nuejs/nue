
// limited list on the demo
const COUNTRIES = {
  cn: 'China',
  de: 'Germany',
  fr: 'France',
  jp: 'Japan',
  uk: 'UK',
  us: 'USA',
}

const SIZES = [
  { key: 'xl', label: 'Very large', desc: '100+' },
  { key: 'l',  label: 'Large',   desc: '50 – 100' },
  { key: 'm',  label: 'Medium', desc: '10 – 50' },
  { key: 's',  label: 'Small', desc: '0 – 10' },
]

export function createUser(item, total) {
  const { type, ts, data } = item
  const created = fakeDate(ts, total)
  const country = COUNTRIES[data.cc]
  const thread = fakeDiscussion(created, data.message)
  return { ...data, type, created, thread, country, size: SIZES.find(el => el.key == data.size) }
}

function fakeDate(index, total) {
  const now = Date.now()
  const twoYearsAgo = now - (2 * 365 * 24 * 60 * 60 * 1000)
  const progress = Math.log(index) / Math.log(total)
  const baseTime = twoYearsAgo + (now - twoYearsAgo) * progress
  const jitter = (Math.random() - 0.5) * 12 * 60 * 60 * 1000 // ±12 hours
  return new Date(baseTime + jitter)
}

/* Random placeholder discussion */
const THREADS = [
  [
    'Can you provide me your system information? Thanks.',
    'Sure thing, gimme a second',
    '👍',
  ],
  [
    'Can you tell me what you were doing when it happened?',
    'I was on the customer view, clicked on the notitication icon, and selected "never". The system did not respond. I\'m on latest Chrome',
    'We found the issue and pushed a fix to production. Please reload the app.',
    'Thank you! Works now 🎉🎉',
  ],
  [
    'Which browser are you using? Chrome, Firefox, Safari? Are you on Windows, Mac, or Linux?',
    'Alright, here’s the full rundown—OS: Windows 11, 64-bit, Version 22H2, CPU: Intel i7-12700, RAM: 16GB, Storage: 512GB SSD, GPU: NVIDIA RTX 3060, Browser: Chrome 123.0.6312.86. Let me know what’s next!',
    'Thanks. Checking this out. Will be back later today',
    '🫡',
  ],
]
let index = 0

function fakeDiscussion(created, body) {
  if (index == THREADS.length) index = 0
  const thread = [{ created, body }]

  THREADS[index++].forEach(function(body, i) {
    thread.push({ created: new Date(), body, is_reply: i % 2 == 0})
  })

  thread.reply = function(body) {
    thread.push({ created: new Date(), body, is_reply: true })
  }

  return thread
}





