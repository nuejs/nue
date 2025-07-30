
import { version, getSystemFiles, createSystemFiles } from '../src/system'
import { testDir, removeAll } from './test-utils'

test('version', () => {
  expect(version).not.toBeNull()
})

test('get system files', async () => {

  // dev files
  expect(getSystemFiles().length).toBe(6)

  // production files
  const files = getSystemFiles(true)
  expect(files.length).toBe(4)

  // render
  const js = await files[0].render()
  expect(js.length).toBeGreaterThan(1000)
})

test('get system files', async () => {
  const files = await createSystemFiles(testDir, true)
  expect(files.length).toBe(4)
  expect(await createSystemFiles(testDir)).toBeFalse()
  await removeAll()
})