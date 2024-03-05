
import { buildJS } from '../src/builder.js'
import { createSite } from '../src/site.js'

import { createKit } from '../src/nuekit.js'
import { promises as fs } from 'node:fs'
import { join, parse } from 'node:path'

import { toMatchPath } from './match-path.js'

expect.extend({ toMatchPath })

// temporary directory
const root = '_test'

// setup and teardown
beforeEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.mkdir(root, { recursive: true })
})
afterEach(async () => await fs.rm(root, { recursive: true, force: true }))

// helper function for creating files to the root directory
async function write(path, content='') {
  const { dir } = parse(path)
  await fs.mkdir(join(root, dir), { recursive: true })
  await fs.writeFile(join(root, path), content)
}

// relative to root
async function read(path) {
  return await fs.readFile(join(root, path), 'utf-8')
}

async function readDist(dist, path) {
  return await fs.readFile(join(dist, path), 'utf-8')
}

// default site and kit
async function getSite() {
  return await createSite({ root })
}

async function getKit() {
  return await createKit({ root, dryrun: true })
}

function createFront(title, pubDate) {
  return ['---', `title: ${title}`, `pubDate: ${pubDate ?? '2020-01-20'}`, '---'].join('\n')
}

test('defaults', async () => {
  const site = await getSite()
  expect(site.is_empty).toBe(true)
  expect(site.dist).toBe('_test/.dist/dev')
  expect(site.port).toBe(8080)
  expect(site.globals).toEqual([])
})

const CONF = `

globals: [global]
dist:    .mydist
port:    1500
title:   Hey

`

test('site.yaml', async () => {
  await write('site.yaml', CONF)
  const site = await getSite()

  expect(site.globals).toEqual(['global'])
  expect(site.dist).toBe('.mydist')
  expect(site.port).toBe(1500)

  // teardown
  await fs.rm(join(root, 'site.yaml'))
})

test('environment', async () => {
  const env = 'alt.yaml'
  await write(env, 'dist: .alt')
  const site = await createSite({ root, env })

  expect(site.dist).toBe('.alt')
  expect(site.port).toBe(8080)
})


test('page styles', async () => {
  await write('site.yaml', 'globals: [globals]')

  const site = await getSite()
  await write('globals/foo.css')
  await write('blog/b.css')
  await write('blog/entry/c.css')

  const arr = await site.getStyles('blog')
  expect(arr).toEqual([ '/globals/foo.css', '/blog/b.css' ])

  const arr2 = await site.getStyles('blog/entry')
  expect(arr2.length).toBe(3)
})


test('root styles', async () => {
  const kit = await getKit()
  await write('globals/bar.css')
  await write('home.css')
  await write('index.md')
  const { styles } = await kit.getPageData('index.md')
  expect(styles).toEqual([ "/home.css" ])
})


test('include / exclude', async () => {
  await write('site.yaml', 'globals: [global]\nlibs: [lib, ext]\n')
  await write('global/global.css')
  await write('global/kama.css')
  await write('lib/zoo.css')
  await write('blog/index.md')
  await write('blog/app.yaml', 'include: [lib]\nexclude: [kama]')

  const kit = await getKit()
  const data = await kit.getPageData('blog/index.md')

  expect(data.styles).toEqual([ "/global/global.css", "/lib/zoo.css" ])
})


test('get data', async () => {
  await write('site.yaml', 'foo: 1')

  const site = await getSite()
  await write('some/app.yaml', 'bar: 1')
  await write('some/page/app.yaml', 'baz: 1')
  const data = await site.getData('some/page')

  expect(data).toEqual({ foo: 1, bar: 1, baz: 1 })
})

test('content collection', async () => {
  // This test proves
  // ----------------
  // 1. Default sorting is on pubDate returning most recent first.
  // 2. Collection returns parent folders, then child folders.
  // 3. Posts with null dates, e.g. First, come before posts with dates.
  await write('blog/first-a.md', '# First')
  await write('blog/first-b.md', createFront('Second', '2020-01-04'))
  await write('blog/nested/hey1.md', createFront('Third', '2020-01-02'))
  await write('blog/nested/hey2.md', createFront('Fourth', '2020-01-03'))
  // 4. Cloudflare `functions` directory is excluded
  await write('blog/functions/contact-us.md', "my secret notes")
  // 5. System files starting with '_' or '.' are excluded.
  await write('blog/.item6.md', createFront('Sixth', '2020-01-03'))
  await write('blog/_item7.md', createFront('Seventh', '2020-01-03'))
  
  const site = await getSite()
  const coll = await site.getContentCollection('blog')
  const actual = coll.map(c => {
    return { pubDate: c.pubDate, url: c.url, title: c.title, dir: c.dir, slug: c.slug }
  })
  // expected order is : First, Second, Fourth, Third
  expect(actual).toEqual([
    { pubDate: undefined, url: '/blog/first-a.html', title: 'First', dir: 'blog', slug: 'first-a.html' },
    { pubDate: new Date('2020-01-04'), url: '/blog/first-b.html', title: 'Second', dir: 'blog', slug: 'first-b.html' },
    { pubDate: new Date('2020-01-03'), url: '/blog/nested/hey2.html', title: 'Fourth', dir: join('blog', 'nested'), slug: 'hey2.html' },
    { pubDate: new Date('2020-01-02'), url: '/blog/nested/hey1.html', title: 'Third', dir: join('blog', 'nested'), slug: 'hey1.html' },
  ])
})

