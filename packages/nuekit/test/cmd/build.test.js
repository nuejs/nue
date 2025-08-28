
import { join } from 'node:path'
import { build, matches, stats, buildAsset, buildAll } from '../../src/cmd/build'
import { testDir, writeAll, removeAll, fileset } from '../test-utils'
import { trim } from '../../src/render/page'
import { createSite } from '../../src/site'



test('matches', () => {
  expect(matches('index.md', ['foo'])).toBeFalse()
  expect(matches('index.md', ['.md'])).toBeTrue()
  expect(matches('docs/index.md', ['docs'])).toBeTrue()
  expect(matches('index.md', ['./index.md'])).toBeTrue()
})

test('stats', () => {
  const lines = stats([{ type: 'css' }, { type: 'js' }, { type: 'js' }, { type: 'yaml' } ])
  expect(lines).toEqual([ "JavaScript files: 2", "CSS files: 1" ])
})


describe('build', async () => {

  const conf = trim(`
    site:
      skip: [functions]
      view_transitions: true
      origin: https://acme.org

    sitemap:
      enabled: true

    rss:
      enabled: true
      collection: blog

    collections:
      blog:
        include: [ blog/ ]
  `)

  beforeEach(async () => {
    await writeAll([
      ['site.yaml', conf],
      ['@system/ui/keyboard.ts', 'export const foo = 100'],
      ['@system/design/base.css', '/* CSS */'],
      ['index.md', '# Hello'],
      ['404.md', '# 404'],
      'blog/index.md',
      'docs/index.md',

      // should be ignored
      'node_modules/test',
      'functions/test',
      '.gitignore',
      'README.md',
      '_skipped',

    ])
  })

  afterEach(async () => await removeAll())

  test('buildAsset: MD', async () => {
    const { assets } = await createSite(testDir, { is_prod: true })
    const home = assets.get('index.md')
    await buildAsset(home, testDir)
    const html = await Bun.file(join(testDir, 'index.html')).text()
    expect(html).toInclude('/@nue/transitions.js')
    expect(html).toInclude('<h1>Hello</h1>')
  })

  test('buildAll', async () => {
    const { assets } = await createSite(testDir, { is_prod: true })

    await buildAll(assets, { root: testDir })
    const results = await fileset(join(testDir, '.dist'))
    expect(results.length).toBe(11)
    expect(assets.length).toBe(7)

    // typescript conversion / minify
    const js = await results.read('@system/ui/keyboard.js')

    expect(js).toInclude('var o=100;export{o as foo};')

    // front page render
    const home = await results.read('index.html')
    expect(home).toInclude('<h1>Hello</h1>')
  })


  test('build feeds', async () => {
    const { assets } = await createSite(testDir, { is_prod: true })

    await build(assets, { root: testDir, silent: true })
    const results = await fileset(join(testDir, '.dist'))

    // sitemap
    const sitemap = await results.read('sitemap.xml')
    expect(sitemap.length).toBeGreaterThan(250)


    const feed = await results.read('feed.xml')
    expect(sitemap.length).toBeGreaterThan(300)
  })


  test('build filtering', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const { assets } = await createSite(testDir, { is_prod: true })
    const subset = await build(assets, { dryrun: true, paths: ['.md', '.css'] })
    expect(subset.length).toBe(5)
  })

})

describe('SPA build', async () => {

  beforeEach(async () => {
    await writeAll([
      ['index.html', '<!doctype dhtml> <body>Hello</body>'],
      ['base.css', ':root { --brand: #ccc }'],
    ])
  })

  afterEach(async () => await removeAll())

  test('build SPA', async () => {
    const { assets } = await createSite(testDir, { is_prod: true })
    await buildAll(assets, { root: testDir })
    const results = await fileset(join(testDir, '.dist'))
    expect(results.length).toBe(8)

    // html page
    const html = await results.read('index.html')

    expect(html).toInclude('<body nue="default-app"></body>')
    expect(html).toInclude('/@nue/mount.js')
    expect(html).toInclude('/base.css')

    // SPA minify
    const js = await results.read('index.html.js')
    expect(js).toInclude('var t=[')

    // CSS minify
    const css = await results.read('base.css')
    expect(css).toBe(':root{--brand:#ccc}')

  })

})