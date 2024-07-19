

import { match } from '../src/browser/app-router.js'
import { getParts, sortCSS } from '../src/util.js'
import { lightningCSS } from '../src/builder.js'
import { renderHead } from '../src/layout.js'
import { getArgs } from '../src/cli.js'
import { promises as fs } from 'node:fs'

import { toMatchPath } from './match-path.js'
import { join } from 'node:path'

expect.extend({ toMatchPath })

// temporary directory
const dist = '_test'

// setup and teardown
beforeAll(async () => {
  await fs.rm(dist, { recursive: true, force: true })
  await fs.mkdir(dist)
})

afterAll(async () => await fs.rm(dist, { recursive: true, force: true }))

async function writeCSS(code, filename='lcss.css') {
  const filepath = join(dist, filename)
  await fs.writeFile(filepath, code)
  return filepath
}

test('Lightning CSS errors', async () => {
  const code = 'body margin: 0 }'
  const filepath = await writeCSS(code)

  try {
    await lightningCSS(filepath, true)
  } catch (e) {
    expect(e.lineText).toBe(code)
    expect(e.line).toBe(1)
  }
})

test('Lightning CSS @import bundling', async () => {
  const code = 'body { margin: 0 }'
  const filename = 'cssimport.css'
  await writeCSS(code, filename)
  const filepath = await writeCSS(`@import "${filename}"`)

  const css = await lightningCSS(filepath, true)
  expect(css).toBe(code.replace(/\s/g, ''))
})

test('Lightning CSS', async () => {
  const code = 'body { margin: 0 }'
  const filepath = await writeCSS(code)

  const css = await lightningCSS(filepath, true)
  expect(css).toBe(code.replace(/\s/g, ''))
})

test('CLI args', () => {
  const args = getArgs(['nue', 'build', '--verbose', '-pnve', 'joku.yaml'])
  expect(args.env).toBe('joku.yaml')
  expect(args.dryrun).toBe(true)
  expect(args.verbose).toBe(true)
})

test('head', () => {
  const head = renderHead({ charset: 'foo', title: 'Hey', preload_image: 'hey.png' })
  expect(head).toInclude('meta charset="foo"')
  expect(head).toInclude('<title>Hey</title>')
  expect(head).toInclude('<link rel="preload" as="image" href="hey.png">')
})

test('app router', async () => {
  expect(match('/fail/:id', '/users/20')).toBeNull()
  expect(match('/users/:id/edit', '/users/20')).toBeNull()
  expect(match('/users/:id', '/users/20')).toEqual({ id: 20 })
  expect(match('/:view/:id', '/users/20')).toEqual({ id: 20, view: 'users' })
})

test('path parts', () => {
  const parts = getParts('docs/glossary/semantic-css.md')
  expect(parts.url).toBe('/docs/glossary/semantic-css.html')
  expect(parts.dir).toMatchPath('docs/glossary')
  expect(parts.appdir).toMatchPath('docs')
  expect(parts.slug).toBe('semantic-css.html')
})

