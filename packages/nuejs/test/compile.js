import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { parse } from '../src/compile.js'
import { getDirname } from './test-utils.js'

const srcdir = getDirname(import.meta.dirname)

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

  console.log(`Compiled ${name}: ${outputPath}`)
}
