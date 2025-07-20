
import {
  renderPage,
  renderSPA,
  renderScripts,
  renderStyles,
  renderMeta,
  renderHead,

} from '../src/render.js'


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

test('renderMeta', () => {
  const meta = renderMeta({
    author: 'tipiirai',
    version: '1.0',
    desc: 'hello',
    og: 'foo.png',
    dir: 'blog',

  }, {
    components: ' ',

  })
  expect(meta.length).toBeGreaterThan(7)
  expect(meta.includes('<meta name="author" content="tipiirai">')).toBeTrue()

})

test('renderHead', async () => {
  const deps = [
    { ext: '.css', path: 'foo.css' },
    { ext: '.js', dir: 'blog', name: 'bar' },
  ]

  const head = renderHead({ title: 'Hello', version: '1.0' }, deps)
  expect(head.length).toBeGreaterThan(7)
})


test('renderPage', () => {
  const data = { sections: true }
  const lib = [{ tag: 'header', render() { return '<a>Home</a>' }}]
  const document = { meta: { title: 'Hello' }, render() { return '<h1>Hello</h1>' } }
  const html = renderPage({ document, data, deps: [], lib })

  expect(html).toInclude('<head>')
  expect(html).toInclude('<body>')
  expect(html).toInclude('<a>Home</a>')
  expect(html).toInclude('<main>')
  expect(html).toInclude('<h1>Hello</h1>')
})

test('renderSPA', () => {
  const tags = [
    { is: 'app', render() {}},
    { tag: 'head', render() { return '<!-- comment -->' }},
  ]
  const html = renderSPA({ tags, data: {}, deps: [], lib: tags })
  console.info(html)
})
