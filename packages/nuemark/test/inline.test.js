
import { renderTokens, renderToken, renderInline } from '../src/render-inline.js'
import { parseInline, parseLink } from '../src/parse-inline.js'


test('plain text', () => {
  const tests = [
    'Hello, World!',
    'Unclosed "quote',
    'Unclosed ****format',
    'Unopened italics__ too',
    'Mega # weir%$ ¶{}€ C! char *s',
    'A very long string \n with  odd \t spacing',
  ]

  for (const test of tests) {
    const [{ text }] = parseInline(test)
    expect(text).toBe(test)
  }
})


test('formatting', () => {
  const tests = [
    ['_', '*yo*', 'em'],
    ['*', 'yo 90', 'em'],
    ['__', 'Ö#(/&', 'strong'],
    ['**', 'go _ open', 'strong'],
    ['~', 'striked', 's'],
    ['/', 'italic', 'i'],
    ['•', 'bold', 'b'],
    // ['|', 'mark', '|'],
  ]

  for (const test of tests) {
    const [ chars, body, tag ] = test
    const html = parseInline(`A ${chars + body + chars} here`)
    expect(html[1].tag).toBe(tag)
    expect(html[1].body).toBe(body)
    expect(html.length).toBe(3)
  }
})

test('formatting inside string', () => {
  expect(renderInline('a_b_c')).toBe('a_b_c')
  expect(renderInline('a/c/d')).toBe('a/c/d')
  expect(renderInline('a _b_')).toBe('a <em>b</em>')
  expect(renderInline('a _b_ c')).toBe('a <em>b</em> c')
})

test('formatting and special chars at the end', () => {
  expect(renderInline('**hello**')).toBe('<strong>hello</strong>')
  expect(renderInline('**hello**:')).toEndWith('</strong>:')
  expect(renderInline('**hello**,')).toEndWith('</strong>,')
  expect(renderInline('**hello*')).toBe('**hello*')
  expect(renderInline('** hello **')).toBe('** hello **')
  expect(renderInline('** hello**')).toBe('** hello**')
})

test('bold + em', () => {
  expect(renderInline('***hello***')).toBe('<em><strong>hello</strong></em>')
  expect(renderInline('___hello___')).toBe('<em><strong>hello</strong></em>')
  expect(renderInline('___ hello ___')).toBe('___ hello ___')
})

test('unclosed formatting', () => {
  expect(renderInline('_foo *bar*')).toBe('_foo <em>bar</em>')
  expect(renderInline('yo /foo /bar _baz_')).toBe('yo /foo /bar <em>baz</em>')
  expect(renderInline('foo/bar *baz*')).toBe('foo/bar <em>baz</em>')
})

test('inline render basics', () => {
  const tests = [
    { text: 'hey', html: 'hey' },
    { is_format: true, tag: 'b', body: 'hey', html: '<b>hey</b>' },
    { is_format: true, tag: 'b', body: '*hey*', html: '<b><em>hey</em></b>' },
    { href: '/', label: 'hey', html: '<a href="/">hey</a>' },
    { href: '/', label: '*hey*', html: '<a href="/"><em>hey</em></a>' },
    { href: '/', label: 'hey', title: 'yo', html: '<a title="yo" href="/">hey</a>' },
  ]

  for (const test of tests) {
    const html = renderToken(test)
    expect(html).toBe(test.html)
  }
})


// image
test('render image', () => {
  const html = renderInline('![foo](/bar.png) post')
  expect(html).toBe('<img src="/bar.png" alt="foo" loading="lazy"> post')
})

test('unclosed image', () => {
  expect(renderInline('![foo]')).toStartWith('!<foo custom')
})

test('inline HTML', () => {
  expect(renderInline('<! kama >')).toBe('&lt;! kama &gt;')
})

test('inline code', () => {
  const html = renderInline('Hey `[zoo] *boo*`')
  expect(html).toBe('Hey <code>[zoo] *boo*</code>')

  expect(renderInline('Hey `<script>`')).toBe('Hey <code>&lt;script&gt;</code>')
})

test('HTML escaping', () => {
  const html = renderInline('Hey <script>')
  expect(html).toBe('Hey &lt;script&gt;')
})

test('escaping', () => {
  expect(renderInline('Hey \\*bold* dude')).toBe('Hey *bold* dude')
  expect(renderInline('Hey \\{ var }')).toBe('Hey { var }')
  expect(renderInline('Hey \\[tag]')).toBe('Hey [tag]')
})


test('simple link', () => {
  const [text, link] = parseInline('Goto [label](/url/)')
  expect(link.label).toBe('label')
  expect(link.href).toBe('/url/')
})

test('link subject', () => {
  const link = parseLink('[Hello](/world "today")')
  expect(link).toMatchObject({ href: '/world', title: 'today', label: 'Hello' })
})

test('parse inline link', () => {
  const [text, link] = parseInline('Goto [label](/url/ "the subject")')
  expect(link.title).toBe('the subject')
  expect(link.label).toBe('label')
  expect(link.href).toBe('/url/')
})

test('parse reflink', () => {
  const link = parseLink('[Hello][world "now"]', true)
  expect(link).toMatchObject({ href: 'world', title: 'now', label: 'Hello' })
})


