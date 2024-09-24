
import { parseDocument, stripMeta } from '../src/document.js'


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
  const doc = parseDocument(['# Hello'])
  expect(doc.title).toBe('Hello')
})

test('title inside hero', () => {
  const doc = parseDocument(['[.hero]', '  # Hello'])
  expect(doc.title).toBe('Hello')
})

test('description', () => {
  const doc = parseDocument(['# Hello', 'This is bruh', '', 'Yo'])
  expect(doc.description).toBe('This is bruh')
})


test('sections', () => {
  const doc = parseDocument([
    '# Hello', 'World',
    '## Foo', 'Bar',
    '## Baz', 'Bruh',
  ])
  expect(doc.sections.length).toBe(3)
  const html = doc.render({ data: { sections: ['hero'] }})
  expect(html).toStartWith('<section class="hero"><h1>Hello</h1>\n<p>World')
  expect(html).toEndWith('<section><h2>Baz</h2>\n<p>Bruh</p></section>')
})

test('table of contents', () => {
  const doc = parseDocument([
    '# Hello', 'World',
    '## Foo', 'Bar',
    '## Baz', 'Bruh',
  ])

  const toc = doc.renderTOC()
  expect(toc).toStartWith('<div class="toc">')
  expect(toc).toInclude('<nav><a href="#foo">Foo</a></nav>')
  expect(toc).toInclude('<nav><a href="#baz">Baz</a></nav>')
})


test('render doc', () => {
  const doc = parseDocument(['# Hello'])
  expect(doc.render()).toBe('<h1>Hello</h1>')
})
