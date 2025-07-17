
import { testDir, writeAll, removeAll } from './test-utils.js'
import { createSite } from '../src/site.js'


beforeEach(async () => {
  await writeAll([
    ['site.yaml', { ignore: '[functions]' }],
    ['@system/controller/keyboard.ts', '// hello'],
    '@system/design/base.css',
    'blog/index.md',
    'docs/index.md',
    'index.md',

    // should be ignored
    'node_modules/test',
    'functions/test',
    '.gitignore',
    'README.md',
    '_skipped',

  ])
})

// afterEach(async () => { await removeAll() })


test('build', async () => {
  const site = await createSite({ root: testDir })
  const assets = await site.build()
  const results = await site.results()

  expect(assets.length).toBe(6)
  expect(results.length).toBe(5)


})