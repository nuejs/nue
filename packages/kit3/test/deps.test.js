
import { getDeps, getIncludeOpts } from '../src/deps'


test('getDeps', async () => {
  const assets = [
    { site: '@base', path: '@shared/design/main.css', type: 'css' },
    { site: 'site2', path: 'other.html', type: 'html' },
    { site: 'acme', path: 'index.md', type: 'md' },
    { site: 'acme', path: 'script.js', type: 'js' },
    { site: 'acme', path: 'app/index.html', type: 'html', dir: 'app' },
    { site: 'acme', path: 'app/ui/button.html', type: 'html', dir: 'app/ui' },
  ]


  async function testDeps(path, expected) {
    const asset = assets.find(el => el.path == path)
    const deps = await getDeps(asset, ['acme', '@base'], assets)
    const paths = [...deps.map(el => el.path)]

    if (expected) expect(paths).toEqual(expected)
    else console.info(paths)
  }

  // TODO: add more tests
  await testDeps('index.md', ['@shared/design/main.css', 'script.js'])
  await testDeps('app/index.html', [ "@shared/design/main.css", "script.js", "app/ui/button.html"])
})


test('home folder', async () => {
  const asset = {
    path: 'index.md',
    site: 'acme',
    type: 'md',
    dir: '',
    app: null
  }

  const assets = [
    asset,
    {
      path: 'home/layout.html',
      site: 'acme',
      type: 'html',
      dir: 'home',
      app: 'home'
    },
  ]

  const chain = ['acme']
  const deps = await getDeps(asset, chain, assets)
  expect(deps.some(d => d.path == 'home/layout.html')).toBe(true)
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
