
import { join, parse } from 'node:path'

import { readGlobalData, readAppData, parseDirs, createAsset } from '../src/asset'
import { testDir, write, writeAll, removeAll } from './test-utils'
import { createFile, toURL } from '../src/file'

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

test('readGlobalData', async () => {
  const files = [
    { is_yaml: true, dir: '@system/data', async text() { return 'foo: 1' } },
    { is_yaml: true, dir: '@system/data', async text() { return 'bar: 1' } },
    { dir: '@system/data', async text() { return 'baz: 1' } },
  ]
  expect(await readGlobalData(files)).toEqual({ foo: 1, bar: 1 })
})

test('readAppData', async () => {
  const files = [
    { path: 'site.yaml', async text() { return 'site: true' } },
    { path: 'blog/app.yaml', async text() { return 'app: true' } },
    { path: 'docs/app.yaml', async text() { return 'docs: true' } },
  ]

  const data = await readAppData('blog/entry/index.md', files)
  expect(data).toEqual({ site: true, app: true, use: [] })
})

test('use array', async () => {
  const files = [
    { path: 'site.yaml', async text() { return 'use: [foo]' } },
    { path: 'blog/app.yaml', async text() { return 'use: [bar]' } },
  ]

  const data = await readAppData('blog/entry/index.md', files)
  expect(data.use).toEqual([ "foo", "bar" ])
})

test('createFile', async () => {
  const path = await write('@system/model/index.ts', '// hello')
  const file = await createFile(testDir, path)

  expect(file).toMatchObject({
    rootpath: 'test_dir/@system/model/index.ts',
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
    { path: '@system/design/base.css' },
    { path: 'site.yaml', async text() { return 'use: [ design/*, view/* ]' } },
  ]

  const file = createAsset(files[0], files)
  const assets = await file.assets()
  expect(assets.length).toEqual(2)
  expect(assets[0].path).toEqual('@system/design/base.css')
})



