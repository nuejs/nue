
import { createHmrProgress } from '../../src/cli/progress/hmr'

const progress = createHmrProgress({
  desc: 'v3.0.0-beta.1 • Bun 1.3.1'
})

progress.start()

// simulate initial updates
const updates = [
  { filepath: 'design/colors.css', site: '@base', type: 'css' },
  { filepath: 'index.md', site: 'sites/blog', type: 'md' },
  { filepath: 'config.yaml', site: 'content/saas', type: 'yaml' },
  { filepath: 'nav.html', site: 'designs/miesian', type: 'html' },
  { filepath: 'app.js', site: '@base', type: 'js' },
  { filepath: 'utils.ts', site: 'content/saas-jp', type: 'ts' },
]

let index = 0

function simulateUpdate() {
  if (index < updates.length) {
    const asset = updates[index]
    progress.siteUpdated(asset)
    progress.render()
    index++

    setTimeout(simulateUpdate, 2000)
  }
}

// simulate browser sessions
progress.browserUpdated({ host: 'localhost:4000', site: '@base', active: true })
progress.browserUpdated({ host: 'blog-site.localhost:4000', site: 'sites/blog', active: true })
progress.browserUpdated({ host: 'miesian.localhost:4000', site: 'designs/miesian', active: true })
progress.browserUpdated({ host: 'memphis.localhost:4000', site: 'designs/memphis', active: true })

progress.render()

simulateUpdate()

// run for 30 seconds then exit
setTimeout(() => {
  progress.stop()
  process.exit(0)
}, 30000)