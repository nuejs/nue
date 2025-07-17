
import { version } from '../package.json' with { type: 'json' }
const year = new Date().getFullYear()

const banner = `/**
 * Nue v${version} - Copyright (c) ${year} Tero Piirainen and contributors
 *
 * Licensed under the MIT License
 */`

for (const name of ['nue', 'nue-jit']) {
  try {
    const result = await Bun.build({
      entrypoints: [`src/${name}.js`],
      naming: `[dir]/${name}.js`,
      target: 'browser',
      outdir: 'dist',
      minify: true,
      banner
    })

    if (result.success) console.info(`Minified dist/${name}.js`)
    else {
      console.error('Build failed:')
      result.logs.forEach(log => console.error(log))
      process.exit(1)
    }

  } catch (err) {
    console.error(`Bundling error: ${err.message}`)
    console.info(err)
    process.exit(1)
  }
}
