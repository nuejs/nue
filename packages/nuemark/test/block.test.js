
import { renderBlocks, renderHeading, renderLines } from '../src/render-blocks.js'
import { parseBlocks, getBreak, parseHeading } from '../src/parse-blocks.js'
import { nuemark } from '..'


test('paragraphs', () => {
  const { blocks } = parseBlocks(['a', 'b', '', '', 'c'])
  expect(blocks.length).toBe(2)

  const html = renderBlocks(blocks)
  expect(html).toStartWith('<p>a b</p>')
  expect(html).toEndWith('<p>c</p>')
})

test('list items', () => {
  const { blocks } = parseBlocks(['- a', '', '  a1', '- b', '', '', '- c'])
  expect(blocks.length).toBe(1)
  expect(blocks[0].entries).toEqual([["a", "", "a1"], ["b", "", ""], ["c"]])
})


test('nested lists', () => {
  const { blocks } = parseBlocks(['- item', '', '  - nested 1', '', '', '  - nested 2'])
  expect(blocks.length).toBe(1)
  expect(blocks[0].entries[0]).toEqual(["item", "", "- nested 1", "", "", "- nested 2"])

  const html = renderBlocks(blocks)
  expect(html).toEndWith('<li><p>nested 2</p></li></ul></li></ul>')
})


test('nested tag data', () => {
  const { blocks } = parseBlocks(['[hello] ', '', '', '  foo: bar', '', '  bro: 10'])
  expect(blocks[0].name).toBe('hello')
  expect(blocks[0].data).toEqual({ foo: "bar", bro: 10 })
})

test('nested tag content', () => {
  const { blocks } = parseBlocks(['[.stack]', '', '', '  line1', '', '  line2'])
  expect(blocks.length).toBe(1)
  expect(blocks[0].blocks.length).toBe(2)

  const html = renderBlocks(blocks)
  expect(html).toStartWith('<div class="stack"><p>line1</p>')
})

test('subsequent blockquotes', () => {
  const { blocks } = parseBlocks(['> hey', '> boy', '', '> another'])
  expect(blocks.length).toBe(3)
  const html = renderBlocks(blocks)
  expect(html).toStartWith('<blockquote><p>hey boy</p></blockquote>')
})


test('numbered items', () => {
  const { blocks } = parseBlocks(['1. Yo', '10. Bruh', '* Bro'])
  expect(blocks[0].numbered).toBeTrue()
  expect(blocks[0].entries).toEqual([["Yo"], ["Bruh"], ["Bro"]])
})


test('multiple thematic breaks', () => {
  const { blocks } = parseBlocks(['A', '---', 'B', '---', 'C'])
  expect(blocks.length).toBe(5)
})


test('parse thematic break', () => {
  const hrs = ['***', '___', '- - -', '*** --- ***']
  for (const str of hrs) {
    expect(getBreak(str)).toBeDefined()
  }
  expect(getBreak('*** yo')).toBeUndefined()
})

test('render thematic break', () => {
  const html = renderLines(['***', '***x-bold***', '', '***   hey   ***'])
  expect(html).toStartWith('<hr>')
  expect(html).toInclude('<p><em><strong>x-bold')
  expect(html).toEndWith('<p>***   hey   ***</p>')
})

test('render thematic break', () => {
  expect(renderLines(['hello', '***'])).toBe('<p>hello</p>\n<hr>')
})

test('parse heading', () => {
  const h = parseHeading('# Hello')
  expect(h).toMatchObject({ attr: {}, text: 'Hello', level: 1 })
})

test('render heading', () => {
  expect(nuemark('# Hello')).toBe('<h1>Hello</h1>')
  expect(nuemark('##Hello')).toBe('<h2>Hello</h2>')
  expect(nuemark('### Hello, *world*')).toBe('<h3>Hello, <em>world</em></h3>')
})

test('heading class name', () => {
  const html = nuemark('# Hello { .boss }')
  expect(html).toBe('<h1 class="boss">Hello</h1>')
})

test('heading attr', () => {
  const h = parseHeading('# Hey { #foo.bar }')
  expect(h.text).toBe('Hey')
  expect(h.attr).toEqual({ class: "bar", id: "foo" })

  expect(renderHeading(h)).toBe('<h1 class="bar" id="foo">Hey</h1>')

  const html = renderHeading(h, { heading_ids: true })
  expect(html).toInclude('<a href="#foo" title="Hey"></a>')
})

test('generated heading id', () => {
  const html = nuemark('# Hello', { heading_ids: true })
  expect(html).toBe('<h1 id="hello"><a href="#hello" title="Hello"></a>Hello</h1>')
})

test('heading block count', () => {
  const { blocks } = parseBlocks(['# Yo', 'rap', '## Bruh', 'bat', '## Bro'])
  expect(blocks.length).toBe(5)
})


