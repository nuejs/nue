import { promises as fs } from 'node:fs'
import { join } from 'node:path'

import { buildCSS } from '../src/builder.js'
import { getArgs } from '../src/cli.js'
import { create } from '../src/create.js'
import { parsePathParts } from '../src/util.js'

import { toMatchPath } from './match-path.js'
expect.extend({ toMatchPath })

// temporary directory
const root = '_test'


// setup and teardown
beforeEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.mkdir(root, { recursive: true })
})

afterEach(async () => await fs.rm(root, { recursive: true, force: true }))

async function write(filename, code) {
  const file = join(root, filename)
  await fs.writeFile(file, code)
  return file
}


test('CSS errors', async () => {
  const code = 'body margin: 0 }'
  const filepath = await write('lcss.css', code)

  // lcss
  try {
    await buildCSS(filepath, true, undefined, true)
  } catch (e) {
    expect(e.lineText).toBe(code)
    expect(e.line).toBe(1)
  }

  // bcss
  try {
    await buildCSS(filepath, true)
  } catch (e) {
    expect(e.lineText).toBe(code)
    expect(e.line).toBe(1)
  }
})

test('CSS @import bundling', async () => {
  const code = 'body { margin: 0 }'
  const filename = 'cssimport.css'
  await write(filename, code)
  const filepath = await write('lcss.css', `@import "${filename}"`)

  const lcss = await buildCSS(filepath, true, undefined, true)
  const bcss = await buildCSS(filepath, true)

  const min = code.replace(/\s/g, '')
  expect(lcss).toContain(min)
  expect(bcss).toContain(min)
})

test('CSS', async () => {
  const code = 'body { margin: 0 }'
  const filepath = await write('lcss.css', code)

  const lcss = await buildCSS(filepath, true, undefined, true)
  const bcss = await buildCSS(filepath, true)

  const min = code.replace(/\s/g, '')
  expect(lcss).toContain(min)
  expect(bcss).toContain(min)
})

test('CLI args', () => {
  const args = getArgs(['nue', 'build', '--verbose', '-pnve', 'joku.yaml'])
  expect(args.env).toBe('joku.yaml')
  expect(args.dryrun).toBe(true)
  expect(args.verbose).toBe(true)
})


test('path parts', () => {
  const parts = parsePathParts('docs/glossary/semantic-css.md')
  expect(parts.url).toBe('/docs/glossary/semantic-css.html')
  expect(parts.dir).toMatchPath('docs/glossary')
  expect(parts.basedir).toMatchPath('docs')
  expect(parts.slug).toBe('semantic-css.html')
})

test('create', async () => {
  const terminate = await create({ root, name: 'test' })
  terminate()

  const contents = await fs.readdir(root)
  expect(contents).toContain('index.md') // should be unpacked to correct dir
  expect(contents).toContain('.dist') // should be built
}, 10_000)
