
import { promises as fs } from 'node:fs'
import { nuemarkdown } from '..'

const opts = {}

try {
  const nuecolor = await import('nuecolor')
  opts.highlight = nuecolor.default
} catch {}

const str = await fs.readFile('./test.md', 'utf-8')

console.info(nuemarkdown(str, opts))