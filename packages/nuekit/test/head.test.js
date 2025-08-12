
import { renderScripts, renderStyles, renderMeta, renderHead, } from '../src/head'

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
  expect(style).toBe('<style>body {}</style>')
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

test('renderHead', async () => {
  const data = {
    title: 'Hello',
    version: '1.0',
    'import-map': { d3: 'd3.js' }
  }

  const head = await renderHead(data, [
    { ext: '.css', path: 'foo.css' },
    { ext: '.js', dir: 'blog', name: 'bar' },
  ])

  expect(head.length).toBeGreaterThan(7)

  const imap = head.find(el => el.includes('importmap'))
  expect(imap).toInclude('"nue":')
  expect(imap).toInclude('"d3":')

})


