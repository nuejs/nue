
import { getDeps, getIncludeOpts, getComponents } from '../src/deps'


test('getDeps', async () => {
  const assets = [

    // @base
    { site: '@base', dir: '@global', path: '@global/base.css', type: 'css' },
    { site: '@base', dir: 'docs', path: 'docs/layout.html', type: 'html' },

    //  acme
    { site: 'acme', path: 'site.yaml', parse() { return { include: ['@global' ] } } },
    { site: 'acme', path: 'index.md', type: 'md' },
    { site: 'acme', path: 'script.js', type: 'js' },
    { site: 'acme', path: 'app/index.html', type: 'html', dir: 'app' },

    // miesian
    { site: 'miesian', path: 'mies.css', type: 'css' },

    // beta
    { site: 'beta', path: 'index.html', type: 'html' },
    { site: 'beta', path: 'layout.html', type: 'html' },

    // gamma
    { site: 'gamma', path: 'root.css', type: 'css' },
    { site: 'gamma', path: 'index.md', type: 'md' },
    { site: 'gamma', path: 'docs/docs.css', type: 'css', dir: 'docs' },
    { site: 'gamma', path: 'docs/index.md', type: 'css', dir: 'docs' },

  ]


  async function testDeps(asset_path, expected) {
    const asset = assets.find(el => el.path == asset_path)
    const deps = await getDeps(asset, [asset.site, 'miesian', '@base'], assets)
    const paths = [...deps.map(el => el.path)]
    if (expected) expect(paths).toEqual(expected)
    else return paths
  }

  await testDeps('index.md', ['@global/base.css', 'mies.css', 'script.js'])
  await testDeps('app/index.html', [ "@global/base.css", 'mies.css', "script.js"])
  await testDeps('index.html', [ 'mies.css', "layout.html" ])


  // subfolders
  await testDeps('docs/index.md', [
    "docs/layout.html", 'mies.css', "root.css", "docs/docs.css"
  ])

})



test('home folder', async () => {
  const assets = [
    { path: 'index.md', site: 'acme' },
    { path: 'home/layout.html', site: 'acme', type: 'html', dir: 'home' },
  ]

  const deps = await getDeps(assets[0], ['acme'], assets)
  expect(deps.some(d => d.path == 'home/layout.html')).toBe(true)
})

test('nested dirs', async () => {
  const page = { path: 'blog/entry.md', site: 'acme', app: 'blog', dir: 'blog' }

  const assets = [
    { type: 'html', path: 'blog/layout.html', site: '@base', app: 'blog', dir: 'blog' },
    { type: 'html', path: 'blog/layout.html', site: 'acme',  app: 'blog', dir: 'blog' },
    { type: 'html', path: 'blog/ui/layout.html', site: 'acme',  app: 'blog', dir: 'blog/ui' },
  ]

  const deps = await getDeps(page, ['acme', '@base'], assets)
  expect(deps.length).toBe(2)
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

  expect(opts.include).toEqual(expect.arrayContaining(['a', 'b', 'e', 'f']))

  expect(opts.exclude).toEqual(['c', 'd', 'g'])

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
