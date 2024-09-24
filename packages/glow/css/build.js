// Running: bun css/build.js
import { promises as fs } from 'node:fs'

import { transform, Features } from 'lightningcss'


async function minify(names, toname, include = 0) {
  const raw = []
  for (const name of names) {
    raw.push(await fs.readFile(`css/${name}.css`, 'utf-8'))
  }

  const min = transform({
    code: Buffer.from(raw.join('\n')),
    minify: true,
    include

  }).code?.toString()

  const to = `minified/${toname}.css`
  await fs.writeFile(to, min)
  console.log('>', to, min.length)
}


await minify(['syntax', 'markers'], 'syntax', Features.Nesting)
await minify(['syntax'], 'syntax.nano', Features.Nesting)

