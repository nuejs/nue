
import { renderHead, renderStyles } from '../src/render/head'

test('renderHead', async () => {
  const conf = {
    import_map: { d3: 'd3.js' },
    rss: { enabled: true }
  }

  const data = {
    title: 'Hello',
    version: '1.0',
    og: 'og.png',
    dir: 'img'
  }

  const deps = [
    { ext: '.js',  dir: 'ui', name: 'ping' },
    { ext: '.ts',  dir: 'ui', name: 'pong' },

    { is_css: true, path: 'base.css' },

    { is_html: true, path: 'ui/form.html', parse() {
      return { is_lib: true, is_dhtml: true }}
    }
  ]

  const html = await renderHead({ conf, data, deps })

  expect(html).toInclude('<script type="importmap">')
  expect(html).toInclude('{"imports":{"d3":"d3.js"}}')
  expect(html).toInclude('<script src="/@nue/hmr.js"')
  expect(html).toInclude('<script src="/ui/ping.js"')
  expect(html).toInclude('<script src="/ui/pong.js"')
  expect(html).toInclude('<meta name="libs" content="ui/form.html">')
  expect(html).toInclude('<link rel="stylesheet" href="/base.css">')
  expect(html).toInclude('type="application/rss+xml" href="/feed.xml">')
  expect(html).toInclude('<meta property="og:image" content="/img/og.png">')
})


test('data and inline css', async () => {
  const conf = {
    is_prod: true,
    site: { origin: 'https://acme.org' },
    design: { layers: [ 'base', 'layout' ] }
  }

  const data = {
    og_image: '/img/og.webp',
    title_template: 'Acme / %s',
    title: 'Hello'
  }

  const deps = [
    { is_css: true, text() { return 'html { --color: #ccc }' }, path: 'nope.css' },
  ]

  const html = await renderHead({ conf, data, deps })

  expect(html).toInclude('<title>Acme / Hello</title>')
  expect(html).toInclude('name="og:title" content="Acme / Hello"')
  expect(html).toInclude('<style>@layer base, layout;html{--color:#ccc}</style>')
  expect(html).not.toInclude('stylesheet')
  expect(html).not.toInclude('hmr.js')
  expect(html).toInclude('"og:image" content="https://acme.org/img/og.webp"')
})


test('renderStyles', async () => {
  const design = { layers: [ 'base' ] }

  const deps = [
    { is_css: true, text() { return 'p { color: red }' }, path: 'nope.css' },
  ]

  // @layer order and stylesheets
  const [ style, link ] = await renderStyles(deps, { design })
  expect(style).toBe('<style>@layer base;</style>')
  expect(link).toBe('<link rel="stylesheet" href="/nope.css">')

  // inline CSS
  const arr = await renderStyles(deps, { design, is_prod: true })
  expect(arr).toEqual([ "<style>@layer base;p{color:red}</style>" ])

})
