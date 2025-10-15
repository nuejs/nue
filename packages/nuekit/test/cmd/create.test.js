import { create, unzip, getLocalZip, fetchZip } from '../../src/cmd/create'
import { rm, readdir } from 'node:fs/promises'

// suppress console messages
jest.spyOn(console, 'log').mockImplementation(() => {})

afterEach(async () => {
  await rm('minimal', { recursive: true, force: true })
})

test('getLocalZip', async () => {
  const zip = await getLocalZip('minimal', 'cmd')
  expect(await zip.exists()).toBeTrue()
})

test.skip('fetchZip', async () => {
  const zip = await fetchZip('minimal', 'https://nuejs.org')
  expect(zip.status).toBe(200)
})

test('unzip', async () => {
  const dir = 'minimal'
  const zip = await getLocalZip(dir, 'cmd')
  await unzip(dir, zip)
  // read files inside minimal/minimal
  const files = await readdir(`${dir}/${dir}`)
  expect(files.sort()).toEqual(['index.css', 'index.html'])
})

test('create', async () => {
  expect(await create('minimal', { dir: 'cmd' })).toBeTrue()
})
