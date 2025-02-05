import { promises as fs, existsSync } from 'node:fs'
import { join, parse } from 'node:path'

import { buildJS } from '../src/builder.js'
import { createKit } from '../src/nuekit.js'
import { createSite } from '../src/site.js'

import { toMatchPath } from './match-path.js'
expect.extend({ toMatchPath })

// temporary directory
const root = '_test'


// setup and teardown
beforeEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.mkdir(root, { recursive: true })
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

// helper function for creating files to the root directory
async function write(path, content = '') {
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

async function getKit(dryrun = true) {
  if (!existsSync(join(root, 'site.yaml'))) await write('site.yaml', '')
  return await createKit({ root, dryrun })
}

function createFront(title, date = '2020-01-20') {
  return ['---', `title: ${title}`, `date: ${date}`, '---'].join('\n')
}

test('site defaults', async () => {
  const site = await getSite()
  expect(site.is_empty).toBe(true)
  expect(site.dist).toMatchPath('_test/.dist/dev')
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
  expect(site.dist).toMatchPath('_test/.mydist')
  expect(site.port).toBe(1500)

  // teardown
  await fs.rm(join(root, 'site.yaml'))
})

test('environment', async () => {
  const env = 'alt.yaml'
  await write(env, 'dist: .alt')
  const site = await createSite({ root, env })

  expect(site.dist).toMatchPath('_test/.alt')
  expect(site.port).toBe(8080)
})


// NOTE: undocumented feature for the next release
const MODEL = `
export default async function (opts) {
  return {
    ...opts,
    async conf() {
      return opts.server_model
    },
  }
}
`

const MODEL_CONF = `
devil: 666

server_model:
  src: _ssr/index.js
  namespace: test
`

test('server_model', async () => {
  await write('site.yaml', MODEL_CONF)
  await write('_ssr/index.js', MODEL)

  const site = await getSite()
  const { test } = await site.getModel()
  expect(test.devil).toBe(666)

  const { namespace } = await test.conf()
  expect(namespace).toBe('test')
})


const CUSTOM_TAGS = `
export default async function (opts) {
  return {
    async lineGraph() {
      return '<svg/>'
    }
  }
}
`

test('custom tags', async () => {
  if (!process.isBun) return // skip for now, because jest fails ts here with: SyntaxError: Unexpected token 'export'

  await write('site.yaml', 'custom_tags: [ _ssr/tags.ts ]')
  await write('_ssr/tags.ts', CUSTOM_TAGS)
  const { tags } = await getSite()
  expect(tags).toHaveProperty('line-graph')
})


test('page styles', async () => {
  await write('site.yaml', 'globals: [globals]')

  const site = await getSite()
  await write('globals/foo.css')
  await write('blog/b.css')
  await write('blog/entry/c.css')

  const arr = await site.getStyles('blog')
  expect(arr).toEqual(['/globals/foo.css', '/blog/b.css'])

  const arr2 = await site.getStyles('blog/entry')
  expect(arr2.length).toBe(3)
})


test('root styles', async () => {
  const kit = await getKit()
  await write('globals/bar.css')
  await write('home.css')
  await write('index.md')
  const { assets } = await kit.getPageData('index.md')
  expect(assets.styles).toEqual(["/home.css"])
})


test('include/exclude data', async () => {
  await write('site.yaml', 'include: [a]\nexclude: [a]')
  await write('blog/app.yaml', 'include: [b]\nexclude: [b]')
  await write('blog/index.md', '---\ninclude: [c]\n---\n')
  const kit = await getKit()
  const data = await kit.getPageData('blog/index.md')

  expect(data.include).toEqual(["a", "b", "c"])
  expect(data.exclude).toEqual(["a", "b"])
})

test('asset include/exclude', async () => {
  await write('site.yaml', 'globals: [global]\nlibs: [lib, ext]\n')
  await write('global/global.css')
  await write('global/kama.dhtml')
  await write('global/kama.css')
  await write('lib/boom.css')
  await write('lib/zoo.css')
  await write('blog/index.md')
  await write('blog/app.yaml', 'include: [lib]\nexclude: [kama]')

  const kit = await getKit()
  const { assets } = await kit.getPageData('blog/index.md')

  expect(assets.styles).toEqual(["/global/global.css", "/lib/boom.css", "/lib/zoo.css"])
  // expect(data.components).toEqual([ "/global/kama.js", "/lib/zoo.css" ])
})

test('SPA', async () => {
  await write('app/model/index.js')
  await write('app/model/customer.js')
  await write('app/model-rs/Cargo.toml')
  await write('app/model-rs/src/customers.rs')
  await write('app/model-rs/src/customers.test.js')
  await write('app/model-rs/dist/model.wasm')
  await write('app/model-rs/dist/Cargo.lock')
  await write('app/index.html', '<symbols dir="icon" files="search"/>')

  const site = await getSite()
  const paths = await site.walk()

  // paths to build
  expect(paths.length).toBe(4)

  // rendered page
  const kit = await getKit()
  const html = await kit.renderSPA('app/index.html')

  expect(html).toInclude('hotreload.js')
  expect(html).toInclude('<path')

})


test('get data', async () => {
  await write('site.yaml', 'foo: 1')

  const site = await getSite()
  await write('some/app.yaml', 'bar: 1')
  await write('some/page/app.yaml', 'baz: 1')
  const data = await site.getData('some/page')

  expect(data).toMatchObject({ foo: 1, bar: 1, baz: 1 })
})


test('content collection', async () => {
  await write('blog/first-a.md', '# First')
  await write('blog/first-b.md', createFront('Second', '2025-01-04'))
  await write('blog/nested/hey1.md', createFront('Third', '2025-01-02'))
  await write('blog/nested/hey2.md', createFront('Fourth', '2025-01-03'))

  // these should be excluded
  await write('blog/functions/contact-us.md', "my secret notes")
  await write('blog/.item6.md', createFront('Sixth', '2025-01-03'))
  await write('blog/_item7.md', createFront('Seventh', '2025-01-03'))

  const site = await getSite()
  const coll = await site.getContentCollection('blog')

  // exclude `functions` directory, dotfiles etc..
  expect(coll.length).toBe(4)

  // sort order
  expect(coll[0].url).toBe('/blog/first-a.html')
  expect(coll[1].title).toBe('Second')
  expect(coll[2].slug).toBe('hey2.html')

  // page metadata
  expect(coll[0]).toMatchObject({ title: "First", slug: "first-a.html", basedir: "blog" })
})

test('basic page generation', async () => {
  await write('index.md', '# Hello\nWorld')
  const kit = await getKit()

  // page data
  const data = await kit.getPageData('index.md')
  expect(data.title).toBe('Hello')
  expect(data.description).toBe('World')

  // generated HTML
  const html = await kit.gen('index.md')
  expect(html).toInclude('<h1>Hello</h1>')
  expect(html).toInclude('<p>World</p>')
})


test('simple custom tag', async () => {
  await write('layout.html', '<a @name="test">Hey</a>')
  await write('index.md', '[test]')

  const kit = await getKit()
  const html = await kit.gen('index.md')
  expect(html).toInclude('<a>Hey</a>')
})

test('custom tag with <slot/>', async () => {
  const HTML = `
    <div @name="test">
      <h2>Hello</h2>
      <slot/>
    </div>
  `
  const MD = [
    '[test]',
    '  ### World',
    '  { slug }',
  ]

  await write('components.html', HTML)
  await write('index.md', MD.join('\n'))

  const kit = await getKit()
  const html = await kit.gen('index.md')
  expect(html).toInclude('<h2>Hello</h2>')
  expect(html).toInclude('<h3>World</h3>')
  expect(html).toInclude('<p>index.html</p>')
})


test('layout components', async () => {
  const site = await getSite()

  await write('layout.html', '<header/>')
  await write('blog/layout.html', '<header/>')
  await write('blog/entry/layout.html', '<header @name="c"/>')

  // root layout
  const comps = await site.getServerComponents()
  expect(comps.length).toBe(1)
  expect(comps[0].tagName).toBe('header')

  // app layout
  const comps2 = await site.getServerComponents('blog')
  // expect(comps2.length).toBe(2)

  // page layout
  const comps3 = await site.getServerComponents('blog/entry')
  expect(comps3.length).toBe(3)
  expect(comps3[0].name).toBe('c')
})


test('page layout', async () => {
  await write('layout.html', `
    <header>Header</header>
    <aside>Aside</aside>
    <aside @name="beside">Beside</aside>
  `)
  await write('site.yaml', 'aside: false')
  await write('index.md', '# Hey')

  const kit = await getKit()
  const html = await kit.gen('index.md')

  expect(html).not.toInclude('false')
  expect(html).toInclude('<header>Header</header>')
  expect(html).not.toInclude('<aside>Aside</aside>')
  expect(html).toInclude('<aside>Beside</aside>')
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
  const { assets } = await kit.getPageData('inline/index.md')
  expect(assets.inline_css[0].path).toEqual('/inline/style.css')
  const html = await kit.gen('inline/index.md')
  expect(html).toInclude('<style href="/inline/style.css">')
  expect(html).toInclude('margin:')
})


test('line endings', async () => {
  const kit = await getKit()
  await write('index.md', '---\ntitle: Page title\rhero: img/image.png\r\n---\r\n\r# Hello\r\n\rWorld')
  const data = await kit.getPageData('index.md')
  expect(data.title).toBe('Page title')
  expect(data.hero).toBe('img/image.png')
  const html = await kit.gen('index.md')
  expect(html).toInclude('<h1>Hello</h1>')
  expect(html).toInclude('<p>World</p>')
})

test('page assets', async () => {
  await write('site.yaml', 'libs: [lib]')
  await write('blog/app.yaml', 'include: [video]')
  await write('lib/video.dhtml')
  await write('blog/index.md', '# Hey')
  await write('blog/comp.htm', '<div/>')
  await write('blog/hello.ts', 'var a')
  await write('blog/main.js', 'var a')

  const kit = await getKit()
  const { assets } = await kit.getPageData('blog/index.md')

  expect(assets.components).toEqual(["/blog/comp.js", "/lib/video.js"])
  expect(assets.scripts.length).toEqual(4)
})



test('bundle', async () => {
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

test('JS errors', async () => {
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


test('the project was started for the first time', async () => {
  await write('site.yaml', 'port: 9090')
  await write('globals/bar.css')
  await write('home.css')
  await write('index.md')

  const kit = await getKit(false)
  const terminate = await kit.serve()
  try {
    const html = await readDist(kit.dist, 'index.html')
    expect(html).toInclude('hotreload.js')
  } finally {
    terminate()
  }
})
