
import { styleText } from 'node:util'

const margin = '   '
const nl = '\n'

function renderBar(current, amount, width = 24) {
  if (!amount) return styleText('gray', '[') + ' '.repeat(width) + styleText('gray', ']') + ' 0%'
  const filled = Math.round(width * current / amount)
  const bar = styleText('cyan', '•'.repeat(filled)) + ' '.repeat(width - filled)
  const percent = Math.round((current / amount) * 100)
  return styleText('gray', '[') + bar + styleText('gray', ']') + ` ${percent}%`
}

function renderRow(row) {
  const label = styleText('gray', row.label.padEnd(25))
  const bar = renderBar(row.current, row.amount)
  const duration = row.endTime ? styleText('magenta', ` ${row.endTime - row.startTime}ms`) : ''
  return label + bar + duration
}

function renderAll(state, is_done) {
  console.clear()
  const header = styleText('bold', is_done ? 'Deploy finished' : 'Deploying files') + nl
  const lines = [ header, ...state.rows.map(row => renderRow(row)) ]

  let output = nl + margin + lines.join(nl + margin) + nl + nl
  if (is_done) output += renderSummary(state)

  process.stdout.write(output + nl + nl)
}

function renderSummary({ startTime, rows }) {
  const data = [
    { label: 'Files deployed', value: getFileCount(rows) },
    { label: 'URLs purged', value: rows.find(el => el.files).files },
    { label: 'Total time', value: (Date.now() - startTime) + 'ms' },
  ]

  const lines = data.map(el => {
    return margin + el.label.padEnd(25) + styleText('magenta', '' + el.value)
  })

  return lines.join(nl)
}

function getFileCount(rows) {
  return rows.reduce((sum, el) => el.name ? sum + el.amount : sum, 0)
}

export function createProgress(items) {
  const state = {
    rows: items.map(row => ({ ...row, current: 0 })),
    startTime: Date.now()
  }
  renderAll(state)

  return {
    update(name) {
      const row = state.rows.find(r => r.name == name)
      if (!row) return
      row.startTime ??= Date.now()
      row.current = (row.current || 0) + 1
      if (row.current >= row.amount) row.endTime = Date.now()
      renderAll(state)
    },
    finish() {
      renderAll(state, true)
    }
  }
}
