#!/usr/bin/env node

/*
  Minifies source files into a single executable: dist/nue.js
*/

import { promises as fs } from 'node:fs'
import { join } from 'node:path'


try {
  let Bundler = process.isBun ? Bun : await import('esbuild')

  // recursive forces creation
  await fs.mkdir('dist', { recursive: true })

  // minify (with Bun or esbuild)
  await Bundler.build({
    entryPoints: [join('src', 'nue.js')],
    outdir: 'dist',
    format: 'esm',
    minify: true,
    bundle: true,
  })

  console.log('Minified Nue to dist/nue.js with', process.isBun ? 'Bun' : 'ESBuild')

} catch (e) {
  console.log('No bundler found. Please install Bun or ESbuild')

}