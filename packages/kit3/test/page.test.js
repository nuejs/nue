
import { renderPage, getComponents } from '../src/render/page'
import { getPathInfo } from '../src/asset'
import { parseNuemark } from 'nuemark'


test('renderPage', async () => {
  const index = getPathInfo('acme/index.md', 'acme')

  index.parse = function() {
    return parseNuemark('# Hello')
  }

  const assets = [
    getPathInfo('acme/global.js', 'acme'),
    index,
  ]

  const html = await renderPage(index, ['acme', '@base'], assets, true)
  expect(html).toInclude('global.js" type="module"')
  expect(html).toInclude('<h1>Hello</h1>')
  expect(html).not.toInclude('hmr.js')
})


test('getComponents', async () => {
  const deps = [
    {
      is_html: true,
      parse: async () => ({ is_lib: true, lib: ['comp1', 'comp2'] })
    },
    {
      is_html: true,
      parse: async () => ({ is_lib: true, is_dhtml: true, lib: ['comp3'] })
    },
    {
      is_html: true,
      parse: async () => ({ is_lib: true, doctype: 'html+dhtml', lib: ['comp4'] })
    },
    { is_js: true }
  ]

  // server-side
  const static_comps = await getComponents(deps)
  expect(static_comps).toEqual(['comp1', 'comp2', 'comp4'])

  // client-side (dhtml)
  const dynamic_comps = await getComponents(deps, true)
  expect(dynamic_comps).toEqual(['comp3', 'comp4'])
})