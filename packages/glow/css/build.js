
import { transform, Features } from 'lightningcss'
import { promises as fs } from 'node:fs'


async function minify(names, toname, include=0) {
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


await minify(['glow', 'markers'], 'glow', Features.Nesting)
await minify(['glow', 'markers'], 'glow.modern')
await minify(['glow'], 'glow.nano')

