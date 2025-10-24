
import { styleText } from 'node:util'

// rendering helpers
function renderBar(current, total, width = 24) {
  if (!total) return styleText('gray', '[') + ' '.repeat(width) + styleText('gray', ']') + ' 0%'
  const filled = Math.round(width * current / total)
  const bar = styleText('cyan', '•'.repeat(filled)) + ' '.repeat(width - filled)
  const percent = Math.round((current / total) * 100)
  return styleText('gray', '[') + bar + styleText('gray', ']') + ` ${percent}%`
}

function renderDuration(startTime, endTime) {
  if (!endTime || !startTime) return ''
  return styleText('magenta', ` ${endTime - startTime}ms`)
}

function renderLabel(label) {
  return styleText('gray', label.padEnd(25))
}

function renderRow(row) {
  return renderLabel(row.label) + renderBar(row.current, row.total) + renderDuration(row.startTime, row.endTime) + '\n'
}

// output
function clear() {
  process.stdout.write('\x1b[H\x1b[J')
}

function render(state, done) {
  clear()
  const totalTime = Date.now() - state.startTime

  // header
  const header = styleText(['white', 'bold'], done ? 'Deploy finished' : 'Deploying 32 files')
  process.stdout.write('\n    ' + header + '\n\n')

  // rows
  state.rows.forEach(row => {
    process.stdout.write('    ' + renderRow(row))
  })

  // footer
  process.stdout.write('\n')
  if (done) {
    process.stdout.write('    ' + styleText(['white', 'bold'], 'Total time ') + styleText('magenta', `${totalTime}ms`) + '\n\n')
  }
}

export function createProgress(sites) {
  const state = {
    rows: sites.map(row => ({ ...row, current: 0 })),
    startTime: Date.now()
  }

  render(state)

  function update(sitename) {
    const row = state.rows.find(r => r.site == sitename)
    if (!row) return

    row.startTime ??= Date.now()
    row.current = (row.current || 0) + 1
    if (row.current >= row.total) row.endTime = Date.now()
    render(state)
  }

  function finish() {
    render(state, true)
  }

  return { update, finish }
}