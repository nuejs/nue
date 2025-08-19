
import { join, parse } from 'node:path'

import { testDir, write, removeAll } from './test-utils'
import { createFile, getFileInfo, getURL, getSlug } from '../src/file'


test('url property', () => {
  function testURL(path, expected) {
    expect(getURL(parse(path))).toBe(expected)
  }
  testURL('index.md', '/')
  testURL('index.css', '/index.css')
  testURL('blog/entry.md', '/blog/entry')
  testURL('app/index.html', '/app/')
  testURL('blog/table.html', '/blog/table')
  testURL('docs/installation.md', '/docs/installation')
  testURL('@system/design/base.css', '/@system/design/base.css')
  testURL('site.yaml', '/site.yaml')
})

test('slug property', () => {
  expect(getSlug(parse('blog/entry.md'))).toBe('entry')
  expect(getSlug(parse('blog/index.html'))).toBe('')
})


test('getFileInfo', () => {
  const info = getFileInfo('blog/table.html')
    expect(info).toEqual({
    dir: "blog",
    base: "table.html",
    ext: ".html",
    name: "table",
    path: "blog/table.html",
    slug: "table.html",
    type: "html",
    url: "/blog/table",
    is_html: true,
  })
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






