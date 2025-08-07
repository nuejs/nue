
import { join } from 'node:path'
import { build, matches, stats, buildAsset, buildAll } from '../src/build'
import { testDir, writeAll, removeAll, fileset } from './test-utils'
import { readAssets } from '../src/assets'



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

  beforeEach(async () => {
    await writeAll([
      ['site.yaml', { ignore: '[functions]', port: 6666 }],
      ['@system/controller/keyboard.ts', 'export const foo = 100'],
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


  test('buildAsset', async () => {
    const { assets } = await readAssets(testDir)
    const home = assets.get('index.md')
    await buildAsset(home, testDir)
    const html = await Bun.file(join(testDir, 'index.html')).text()
    expect(html).toInclude('<!doctype html>')
  })

  test('buildAll', async () => {
    const { assets } = await readAssets(testDir)

    await buildAll(assets, { root: testDir })
    const results = await fileset(join(testDir, '.dist'))
    expect(results.length).toBe(11)
    expect(assets.length).toBe(7)

    // typescript conversion / minify
    const js = await results.read('@system/controller/keyboard.js')
    expect(js).toInclude('var o=100;export{o as foo};')

    // front page render
    const home = await results.read('index.html')
    expect(home).toInclude('<!doctype html>')
  })

  test('build filtering', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const { assets } = await readAssets(testDir)
    const subset = await build(assets, { dryrun: true, paths: ['.md', '.css'] })
    expect(subset.length).toBe(5)
  })

})
