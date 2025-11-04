
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
  const { content, type } = await tree.render('/@shared/ui/join.html.js')
  expect(content).toStartWith('export const lib')
  expect(type).toInclude('application/javascript')
})

test('acme home', async () => {
  const { content } = await tree.render({ host: 'acme.localhost', pathname: '/' })

  expect(content).toInclude('"og:description" content="Acme desc"')
  expect(content).toInclude('Acme header')
  expect(content).toInclude('<h1>Hello Acme')
  expect(content).toInclude('href="/feed.xml"')
})

test('production CSS', async () => {
  const { content, type } = await tree.render({
    host: 'acme.production.localhost',
    pathname: '/acme.css'
  })

  expect(content).toInclude('body{padding:')
  expect(type).toInclude('text/css')
})

test('inherited JS ', async () => {
  const { content, type } = await tree.render({
    host: 'acme.localhost',
    pathname: '/base.js'
  })

  expect(content).toInclude('export const foo = true')
  expect(type).toInclude('application/javascript')
})

test('minified JS ', async () => {
  const { content, type } = await tree.render({
    host: 'acme.localhost.production:4000',
    pathname: '/base.js'
  })

  expect(content).toInclude('var o=!0;export{o as foo};')
  expect(type).toInclude('application/javascript')
})


test('content/artsy', async () => {
  const { content } = await tree.render({
    host: 'beta.localhost',
    pathname: '/'
  })

  expect(content).toInclude('<h1>This is art</h1>')
  expect(content).toInclude('<style>@layer base, components</style>')
  expect(content).toInclude('href="/epic-layout.css"')
  expect(content).toInclude('href="/epic-colors.css"')

})

test('SPA', async () => {
  const { content, type } = await tree.render({
    host: 'beta.localhost',
    pathname: '/app/'
  })
  expect(content).toInclude('"libs" content="@shared/ui/join.html app/index.html"')
  expect(content).toInclude('<body nue="default-app"></body>')
  expect(content).toInclude('"/@nue/state.js"')
  expect(type).toInclude('text/html')
})


test('SPA JS', async () => {
  const { content, type } = await tree.render({
    host: 'beta.localhost',
    pathname: '/app/index.html.js'
  })

  expect(content).toStartWith('export const lib')
  expect(type).toInclude('application/javascript')
})

test('dependsOn', async () => {
  expect(await tree.dependsOn({ host: 'acme.localhost', pathname: '/'}, 'base.js')).toBeTrue()
  expect(await tree.dependsOn({ host: 'beta.localhost', pathname: '/'}, 'acme.css')).toBeFalse()
})


test('build', async () => {
  const page = tree.get('sites/acme/index.md')
  const html = await tree.build(page)
  expect(html).toInclude('<h1>Hello Acme')
})