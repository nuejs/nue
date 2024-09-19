import { parseMeta, parseBlocks, parseSections, parsePage, parseHeading } from '../src/parse.js'
import { parseComponent, valueGetter, parseAttr, parseSpecs } from '../src/component.js'
import { renderIsland, renderLines, renderHeading } from '../src/render.js'
import { tags, parseSize } from '../src/tags.js'
import { nuemarkdown } from '../index.js'


test('fenced code', () => {
  const { html } = renderLines(['``` md.foo', `<h1>hey</h1>`, '```', 'after'])
  expect(html).toStartWith('<div class=\"foo\"><pre><code language=\"md\"><i>&lt;')
  expect(html).toInclude('</code></pre></div>')
  expect(html.trim()).toEndWith('<p>after</p>')
})

test('fenced code: space before class name', () => {
  const { html } = renderLines(['``` md #go.pink', '# Hey', '```'])
  expect(html).toInclude('<div class="pink">')
  expect(html).toInclude('<pre id="go">')
  expect(html).toInclude('<code language="md">')
  expect(html).not.toInclude('<span>')
})

test('fenced code & numbered', () => {
  const { html } = renderLines(['``` numbered .pink', '<p>', '```'])
  expect(html).toInclude('<code language="html">')
  expect(html).toInclude('<div class="pink">')
  expect(html).toInclude('<span>')

})

test('fenced code & numbered last', () => {
  const { html } = renderLines(['``` md .pink numbered', '# Hey', '```'])
  expect(html).toInclude('<div class="pink">')
  expect(html).toInclude('<span>')
})

test('[code.foo]', () => {
  const html = tags.code({ content: ['<p>Hey</p>'], language: 'xml', numbered: true, attr: { class: 'foo'} })
  expect(html).toStartWith('<div class="foo"><pre><code language="xml">')
  expect(html).toInclude('<i>')
})

test('[code caption]', () => {
  const html = tags.code({ content: ['<!-- Hey -->'], caption: 'index.js', numbered: 1 })
  expect(html).toInclude('<figure><figcaption>index.js')
  expect(html).toInclude('<sup>&lt;!-- Hey')
})

test('[codeblocks]', () => {
  const html = tags.codeblocks({ content: ['a', 'b'], captions: 'A; B' })
  expect(html).toStartWith('<div><figure><figcaption>A')
  expect(html).toInclude('<figcaption>B')
  expect(html).toInclude('<pre>')
})

test('[codetabs]', () => {
  const html = tags.codetabs({ content: ['a', 'b'], captions: 'A; B', languages: 'jsx; md' })
  expect(html).toStartWith('<div tabs is="aria-tabs">')
  expect(html).toInclude('<div role="tablist">')
  expect(html).toInclude('<li role="tabpanel"><pre>')
})

test('nested code with comment', () => {
  const { html } = renderLines(['[.test]', '  // not rendered', '  ```', '  // hey', '  ```'])
  expect(html).toStartWith('<div class="test">')
  expect(html).toInclude('<sup>// hey</sup>')
})

test('multiple md extensions', () => {
  const { html } = renderLines(['[.test] ', '\tcontent1', '[.test]', '\tcontent2'])
  expect(html).toBe('<div class="test"><p>content1</p></div><div class="test"><p>content2</p></div>')
})

test('parse fenced code', () => {
  const blocks = parseBlocks(['# Hey', '``` md.foo#bar', '// hey', '[foo]', '```'])
  const [hey, fenced] = blocks
  expect(fenced.is_code).toBe(true)
  expect(fenced.name).toBe('md')
  expect(fenced.attr).toEqual({ class: 'foo', id: 'bar' })
  expect(fenced.content).toEqual(["// hey", "[foo]"])
})


test('[!] img', () => {
  const img = tags['!']({ _: 'img.png' })
  expect(img).toStartWith('<figure><img ')

  const video = tags['!']({ _: 'img.mp4' })
  expect(video).toStartWith('<video src="img.mp4">')
})

test('[video] sources', () => {
  const html = tags.video({ sources: ['/test.mp4', '/test.webm'], content: ['Nope'] })
  expect(html).toInclude('source src="/test.webm" type="video/webm"')
  expect(html).toInclude('<p>Nope</p>')
})

test('[video] simple', () => {
  const html = tags.video({ _: '/test.mp4', width: 500, loop: true, muted: true, joku: 899 })
  expect(html).toBe('<video src="/test.mp4" loop muted width="500"></video>')
})