test('bad component names', () => {
  const tests = ['[(10)] [3 % 8]', '[-hey]', '[he+y] there']
  for (const test of tests) {
    const html = renderInline(test)
    expect(html).toBe(test)
  }
})

test('inline image tag', () => {
  const html = renderInline('[! foo.svg]')
  expect(html).toStartWith('<figure>')
})

test('image link', () => {
  const html = renderInline('[![](/img/foo.png)](/)')
  expect(html).toStartWith('<a href="/"><img src="/img/foo.png"')
})

test('complex label with an image', () => {
  const complex_label = 'Hey ![Cat](/cat.png)!'
  const link = `[${complex_label}](/link/ "lol")`

  const el = parseLink(link)
  expect(el.label).toBe(complex_label)
  expect(el.href).toBe('/link/')

  const html = renderInline(link)
  expect(html).toStartWith('<a title="lol" href="/link/">Hey')
  expect(html).toEndWith('alt="Cat" loading="lazy">!</a>')
})


test('parse complex Wikipedia-style link', () => {
  const [text, link, rest] = parseInline('Goto [label](/url/(master)) plan')
  expect(link.href).toBe('/url/(master)')
})

test('parse footnote link', () => {
  const link = parseLink('[Hello][^1]', true)
  expect(link.href).toBe('#^1')
})

test('parse footnote ref', () => {
  const [text, tag] = parseInline('Hello [^1]', true)
  expect(tag.href).toBe('#^1')
})

test('render footnote link', () => {
  const noterefs = ['^1', '^go']
  const rel = { is_footnote: true, href: '#^go' }
  const html = renderToken(rel, { noterefs })
  expect(html).toStartWith('<a href="#^go" rel="footnote">')
  expect(html).toInclude('<sup role="doc-noteref">2</sup>')
})

test('footnote mix', () => {
  const html = renderInline('[a][^1] b [^1]', { noterefs: ['^1'] })
  expect(html).toInclude('a<sup')
  expect(html).toEndWith('1</sup></a>')
})


test('render reflinks', () => {
  const ref = { href: '/', title: 'Bruh' }
  const html = renderToken({ href: 'ref', label: 'Foobar' }, { reflinks: { ref } })
  expect(html).toBe('<a title="Bruh" href="/">Foobar</a>')
})

test('parse simple image', () => {
  const [text, img] = parseInline('Image ![](yo.svg)')
  expect(img.is_image).toBeTrue()
  expect(img.href).toBe('yo.svg')
})

// anonymous tag
test('inline span', () => {
  const html = renderInline('hello [.green "world"]!')
  expect(html).toBe('hello <span class="green">world</span>!')
})

test('empty inline span', () => {
  const html = renderInline('[.myclass#myid]')
  expect(html).toStartWith('<span ')
  expect(html).toInclude('class="myclass"')
  expect(html).toInclude('id="myid"')
  expect(html).toEndWith('></span>')
})

// named default html tag
test('inline html tag', () => {
  const html = renderInline('[b "*content*"]')
  expect(html).toBe('<b><em>content</em></b>')
})

test('empty inline html tag', () =>  {
  const html = renderInline('[del.pink.border#myid]')
  expect(html).toStartWith('<del ')
  expect(html).toInclude('id="myid"')
  expect(html).toInclude('class="pink border"')
  expect(html).toEndWith('></del>')
})

// parse tags and args
test('inline tag', () => {
  const [el] = parseInline('[version]')
  expect(el.name).toBe('version')
})

test('inline tag with reflink', () => {
  const els = parseInline('[tip] and [link][foo]')
  const [ tag, and, link] = els
  expect(tag.is_tag).toBeTrue()
  expect(tag.name).toBe('tip')
  expect(link.is_reflink).toBeTrue()
})

test('link with a tag', () => {
  const html = renderInline('[[my-tag]](/)')
  expect(html).toBe('<a href="/"><my-tag custom="my-tag"></my-tag></a>')
})

test('link with image tag', () => {
  const html = renderInline('lol [[! yo.svg]](/)')
  expect(html).toStartWith('lol <a href="/">')
  expect(html).toEndWith('src="yo.svg"></figure></a>')
})


test('tag args', () => {
  const [ text, comp, rest] = parseInline('Hey [print foo] thing')
  expect(comp.name).toBe('print')
  expect(comp.data.foo).toBeTrue()
})

test('{ variables }', () => {
  const tokens = parseInline('v{ version } ({ date })')
  expect(tokens.length).toBe(5)
  expect(tokens[1]).toEqual({ is_var: true, name: "version" })

  const data = { version: '1.0.1', date: '2025-01-01' }
  const text = renderTokens(tokens, { data })
  expect(text).toBe('v1.0.1 (2025-01-01)')
})

test('complex variable getters', () => {
  const opts = { data: { package: { name: 'glow', items: [1, 2] } }}
  expect(renderInline('{ package.name }', opts)).toBe('glow')
  expect(renderInline('{ package.items[0] }', opts)).toBe('1')
  expect(renderInline('{ package.name.toUpperCase() }', opts)).toBe('GLOW')
  expect(renderInline('{ zap.erro.boo }', opts)).toBe('')
})


test('{ #foo.bar }', () => {
  const tokens = parseInline('Hey { #foo.bar }')
  expect(tokens[1].attr).toEqual({ class: "bar", id: "foo" })

  const text = renderTokens(tokens)
  expect(text.trim()).toEqual('Hey')
})

