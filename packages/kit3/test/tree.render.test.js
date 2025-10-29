
import { createTree } from '../src/tree'

process.chdir('tree')

const tree = createTree()
await tree.load()

afterAll(() => process.chdir('..'))

test('base home', async () => {
  const { content, type } = await tree.render('/')
  expect(content).toInclude('/@shared/design/typography.css')
  expect(content).toInclude('<h1>Hello Base</h1>')
  expect(content).toInclude('/@nue/hmr.js')
  expect(type).toInclude('text/html')
})

test('base UI', async () => {
  const { content, type } = await tree.render('/@shared/ui/join.html.js')
  expect(content).toStartWith('export const lib')
  expect(type).toInclude('application/javascript')
})

test('acme home', async () => {
  const { content } = await tree.render({ host: 'acme.localhost', pathname: '/' })
  expect(content).toInclude('<h1>Hello Acme</h1>')
  expect(content).toInclude('href="/feed.xml"')
})


test('CSS file', async () => {
  const { content, type } = await tree.render({
    host: 'acme.localhost',
    pathname: '/acme.css'
  })

  expect(content).toInclude('body { padding: 1em }')
  expect(type).toInclude('text/css')
})


test('SPA', async () => {
  const { content, type } = await tree.render({
    host: 'beta.localhost',
    pathname: '/app/'
  })
  expect(content).toInclude('"libs" content="app/index.html"')
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

