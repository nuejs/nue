
import { join } from 'node:path'
import { mkdir, rm, readdir } from 'node:fs/promises'
import { testDir, removeAll }from './test-utils.js'
import { initDir, deployClient, deployPackage } from '../src/init.js'

beforeEach(async () => { await mkdir(testDir, { recursive: true }) })
afterEach(async () => { await removeAll() })


test('deployPackage', async () => {
  await deployPackage('nuedom/src/nue.js', testDir, true)
  const file = Bun.file(join(testDir, 'nue.js'))
  expect(await file.exists()).toBeTrue()
})

test('initDir', async () => {
  const dir = await initDir(testDir)
  expect(dir).toEndWith('@nue')
})


test('dev client files', async () => {
  await deployClient(testDir)
  const files = await readdir(testDir)
  expect(files.sort()).toEqual([
    "error.js", "favicon.ico", "hotreload.js", "mount.js", "router.js"
  ])
})


test('prod client files', async () => {
  await deployClient(testDir, true)
  const files = await readdir(testDir)
  expect(files.length).toBeGreaterThan(4)
})
