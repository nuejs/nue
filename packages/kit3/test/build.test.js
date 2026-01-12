
import { test, expect, afterAll, spyOn } from 'bun:test'

import { createTree } from '../src/tree'

import {
  getSharedAssets,
  getAffectedPages,
  getInheritedContent,
  printSummaryTable,
  buildNueAssets,
  getBuildables,
  build,
} from '../src/cli/build'


process.chdir('tree')

afterAll(() => process.chdir('..'))


test('printSummaryTable', async () => {
  const spy = spyOn(console, 'log').mockImplementation(() => {})

  printSummaryTable([
    { site: '@base' },
    { site: '@base' },
    { site: 'acme.org' },
    { site: 'beta.org' },
  ])

  const { calls } = spy.mock
  expect(calls[0][0]).toInclude('2 files')
  expect(calls.length).toBe(3)
  spy.mockRestore()
})

test('getBuildables', async () => {
  const tree = createTree()
  await tree.load()
  const arr = await getBuildables(tree, { only: ['epic-layout'] })
  expect(arr.length).toBe(1)
})


test('getSharedAssets', () => {
  const buildables = [
    { site: '@base', dir: '@shared', path: '@shared/join.html', is_dhtml_lib: true },
    { site: 'beta', dir: '', path: 'globals.ts', is_ts: true },
  ]

  const arr = getSharedAssets('acme', ['@base', 'beta', 'acme'], buildables)

  expect(arr.length).toBe(2)
  expect(arr[0].site).toBe('acme')
})

test('getInheritedContent', () => {
  const assets = [
    { site: '@base', dir: 'blog', path: 'blog/post.md', is_md: true },
  ]

  const arr = getInheritedContent('acme', ['@base', 'acme'], assets)
  expect(arr.length).toBe(1)
  expect(arr[0].site).toBe('acme')
})


test('getAffectedPages', () => {
  const all = [
    { site: 'acme', path: 'index.md', is_md: true },
  ]

  const buildables = [
    { site: '@base', path: '@shared/design/base.css', is_css: true },
  ]

  const arr = getAffectedPages('acme', ['@base', 'acme'], all, buildables)
  expect(arr.length).toBe(1)

})

test('tree.buildAsset', async () => {
  const tree = createTree()
  await tree.load()
  const page = tree.get('sites/acme/index.md')
  const html = await tree.buildAsset(page, { is_prod: true })
  expect(html).toInclude(';body{padding:1em')

  const file = Bun.file('.dist/acme/index.html')
  expect(await file.text()).toInclude('<title>Hello Acme</title>')
})


test('build', async () => {
  const tree = createTree()
  await tree.load()

  const { sites, buildables } = await build(tree, { only: [ 'acme' ], silent: true})
  expect(buildables.length).toBe(1)
  expect(sites).toEqual(['acme'])
})

test('buildNueAssets', async () => {
  await buildNueAssets('acme')
})

