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
