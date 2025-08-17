
import { test, expect } from 'bun:test'
import { listDependencies, parseDirs } from '../src/deps'

const paths = [

  // root (2)
  'site.yaml',
  'globals.js',

  // system (6)
  '@system/design/base.css',
  '@system/design/components.css',
  '@system/data/authors.yaml',
  '@system/layout/page.html',
  '@system/ui/button.html',
  '@system/ui/keyboard.js',

  // app (4)
  'app/index.html',
  'app/main.js',
  'app/ui/header.html',
  'app/views/login.html',

  // blog (4)
  'blog/index.md',
  'blog/layout.html',
  'blog/entry/index.md',
  'blog/entry/content.html',

  // marketing (2)
  'marketing/table.html',
  'marketing/chart.js'
]

test('SPA app', () => {
  const deps = listDependencies('app/index.html', { paths })
  expect(deps.length).toBe(2 + 6 + 3) // root + system + app (no self)
  expect(deps).toContain('site.yaml')
  expect(deps).toContain('globals.js')
})

test('root SPA', () => {
  const paths = [ 'css/spa.css', 'ui/users.html', 'index.html' ]
  const deps = listDependencies('index.html', { paths })
  expect(deps.length).toBe(2)
})

test('MPA deps', () => {
  const deps = listDependencies('blog/entry/index.md', { paths })
  expect(deps.length).toBe(2 + 6 + 2) // root + system + blog hierarchy
  expect(deps).toContain('site.yaml')
  expect(deps).toContain('blog/layout.html')
})

test('standalone html', () => {
  const deps = listDependencies('marketing/table.html', { paths })
  expect(deps.length).toBe(2 + 6 + 1) // root + system + marketing
  expect(deps).toContain('site.yaml')
  expect(deps).toContain('marketing/chart.js')
  expect(deps).not.toContain('app/main.js')
})

test('strict CSS', () => {
  const deps = listDependencies('app/index.html', {
    paths: [...paths, 'app/custom.css'],
    strict: true
  })
  expect(deps.length).toBe(2 + 6 + 3) // custom.css blocked
})

test('allow local CSS', () => {
  const deps = listDependencies('app/index.html', {
    paths: [...paths, 'app/custom.css'],
    strict: false
  })
  expect(deps.length).toBe(2 + 6 + 4) // custom.css included
  expect(deps).toContain('app/custom.css')
})

test('root CSS follows strict rules', () => {
  const deps = listDependencies('app/index.html', {
    paths: [...paths, 'global.css'],
    strict: true
  })
  expect(deps.length).toBe(2 + 6 + 3) // root CSS blocked by strict
  expect(deps).not.toContain('global.css')
})

test('exclusions', () => {
  const deps = listDependencies('app/index.html', {
    exclude: ['app/ui', '@system/design', 'site.yaml'],
    paths,
  })

  expect(deps.length).toBe(1 + 4 + 2) // globals.js + 4 system + 2 app
  expect(deps).not.toContain('app/ui/header.html')
  expect(deps).not.toContain('@system/design/base.css')
  expect(deps).not.toContain('site.yaml')
  expect(deps).toContain('globals.js')
})

test('parseDirs', () => {
  expect(parseDirs('blog')).toEqual(['blog'])
  expect(parseDirs('blog/entry')).toEqual(['blog', 'blog/entry'])
})