test('render blockquote', () => {
  const html = renderLines(['> ## Hey', '> 1. dude'])
  expect(html).toStartWith('<blockquote><h2>Hey</h2>\n<ol><li><p>dude')
})

test('render fenced code', () => {
  const html0 = renderLines(['```css .pink numbered', 'em {}', '```'])
  expect(html0).toStartWith('<div class="pink"><pre><code language="css"><span>')
  const html1 = renderLines(['```css.pink numbered', 'em {}', '```'])
  expect(html1).toStartWith('<div class="pink"><pre><code language="css"><span>')
  const html2 = renderLines(['```.pink numbered', 'em {}', '```'])
  expect(html2).toStartWith('<div class="pink"><pre><code language="*"><span>')
  const html3 = renderLines(['```.pink', 'em {}', '```'])
  expect(html3).toStartWith('<div class="pink"><pre><code language="*">')
})

test('fenced code with caption', () => {
  const html = renderLines(['``` css.bad "Hey *there*"', 'em {}', '```'])
  expect(html).toStartWith('<figure class="bad"><figcaption>Hey <em>there</em>')
  expect(html).toEndWith('</i></code></pre></figure>')
})


test('multi-line list entries', () => {
  const list = parseBlocks(['* foo', '  boy', '* bar']).blocks[0]
  expect(list.entries).toEqual([["foo", "boy"], ["bar"]])
})

test('nested list', () => {
  const { items } = parseBlocks(['* > foo', '  1. boy', '  2. bar']).blocks[0]
  const [[quote, nested]] = items

  expect(quote.is_quote).toBeTrue()
  expect(nested.is_list).toBeTrue()
})

test('blockquote', () => {
  const [quote] = parseBlocks(['> foo', '> boy']).blocks
  expect(quote.is_quote).toBeTrue()
  expect(quote.content).toEqual(["foo", "boy"])
})

test('fenced code blocks', () => {
  const [code] = parseBlocks(['``` css.foo numbered', 'func()', '```']).blocks

  expect(code.name).toBe('css')
  expect(code.attr).toEqual({ class: 'foo' })
  expect(code.code).toEqual(["func()"])
  expect(code.data.numbered).toBeTrue()
})

test('parse table', () => {
  const lines = [
    '| Month    | Amount  |',
    '| -------- | ------- |',
    '| January  | $250    |',
    '| February | $80     |',
  ]

  // parse
  const [table] = parseBlocks(lines).blocks
  expect(table.rows[1]).toEqual(["January", "$250"])
  expect(table.rows.length).toBe(3)
  expect(table.head).toBeTrue()

  // render
  const html = renderLines(lines)
  expect(html).toInclude('<th>Month</th><th>Amount</th>')
  expect(html).toInclude('<tr><td>February</td><td>$80</td>')
})

test('parse reflinks', () => {
  const { reflinks } = parseBlocks([
    '[.hero]',
    '  # Hello, World',
    '  [foo]: //website.com',
    '[1]: //another.net "something"'
  ])

  expect(reflinks).toEqual({
    "1": {
      href: "//another.net",
      title: "something",
    },
    foo: {
      href: "//website.com",
    },
  })
})

test('footnotes with [define]', () => {
  const html = renderLines([
    '[hey][^ki] [yo][^ko]',
    '[define]',
    '  ## King { #ki }',
    '  ## Kong { #ko }',
  ])

  expect(html).toInclude('<a href="#^ki" rel="footnote">hey<sup role="doc-noteref">1</sup></a>')
  expect(html).toInclude('1</sup></a> <a')
  expect(html).toInclude('2</sup></a></p>')
  expect(html).toInclude('<dl><dt><a name="^ki">King')
})


test('complex tag data', () => {
  const comp = parseBlocks(['[hello#foo.bar world size="10"]', '  foo: bar']).blocks[0]
  expect(comp.attr).toEqual({ class: "bar", id: "foo", })
  expect(comp.data).toEqual({ world: true, size: 10, foo: "bar", })
})

test('duplicate tag classes', () => {
  const { blocks } = parseBlocks(['[hello.c.c.bar class="foo bar" world]'])
  expect(blocks[0].attr.class).toBe('c bar foo')
  expect(blocks[0].data).toEqual({ world: true })
})

test('escaping', () => {
  const html = renderLines([
    '\\[code]', '',
    '\\> blockquote', '',
    '\\## title',
  ])

  expect(html).toInclude('<p>[code]</p>')
  expect(html).toInclude('<p>> blockquote</p>')
  expect(html).toInclude('<p>## title</p>')
})

test('before render callback', () => {
  function beforerender(block) {
    if (block.is_heading) block.level = 2
    if (block.is_content) block.content = ['World']
  }

  const html = renderLines(['# Hello', 'Bar'], { beforerender })
  expect(html).toBe('<h2>Hello</h2>\n<p>World</p>')
})





