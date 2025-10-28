
import { getDeps, getIncludeOpts, getComponents } from '../src/deps'


test('getDeps', async () => {
  const assets = [
    { site: '@base', path: '@shared/design/main.css', type: 'css' },
    { site: 'acme', path: 'index.md', type: 'md' },
    { site: 'acme', path: 'script.js', type: 'js' },
    { site: 'acme', path: 'app/index.html', type: 'html', dir: 'app' },
    { site: 'acme', path: 'app/ui/button.html', type: 'html', dir: 'app/ui' },

    { site: 'site2', path: 'index.html', type: 'html' },
    { site: 'site2', path: 'layout.html', type: 'html' },
  ]


  async function testDeps(path, expected) {
    const asset = assets.find(el => el.path == path)
    const deps = await getDeps(asset, [asset.site, '@base'], assets)
    const paths = [...deps.map(el => el.path)]
    if (expected) expect(paths).toEqual(expected)
    else return paths
  }

  // TODO: add more tests
  await testDeps('index.md', ['@shared/design/main.css', 'script.js'])
  await testDeps('app/index.html', [ "@shared/design/main.css", "script.js", "app/ui/button.html"])
  await testDeps('index.html', [ "@shared/design/main.css", "layout.html" ])
})


test('home folder', async () => {
  const assets = [
    { path: 'index.md', site: 'acme' },
    { path: 'home/layout.html', site: 'acme', type: 'html', dir: 'home' },
  ]

  const deps = await getDeps(assets[0], ['acme'], assets)
  expect(deps.some(d => d.path == 'home/layout.html')).toBe(true)
})


test('sintle-site mode', async () => {
  const assets = [
    { path: 'index.md' },
    { path: 'home/home.css', dir: 'home', type: 'css' },
  ]

  const deps = await getDeps(assets[0], [], assets)
  expect(deps[0].type).toEqual('css')
  expect(deps.length).toEqual(1)
})


test('getIncludeOpts', async () => {

  const assets = [
    { site: 'acme', path: 'site.yaml', parse: () => ({ include: ['a'] }) },
    { site: 'mies', path: 'site.yaml', parse: () => ({ exclude: ['d'] }) },
    { site: 'acme', path: 'blog/app.yaml', parse: () => ({ include: ['b'], exclude: ['c'] }) },
    { site: 'mies', path: 'blog/app.yaml', parse: () => ({ include: ['e'] }) }
  ]

  const page = {
    is_md: true,
    app: 'blog',
    parse: () => ({ meta: { include: ['f'], exclude: ['g'] }})
  }

  const opts = await getIncludeOpts(page, ['acme', 'mies'], assets)

  expect(opts).toEqual({
    include: ['a', 'b', 'e', 'f'],
    exclude: ['c', 'd', 'g']
  })
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
