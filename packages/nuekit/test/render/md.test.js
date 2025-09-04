
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
  }, files)

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
  const page = createAsset({
    async text() { return ['# Hello', '[custom.blue]', '  World'].join('\n') },
    is_md: true,
  }, [
    { is_html: true, path: 'c.html', async text() {
      return '<!html lib><custom class="{ class } { nothing }"><slot/></custom>'
    }}
  ])

  const html = await page.render()
  expect(html).toInclude('<div class="blue">World</div>')
})


test('Built-in functions & variables', async () => {
  const page = createAsset({
    async text() { return '# Hey' },
    is_md: true,
    url: '/'
  }, [
    { is_html: true, path: 'c.html', async text() {
      return `
        <!html lib>
        <header>
          {{ markdown("*hey*") }}
          <p>{ headings.length }</p>
          <p>{ url }</p>
        </header>`
    }}
  ])

  const html = await page.render()
  expect(html).toInclude('<header><em>hey</em><p>1</p> <p>/</p></header>')
})

