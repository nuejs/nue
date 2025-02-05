
import { parseDocument, stripMeta, sectionize } from '../src/parse-document.js'
import { parseBlocks } from '../src/parse-blocks.js'

test('front matter', () => {
  const lines = ['---', 'foo: 10', 'bar: 20', '---', '# Hello']
  const meta = stripMeta(lines)
  expect(meta).toEqual({ foo: 10, bar: 20 })
  expect(lines).toEqual([ "# Hello" ])
})


test('empty meta', () => {
  const lines = ['# Hello']
  const meta = stripMeta(lines)
  expect(meta).toEqual({})
  expect(lines).toEqual([ "# Hello" ])
})


test('document title', () => {
  const { meta } = parseDocument(['# Hello'])
  expect(meta.title).toBe('Hello')
})

test('title inside hero', () => {
  const { meta } = parseDocument(['[.hero]', '  # Hello'])
  expect(meta.title).toBe('Hello')
})

test('description', () => {
  const { meta } = parseDocument(['# Hello', 'This is bruh', '', 'Yo'])
  expect(meta.description).toBe('This is bruh')
})


test('render method', () => {
  const doc = parseDocument(['# Hello'])
  expect(doc.render()).toBe('<h1>Hello</h1>')
})


test('sectionize', () => {
  const tests = [
    ['### h3', 'para', '### h3', 'para', '#### h4', 'para'],
    ['# h1', 'para', '## h2', 'para', '### h3', 'para'],
    ['para', '## h3', '+++', 'para', '## h2'],
    ['## lol', '+++', '## bol'],
    ['lol', '+++', 'bol'],
  ]

  for (const test of tests) {
    const { blocks } = parseBlocks(test)
    expect(sectionize(blocks).length).toBe(2)
  }
})

test('non section', () => {
  const { blocks } = parseBlocks(['hello', 'world'])
  expect(sectionize(blocks)).toBeUndefined()
})


test('multiple sections', () => {
  const lines = [
    '# Hello', 'World',
    '## Foo', 'Bar',
    '---', 'Bruh', '***',
  ]

  const doc = parseDocument(lines)
  // expect(doc.sections.length).toBe(2)

  const html = doc.render({ sections: ['hero'] })
  expect(html).toStartWith('<section class="hero"><h1>Hello</h1>')
  expect(html).toEndWith('<hr></section>')
})


test('render reflinks', () => {
  const links = { external: 'https://bar.com/zappa "External link"' }

  const doc = parseDocument([
    '[Hey *dude*][local]',
    'Inlined [Second][external]',
    '[local]: /blog/yo.html "Local link"'
  ])

  const html = doc.render({ links })
  expect(html).toInclude('<a title="Local link" href="/blog/yo.html">Hey <em>dude</em></a>')
  expect(html).toInclude('Inlined <a title="External link" href="https://bar.com/zappa">Second</a>')
})


test('footnotes', () => {
  const doc = parseDocument([
    'This,[^1] [here][^a] goes.[^b]',
    '[^1]: foo',
    '[^a]: bar',
    '[^b]: baz',
  ])

  const html = doc.render()
  expect(html).toInclude('<a href="#^1" rel="footnote">')
  expect(html).toInclude('<ol role="doc-endnotes"><li><a name="^1"></a>foo</li>')
})



test('table of contents', () => {
  const doc = parseDocument([
    '# Hello', 'World',
    '## Foo', 'Bar',
    '## Baz', 'Bruh',
  ])

  const toc = doc.renderTOC()
  expect(toc).toStartWith('<div>')
  expect(toc).toInclude('<nav><a href="#foo"><strong>Foo</strong></a></nav>')
  expect(toc).toInclude('<nav><a href="#baz"><strong>Baz</strong></a></nav>')
})


