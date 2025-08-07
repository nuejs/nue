
import { testDir, write, writeAll, removeAll } from './test-utils'
import { readAssets } from '../src/assets'

afterAll(async () => await removeAll())

test('caching', async () => {

  const paths = await writeAll([
    ['site.yaml', { foo: true }],
    ['blog/app.yaml', { bar: true }],
    ['blog/index.md', '# Hello'],
  ])

  const { assets } = await readAssets(testDir, paths)
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
  expect(await page.data()).toEqual({ foo: true })
})


test('Other assets', async () => {
  const paths = await writeAll([
    ['index.html', '<!doctype dhtml><app/>'],
    ['base.css', '/* CSS */\ body { }'],
  ])

  const { assets } = await readAssets(testDir, paths)
  expect(await assets.get('base.css').render(true)).toBe('body{}')
  const ret = await assets.get('index.html').render()
  expect(Object.keys(ret)).toEqual(['is_spa', 'js', 'html'])
})