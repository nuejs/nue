
import { renderScripts, renderStyles, renderMeta, renderHead, } from '../src/head.js'

test('renderScripts', () => {
  const [foo, bar] = renderScripts([
    { ext: '.ts', dir: '@system', name: 'foo' },
    { ext: '.js', dir: 'blog', name: 'bar' },
  ])
  expect(foo).toBe('<script src="/@system/foo.js" type="module"></script>')
  expect(bar).toInclude('/blog/bar.js')
})

test('renderStyles', () => {
  const [ foo, bar ] = renderStyles([
    { ext: '.css', path: 'foo.css' },
    { ext: '.css', path: 'bar.css' }
  ])

  expect(foo).toBe('<link rel="stylesheet" href="/foo.css">')
  expect(bar).toInclude('href="/bar.css"')

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
  expect(meta.includes('<meta name="author" content="tipiirai">')).toBeTrue()
  expect(meta.includes('<meta name="libs" content="/blog/foo.js">')).toBeTrue()

})

test('renderHead', async () => {
  const data = {
    title: 'Hello',
    version: '1.0',
    imports: { d3: 'd3.js' }
  }

  const head = renderHead(data, [
    { ext: '.css', path: 'foo.css' },
    { ext: '.js', dir: 'blog', name: 'bar' },
  ])

  expect(head.length).toBeGreaterThan(7)

  const imap = head.find(el => el.includes('importmap'))
  expect(imap).toInclude('"nue":')
  expect(imap).toInclude('"d3":')

})


