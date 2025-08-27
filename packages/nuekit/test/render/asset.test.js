
import { createAsset } from '../../src/asset'


test('index.html', async () => {
  const page = createAsset({
    async text() { return '<h1>Hey { slug }</h1> <p>{{ markdown("*boo*") }}</p>' },
    is_html: true,
    slug: 'world',
    url: '/'
  }, [])

  const html = await page.render()
  expect(html).toInclude('<article><h1>Hey world</h1>')
  expect(html).toInclude('<p><em>boo</em></p>')
})


test('lib.html', async () => {
  const files = [
    { is_html: true, path: 'user-list.html', ext: '.html',
      async text() { return '<user-list/>' }
    },
    { is_html: true, path: 'lib.html', async text() { return '<!html lib> <ul :is="user-list"/>' }},
  ]

  const page = createAsset(files[0], files)

  // document
  const doc = await page.parse()
  expect(doc.lib.length).toBe(1)

  // reactive components / dependencies
  const comps = await page.components()
  expect(comps.length).toBe(1)
  expect(comps[0].tag).toBe('ul')

  // render HTML
  const html = await page.render()
  expect(html).toInclude('<ul>')
  expect(await page.contentType()).toInclude('text/html')
})


test('dhtml', async () => {
  const lib = createAsset({
    async text() { return '<!dhtml lib> <comp>Again</comp>' },
    path: 'lib.html',
    is_html: true,
  })

  const page = createAsset({
    async text() { return '<!dhtml> <h1>Hey</h1> <p>World</p> <comp/>' },
    path: 'index.html',
    is_html: true,
  }, [ lib ])

  const { html, js } = await page.render()

  expect(html).toInclude('<meta name="libs" content="index.html lib.html">')
  expect(html).toInclude('<article nue="default-app"></article>')
  expect(html).toInclude('"state":"/@nue/state.js"')
  expect(js).toInclude(`export const lib = [ { tag: 'article'`)
  expect(js).toInclude("is: 'default-app'")

  expect(await lib.render()).toInclude("export const lib = [ { tag: 'comp'")
})





