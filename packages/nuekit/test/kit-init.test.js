import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { init } from '../src/init.js'

// temporary directory
const root = '_test'

// setup and teardown
beforeAll(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.mkdir(root, { recursive: true })
})
afterAll(async () => await fs.rm(root, { recursive: true, force: true }))

test('init dist/@nue dir', async () => {
  await init({ dist: root, is_dev: true, esbuild: false })
  const names = await fs.readdir(join(root, '@nue'))
  expect(names.length).toBeGreaterThan(7)
})
