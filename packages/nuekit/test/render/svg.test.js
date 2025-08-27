
import { renderFonts, renderHMR, renderSVG, convertHTMLTag } from '../../src/render/svg'


test('renderFont / inlined', async () => {
  const [ css ] = await renderFonts({ Test: 'render/svg.test.js' })
  expect(css).toInclude('data:font/woff2;base64')
  expect(css.length).toBeGreaterThan(200)
  expect(css).toInclude('@font-face')
})

test('renderFonts / external', async () => {
  const [ css ] = await renderFonts({ Test: 'test.woff2' }, true)
  expect(css).toBe(`@font-face { font-family: 'Test'; src: url('/test.woff2')}`)
})

test('renderFonts: bad path', async () => {
  const ret = await renderFonts({ Test: 'foo' })
  expect(ret).toEqual([])
})

test('renderHMR', () => {
  const html = renderHMR({
    body: '<svg>',
    base: 'foo.svg',
    fonts: ['@font-face {}'],
    styles: [{ url: '/foo.css' }]
  })

  expect(html).toInclude('@font-face')
  expect(html).toInclude('href="/foo.css"')
  expect(html).toInclude('/@nue/hmr.js')
  expect(html).toInclude('<body><svg></body>')
})

test('renderHMR', async () => {

  const asset = {
    async data() { return {} },
    async components() { return [] },
    async config() { return {} },

    base: 'test.svg',

    async parse() {
      const attr = [{ name: 'width', val: 100 }, { name: 'height', val: 100 }]
      return {
        root: { tag: 'svg', attr, meta: { css: '[ table ]' } },
      }
    },
    async assets() {
      async function text() { return `:root { --brand: #ccc }` }
      return [ { is_css: true, path: 'table.css', url: '/table.css', text } ]
    },

  }

  const html = await renderSVG(asset, { hmr: '', fonts: { Test: 'test.woff' } })
  expect(html).toInclude('<!doctype html>')
  expect(html).toInclude('@font-face')
  expect(html).toInclude('<link rel="stylesheet" href="/table.css">')
  expect(html).toInclude('xmlns="http://www.w3.org/2000/svg')
  expect(html).toInclude('0 0 100 100')

  const svg = await renderSVG(asset, { fonts: { Test: 'render/svg.test.js' } })
  expect(svg).toInclude("url('data:font/woff2;base64")
  expect(svg).toInclude(':root{--brand:#ccc}')
  expect(svg).toInclude('</style></svg>')

})


test('custom <html> tag', () => {
  const { tag, children, attr } = convertHTMLTag({ tag: 'html', children: [{ tag: 'table' }] })
  expect(tag).toBe('foreignObject')
  expect(attr.length).toBe(4)
  expect(children[0].attr[0].name).toEqual('xmlns')

})