
import { createAsset } from '../../src/asset'


test('MD: page assets', async () => {

  const files = [
    { is_html: true, path: 'header.html', async text() { return '<!html lib><header class="foo"/> <navi/>' }},
    { is_html: true, path: 'footer.html', async text() { return '<!html lib><footer/>' }},
    { is_html: true, path: 'reactive.html', async text() { return '<!dhtml lib> <foo/>' }},
  ]

  const page = createAsset({
    async text() { return '# Hello' },
    path: 'page.md',
    is_md: true,
  }, { files })

  // document meta
  const doc = await page.parse()
  expect(doc.meta.title).toBe('Hello')

  // layout components
  const comps = await page.components()
  expect(comps.length).toBe(3)
  expect(comps[0].tag).toBe('header')

  // render HTML
  const html = await page.render()
  expect(html).toInclude('<header class="foo">')
  expect(html).toInclude('script src="/@nue/mount.js"')

})

test('MD: custom tags with <slot/>', async () => {
  const files = [
    { is_html: true, path: 'c.html', async text() {
      return '<!html lib><custom class="{ class } { nothing }"><slot/></custom>'
    }}
  ]
  const page = createAsset({
    async text() { return ['# Hello', '[custom.blue]', '  World'].join('\n') },
    is_md: true,
  }, { files })

  const html = await page.render()
  expect(html).toInclude('<div class="blue">World</div>')
})


test('Built-in functions & variables', async () => {
  const file = { is_html: true, path: 'c.html', async text() {
    return `
      <!html lib>
      <header>
        <pretty-title/>
        <p>{ headings.length }</p>
        <p>{ url }</p>
      </header>

      <pretty-title>
        {{ markdown("*hey*") }}
      </pretty-title>
    `
  }}

  const page = createAsset({
    async text() { return '# Hey' },
    is_md: true,
    url: '/'
  }, { files: [file] })

  const html = await page.render()
  expect(html).toInclude('<header><div><em>hey</em></div> <p>1</p> <p>/</p></header>')
})

