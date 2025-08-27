
import { renderScripts, renderStyles, renderMeta, renderHead, } from '../../src/render/head'

test('renderScripts', () => {
  const [foo, bar] = renderScripts([
    { ext: '.ts', dir: '@system', name: 'foo' },
    { ext: '.js', dir: 'blog', name: 'bar' },
  ])
  expect(foo).toBe('<script src="/@system/foo.js" type="module"></script>')
  expect(bar).toInclude('/blog/bar.js')
})

test('renderStyles', async () => {
  const files = [
    { is_css: true, path: 'b/style.css', async text() { return '' } },
    { is_css: true, path: 'base.css', base: 'base.css', async text() { return '' } },
    { is_css: true, path: 'a/style.css', async text() { return 'body {}' } },
  ]

  // sort base first
  const css = await renderStyles(files)
  expect(css[0]).toBe('<link rel="stylesheet" href="/base.css">')
  expect(css[1]).toContain('a/style.css')
  expect(css[2]).toContain('b/style.css')

  // inline css
  const style = await renderStyles(files, { is_prod: true, design: { inline_css: true }})
  expect(style).toBe('<style>body{}</style>')
})

test('renderMeta', async () => {
  const meta = await renderMeta({
    author: 'tipiirai',
    version: '1.0',
    desc: 'hello',
    og: 'foo.png',
    dir: 'blog',

  }, ['/blog/foo.js'])

  expect(meta.length).toBeGreaterThan(7)
  expect(meta.includes('<meta charset="utf-8">')).toBeTrue()
  expect(meta.includes('<meta name="author" content="tipiirai">')).toBeTrue()
  expect(meta.includes('<meta name="libs" content="/blog/foo.js">')).toBeTrue()

})

test('title_template', async () => {
  const meta = await renderMeta({
    title_template: '%s World',
    'date.updated': false,
    generator: false,
    title: 'Hello'
  })
  expect(meta.includes('<meta name="og:title" content="Hello World">')).toBeTrue()
  expect(meta.length).toBe(3)
})

test('renderHead', async () => {
  const conf = {
    import_map: { d3: 'd3.js' }
  }

  const data = {
    title: 'Hello',
    version: '1.0',
  }

  const assets = [
    { ext: '.css', path: 'foo.css' },
    { ext: '.js', dir: 'blog', name: 'bar' },
  ]

  const head = await renderHead({ conf, data, assets })

  expect(head.length).toBeGreaterThan(7)

  const map = head.find(el => el.includes('importmap'))
  expect(map).toStartWith('<script type="importmap">')
  expect(map).toInclude('{"imports":{"d3":"d3.js"}}')
})


