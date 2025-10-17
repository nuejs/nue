
import { getDeps, getIncludeOpts } from '../src/deps'


test('getDeps', async () => {
  const assets = new Map([
    ['@base/@shared/design/main.css', { path: '@shared/design/main.css', site: '@base', type: 'css' }],
    ['site2/other.html',    { path: 'other.html', site: 'site2', type: 'html' }],
    ['acme/index.md',       { path: 'index.md', site: 'acme',   type: 'md' }],
    ['acme/script.js',      { path: 'script.js', site: 'acme', type: 'js' }],

    ['acme/app/index.html',     { path: 'app/index.html', site: 'acme', type: 'html', dir: 'app' }],
    ['acme/app/ui/button.html', { path: 'ui/button.html', site: 'acme', type: 'html', dir: 'app/ui' }],
  ])


  async function testDeps(path, expected) {
    const deps = await getDeps(assets.get(path), ['acme', '@base'], assets)
    const paths = [...deps.map(el => el.path)]

    if (expected) expect(paths).toEqual(expected)
    else console.info(paths)
  }

  // TODO: add more tests
  await testDeps('acme/index.md', ['@shared/design/main.css', 'script.js'])
  await testDeps('acme/app/index.html', [ "@shared/design/main.css", "script.js", "ui/button.html"])
})


test('getDeps for index.md', async () => {
  const assets = new Map([
    ['acme/index.md', {
      path: 'index.md',
      site: 'acme',
      type: 'md',
      dir: '',
      app: null
    }],
    ['acme/home/layout.html', {
      path: 'home/layout.html',
      site: 'acme',
      type: 'html',
      dir: 'home',
      app: 'home'
    }],
  ])

  const asset = assets.get('acme/index.md')
  const chain = ['acme']

  const deps = await getDeps(asset, chain, assets)

  // should include home app for index.md
  expect(deps.some(d => d.path == 'home/layout.html')).toBe(true)
})


test('getIncludeOpts', async () => {

  const assets = new Map([
    ['acme/site.yaml', { parse: () => ({ include: ['a'] }) }],
    ['acme/blog/app.yaml', { parse: () => ({ include: ['b'], exclude: ['c'] }) }],
    ['mies/site.yaml', { parse: () => ({ exclude: ['d'] }) }],
    ['mies/blog/app.yaml', { parse: () => ({ include: ['e'] }) }]
  ])

  const page = {
    is_md: true,
    appdir: 'blog',
    parse: () => ({ meta: { include: ['f'], exclude: ['g'] }})
  }

  const opts = await getIncludeOpts(page, ['acme', 'mies'], assets)

  expect(opts).toEqual({
    include: ['a', 'b', 'e', 'f'],
    exclude: ['c', 'd', 'g']
  })
})