import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse } from '../src/compile.js'

const genIndex = (name) => `
<meta charset="utf-8"> 
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="../../client/test.css">

<h1>${name}</h1>

<div id="container"></div>

<script type="module">
import createApp from '../../../src/browser/nue.js';
import { lib } from './index.js';
const [App, ...deps] = lib
createApp(App, {}, deps).mount(container)
</script>
`

const srcdir = dirname(fileURLToPath(import.meta.url))

// Ensure the dist directory exists
const distDir = join(srcdir, 'dist')
mkdirSync(distDir, { recursive: true })

// Compile test files
const testComponentDirs = readdirSync(srcdir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('test-'))
  .map(dirent => ({ testPath: join(srcdir, dirent.name), name: dirent.name }))

for (const { testPath, name } of testComponentDirs) {
  const componentPath = join(testPath, 'component.dhtml')

  // Skip if component.dhtml doesn't exist
  if (!existsSync(componentPath)) {
    console.log(`Skipping ${name}: No component.dhtml found`)
    continue
  }

  const source = readFileSync(componentPath, 'utf-8')
  const { components } = parse(source)

  // Create output directory
  const outputDir = join(distDir, name)
  mkdirSync(outputDir, { recursive: true })

  const outputPath = join(outputDir, 'index.js')
  const output = `export const lib = [${components.join(',')}]`
  writeFileSync(outputPath, output)

  writeFileSync(join(outputDir, 'index.html'), genIndex(name))

  console.log(`Compiled ${name}: ${outputPath}`)
}
