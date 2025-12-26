
import { renderPage } from '../src/render/page'
import { getPathInfo } from '../src/asset'
import { parseNuemark } from 'nuemark'
import { parseNue } from 'nuedom'


// the page
const MD = `
---
desc: *Hello*
sections: [ dark, light ]
---

# Hello

[custom hello="World"]
`

const page = getPathInfo('acme/index.md', 'acme')
page.parse = function() { return parseNuemark(MD) }

test('metadata', async () => {
  const data = getPathInfo('site.yaml', 'acme')

  data.parse = function() {
    return {
      og: '/og.png',
      design: { layers: ['base' ] },
      import_map: { foo: 'bar.js' },
    }
  }

  const html = await renderPage(page, ['acme'], [page, data])
  expect(html).toInclude('<meta name="description" content="Hello">')
  expect(html).toInclude('<meta property="og:image" content="/og.png">')
  expect(html).toInclude('<style>@layer base</style>')
  expect(html).toInclude('<script type="importmap">{"imports":{"foo":"bar.js"}}</script>')
})


test('sections & wrap', async () => {
  const data = getPathInfo('site.yaml', 'acme')

  data.parse = function() {
    return {
      content: {
        content_wrapper: 'wrap',
        heading_ids: true,
        sections: true
      }
    }
  }

  const html = await renderPage(page, ['acme'], [page, data])
  expect(html).toInclude('<section class="dark"><div class="wrap">')
  expect(html).toInclude('<h1 id="hello"><a href="#hello"')
})

test('CSS and JS deps', async () => {
  const assets = [
    getPathInfo('@shared/layout/analytics.js', '@base'),
    getPathInfo('@shared/design/base.css', 'acme'),
    getPathInfo('acme/global.js', 'acme'),
    page
  ]

  const html = await renderPage(page, ['acme', '@base'], assets, true)

  expect(html).toInclude('href="/@shared/design/base.css"')
  expect(html).toInclude('src="/global.js" type="module"')
  expect(html).toInclude('src="/@shared/layout/analytics.js"')
  expect(html).toInclude('<h1>Hello</h1>')
  expect(html).not.toInclude('hmr.js')
})


test('server data & layout', async () => {

  // @base: layout
  const layout = getPathInfo('@shared/layout.html', '@base')
  const data = getPathInfo('@shared/data/links.yaml', '@base')
  const comps = getPathInfo('comps.html', 'acme')

  layout.parse = function() {
    return parseNue(`
      <!html lib>
      <header><custom :links/> {{ markdown(desc) }}</header>
    `)
  }

  data.parse = function() {
    return { links: ['a', 'b']}
  }

  comps.parse = function() {
    return parseNue(`
      <!html lib>
      <custom>{ hello }<a :each="link in links">{ link }</a></custom>
    `)
  }

  const html = await renderPage(page, ['acme', '@base'], [page, layout, comps, data])
  expect(html).toInclude('<div>World<a>a</a><a>b</a></div>')
  expect(html).toInclude('<div><a>a</a><a>b</a></div>')
  expect(html).toInclude('<em>Hello</em></header>')
})


test('client components', async () => {
  const comps = getPathInfo('comps.html', 'acme')

  comps.parse = function() {
    return parseNue(`
      <!dhtml lib>
      <hello>Hello</hello>
    `)
  }

  const html = await renderPage(page, ['acme'], [ comps, page ])
  expect(html).toInclude('<meta name="libs" content="comps.html">')
  expect(html).toInclude('<script src="/@nue/mount.js" type="module"></script>')
  expect(html).toInclude('<custom nue="custom">')
  expect(html).toInclude('<script type="application/json">{"hello":"World"}')

})


test('collections', async () => {

  // conf
  const conf = getPathInfo('site.yaml', 'acme')
  conf.parse = () => ({ scope: 'body', collections: { pages: { include: [ 'blog/' ]} }})

  // item
  const item = getPathInfo('blog/hello.md', 'acme')
  item.parse = () => ({ meta: { title: 'Hey' } })

  // component
  const comp = getPathInfo('layout.html', 'acme')
  comp.parse = () => parseNue(`
    <custom>
      <p :each="page of pages">{ page.title }</p>
    </custom>
  `)

  const html = await renderPage(page, ['acme'], [page, conf, comp, item])

  expect(html).toInclude('<div><p>Hey</p></div>')

})