test('nuemark components', async () => {
  await write('layout.html', '<a @name="foo">Hey</a>')
  await write('index.md', '[foo]')

  const kit = await getKit()
  const html = await kit.gen('index.md')
  expect(html).toInclude('<a>Hey</a>')
})

test('layout components', async () => {
  const site = await getSite()

  await write('layout.html', '<header/>')
  await write('blog/layout.html', '<header/>')
  await write('blog/entry/layout.html', '<header @name="c"/>')

  // root layout
  const comps = await site.getLayoutComponents()
  expect(comps.length).toBe(1)
  expect(comps[0].tagName).toBe('header')

  // app layout
  const comps2 = await site.getLayoutComponents('blog')
  expect(comps2.length).toBe(2)

  // page layout
  const comps3 = await site.getLayoutComponents('blog/entry')
  expect(comps3.length).toBe(3)
  expect(comps3[0].name).toBe('c')
})


test('getRequestPaths', async () => {
  await write('index.md')
  const site = await getSite()
  expect(await site.getRequestPaths('/')).toMatchObject({ path: 'index.html' })
  expect(await site.getRequestPaths('/fail')).toBeUndefined()

  // custom 404 page
  await write('404.md')
  expect(await site.getRequestPaths('/fail')).toMatchObject({ path: '404.html' })

  // SPA root
  const path = 'admin/index.html'
  await write(path)
  expect((await site.getRequestPaths('/admin/')).path).toMatchPath(path)
  expect((await site.getRequestPaths('/admin/customers')).path).toMatchPath(path)
  expect(await site.getRequestPaths('/admin/readme.html')).toMatchObject({ path: '404.html' })
})


test('inline CSS', async () => {
  const kit = await getKit()
  await write('inline/style.css', 'body { margin: 0 }')
  await write('inline/app.yaml', 'inline_css: true')
  await write('inline/index.md', '# Hey')
  const data = await kit.getPageData('inline/index.md')
  expect(data.inline_css[0].path).toEqual('/inline/style.css')
  const html = await kit.renderMPA('inline/index.md', data)
  expect(html).toInclude('<style href="/inline/style.css">')
  expect(html).toInclude('margin:')
})

test('page data', async () => {
  const kit = await getKit()
  await write('index.md', createFront('Hello') + '\n\nWorld')
  const data = await kit.getPageData('index.md')
  expect(data.title).toBe('Hello')
  expect(data.page.meta.title).toBe('Hello')
})

test('page assets', async() => {
  const kit = await getKit()
  await write('scripts/app.yaml', 'include: [hello.js]\nhotreload: false')
  await write('scripts/index.md', '# Hey')
  await write('scripts/hello.nue', '<div/>')
  await write('scripts/hello.ts', 'var a')
  await write('scripts/main.js', 'var a')
  const data = await kit.getPageData('scripts/index.md')

  expect(data.components).toEqual([ "/scripts/hello.js" ])
  expect(data.scripts).toEqual([ "/scripts/hello.js", "/@nue/mount.js" ])
})


test('index.html', async() => {
  await write('index.html', '<test/>')
  const kit = await getKit()
  await kit.gen('index.html')
  const html = await readDist(kit.dist, 'index.html')

  expect(html).toInclude('hotreload.js')
  expect(html).toInclude('is="test"')
})

test('index.md', async() => {
  await write('index.md', '# Hey')
  const kit = await getKit()
  await kit.gen('index.md')
  const html = await readDist(kit.dist, 'index.html')
  expect(html).toInclude('hotreload.js')
  expect(html).toInclude('<title>Hey</title>')
  expect(html).toInclude('<h1 id="hey">')
})


test('bundle', async() => {
  await write('a.ts', 'export const foo = 30')
  await write('b.ts', 'import { foo } from "./a.js"; const bar = 10 + foo')

  // bun bundle
  const opts = { path: `./${root}/b.ts`, outdir: root, bundle: true }
  await buildJS(opts)
  expect(await read('b.js')).toInclude('var foo = 30')

  // esbuild bundl3
  await buildJS({ ...opts, esbuild: true })
  expect(await read('b.js')).toInclude('var foo = 30')
})

test('JS errors', async() => {
  const code = 'konst foo = 1'
  await write('a.js', code)
  const opts = { path: `./${root}/a.js`, outdir: root, silent: true }

  try {
    await buildJS(opts)
  } catch (e) {
    // console.info(e)
    expect(e.lineText).toBe(code)
  }

  try {
    await buildJS({ ...opts, esbuild: true })
  } catch (e) {
    expect(e.lineText).toBe(code)
  }

})

test.skip('random unit test', async() => {
  const kit = await createKit({ root: '../nextjs-blog', dryrun: true })
})

