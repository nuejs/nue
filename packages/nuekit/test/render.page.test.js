
import { renderMD, renderSVG, renderHTML, renderSPA } from '../src/render.js'
import { writeAll, removeAll, testDir } from './test-utils.js'
import { createAssets } from '../src/assets.js'

// converted to YAML by writeAll
const SITE_DATA = {
  use: '[ design/*.css, view/*, !app ]',
  brand: 'Acme',
  class: 'wide'
}

const HOME = `
---
sections: true
---

# Hello
Description
`

const paths = await writeAll([
  ['@system/design/base.css', ':root { --accent: red }'],
  ['@system/design/app.css', 'body { font-size: 14px }'],
  ['@system/view/header.html', '<header>${ brand }</header>'],
  ['@system/view/footer.html', '<footer>Copyright</footer>'],

  ['site.yaml', SITE_DATA],
  ['index.md', HOME],

  // server-side HTML
  ['server.html', '<!doctype html><main>${ brand }</main>'],

  // visuals
  ['visuals/components.html', '<foo>Hello</foo>'],
  ['visuals/standalone.svg', '<svg><foo/></svg>'],
  ['visuals/external.svg', '<?xml version="1.0" standalone="no"?><svg><foo/></svg>'],

  // SPA
  ['app/index.html', '<!doctype dhtml><body :is="app">Hello</body>'],

  // dynamic components
  ['app/components.html', '<!doctype dhtml><table :is="userlist"></table>'],
])

const assets = await createAssets(testDir, paths)

afterAll(async () => { await removeAll() })


test('MD', async () => {
  const file = assets.get('index.md')

  const html = await renderMD(file)

  expect(html).toInclude('<title>Hello</title>')
  expect(html).toInclude('<meta name="description" content="Description">')
  expect(html).toInclude('<link rel="stylesheet" href="/@system/design/base.css">')
  expect(html).not.toInclude('href="/@system/design/app.css"')
  expect(html).toInclude('<body class="wide">')
  expect(html).toInclude('<header>Acme</header>')
  expect(html).toInclude('<section><h1>Hello</h1>')
  expect(html).toInclude('<footer>Copyright</footer>')
})

test('standalone SVG', async () => {
  const file = assets.get('visuals/standalone.svg')
  const svg = await renderSVG(file)
  expect(svg).toBe('<svg><style>:root { --accent: red }</style> <div>Hello</div></svg>')
})

test('external SVG', async () => {
  const file = assets.get('visuals/external.svg')
  const svg = await renderSVG(file)
  expect(svg).toInclude('@import url("/@system/design/base.css");')
})

test('custom HTML page', async () => {
  const file = assets.get('server.html')
  const { html } = await renderHTML(file)
  expect(html).toInclude('<main>Acme</main>')
  expect(html).not.toInclude('<body')
})

test('SPA', async () => {
  const file = assets.get('app/index.html')
  const { html, js } = await renderHTML(file)
  expect(html).toInclude('<body :is="app"></body>')
  expect(js).toInclude("export const lib = [ { tag: 'body'")
})

test('dynamic components', async () => {
  const file = assets.get('app/components.html')
  const { html, js } = await renderHTML(file)
  expect(html).toBeNull()
  expect(js).toBe("export const lib = [ { tag: 'table', is: 'userlist' } ]")
})

