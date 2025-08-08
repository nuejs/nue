
import { join, parse } from 'node:path'

import { testDir, write, removeAll } from './test-utils'
import { createFile, getFileInfo, toURL } from '../src/file'


test('.url property', () => {
  expect(toURL(parse('index.md'))).toBe('/')
  expect(toURL(parse('app/index.html'))).toBe('/app/')
  expect(toURL(parse('blog/table.html'))).toBe('/blog/table.html')
  expect(toURL(parse('docs/installation.md'))).toBe('/docs/installation')
  expect(toURL(parse('@system/design/base.css'))).toBe('/@system/design/base.css')
  expect(toURL(parse('site.yaml'))).toBe('/site.yaml')
})

test('getFileInfo', () => {
  const info = getFileInfo('blog/table.html')
    expect(info).toEqual({
    dir: "blog",
    base: "table.html",
    ext: ".html",
    name: "table",
    path: "blog/table.html",
    type: "html",
    url: "/blog/table.html",
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






