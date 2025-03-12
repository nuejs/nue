import { parseRow, renderRow, parseSyntax } from '../src/glow.js'

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

test('parse Lua comment on its own line', () => {
  const html = renderRow('-- comment', 'lua')
  expect(html).toBe('<sup>-- comment</sup>')
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
