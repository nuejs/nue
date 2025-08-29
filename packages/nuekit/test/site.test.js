
import { sortPaths } from '../src/site'

test('sortPaths', () => {
  const sorted = sortPaths([
    'blog/post.md',
    'index.html',
    '@system/design/base.css',
    'docs/getting-started.md',
    'global.css',
    '@system/layout/header.html',
    'about.md'
  ])

  expect(sorted).toEqual([
    "@system/design/base.css",
    "@system/layout/header.html",
    "about.md",
    "global.css",
    "index.html",
    "blog/post.md",
    "docs/getting-started.md"
  ])
})