test('[tabs] attr', () => {
  const html = tags.tabs({ _: 't1 ; t2', content: ['c1', 'c2'], attr: {} })
  expect(html).toInclude('<div tabs is="aria-tabs" class="tabs">')
  expect(html).toInclude('<div role="tablist">')
  expect(html).toInclude('<a role="tab" aria-selected>t1</a>')
  expect(html).toInclude('<li role="tabpanel">')
  expect(html).toInclude('<p>c1</p>')
})

test('[tabs] key and wrapper', () => {
  const html = tags.tabs({
    tabs: 'Tab 1 | Tab 2',
    content: ['Content 1', 'Content 2'],
    wrapper: 'gradient',
    key: 'tab',
  })

  expect(html).toStartWith('<div class="gradient">')
  expect(html).toInclude('id="tab-tab-1" aria-controls="tab-panel-1"')
  expect(html).toInclude('id="tab-panel-2" aria-labelledby="tab-tab-2"')
})


const NESTED_TABS = `
 [tabs "Foo | Bar"]
  First
  ---
  Second

  [tabs "Baz | Bruh" key="inner"]\t
    Inner 1
    ---
    Inner 2
`

test('Nested [tabs]', () => {
  const html = nuemarkdown(NESTED_TABS)
  expect(html).toInclude('aria-selected>Foo</a>')
  expect(html).toInclude('<a role="tab">Bar</a>')

  expect(html).toInclude('aria-controls="inner-panel-1">Baz</a>')
  expect(html).toInclude('id="inner-tab-2"')
  expect(html).toInclude('id="inner-panel-2"')
})


test('long divider', () => {
  const { html } = renderLines(['[.a]', '  foo', '  ------', '  bar'])
  expect(html).toInclude('<div><p>foo</p>\n</div>')
  expect(html).not.toInclude('<ul>')
})

test('[image] content', () => {
  const html = tags.image({ src: 'a.png', content: ['Hey'] })
  expect(html).toInclude('<figcaption><p>Hey</p>')
  expect(html).toInclude('src="a.png')
  expect(html).toInclude('figure')
})

test('[image] link', () => {
  const a = tags.image({ _: 'a.png', href: '/' })
  expect(a).toStartWith('<figure><a href="/"><img')
})

test('[image] picture', () => {
  const pic = tags.image({ small: 'a.png', large: 'b.png', offset: 800, attr: { class: 'big' } })
  expect(pic).toStartWith('<figure class="big">')
  expect(pic).toInclude('<picture>')
  expect(pic).toInclude('source srcset="b.png"')
  expect(pic).toInclude('max-width: 800px')
  expect(pic).toInclude('src="b.png"')
})

test('[image] caption', () => {
  const figure = tags.image({ src: 'a.png', caption: 'Hey *man*', attr: { class: 'big' } })
  expect(figure).toInclude('<figcaption>Hey <em>man</em></figcaption>')
  expect(figure).toInclude('figure class="big"')
  expect(figure).toInclude('src="a.png"')
})

test('parseSize', () => {
  const { width, height } = parseSize({ size: '10 x 10' })
  expect(width).toBe('10')
  expect(height).toBe('10')
})

test('[image] basics', () => {
  const img = tags.image({ _: 'a.png', alt: 'Hey', width: 10, height: 10 })

  expect(img).toStartWith('<figure><img')

  expect(img).toInclude('src="a.png"')
  expect(img).toInclude('alt="Hey"')
  expect(img).toInclude('loading="lazy"')
  expect(img).toInclude('width="10"')
  expect(img).toInclude('height="10"')

  const img2 = tags.image({ size: '10 x 10 px' })
  expect(img2).toInclude('width="10"')
  expect(img2).toInclude('height="10"')

})

test('[image] srcset', () => {
  const img = tags.image({
    srcset: ['a.jpg 20vw', 'b.jpg'],
    loading: null,
    sizes: '4em'
  })

  expect(img).toInclude('<img srcset="a.jpg 20vw, b.jpg" sizes="4em">')
})


test('[block]', () => {
  const attr = { id: 'epic' }
  const data = { count: 10 }
  const single = tags.block({ attr, data, content: ['foo'] })

  expect(single).toInclude('<div id="epic">')
  expect(single).toInclude('<p>foo</p>')

  const double = tags.block({ attr, data, content: ['foo', 'bar'] })
    expect(double).toInclude('<div id="epic">')
})

test('[layout] alias', () => {
  const html = tags.layout({ content: ['a', 'b'] })
  expect(html).toStartWith('<div>')
})

