
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
const HTML_COMMENT = `
<div>
  <!--
    First
    Second
  -->
</div>`

const JS_COMMENT = `
/* First */
function() {
  /*
    Second
  */
}
`

test('extract comments', () => {
  let blocks = parseSyntax(HTML_COMMENT.trim())
  expect(blocks[1].comment[0]).toBe('  <!--')

  blocks = parseSyntax(JS_COMMENT.trim())
  expect(blocks[0].comment).toEqual(['/* First */'])
  expect(blocks[2].comment[0]).toEqual('  /*')
})
