
import { readData, parseDirs, createFile, createAsset, createAssets } from '../src/assets.js'
import { testDir, write, writeAll, removeAll } from './test-utils.js'
import { join } from 'node:path'

test('parseDirs', () => {
  expect(parseDirs('')).toEqual(['.'])
  expect(parseDirs('blog')).toEqual(['blog'])
  expect(parseDirs('news/entry')).toEqual(['news', 'news/entry'])
})

test('readData', async () => {
  const files = [
    { path: 'site.yaml', async read() { return 'site: true' } },
    { path: 'blog/app.yaml', async read() { return 'app: true' } },
    { path: 'docs/app.yaml', async read() { return 'docs: true' } },
  ]

  const data = await readData('blog/entry/index.md', files)
  expect(data).toEqual({ site: true, app: true, use: [] })
})

test('use array', async () => {
  const files = [
    { path: 'site.yaml', async read() { return 'use: [foo]' } },
    { path: 'blog/app.yaml', async read() { return 'use: [bar]' } },
  ]

  const data = await readData('blog/entry/index.md', files)
  expect(data.use).toEqual([ "foo", "bar" ])
})

test('createAsset', async () => {
  const file = { dir: 'blog', ext: '.md', path: 'blog/index.md' }
  const files = [
    { path: '@system/design/base.css', async read() { return '' } },
    { path: 'site.yaml', async read() { return 'use: [ design/* ]' } },
  ]

  const asset = createAsset(file, files)

  expect(asset).toMatchObject({ dir: "blog", ext: ".md", path: "blog/index.md" })
  expect(await asset.deps()).toEqual([ "@system/design/base.css" ])
  expect(asset.is_md).toBeTrue()

})


test('createFile', async () => {
  const path = await write('@system/model/index.ts', '// hello')
  const file = await createFile(testDir, path)

  expect(file).toMatchObject({
    path: '@system/model/index.ts',
    dir: '@system/model',
    basedir: '@system',
    base: 'index.ts',
    name: 'index',
    ext: '.ts',
  })

  expect(file.mtime).toBeInstanceOf(Date)
  expect(await file.read()).toBe('// hello')

  // copy operation
  await file.copy(join(testDir, '.dist'))
  expect(await Bun.file(join(testDir, '.dist', file.path)).exists()).toBeTrue()

  await removeAll()
})


test('createAssets', async () => {
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
  await write('blog/app.yaml', { bar: false })
  expect(await page.data()).toMatchObject({ foo: true, bar: true })

  // update -> flush cache
  assets.update('blog/app.yaml')
  expect(await page.data()).toMatchObject({ foo: true, bar: false })

  // remove -> update cache
  assets.remove('blog/app.yaml')
  expect(await page.data()).toEqual({ foo: true, use: [] })

  await removeAll()
})