// Running: bun css/build.js
import { promises as fs } from 'node:fs'

async function minify(names, toname) {
  const raw = []
  for (const name of names) {
    raw.push(await fs.readFile(`css/${name}.css`, 'utf-8'))
  }

  const filename = 'tmp.css'
  await fs.writeFile(filename, raw.join('\n'))

  const min = await (await Bun.build({
    entrypoints: [filename],
    minify: true,
    throw: true,
  })).outputs[0].text()

  await fs.rm(filename)

  const to = `minified/${toname}.css`
  await fs.writeFile(to, min)
  console.log('>', to, min.length)
}


await minify(['syntax', 'markers'], 'syntax')
await minify(['syntax'], 'syntax.nano')

