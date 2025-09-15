
import { sortPaths } from '../src/site'

test('sortPaths', () => {
  const sorted = sortPaths([
    'blog/post.md',
    'index.html',
    '@shared/design/area.css',
    'docs/getting-started.md',
    'global.css',
    '@shared/design/base.css',
    'about.md'
  ])

  expect(sorted).toEqual([
    "@shared/design/base.css",
    "@shared/design/area.css",
    "about.md",
    "global.css",
    "index.html",
    "blog/post.md",
    "docs/getting-started.md"
  ])
})

