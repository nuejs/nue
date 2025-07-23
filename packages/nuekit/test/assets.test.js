
import { readData, parseDirs, createFile, createAsset, createAssets, toURL } from '../src/assets.js'
import { testDir, write, writeAll, removeAll } from './test-utils.js'
import { join, parse } from 'node:path'

test('parseDirs', () => {
  expect(parseDirs('')).toEqual(['.'])
  expect(parseDirs('blog')).toEqual(['blog'])
  expect(parseDirs('news/entry')).toEqual(['news', 'news/entry'])
})

test('toURL', () => {
  expect(toURL(parse('index.md'))).toBe('/')
  expect(toURL(parse('blog/index.html'))).toBe('/blog/')
  expect(toURL(parse('docs/installation.md'))).toBe('/docs/installation')
  expect(toURL(parse('@system/design/base.css'))).toBe('/@system/design/base.css')
  expect(toURL(parse('site.yaml'))).toBe('/site.yaml')
})

test('readData', async () => {
  const files = [
    { path: 'site.yaml', async text() { return 'site: true' } },
    { path: 'blog/app.yaml', async text() { return 'app: true' } },
    { path: 'docs/app.yaml', async text() { return 'docs: true' } },
  ]

  const data = await readData('blog/entry/index.md', files)
  expect(data).toEqual({ site: true, app: true, use: [] })
})

test('use array', async () => {
  const files = [
    { path: 'site.yaml', async text() { return 'use: [foo]' } },
    { path: 'blog/app.yaml', async text() { return 'use: [bar]' } },
  ]

  const data = await readData('blog/entry/index.md', files)
  expect(data.use).toEqual([ "foo", "bar" ])
})

test('createFile', async () => {
  const path = await write('@system/model/index.ts', '// hello')
  const file = await createFile(testDir, path)

  expect(file).toMatchObject({
    fullpath: 'test_dir/@system/model/index.ts',
    path: '@system/model/index.ts',
    dir: '@system/model',
    basedir: '@system',
    base: 'index.ts',
    name: 'index',
    is_ts: true,
    ext: '.ts',
  })

  expect(file.mtime).toBeInstanceOf(Date)
  expect(await file.text()).toBe('// hello')

  // copy operation
  await file.copy(join(testDir, '.dist'))
  expect(await Bun.file(join(testDir, '.dist', file.path)).exists()).toBeTrue()

  await removeAll()
})


test('createAsset', async () => {
  const files = [
    { path: 'blog/index.html', dir: 'blog', ext: '.html' },
    { path: '@system/design/base.css', async text() { return '' } },
    { path: 'site.yaml', async text() { return 'use: [ design/*, view/* ]' } },
  ]

  const file = createAsset(files[0], files)
  const assets = await file.assets()
  expect(assets.length).toEqual(2)
  expect(assets[0].path).toEqual('@system/design/base.css')
})


test('asset update & remove', async () => {
  const paths = await writeAll([
    ['site.yaml', { foo: true }],
    ['blog/app.yaml', { bar: true }],
    ['blog/index.md', '# Hello'],
  ])

  const assets = await createAssets(testDir, paths)
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

  await removeAll()
})

test('asset.serverComponents()', async () => {

  const paths = await writeAll([
    ['blog/index.md', '# Hello'],
    ['blog/header.html', '<header/>'],
    ['blog/footer.html','<footer/>'],
  ])

  const assets = await createAssets(testDir, paths)
  const comps = await assets[0].serverComponents()
  expect(comps).toEqual([{ tag: "header" }, {tag: "footer" }])

  await removeAll()
})
