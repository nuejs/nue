import fs from 'node:fs'
import path from 'node:path'
import { parse } from '../src/compile.js'

// Ensure the dist directory exists
const distDir = path.join(process.cwd(), 'packages', 'nuejs', 'test', 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// Compile test files
const testDir = path.join(process.cwd(), 'packages', 'nuejs', 'test')
const testComponentDirs = fs
  .readdirSync(testDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('test-'))
  .map(dirent => dirent.name)

for (const testDir of testComponentDirs) {
  const componentPath = path.join(testDir, 'component.dhtml')

  // Skip if component.dhtml doesn't exist
  if (!fs.existsSync(componentPath)) {
    console.log(`Skipping ${testDir}: No component.dhtml found`)
    continue
  }

  const source = fs.readFileSync(componentPath, 'utf-8')
  const { components } = parse(source)

  // Create output directory
  const outputDir = path.join(distDir, testDir)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, 'index.js')
  const output = `export const lib = [${components.join(',')}]`
  fs.writeFileSync(outputPath, output)

  console.log(`Compiled ${testDir}/component.dhtml to ${outputPath}`)
}
