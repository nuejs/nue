
import { sortPaths } from '../src/site'

test('sortPaths', () => {
  const sorted = sortPaths([
    'blog/post.md',
    'index.html',
    '@system/design/area.css',
    'docs/getting-started.md',
    'global.css',
    '@system/design/base.css',
    'about.md'
  ])

  expect(sorted).toEqual([
    "@system/design/base.css",
    "@system/design/area.css",
    "about.md",
    "global.css",
    "index.html",
    "blog/post.md",
    "docs/getting-started.md"
  ])
})

