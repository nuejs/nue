
import { styleText as color } from 'node:util'

const TITLES = { types: 'File types', shared: 'Shared assets', sites: 'Sites' }
const ICONS = { html: '🔵', css: '🟣', js: '🔴' }

const cyan = (text) => color('cyan', '' + text)
const gray = (text) => color('gray', '' + text)


export function createLog({ files, version }) {
  const start = new Date()
  const purge = { progress: 0 }

  function renderPurge() {
    const label = 'CDN purge'.padEnd(35)
    return label + renderProgress()
  }

  function renderProgress(length=40) {

    const progress = purge.finished ? length : purge.progress * 2
    const filled = '█'.repeat(progress)
    const empty = '░'.repeat(length - progress)
    return purge.finished ? gray(filled) : filled + gray(empty)
  }

  function renderSummary() {
    const size = files.reduce((sum, file) => sum + file.size, 0)
    const purgeTime = purge.finished - purge.start
    const totalTime = Date.now() - start
    const ratio = Math.round(purgeTime / totalTime * 100)

    return `Pushed ${files.length} files (${formatSize(size)})` +
      ` in ${ formatTime(totalTime) } • Purge time ${ formatTime(purgeTime) } (${ratio}%)`
  }

  function render() {
    console.clear()

    // header
    const arr = ['', color('magenta', 'nue deploy'), gray(`v${version} • Bun ${Bun.version}`), '']

    // sections
    const cats = categorize(files)

    for (const type in cats) {
      arr.push(TITLES[type], ...renderSection(type, cats[type]), '')
    }

    // purging in progress...
    if (purge.start) arr.push(renderPurge())

    // done
    if (purge.finished) arr.push('', '===', gray(renderSummary()))

    arr.push('', '')

    process.stdout.write(arr.join('\n   ') + '\u001b[2K\r')
  }

  render()

  return {

    fileFinish(file) {
      file.uploaded = true
      render()
    },

    purgeStart() {
      purge.start = Date.now()
      purge.timer = setInterval(() => { purge.progress++; render() }, 250)

    },

    purgeFinish() {
      clearInterval(purge.timer)
      purge.finished = Date.now()
      render()
    },

    render
  }
}

function renderDots(arr) {
  return arr.map(file => color(file.uploaded ? 'green' : 'black', '•')).join(' ')
}

function formatSize(bytes) {
  const kb = bytes / 1024
  return kb < 500 ? `${Math.round(kb)}K` : `${(kb / 1024).toFixed(1)}M`
}

function formatTime(ms) {
  return `${(ms / 1000).toFixed(1)}s`
}

// finished -> green dot
function renderSection(type, data) {
  if (!Object.keys(data)[0]) return []
  const arr = []

  for (let key in data) {
    const items = data[key]
    const label = type == 'types' ? (ICONS[key] || '🟢') + ' ' + key : key
    const count = `(${items.length})`.padEnd(6)
    arr.push(gray(label.padEnd(35) + count + renderDots(items)))
  }


  // length order
  arr.sort((a, b) => b.length - a.length)

  return arr
}

function categorize(files) {
  const result = { types: {}, shared: {}, sites: {} }

  for (const file of files) {
    ;(result.types[file.type] ??= []).push(file)

    const coll = file.is_shared ? result.shared : result.sites
    ;(coll[file.site] ??= []).push(file)
  }

  return result
}