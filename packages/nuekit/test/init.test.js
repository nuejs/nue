
import { mkdir, rm, readdir } from 'node:fs/promises'
import { testDir, removeAll }from './test-utils.js'
import { initDir, deployClient, resolvePath } from '../src/init.js'

beforeEach(async () => { await mkdir(testDir, { recursive: true }) })
afterEach(async () => { await removeAll() })


test('dev client files', async () => {
  await deployClient(testDir)
  const files = await readdir(testDir)
  expect(files.sort()).toEqual([
    "error.js", "favicon.ico", "hotreload.js", "mounter.js", "router.js"
  ])
})


test.only('prod client files', async () => {
  await deployClient(testDir, true)
  const files = await readdir(testDir)
  console.info(files)
  // expect(files.length).toBeGreaterThan(4)
})