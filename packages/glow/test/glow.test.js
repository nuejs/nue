import { glow, parseRow, renderRow, parseSyntax } from '../src/glow.js'

test('HTML', () => {
  const row = '<div class="hello">'

  // parse
  const [char, prop, ...rest] = parseRow(row)

  expect(char.tag).toBe('i')
  expect(prop.tag).toBe('strong')
  expect(prop.start).toBe(5)

  expect(rest.length).toBeGreaterThan(4)

  // render
  const html = renderRow(row)
  expect(html).toStartWith('<i>&lt;</i>')
  expect(html).toInclude('<strong>class</strong>')
  expect(html).toInclude('<em>"hello"</em>')
})

test('Emphasis', () => {
  const html = renderRow('Hey •[img]• girl')
  expect(html).toInclude('Hey <mark>')
  expect(html).toInclude('</i></mark> girl')
})


/* multiline comments */
test('parse HTML comment', () => {
  const blocks = parseSyntax(['<div>', '<!--', 'comment', '-->', '</div>'])
  expect(blocks[1].comment[0]).toBe('<!--')
})


test('parse JS comment', () => {
  const blocks = parseSyntax(['/* First */', 'function() {', '/*', 'Second', '*/'])
  expect(blocks[0].comment).toEqual(['/* First */'])
  expect(blocks[2].comment[0]).toEqual('/*')
})

test('parse TS inline comment', () => {
  const html = renderRow('const colors: Record</* name */ string, /* hex */ string> = {};')
  expect(html).toInclude('Record<i>&lt;</i><sup>/* name */</sup> <strong>string</strong><i>,</i> <sup>/* hex */</sup> <strong>string</strong><i>&gt;</i>')
})


test('parse block comment with content after comment-end', () => {
  const result = glow(`/*
hello
*/ world`, 'js')
  expect(result).toEqual('<code language=\"js\"><sup>/*</sup>\n<sup>hello</sup>\n<sup>*/</sup> world</code>')
})

test('parse inline comment with content after end', () => {
  const result = glow(`/* this is a line comment */ const foo = 2;`, 'js')
  expect(result).toEqual('<code language=\"js\"><sup>/* this is a line comment */</sup> <strong>const</strong> <b>foo</b> <i>=</i> <em>2</em><i>;</i></code>')
})

/* prefix and mark */
test('disable mark', () => {
  const html = renderRow('Hey •[img]• girl', undefined, false)
  expect(html).toInclude('Hey •')
  expect(html).toInclude('• girl')
})

test('escape prefixes', () => {
  const blocks = parseSyntax([
    '\\+ not really adding a line',
    '\\- not really removing a line',
    '\\| not really marking a line'
  ], 'md')

  expect(blocks[0].line).toEqual('+ not really adding a line')
  expect(blocks[1].line).toEqual('- not really removing a line')
  expect(blocks[2].line).toEqual('| not really marking a line')
})

test('disable prefixes', () => {
  const blocks = parseSyntax([
    '+ not really adding a line',
    '- not really removing a line',
    '> not really marking a line'
  ], undefined, false)

  expect(blocks[0].wrap).toEqual(false)
  expect(blocks[1].wrap).toEqual(false)
  expect(blocks[2].wrap).toEqual(false)
})
