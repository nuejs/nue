
import {
  parseFor,
  parseForArgs,
  tokenizeAttr,
  parseExpression,
  parseAttributes,
  parseClassHelper

} from '../src/compiler/attributes.js'


test('attr tokenize basics', () => {
  const attr = 'class=test disabled :onclick="log($event)"'
  expect(tokenizeAttr(attr)).toEqual(['class=test', 'disabled', ':onclick=log($event)'])
})

test('tokenize class helper', () => {
  const attr = 'class="{ active: active(item), foo: true } bar"'
  expect(tokenizeAttr(attr)).toEqual(["class={ active: active(item), foo: true } bar"])
})

test('tokenize complex', () => {
  const attr = `:onclick="this.fire('bomb' == state) || console.log(a || $event)" disabled goto="10"`
  const attrs = tokenizeAttr(attr)
  expect(attrs[0]).toBe(":onclick=this.fire('bomb' == state) || console.log(a || $event)")
  expect(attrs.length).toBe(3)
})

// parse expression
test('plain value', () => {
  expect(parseExpression('plain value')).toBeUndefined()
})

test('expression', () => {
  expect(parseExpression('${ 1 + 1 }')).toBe('(1 + 1)')
})

test('interpolation', () => {
  expect(parseExpression("foo ${ cute('hey') } baz")).toBe(`"foo " + (_.cute('hey')) + " baz"`)
})

test('complex expression', () => {
  const expr = '${ cute ? prettyDate(date) : new Date() } more'
  expect(parseExpression(expr)).toBe(('(_.cute ? _.prettyDate(_.date) : new Date()) + " more"'))
})

test('class helper', () => {
  expect(parseClassHelper("tabular: true, is-active: false")).toBe('_.$concat({tabular: true, "is-active": false})')
})

test('class helper plain value', () => {
  expect(parseClassHelper("hypa, move: 1")).toBe('_.$concat({hypa: _.hypa, move: 1})')
})

test('complex class helper', () => {
  const expr = parseExpression('prefix { hey: bar, boo: baz() }', 'class')
  expect(expr).toBe('"prefix " + _.$concat({hey: _.bar, boo: _.baz()})')
})


// for arguments
test('for args', () => {
  expect(parseForArgs('item, $i')).toMatchObject({ keys: ['item'], index: '$i' })
})

test('for arg parenthesis', () => {
  expect(parseForArgs('(item, i)')).toMatchObject({ keys: ['item'], index: 'i' })
})

test('[k, v]', () => {
  expect(parseForArgs('[k, v]')).toEqual({ keys: ['k', 'v'], is_entries: true })
})

test('([k, v])', () => {
  expect(parseForArgs('([k, v])')).toEqual({ keys: ['k', 'v'], is_entries: true })
})

test('[lang, text], i', () => {
  expect(parseForArgs('[lang, text], i')).toEqual({ keys: ['lang', 'text'], index: 'i', is_entries: true })
})

test('({ lang, text }, i)', () => {
  expect(parseForArgs('({ lang, text }, i)')).toMatchObject({ keys: ['lang', 'text'], index: 'i' })
})

test('({k, v})', () => {
  expect(parseForArgs('({k, v})')).toEqual({ keys: ['k', 'v'], is_entries: false })
})



test('simple for clause', () => {
  expect(parseFor('item, i in items')).toMatchObject({ fn: '_.items', keys: ['item'], index: 'i' })
})

test('complex for clause', () => {
  expect(parseFor('({ foo, bar }, $index) in Object.entries(items)')).toMatchObject({
    fn: 'Object.entries(_.items)',
    keys: ['foo', 'bar'],
    index: '$index'
  })
})

test('basic attrs', () => {
  const [a, b] = parseAttributes('class=test disabled').attr
  expect(a).toEqual({ name: "class", val: "test" })
  expect(b).toEqual({ name: "disabled", bool: true, val: true })
})

test('equals character', () => {
  const [ attr ] = parseAttributes('href="?id=100"').attr
  expect(attr.name).toBe('href')
  expect(attr.val).toBe('?id=100')
})


test('event argument', () => {
  expect(parseAttributes(':oninput="seek(index, $event)"').handlers[0]).toEqual({
    h_fn: '_.seek(_.index, $e)',
    name: 'oninput',
  })
})

test('for attribute', () => {
  expect(parseAttributes(':for="item, i of items"').for).toMatchObject({
    fn: '_.items',
    keys: [ 'item' ],
    index: 'i',
  })
})

test('if attribute', () => {
  expect(parseAttributes(':if="item"')).toEqual({ if: "_.item" })
})

test('skip style attribute', () => {
  const { attr } = parseAttributes('width=100 style="color: blue"')
  expect(attr.length).toBe(1)
})


