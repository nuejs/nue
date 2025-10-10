
import { join } from 'node:path'
import { build, matches, stats, buildAsset, buildAll, minifyJS } from '../../src/cmd/build'
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


const CONF = {
  root: testDir,
  is_prod: true,
  dist: join(testDir, '.dist'),

  ignore: [ 'node_modules', 'functions' ],

  site: {
    view_transitions: true,
    origin: 'https://acme.org'
  },

  design: {
    inline_css: true
  },

  sitemap: { enabled: true },

  rss: {
    enabled: true,
    collection: 'blog'
  },

  collections: {
    blog:{include: [ 'blog/' ] }
  }
}

describe('build', async () => {

  beforeEach(async () => {
    await writeAll([
      ['@shared/ui/keyboard.ts', 'export const foo = 100'],
      ['@shared/data/author.json', '{ "foo": 10 }'],
      ['@shared/design/base.css', '/* CSS */'],
      ['@shared/design/global.css', 'body { font-size: 15px }'],
      ['index.md', '# Hello'],
      ['404.md', '# 404'],
      'blog/index.md',
      'docs/index.md',

      // should be ignored
      'node_modules/test',
      'functions/test',
    ])
  })

  afterEach(async () => await removeAll())


  test('buildAsset: MD', async () => {
    const site = await createSite(CONF)
    const home = site.get('index.md')

    await buildAsset(home, testDir)
    const html = await Bun.file(join(testDir, 'index.html')).text()

    expect(html).toInclude('<style>body{font-size:15px}</style>')
    expect(html).toInclude('/@nue/transitions.js')
    expect(html).toInclude('<h1>Hello</h1>')
  })

  test('buildAll', async () => {
    const { dist } = CONF
    const { assets } = await createSite(CONF)

    await buildAll(assets, { dist })
    const results = await fileset(dist)

    expect(assets.length).toBe(8)
    expect(results.length).toBe(12)

    // typescript conversion / minify
    const js = await results.read('@shared/ui/keyboard.js')

    expect(js).toInclude('var o=100;export{o as foo};')

    // front page render
    const home = await results.read('index.html')
    expect(home).toInclude('<h1>Hello</h1>')
  })


  test('build feeds', async () => {
    const site = await createSite(CONF)

    await build(site, {  silent: true })
    const results = await fileset(join(testDir, '.dist'))

    // sitemap
    const sitemap = await results.read('sitemap.xml')
    expect(sitemap.length).toBeGreaterThan(250)


    const feed = await results.read('feed.xml')
    expect(sitemap.length).toBeGreaterThan(300)
  })


  test('build filtering', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const site = await createSite(CONF)
    const subset = await build(site, { dryrun: true, paths: ['.md', '.css'] })
    expect(subset.length).toBe(6)
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
    const { assets } = await createSite(CONF)
    const { dist } = CONF
    await buildAll(assets, { dist })
    const results = await fileset(dist)
    expect(results.length).toBe(8)

    // html page
    const html = await results.read('index.html')

    expect(html).toInclude('<body nue="default-app"></body>')
    expect(html).toInclude('/@nue/mount.js')
    expect(html).not.toInclude('/base.css')
    expect(html).toInclude('<style>:root{--brand:#ccc}</style>')

    // SPA minify
    const js = await results.read('index.html.js')
    expect(js).toInclude('var t=[')

    // minified CSS files should still exist
    const css = await results.read('base.css')
    expect(css).toBe(':root{--brand:#ccc}')

  })

})


test('Minify JS', async () => {
  const code = `
    async function test()  {
      const nue = await import('/@nue/nue.js')
      nue.hello()
    }
    await test()
  `
  expect(await minifyJS(code)).toStartWith('var')
})


