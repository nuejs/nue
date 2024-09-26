
import { renderTokens, renderToken, renderInline } from '../src/render-inline.js'
import { parseInline, parseLink } from '../src//parse-inline.js'


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
    expect(test).toBe(text)
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
  ]

  for (test of tests) {
    const [ chars, body, tag ] = test
    const ret = parseInline(`A ${chars + body + chars} here`)
    expect(ret[1].tag).toBe(tag)
    expect(ret[1].body).toBe(body)
    expect(ret.length).toBe(3)
  }
})

test('inline render basics', () => {
  const tests = [
    { text: 'hey', html: 'hey' },
    { is_format: true, tag: 'b', body: 'hey', html: '<b>hey</b>' },
    { is_format: true, tag: 'b', body: '*hey*', html: '<b><em>hey</em></b>' },
    { href: '/', label: 'hey', html: '<a href="/">hey</a>' },
    { href: '/', label: '*hey*', html: '<a href="/"><em>hey</em></a>' },
    { href: '/', label: 'hey', title: 'yo', html: '<a href="/" title="yo">hey</a>' },
  ]

  for (test of tests) {
    const html = renderToken(test)
    expect(html).toBe(test.html)
  }
})


test('parse simple link', () => {
  const [text, link] = parseInline('Goto [label](/url/)')
  expect(link.label).toBe('label')
  expect(link.href).toBe('/url/')
})

// image
test('render image', () => {
  const html = renderInline('![foo](/bar.png) post')
  expect(html).toBe('<img src="/bar.png" alt="foo" loading="lazy"> post')
})

test('inline code', () => {
  const html = renderInline('Hey `[zoo] *boo*`')
  expect(html).toBe('Hey <code>[zoo] *boo*</code>')
})

test('escaping', () => {
  expect(renderInline('Hey \\*bold* dude')).toBe('Hey *bold* dude')
  expect(renderInline('Hey \\{ var }')).toBe('Hey { var }')
  expect(renderInline('Hey \\[tag]')).toBe('Hey [tag]')
})


test('parse link', () => {
  const link = parseLink('[Hello](/world "today")')
  expect(link).toMatchObject({ href: '/world', title: 'today', label: 'Hello' })
})

test('parse reflink', () => {
  const link = parseLink('[Hello][world "now"]', true)
  expect(link).toMatchObject({ href: 'world', title: 'now', label: 'Hello' })
})


test('parse reflink', () => {
  const [text, link] = parseInline('Baz [foo][bar]')
  expect(link.label).toBe('foo')
  expect(link.href).toBe('bar')
})

test('parse complex link', () => {
  const [text, link, rest] = parseInline('Goto [label](/url/(master)) plan')
  expect(link.href).toBe('/url/(master)')
})


test('render reflinks', () => {
  const foo = { href: '/', title: 'Bruh' }
  const html = renderToken({ href: 'foo', label: 'Foobar' }, { reflinks: { foo } })
  expect(html).toBe('<a href="/" title="Bruh">Foobar</a>')
})


test('parse subject link', () => {
  const [text, link] = parseInline('Goto [label](/url/ "the subject")')
  expect(link.title).toBe('the subject')
  expect(link.label).toBe('label')
  expect(link.href).toBe('/url/')
})

test('parse simple image', () => {
  const [text, img] = parseInline('Image ![](yo.svg)')
  expect(img.is_image).toBeTrue()
  expect(img.href).toBe('yo.svg')
})


// parse tags and args
test('inline tag', () => {
  const [el] = parseInline('[version]')
  expect(el.name).toBe('version')
})

test('inline tag', () => {
  const [ tag, and, link] = parseInline('[tip] and [link][foo]')
  expect(tag.is_tag).toBeTrue()
  expect(link.is_reflink).toBeTrue()
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

test('{ #foo.bar }', () => {
  const tokens = parseInline('Hey { #foo.bar }')
  expect(tokens[1].attr).toEqual({ class: "bar", id: "foo" })

  const text = renderTokens(tokens)
  expect(text.trim()).toEqual('Hey')
})

