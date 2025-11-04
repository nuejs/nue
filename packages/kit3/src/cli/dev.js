
import { styleText as color } from 'node:util'

const ICONS = { yaml: '🟡', js: '🔴', ts: '⚫', html: '🔵', md: '🟢', css: '🟣', }

const cyan = (text) => color('cyan', '' + text)
const gray = (text) => color('gray', '' + text)

export function createLog({ interval=60*1000, version, port, silent }) {
  const sections = { Files: {}, Sites: {}, HMR: {} }
  const totals = { updates: 0, removes: 0, hmr: 0 }
  const times = { start: new Date(), devtime: 0, lastmod: new Date() }
  const min = 60 * 1000
  let latest

  function incr(title, name) {
    const coll = sections[title]
    coll[name] = (coll[name] ?? 0) + 1
  }

  function addup(key, file) {
    times.lastmod = Date.now()
    latest = file
    totals[key]++
  }

  function renderLastFile(file) {
    const age = Date.now() - times.lastmod
    const ago = age >= min/2 ? timeElapsed(age) + ' ago' : 'Just now'
    // ICONS[file.type] +
    return ago + ': ' + cyan(file.path) + ' ' + gray('=>')
  }

  function renderSection(title, data, max) {
    if (!Object.keys(data)[0]) return []
    const dot = '•' + (max < 25 ? '  ' : max < 50 ? ' ' : '')
    const arr = []

    for (let label in data) {
      const am = data[label]

      if (title == 'Files') label = ICONS[label.toLowerCase()] + ' ' + label
      const max_dots = Math.min(am, 110)
      const count = `(${am})`.padEnd(6)
      arr.push(gray(label.padEnd(25) + cyan(count) + dot.repeat(max_dots)))
    }

    // length order
    arr.sort((a, b) => b.length - a.length)

    return ['', title, ...arr]
  }

  function renderSummary() {
    const { updates, removes, hmr } = totals
    const cols = []
    if (updates) cols.push(`${ updates } files updated`)
    if (removes) cols.push(` • ${ removes } deleted`)
    if (hmr) cols.push(` • ${ hmr } HMR calls`)

    // times
    const { uptime, devtime, devratio } = times
    if (uptime >= min) cols.push(` | ${ timeElapsed(uptime) } uptime`)
    if (devtime >= min) cols.push(` • ${ timeElapsed(devtime) } devtime (${ devratio }%)`)

    return gray(cols.join(''))
  }

  // times
  function updateTimes() {
    const { start, lastmod, devtime } = times
    const now = Date.now()
    times.uptime = now - start

    if (lastmod && now - lastmod < interval) {
      times.devtime += interval
    }

    times.devratio = Math.floor(times.devtime / times.uptime * 100)
  }

  const timer = setInterval(() => { updateTimes(); render() }, interval)

  // render all
  function render() {
    if (silent) return

    console.clear()

    // header
    const arr = ['', color('magenta', 'nue dev'), gray(`v${version} • Bun ${Bun.version}`), '']

    // latest file
    if (latest) {
      arr.push(renderLastFile(latest))

      // sections
      const biggest = Math.max(...Object.values(sections).flatMap(obj => Object.values(obj)))

      for (const title in sections) {
        arr.push(...renderSection(title, sections[title], biggest))
      }

      // separator line
      arr.push('', '===')

      // summary
      arr.push(renderSummary(), '', '')

    } else {
      arr.push('Watching for changes...', '')
      arr.push(cyan(`<sitename>.localhost:${ port }`), '', '')
    }

    process.stdout.write(arr.join('\n   '))

  }

  function muteCursor(p) {
    p.stdin.setRawMode(true)

    p.stdin.on('data', (char) => {
      if (char[0] == 3) { p.stdout.write('\u001b[2K\r'); p.exit(0) }
    })
  }

  muteCursor(process)

  render()

  return {

    // Example: { site: 'acme', type: 'yaml', path: 'site.yaml' }
    trackUpdate(file) {
      const { type, site } = file
      incr('Files', type.toUpperCase())
      incr('Sites', site)
      addup('updates', file)
    },

    // Example: acme.localhost:4000
    trackHMR(host) {
      incr('HMR', host)
      totals.hmr++
    },

    trackRemove(file) {
      addup('removes', file)
      render()
    },

    render
  }
}


function timeElapsed(ms) {
  const sec = Math.floor(ms / 1000)
  const hour = Math.floor(sec / 3600)
  const min = Math.floor((sec % 3600) / 60)
  return hour ? `${hour}h ${min}m` : `${min}m`
}


