// Running: bun css/build.js
import { promises as fs } from 'node:fs'

async function minify(names, toname) {
  const min = await (await Bun.build({
    entrypoints: names.map(name => `css/${name}.css`),
    minify: true,
    throw: true,
    experimentalCss: true,
  })).outputs.map(async file => await file.text())

  const to = `minified/${toname}.css`
  await fs.mkdir('minified', { recursive: true })
  await fs.writeFile(to, min)
  console.log('>', to, (await fs.stat(to)).size)
}


await minify(['syntax', 'markers'], 'syntax')
await minify(['syntax'], 'syntax.nano')