test('[block] with nested component', () => {
  const content = ['# Hello', '## World\n[image "joo.png"]']
  const html = tags.block({ content })
  expect(html).toInclude('<h1>')
  expect(html).toInclude('<div><h2 id="world">')
  expect(html).toInclude('<img')
})

test('[table]', () => {
  const html = tags.table({ head: 'Name | Age', items: ['John | 30', 'Mary | 28,5'], wrapper: 'foo' })
  expect(html).toStartWith('<div class="foo"><table>')
  expect(html).toInclude('<th>Name</th>')
  expect(html).toInclude('<th>Age</th>')
  expect(html).toInclude('<td>John</td>')
  expect(html).toInclude('<td>Mary</td>')
  expect(html).toInclude('<td>28,5</td>')
})

test('[button]', () => {
  const html = tags.button({ label: '*Hey*' })
  expect(html).toInclude('<a href="#" role="button">')
  expect(html).toInclude('<em>Hey</em>')
})

test('render sections', () => {
  const lines = ['a', 'a', '--- #a.b', 'b', 'b', '---', 'c', 'c']
  const { html } = renderLines(lines, { draw_sections: true, data: { section_classes: ['foo'] } })
  expect(html).toStartWith('<section class="foo"><p>a')
  expect(html).toInclude('<section class="b" id="a"><p>b')
  expect(html).toInclude('<section><p>c')
})

test('generic block', () => {
  const { html } = renderLines(['[.info]', '  # Hello', '  para', '  ---', '  World'])
  expect(html).toInclude('<div class="info">')
  expect(html).toInclude('<p>para</p>')
})

test('reflinks', () => {
  const links = { dude: '//hey.net "boom"' }
  const lines = ['[hey][yolo] [dude][dude]', '[.foo]', '[yolo]: yolo.co "lol"']
  const { html } = renderLines(lines, { data: { links } })

  expect(html).toInclude('<a href="yolo.co" title="lol">hey</a>')
  expect(html).toInclude('<a href="//hey.net" title="boom">dude</a>')
})

test('H1 with inner <em>', () => {
  const { id } = parseHeading('# Hey _bro_ *man*')
  expect(id).toEqual('hey-bro-man')
})

test('render heading', () => {
  const h1 = renderHeading('Hey', 1, 'This is a too long text version of it')
  expect(h1).toEqual('<h1>Hey</h1>')

  const h2 = renderHeading('Foo <em>bar</em> { #baz }', 2, 'Foo bar { #baz }')
  expect(h2).toEqual('<h2 id="baz"><a href="#baz" title="Foo bar"></a>Foo <em>bar</em></h2>')

  const h3 = renderHeading('Hey { .baz }', 3, 'Hey { .baz }')
  expect(h3).toEqual('<h3 class="baz">Hey</h3>')
})

test('parseHeading', () => {
  const h1 = parseHeading('# Hey { #me-too.hey.yo }')
  expect(h1.text).toBe('# Hey')
  expect(h1.id).toBe('me-too')
  expect(h1.class).toBe('hey yo')

  const h2 = parseHeading('## Hey { .foo }')
  expect(h2.text).toBe('## Hey')
  expect(h2.class).toBe('foo')
})


test('page island', () => {
  const { html } = renderLines(['yo', '[hey]', '  bar: 2'])
  expect(html).toInclude('<p>yo</p>')
  expect(html).toInclude('is="hey"')
  expect(html).toInclude('{"bar":2}')
})

// rendering blocks
test('renderIsland', () => {
  const attr = { id: 'epic' }
  const data = { count: 10 }
  const island = renderIsland({ name: 'foo', attr, data })
  expect(island).toInclude('<div id="epic" is="foo"')
  expect(island).toInclude('{"count":10}')
})



// page parsing
test('parse sections', () => {
  const els = parseSections(['a', 'a'])
  expect(els[0].lines).toEqual(['a', 'a'])
  expect(els.length).toBe(1)
})

test('parse sections', () => {
  const lines = ['a', 'a', '--- #a.b', 'b', 'b', '---', 'c', 'c']
  const sections = parseSections(lines)
  const [a, b, c] = sections
  expect(sections.length).toBe(3)
  expect(a.lines).toEqual(['a', 'a'])
  expect(b.attr).toEqual({ id: "a", class: "b" })
  expect(c.lines).toEqual(['c', 'c'])
})


