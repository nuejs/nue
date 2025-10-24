
import { createProgress } from '../../src/cli/progress'

// shared progress simulator
function simulateProgress(progress, site, total, delay) {
  return new Promise(resolve => {
    let current = 0
    const interval = setInterval(() => {
      progress.update(site)
      current++
      if (current >= total) {
        clearInterval(interval)
        resolve()
      }
    }, delay)
  })
}

async function simulateDeploy() {
  const sites = [
    { site: '@base', label: 'Shared assets (@base)', total: 2 },
    { site: 'www', label: 'acme.nuejs.com', total: 5 },
    { site: 'blog', label: 'blog--acme.nuejs.com', total: 5 },
    { site: 'saas', label: 'saas--acme.nuejs.com', total: 8 },
    { site: 'admin', label: 'admin--acme.nuejs.com', total: 8 },
    { is_cdn: true, label: 'Purging CDN cache', total: 2 }
  ]

  const progress = createProgress(sites)

  const uploads = sites.filter(d => !d.is_cdn).map((row, i) => {
    return new Promise(resolve => {
      setTimeout(() => {
        simulateProgress(progress, row.site, row.total, 500 / row.total).then(resolve)
      }, i * 200)
    })
  })

  await Promise.all(uploads)

  // cdn purge uses last site
  const cdn = sites[sites.length - 1]
  await simulateProgress(progress, cdn.site, cdn.total, 500)

  progress.finish()
}

simulateDeploy()