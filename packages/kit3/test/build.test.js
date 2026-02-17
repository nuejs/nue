// build.test.js
import { unique, getSites, shouldIncludePage, hasCSSDep, isMedia } from '../src/cli/build'


test('unique', () => {
  const assets = [
    { site: 'acme', path: 'index.html' },
    { site: 'acme', path: 'index.html' },
    { site: 'acme', path: 'about.html' },
    { site: 'beta', path: 'index.html' },
  ]
  expect(unique(assets).length).toBe(3)
})


test('getSites excludes @base', () => {
  const assets = [
    { site: '@base' },
    { site: 'acme' },
    { site: 'beta' },
  ]
  expect(getSites(assets)).toEqual(['acme', 'beta'])
})


test('shouldIncludePage local', () => {
  const assets = [{ site: 'acme', is_page: true, url: '/' }]
  const page = assets[0]
  expect(shouldIncludePage(page, 'acme', assets)).toBe(true)
})


test('shouldIncludePage inherited root', () => {
  const assets = [
    { site: '@base', is_page: true, url: '/', is_md: true },
  ]
  expect(shouldIncludePage(assets[0], 'acme', assets)).toBe(true)
})


test('shouldIncludePage inherited blocked by local', () => {
  const assets = [
    { site: '@base', is_page: true, url: '/', is_md: true },
    { site: 'acme', is_page: true, url: '/' },
  ]
  expect(shouldIncludePage(assets[0], 'acme', assets)).toBe(false)
})


test('shouldIncludePage html wins over md', () => {
  const assets = [
    { site: '@base', is_page: true, url: '/', is_md: true },
    { site: 'baseapp', is_page: true, url: '/', is_html: true },
  ]
  expect(shouldIncludePage(assets[0], 'acme', assets)).toBe(false)
  expect(shouldIncludePage(assets[1], 'acme', assets)).toBe(true)
})


test('shouldIncludePage app not in site', () => {
  const assets = [
    { site: '@base', is_page: true, url: '/blog/', app: 'blog' },
  ]
  expect(shouldIncludePage(assets[0], 'acme', assets)).toBe(false)
})


test('shouldIncludePage app in site', () => {
  const assets = [
    { site: '@base', is_page: true, url: '/blog/post', app: 'blog' },
    { site: 'acme', app: 'blog' },
  ]
  expect(shouldIncludePage(assets[0], 'acme', assets)).toBe(true)
})


test('hasCSSDep', () => {
  const deps = [
    { is_css: true, path: 'style.css', site: '@base' },
    { is_js: true, path: 'app.js', site: '@base' },
  ]
  const changed = [{ path: 'style.css', site: '@base' }]
  expect(hasCSSDep(deps, changed)).toBe(true)
})


test('hasCSSDep no match', () => {
  const deps = [
    { is_css: true, path: 'style.css', site: '@base' },
  ]
  const changed = [{ path: 'other.css', site: '@base' }]
  expect(hasCSSDep(deps, changed)).toBe(false)
})


test('isMedia', () => {
  expect(isMedia('image/png')).toBe(true)
  expect(isMedia('video/mp4')).toBe(true)
  expect(isMedia('text/html')).toBe(false)
  expect(isMedia(undefined)).toBe(false)
})