test('parse page', () => {
  const page = parsePage(['# Hello', '## World', '[foo]: bar', '[tabs foo=1]', '  bar: 2'])

  expect(page.isomorphic).toBe(true)
  expect(page.links).toHaveProperty('foo')
  expect(page.headings.length).toBe(2)

  const { blocks } = page.sections[0]
  expect(blocks.length).toBe(2)
  expect(blocks[1].data).toEqual({ foo: 1, bar: 2 })
})


test('parse page: ! component', () => {
  const page = parsePage(['[! "/foo"]'])
  const { data, name } = page.sections[0].blocks[0]
  expect(data._).toBe('/foo')
  expect(name).toBe('!')
})

// blocks within sections
test('parse blocks', () => {
  const blocks = parseBlocks(['Hello', '[foo]', '  bar: 10', 'World'])
  const [intro, comp, outro] = blocks
  expect(intro).toEqual(['Hello'])
  expect(comp.name).toEqual('foo')
  expect(comp.body).toEqual(["bar: 10"])
  expect(outro).toEqual(['World'])
})

test('parse single content block', () => {
  const [intro, comp] = parseBlocks(['Yo', '[.info]', '  Hello', '  World'])
  expect(comp.attr.class).toBe('info')
  expect(comp.body).toEqual(["Hello", "World"])
})


test('parseMeta', () => {
  expect(parseMeta(['']).rest).toEqual([''])

  expect(parseMeta(['# Hey']).rest).toEqual(['# Hey'])

  expect(parseMeta(['---', 'title: foo', '---']))
    .toEqual({ meta: { title: "foo" }, rest: [] })

  expect(parseMeta(['---', 'foo: 10', '---', '# Hey']))
    .toEqual({ meta: { foo: 10 }, rest: ['# Hey'] })
})


// parsing components
test('valueGetter', () => {
  const { str, getValue } = valueGetter(`foo="yo" bar="hey dude"`)
  expect(str).toBe('foo=:1: bar=:2:')
  expect(getValue(':1:')).toBe('yo')
  expect(getValue(':2:')).toBe('hey dude')
})

test('parseAttr', () => {
  expect(parseAttr('.bar#foo')).toEqual({ id: 'foo', class: 'bar' })
  expect(parseAttr('.bar#foo.baz')).toEqual({ id: 'foo', class: 'bar baz' })
})

test('parseSpecs', () => {
  expect(parseSpecs('tabs')).toEqual({ name: 'tabs', attr: {} })
  expect(parseSpecs('tabs.#foo.bar')).toEqual({ name: 'tabs', attr: { id: 'foo', class: 'bar' } })
})

test('parse plain args', () => {
  const { name, data }= parseComponent('video src="/a.mp4" loop muted')
  expect(name).toBe('video')
  expect(data.loop).toBe(true)
  expect(data.muted).toBe(true)
})

test('parseComponent', () => {

  expect(parseComponent('#foo.bar')).toEqual({
    attr: { id: "foo", class: "bar" },
    name: null,
    data: {},
  })

  expect(parseComponent('list.tweets')).toEqual({
    attr: { class: "tweets" },
    name: 'list',
    data: {},
  })

  expect(parseComponent('tip "Hey there"')).toEqual({
    data: { _: 'Hey there' },
    name: 'tip',
    attr: {},
  })

  expect(parseComponent('img /foo')).toEqual({
    data: { _: '/foo' },
    name: 'img',
    attr: {},
  })

  expect(parseComponent('item cols=3 grayed')).toEqual({
    data: { cols: 3, _: 'grayed', grayed: true },
    name: 'item',
    attr: {},
  })

  expect(parseComponent('info#alert "Sure ??" class="boss"')).toEqual({
    attr: { class: 'boss', id: 'alert' },
    data: { _: 'Sure ??' },
    name: 'info',
  })

})


test('blockquotes', () => {
  const { html } = renderLines(['> hey', '', 'joe'])
  expect(html).toInclude('</blockquote>\n<p>joe</p>')
})

/*
  Required:
  bun add react
  bun add react-dom
*/
test('JSX component', async () => {
  try {
    // import React SSR (server side rendering) API method
    const { renderToString } = await import('react-dom/server')

    // import custom JSX components
    const jsx = await import('./react-lib')

    // make them compatible with Nuemark
    const lib = Object.keys(jsx).map(name => {
        return { name, render: (data) => renderToString(jsx[name](data)) }
    })

    // render JSX with Nuemark
    const html = nuemarkdown('[my-test]', { lib, data: { message: 'Hello' } })

    expect(html).toBe('<h1 style="color:red">Hello</h1>')

      // react not imported
  } catch (ignored) {
    console.info('JSX test skipped')
  }
})
