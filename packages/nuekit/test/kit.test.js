
import { buildJS } from '../src/builder.js'
import { createSite } from '../src/site.js'

import { createKit } from '../src/nuekit.js'
import { promises as fs } from 'node:fs'
import { join, parse } from 'node:path'
import { init } from '../src/init.js'

// temporary directory
const root = '_test'

// setup and teardown
beforeAll(async () => await fs.mkdir(root, { recursive: true }))
afterAll(async () => await fs.rm(root, { recursive: true, force: true }))

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

test('root styles', async () => {
  const kit = await getKit()
  await write('home.css')
  await write('index.md')
  const { styles } = await kit.getPageData('index.md')
  expect(styles).toEqual([ "/home.css" ])

})


test('subdirs', async () => {
  const site = await getSite()
  await write('blog/b.js')
  await write('blog/entry/c.js')
  expect(await site.getAssets('blog', ['js'])).toEqual(['/blog/b.js'])

  expect(await site.getAssets('blog/entry', ['js']))
    .toEqual(['/blog/b.js', '/blog/entry/c.js'])
})


test('app data', async () => {
  const site = await getSite()
  await write('some/app.yaml', 'title: World')
  const app_data = await site.getData('some')
  expect(app_data.title).toBe('World')
})


function front(title) {
  return ['---', `title: ${title}`, '---'].join('\n')
}

test('content collection', async () => {
  await write('blog/first.md', front('First'))
  await write('blog/nested/hey.md', front('Second'))

  const site = await getSite()
  const coll = await site.getContentCollection('blog')

  expect(coll.length).toBe(2)
  expect(coll[0].url).toBe('/blog/first.html')
  expect(coll[1].title).toBe('Second')
  expect(coll[1].dir).toBe('blog/nested')
  expect(coll[1].slug).toBe('hey.html')
})


test('layout components', async () => {
  const site = await getSite()

  // global layout
  await write('layout.html', '<header/>')
  const comps = await site.getLayoutComponents('blog')
  expect(comps.length).toBe(1)
  expect(comps[0].tagName).toBe('header')

  // blog layout
  await write('blog/layout.html', '<header/>')
  const comps2 = await site.getLayoutComponents('blog')
  expect(comps2.length).toBe(2)

  // two levels
  await write('blog/second/layout.html', '<header/>')
  const comps3 = await site.getLayoutComponents('blog/second')
  expect(comps3.length).toBe(2)
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
  expect(await site.getRequestPaths('/admin/')).toMatchObject({ path })
  expect(await site.getRequestPaths('/admin/customers')).toMatchObject({ path })
  expect(await site.getRequestPaths('/admin/readme.html')).toMatchObject({ path: '404.html' })
})



test('init dist/@nue dir', async () => {
  await init({ dist: root, is_dev: true, esbuild: false })
  const names = await fs.readdir(join(root, '@nue'))
  expect(names.length).toBeGreaterThan(7)
})


test('inline CSS', async () => {
  const kit = await getKit()
  await write('inline/style.css', 'body { margin: 0 }')
  await write('inline/app.yaml', 'inline_css: true')
  await write('inline/index.md', '# Hey')
  const data = await kit.getPageData('inline/index.md')


  expect(data.inline_css[0]).toEqual({ path: "/inline/style.css", content: "body { margin: 0 }"})
  const html = await kit.renderPage('inline/index.md', data)
  expect(html).toInclude('<style href="/inline/style.css">body { margin: 0 }</style>')
})


test('page scripts', async() => {
  const kit = await getKit()
  await write('scripts/app.yaml', 'include: [hello.js]\nno_hotreload: true')
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
  expect(html).toInclude('island="test"')
})

test('index.md', async() => {
  await write('index.md', '# Hey')
  const kit = await getKit()
  await kit.gen('index.md')
  const html = await readDist(kit.dist, 'index.html')

  expect(html).toInclude('hotreload.js')
  expect(html).toInclude('<title>Hey</title>')
  expect(html).toInclude('<h1>Hey</h1>')
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

test('syntax errors', async() => {
  const code = 'konst foo = 1'
  await write('a.js', code)
  const opts = { path: `./${root}/a.js`, outdir: root, silent: true }

  try {
    await buildJS(opts)
  } catch (e) {
    console.info(e)
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

