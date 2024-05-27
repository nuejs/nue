import { match } from '../src/browser/app-router.js'

import { parsePathParts, sortCSS } from '../src/util.js'
import { lightningCSS } from '../src/builder.js'
import { create } from '../src/create.js'
import { getArgs } from '../src/cli.js'

import { toMatchPath } from './match-path.js'

import { promises as fs } from 'node:fs'
import { join } from 'node:path'

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


test('Lightning CSS errors', async () => {
  const code = 'body margin: 0 }'
  const filename = await write('lcss.css', code)

  try {
    await lightningCSS(filename, true)
  } catch (e) {
    expect(e.lineText).toBe(code)
    expect(e.line).toBe(1)
  }
})

test('Lightning CSS', async () => {
  const code = 'body { margin: 0 }'
  const filename = await write('lcss.css', code)

  const css = await lightningCSS(filename, true)
  expect(css).toBe(code.replace(/\s/g, ''))
})

test('CLI args', () => {
  const args = getArgs(['nue', 'build', '--verbose', '-pnve', 'joku.yaml'])
  expect(args.env).toBe('joku.yaml')
  expect(args.dryrun).toBe(true)
  expect(args.verbose).toBe(true)
})

test('app router', async () => {
  expect(match('/fail/:id', '/users/20')).toBeNull()
  expect(match('/users/:id/edit', '/users/20')).toBeNull()
  expect(match('/users/:id', '/users/20')).toEqual({ id: 20 })
  expect(match('/:view/:id', '/users/20')).toEqual({ id: 20, view: 'users' })
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
})
