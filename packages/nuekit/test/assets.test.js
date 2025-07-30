
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
  expect(await page.data()).toEqual({ foo: true, use: [] })
})

test('HTML assets', async () => {

  const paths = await writeAll([
    ['hello.md', '# Hello'],
    ['index.html', '<!doctype dhtml> <body/> <helper/>'],
    ['header.html', '<header/> <navi/>'],
    ['footer.html','<footer/>'],
    ['components.html','<!doctype dhtml> <users/> <user/>'],
    ['join.html', '<!doctype html> <join/>'],
  ])

  const { assets } = await readAssets(testDir, paths)
  const [ page, spa ] = assets

  expect(await page.isDHTML()).toBeFalse()

  const comps = await page.components()
  expect(comps.map(el => el.tag).sort()).toEqual(['footer', 'header', 'join', 'navi'])

  expect(await spa.isSPA()).toBeTrue()

  expect((await spa.components()).map(el => el.tag)).toEqual(['body', 'helper', 'users', 'user'])

  // cache test
  await write('header.html', '<custom/>')
  await Bun.file(`${testDir}/footer.html`).delete()
  expect((await page.components()).length).toBe(4)

  assets.update('header.html')
  assets.remove('footer.html')
  expect((await page.components()).length).toBe(2)

  // render
  const html = await assets[0].render()
  expect(html).toInclude('<!doctype html>')

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