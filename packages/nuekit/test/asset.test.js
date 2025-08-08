
import { createAsset } from '../src/asset'

test('data', async () => {

  const files = [
    { is_yaml: true, path: 'site.yaml', async text() { return 'site: true' } },
    { is_yaml: true, path: 'blog/app.yaml', async text() { return 'app: true' } },
    { is_yaml: true, path: 'blog/entry/page.yaml', async text() { return 'page: true' } },
    { is_yaml: true, path: 'docs/app.yaml', async text() { return 'docs: true' } },
  ]

  const asset = createAsset({ path: 'blog/entry/index.md' }, files)
  const data = await asset.data()
  expect(data).toEqual({ site: true, app: true, page: true })
})


test('assets', async () => {
  const files = [
    { path: 'index.md' },
    { path: '@system/design/base.css' },
    { path: 'blog/blog.js' },
  ]

  const asset = createAsset(files[0], files)
  const assets = await asset.assets()
  expect(assets.length).toBe(1)
})


test('MPA: page.md', async () => {

  const files = [
    { is_html: true, path: 'header.html', async text() { return '<header class="foo"/> <navi/>' }},
    { is_html: true, path: 'footer.html', async text() { return '<footer/>' }},
    { is_html: true, path: 'reactive.html', async text() { return '<!doctype dhtml> <foo/>' }},
  ]

  const page = createAsset({
    async text() { return '# Hello' },
    path: 'page.md',
    is_md: true,
  }, files)

  // document meta
  const doc = await page.document()
  expect(doc.meta.title).toBe('Hello')

  // layout components
  const comps = await page.components()
  expect(comps.length).toBe(3)
  expect(comps[0].tag).toBe('header')

  // render HTML
  const html = await page.render()
  expect(html).toInclude('<header class="foo">')
  expect(html).toInclude('script src="/@nue/mount.js"')

})


test('SPA: index.html', async () => {

  const files = [
    { is_html: true, path: 'index.html', base: 'index.html',
      async text() { return '<!doctype dhtml> <body><foo/></body>' }
    },

    { is_html: true, path: 'reactive.html', async text() { return '<!doctype dhtml> <foo/>' }},
  ]

  const page = createAsset(files[0], files)

  // SPA
  expect(await page.isDHTML()).toBeTrue()
  expect(await page.isSPA()).toBeTrue()

  // document
  const doc = await page.document()
  expect(doc.doctype).toBe('dhtml')
  expect(doc.elements.length).toBe(1)

  // reactive components
  const comps = await page.components()
  expect(comps.length).toBe(1)

  // render HTML
  const spa = await page.render()
  expect(spa.is_spa).toBeTrue()
  expect(spa.js).toInclude('export const lib')
  expect(spa.html).toInclude('<!doctype html>')
  expect(spa.html).toInclude('<body nue>')

})


test('SSR: user-list.html', async () => {
  const files = [
    { is_html: true, path: 'user-list.html', ext: '.html',
      async text() { return '<!doctype html> <user-list/>' }
    },
    { is_html: true, path: 'users.html', async text() { return '<ul :is="user-list"/>' }},
  ]

  const page = createAsset(files[0], files)

  // document
  const doc = await page.document()
  expect(doc.doctype).toBe('html')
  expect(doc.elements.length).toBe(1)

  // DHTML
  expect(await page.isDHTML()).toBeFalse()

  // reactive components / dependencies
  const comps = await page.components()
  expect(comps.length).toBe(1)
  expect(comps[0].tag).toBe('ul')

  // render HTML
  const html = await page.render()
  expect(html).not.toInclude('<body>')
  expect(html).toInclude('<ul>')

  expect(await page.contentType()).toBe('text/html')
})

test('SVG', async () => {
  const files = [
    { is_html: true, path: 'user-list.html',
      async text() { return '<!doctype html> <user-list/>' }
    },
    { is_html: true, path: 'users.html', async text() { return '<ul :is="user-list"/>' }},
  ]

  const page = createAsset(files[0], files)

  // document
  const doc = await page.document()
  expect(doc.doctype).toBe('html')
  expect(doc.elements.length).toBe(1)

  // DHTML
  expect(await page.isDHTML()).toBeFalse()

  // reactive components / dependencies
  const comps = await page.components()
  expect(comps.length).toBe(1)
  expect(comps[0].tag).toBe('ul')

  // render HTML
  const html = await page.render()
  expect(html).not.toInclude('<body>')
  expect(html).toInclude('<ul>')

})


