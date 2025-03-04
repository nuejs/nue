import fs from 'node:fs'
import path from 'node:path'
import { parse } from '../src/compile.js'

// Ensure the dist directory exists
const distDir = path.join(process.cwd(), 'packages', 'nuejs', 'test', 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// Compile browser test files
const browserTestDir = path.join(process.cwd(), 'packages', 'nuejs', 'test')
const testDirs = fs
  .readdirSync(browserTestDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'node_modules')
  .map(dirent => dirent.name)

for (const testDir of testDirs) {
  const componentPath = path.join(browserTestDir, testDir, 'component.dhtml')

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

// Compile client test files
const clientTestDir = path.join(process.cwd(), 'packages', 'nuejs', 'test', 'client')
if (fs.existsSync(clientTestDir)) {
  const clientTestFiles = fs.readdirSync(clientTestDir).filter(file => file.endsWith('.dhtml'))

  for (const file of clientTestFiles) {
    const filePath = path.join(clientTestDir, file)
    const source = fs.readFileSync(filePath, 'utf-8')
    const { components } = parse(source)

    const baseName = path.basename(file, '.dhtml')
    const outputPath = path.join(distDir, `${baseName}.js`)

    const output = `export const lib = [${components.join(',')}]`
    fs.writeFileSync(outputPath, output)

    console.log(`Compiled ${file} to ${outputPath}`)
  }
}

console.log('All files compiled successfully!')
