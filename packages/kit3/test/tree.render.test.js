
import { createTree } from '../src/tree'

process.chdir('tree')

const tree = createTree()
await tree.load()

afterAll(() => process.chdir('..'))

test('base home', async () => {
  const { content, type } = await tree.render('/')
  expect(content).toInclude('/@shared/design/typography.css')
  expect(content).toInclude('<h1>Hello Base')
  expect(content).toInclude('/@nue/hmr.js')
  expect(type).toInclude('text/html')
})

test('page update', async () => {
  const { content } = await tree.render('/blog/first')
  expect(content).toInclude('<h1>First blog entry')


  // works after update
  tree.update('@base/blog/first.md')
  const page = await tree.render('/blog/first')
  expect(page.content).toInclude('<h1>First blog entry')
})

test('base UI', async () => {
  const { content, type } = await tree.render('/@shared/layout/join.html.js')
  expect(content).toStartWith('export const lib')
  expect(type).toInclude('application/javascript')
})

test('acme home', async () => {
  const { content } = await tree.render({ host: 'acme.localhost', pathname: '/' })

  // return console.info(content.length)
  expect(content).toInclude('"og:description" content="Acme desc"')
  expect(content).toInclude('Acme header')
  expect(content).toInclude('<h1>Hello Acme')
  expect(content).toInclude('href="/feed.xml"')
})

test('dev.io', async () => {
  const ret = await tree.render({ host: 'dev.io.localhost', pathname: '/' })
  expect(ret.content).not.toBeNull()
  expect(ret.content).toInclude('href="/dev-io.css"')
})

test('/blog/dev-2.0-feature-x', async () => {
  const ret = await tree.render({
    pathname: '/blog/dev-2.0-feature-x',
    host: 'dev.io.localhost',
  })
  expect(ret.content).toInclude('<h1>Hello 2.0</h1>')
})

test('inherited/unminified CSS/JS ', async () => {
  const js = await tree.render({ host: 'acme.localhost', pathname: '/base.js' })
  expect(js.type).toInclude('application/javascript')

  const css = await tree.render({ host: 'acme.localhost', pathname: '/acme.css' })
  expect(css.type).toInclude('text/css;charset=utf-8')
})


test('production CSS', async () => {
  const { content, type } = await tree.render({
    host: 'acme.production.localhost',
    pathname: '/acme.css'
  })

  expect(content).toInclude('body{padding:')
  expect(type).toInclude('text/css')
})


test('minified JS ', async () => {
  const { content, type } = await tree.render({
    host: 'acme.production.localhost:4000',
    pathname: '/base.js'
  })

  expect(content).toInclude('var o=!0;export{o as foo};')
  expect(type).toInclude('application/javascript')
})


test('content/artsy', async () => {
  const { content } = await tree.render({ host: 'beta.localhost', pathname: '/' })
  expect(content).toInclude('<h1>This is art</h1>')
  expect(content).toInclude('<style>@layer base, components;</style>')
  expect(content).toInclude('href="/epic-layout.css"')
  expect(content).toInclude('href="/epic-colors.css"')

})

test('SPA', async () => {
  const { content, type } = await tree.render({ host: 'beta.localhost', pathname: '/app/' })
  expect(content).toInclude('"libs" content="@shared/layout/join.html')
  expect(content).toInclude('app/index.html')
  expect(content).toInclude('<script src="/@shared/lib/extra.js"')
  expect(content).toInclude('<body nue="default-app"></body>')
  expect(content).toInclude('"/@nue/state.js"')
  expect(type).toInclude('text/html')
})


test('SPA JS', async () => {
  const { content, type } = await tree.render({
    pathname: '/app/index.html.js',
    host: 'beta.localhost',
  })

  expect(content).toStartWith('export const lib')
  expect(type).toInclude('application/javascript')
})

test('include / exclude', async () => {
  const { content } = await tree.render({ host: 'beta.localhost', pathname: '/hey' })

  expect(content).toInclude('href="/@shared/lib/extra.css"')
  expect(content).toInclude('src="/@shared/lib/extra.js')
  expect(content).not.toInclude('@shared/lib/extra.html')
})


test('favicon', async () => {
  const file = await tree.render({ host: 'localhost', pathname: '/favicon.ico' })
  expect(await file.exists()).toBeTrue()
})

test('binary files', async () => {
  const font = await tree.render({ host: 'localhost', pathname: '/img/font.woff2' })
  expect(font.type).toBe('font/woff2')

  const webp = await tree.render({ host: 'localhost', pathname: '/img/img.webp' })
  expect(webp.type).toBe('image/webp')

  const png = await tree.render({ host: 'localhost', pathname: '/img/img.png' })
  expect(png.type).toBe('image/png')
})


test('dependsOn', async () => {
  expect(await tree.dependsOn({ host: 'acme.localhost', pathname: '/'}, 'base.js')).toBeTrue()
  expect(await tree.dependsOn({ host: 'beta.localhost', pathname: '/'}, 'acme.css')).toBeFalse()
})
