
import { create, unzip, getLocalZip, fetchZip } from '../../src/cmd/create'
import { rm, readdir } from 'node:fs/promises'

const testdir = import.meta.dirname

// suppress console messages
jest.spyOn(console, 'log').mockImplementation(() => {})

afterEach(async () => {
  await rm('minimal', { recursive: true, force: true })
})

test('getLocalZip', async () => {
  const zip = await getLocalZip('minimal', testdir)
  expect(await zip.exists()).toBeTrue()
})

test.skip('fetchZip', async () => {
  const zip = await fetchZip('minimal', 'https://nuejs.org')
  expect(zip.status).toBe(200)
})

test('unzip', async () => {
  const dir = 'minimal'
  const zip = await getLocalZip(dir, testdir)
  await unzip(dir, zip)
  const files = await readdir(dir)
  expect(new Set(files)).toEqual(new Set(["index.html", "index.css"]))
})

test('create', async () => {
  expect(await create('minimal', { dir: testdir })).toBeTrue()
})
