
import { parseDocument, stripMeta, sectionize } from '../src/document.js'
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
    ['## lol', '---', '## bol'],
    ['lol', '---', 'bol'],
  ]

  for (const blocks of tests) {
    const headings = parseBlocks(blocks)
    expect(sectionize(headings).length).toBe(2)
  }
})

test('non section', () => {
  const paragraphs = parseBlocks(['hello', 'world'])
  expect(sectionize(paragraphs)).toBeUndefined()
})

test('single section', () => {
  const { sections } = parseDocument(['Hello'])
  expect(sections.length).toBe(1)
})

test('multiple sections', () => {
  const doc = parseDocument([
    '# Hello', 'World',
    '## Foo', 'Bar',
    '---', 'Bruh', '***',
  ])

  expect(doc.sections.length).toBe(3)
  const html = doc.render({ data: { sections: ['hero'] }})
  expect(html).toStartWith('<section class="hero"><h1>Hello</h1>')
  expect(html).toEndWith('<hr></section>')
})


test('table of contents', () => {
  const doc = parseDocument([
    '# Hello', 'World',
    '## Foo', 'Bar',
    '## Baz', 'Bruh',
  ])

  const toc = doc.renderTOC()
  expect(toc).toStartWith('<div aria-label="Table of contents">')
  expect(toc).toInclude('<nav><a href="#foo"><strong>Foo</strong></a></nav>')
  expect(toc).toInclude('<nav><a href="#baz"><strong>Baz</strong></a></nav>')
})


