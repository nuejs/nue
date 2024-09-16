import { nuemarkdown } from '../index.js'
import { promises as fs } from 'node:fs'

const str = await fs.readFile('./test.md', 'utf-8')

console.info(nuemarkdown(str))
