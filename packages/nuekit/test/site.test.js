
import { testDir, writeAll, removeAll } from './test-utils.js'
import { createSite } from '../src/site.js'


beforeEach(async () => {
  await writeAll([
    ['site.yaml', { ignore: '[functions]', port: 6666 }],
    ['@system/controller/keyboard.ts', 'export const foo = 100'],
    ['@system/design/base.css', '/* hey */'],
    ['index.md', '# Hello'],
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

afterEach(async () => { await removeAll() })


test('filter && dry run', async () => {
  const site = await createSite(testDir)
  const assets = await site.build({ filters: ['**/index.md'], dryrun: true })
  const results = await site.results()

  expect(assets.length).toBe(3)
  expect(results.length).toBe(0)
})


test('build all', async () => {
  const site = await createSite(testDir)
  const assets = await site.build()
  const results = await site.results()

  expect(assets.length).toBe(6)
  expect(results.length).toBe(5)

  // markdown
  const home = await results.read('index.html')
  expect(home).toInclude('<!doctype html>')
  expect(home).toInclude('<h1>Hello</h1>')

  // typescript conversion
  const js = await results.read('@system/controller/keyboard.js')
  expect(js).toInclude('var foo = 100;')

  // CSS copy
  const css = await results.read('@system/design/base.css')
  expect(css).toBe('/* hey */')

})


test.only('serve', async () => {
  const site = await createSite(testDir)

  // server
  const server = site.serve()
  expect(server.url).toBe('http://localhost:6666/')
  expect(server.port).toBe(6666)

  // request home page
  const res = await fetch(new Request(server.url))
  console.info(res.status)
  // expect(res.status).toBe(404)

  await new Promise(resolve => {

    server.stop()
    resolve()

  })


})

