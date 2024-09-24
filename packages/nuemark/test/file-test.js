import { promises as fs } from 'node:fs'

import { nuemarkdown } from '../index.js'


const str = await fs.readFile('./test.md', 'utf-8')
console.info(nuemarkdown(str))
