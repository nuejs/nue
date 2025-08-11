
import { tokenize } from '../src/compiler/tokenizer.js'


test('tag', () => {
  expect(tokenize('<p>Hello</p>')).toEqual(['<p>', 'Hello', '</p>'])
})

test('self-closing tag', () => {
  expect(tokenize('<div/>')).toEqual(['<div/>'])
})

test('expressions', () => {
  const tokens = tokenize('<span>{ text } foo {{ html }} bar {{{ html }}}</span>')
  expect(tokens).toEqual(
    [ "<span>", "{ text }", " foo ", "{{ html }}", " bar ", "{{ html }}", "</span>" ]
  )
})

test('nested tags', () => {
  expect(tokenize('<div><p>Hi</p></div>')).toEqual(['<div>', '<p>', 'Hi', '</p>', '</div>'])
})

test('open tags', () => {
  expect(tokenize('<hr>')).toEqual(['<hr/>'])
  expect(tokenize('<img src>')).toEqual(['<img src/>'])
  expect(tokenize('<hr><a></a>')).toEqual(['<hr/>', '<a>', '</a>'])
})

test('complex', () => {
  const els = tokenize(`
    <div>
      <p foo="10">Hi</p>
      <span><b>there</b></span>
    </div>
  `)
  expect(els.length).toBe(10)
})

test('simple, unquoted attributes', () => {
  const els = tokenize('<p :onclick=hey>Hi</p>')
  expect(els[0]).toBe('<p :onclick=hey>')
  expect(els.length).toBe(3)
})

test('class helper', () => {
  const els = tokenize('<p :class="{ foo: true }">Hi</p>')
  expect(els.length).toBe(3)
})

test('single quoted attr', () => {
  const els = tokenize(`<p :class='{ boo || "baz" }'>Hi</p>`)
  expect(els.length).toBe(3)
})

test('complex attribute', () => {
  const els = tokenize('<p :class="{ foo: true } baz { bar }">Hi</p>')
  expect(els.length).toBe(3)
})

test('elem with attributes', () => {
  expect(tokenize('<div class=test disabled>')).toEqual(['<div class=test disabled>'])
})

test('newlines', () => {
  const els = tokenize(`
    <div
      amount="10"
      class="bar"/>
  `)
  expect(els.length).toBe(1)
})

test('if and angle brackets', () => {
  expect(tokenize('<a :if="var > 10"/>').length).toBe(1)
  expect(tokenize('<a :if="{ var < 10 }"/>').length).toBe(1)
  expect(tokenize('<b :if="am < 50"/>').length).toBe(1)
})

test('unclosed tag throws', () => {
  expect(() => tokenize('<a href="boo"<b/>')).toThrow(SyntaxError)
})

test('comments', () => {
  const els = tokenize(`
    <h1>Hello</h1>
    <!--
      <b>World</p>
    -->
  `)

  expect(els.join('').trim()).toEqual('<h1>Hello</h1>')
})

test('annotations', () => {
  const els = tokenize(`
    <!--
      @license MIT
      @author tipiirai
    -->
    <h1>Hello</h1>
  `)

  expect(els[0].meta).toEqual({license: "MIT", author: "tipiirai" })
})


test('scripts with expressions', () => {
  const tokens = tokenize('<a><script>`{expr}`</script></a>')
  expect(tokens.length).toBe(5)
  expect(tokens[2]).toBe('`{expr}`')
})

test('scripts with inner HTML', () => {
  const tokens = tokenize('<a><script>"<b>B</b>"</script></a>')
  expect(tokens.length).toBe(5)
  expect(tokens[2]).toBe('"<b>B</b>"')
})




