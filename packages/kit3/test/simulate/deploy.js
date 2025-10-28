
import { createProgress } from '../../src/cli/progress/deploy'

// shared progress simulator
function simulateProgress(progress, name, amount, delay) {
  return new Promise(resolve => {
    let current = 0
    const interval = setInterval(() => {
      progress.update(name)
      current++
      if (current >= amount) {
        clearInterval(interval)
        resolve()
      }
    }, delay)
  })
}

async function simulateDeploy() {
  const items = [
    { name: '@base', label: 'Shared assets (@base)', amount: 2 },
    { name: 'www', label: 'acme.nuejs.com', amount: 5 },
    { name: 'blog', label: 'blog--acme.nuejs.com', amount: 5 },
    { name: 'saas', label: 'saas--acme.nuejs.com', amount: 8 },
    { name: 'admin', label: 'admin--acme.nuejs.com', amount: 8 },
    { label: 'Purging CDN cache', files: 56, amount: 2 }
  ]

  const progress = createProgress(items)

  const sites = items.filter(d => !!d.name).map((row, i) => {
    return new Promise(resolve => {
      setTimeout(() => {
        simulateProgress(progress, row.name, row.amount, 500 / row.amount).then(resolve)
      }, i * 200)
    })
  })

  await Promise.all(sites)

  // cdn purge uses last item
  const cdn = items[items.length - 1]
  await simulateProgress(progress, cdn.name, cdn.amount, 500)

  progress.finish()
}

simulateDeploy()