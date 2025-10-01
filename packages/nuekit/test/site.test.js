
import { sortAssets, mergeSharedData } from '../src/site'

test('sortAssets', () => {
  const sorted = sortAssets([
    'blog/post.md',
    'index.html',
    '@shared/design/area.css',
    'docs/getting-started.md',
    'global.css',
    '@shared/design/base.css',
    'about.md'
  ])

  expect(sorted).toEqual([
    "@shared/design/area.css",
    "@shared/design/base.css",
    "blog/post.md",
    "docs/getting-started.md",
    "about.md",
    "global.css",
    "index.html",
  ])
})

test('sort assets', () => {
  const assets = [{ path: 'b' }, { path: 'a' }]
  const sorted = sortAssets(assets)

  // both should be sorted
  expect(assets[0].path).toBe('a')
  expect(sorted[0].path).toBe('a')
})


test('mergeSharedData', async () => {
  const dir = '@shared/data'

  const assets = [
    { dir, is_yaml: true, parse() { return { port: 100 } }},
    { dir, is_js: true, parse() { return { default: function(data) { data.port = 200 }} }},
  ]

  const data = await mergeSharedData(assets)
  expect(data).toEqual({ port: 200 })

})
