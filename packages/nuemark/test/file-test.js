
import { nuemarkdown } from '../index.js'
import { promises as fs } from 'node:fs'

const opts = {}

try {
  const nuecolor = await import('nuecolor')
  opts.highlight = nuecolor.default
} catch {}

const str = await fs.readFile('./test.md', 'utf-8')

console.info(nuemarkdown(str, opts))