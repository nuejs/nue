
import { createLog } from '../../src/cli/dev'

const cli = createLog({ version: '3.0.0-beta.1' })

const paths = [
  '@base/@shared/design/typography.css',
  '@base/@shared/ui/join.html',
  '@base/@shared/ui/layout.html',
  '@base/base.js',
  '@base/blog/first.md',
  '@base/index.md',
  '@base/site.yaml',
  'sites/acme/acme.css',
  'sites/acme/index.md',
  'sites/acme/layout.html',
  'sites/acme/site.yaml',
  'sites/beta/app/index.html',
  'sites/beta/index.md',
  'sites/beta/site.yaml',
]

function parsePath(path) {
  const els = path.split('/')
  const type = els.pop().split('.').pop()
  const is_base = els[0] == '@base'
  const site = is_base ? '@base' : els[1]
  return { path, is_base, type, site }
}

function randomPath() {
  return paths[Math.floor(Math.random() * paths.length)]
}

let count = 0

while (true) {
  count++
  const file = parsePath(randomPath())

  if (count % 5 == 0) {
    cli.trackRemove(file)
    continue
  }

  cli.trackUpdate(file)

  // hmr
  const subs = file.is_base ? ['', 'acme.', 'beta.'] : [file.site + '.']
  subs.forEach(subomain => cli.trackHMR(`${subomain}localhost:4000`))
  cli.render()

  await Bun.sleep(50 * Math.random())
  if (count > 70) break
}

