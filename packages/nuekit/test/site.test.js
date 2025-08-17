
import { testDir, write, writeAll, removeAll } from './test-utils'
import { readAssets } from '../src/site'

afterAll(async () => await removeAll())

test('caching', async () => {

  const paths = await writeAll([
    ['site.yaml', { foo: true }],
    ['blog/app.yaml', { bar: true }],
    ['blog/index.md', '# Hello'],
  ])

  const { assets } = await readAssets(testDir)
  expect(assets.length).toBe(3)

  // page data
  const page = assets[2]
  expect(await page.data()).toMatchObject({ foo: true, bar: true })

  // data should be cached
  await write('blog/app.yaml', { bar: 100 })
  expect(await page.data()).toMatchObject({ foo: true, bar: true })

  // update -> flush cache
  assets.update('blog/app.yaml')
  expect(await page.data()).toMatchObject({ foo: true, bar: 100 })

  // remove -> update cache
  assets.remove('blog/app.yaml')
  expect(await page.data()).toEqual({ foo: true, is_prod: undefined })
})


