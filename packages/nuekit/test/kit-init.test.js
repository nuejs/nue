import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { initNueDir } from '../src/init.js'

// temporary directory
const dist = '_test'

// setup and teardown
beforeAll(async () => {
  await fs.rm(dist, { recursive: true, force: true })
  await fs.mkdir(dist)
})

afterAll(async () => await fs.rm(dist, { recursive: true, force: true }))

test('bun init', async () => {
  await initNueDir({ dist, is_dev: true })
  const names = await fs.readdir(join(dist, '@nue'))
  expect(names.length).toBe(11)
})

test('esbuild init', async () => {
  await initNueDir({ dist, is_dev: true, esbuild: true })
  const names = await fs.readdir(join(dist, '@nue'))
  expect(names.length).toBe(11)
})
