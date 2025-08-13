
import { findAssetByURL, onServe } from '../../src/cmd/serve.js'

test('find /', () => {
  const asset = findAssetByURL('/', [{ url: '/' }])
  expect(asset).not.toBeNull()
})

test('find /@nue/nue.js', () => {
  const asset = findAssetByURL('/@nue/nue.js')
  expect(asset.render).not.toBeNull()
})

test('find app.html.js', () => {
  const asset = findAssetByURL('/app.html.js', [{ path: 'app.html' }])
  expect(asset).not.toBeNull()
})

test('onServe /test', async () => {
  const page = { url: '/test', render() { return 'hey' } }
  const result = await onServe('/test', [ page ])
  expect(result.content).toBe('hey')
  expect(result.type).toInclude('text/html')
})

test('onServe /app/users', async () => {
  const spa = { path: 'app/index.html', render() { return { html: 'hey' }} }
  const result = await onServe('/app/users', [ spa ])
  expect(result).toBe('hey')
})


describe.skip('serve', async () => {

  beforeEach(async () => {
    await writeAll([
      ['lib/components.html', '<!doctype dhtml>'],
      ['lib/keyboard.js', '// keyboard'],
      ['lib/base.css', '/* CSS */'],
      ['blog/entry.md', '# Entry'],
      ['index.md', '# Home'],
      ['404.md', '# 404'],
    ])
  })

  afterEach(async () => await removeAll())


  test('onServe', async () => {
    const { assets } = await readAssets(testDir)

  })



  test.skip('old stuff', async () => {

    // server
    const server = site.serve()
    expect(server.url).toBe('http://localhost:6666/')
    expect(server.port).toBe(6666)

    // request home page
    const res = await fetch(new Request(server.url))
    expect(res.status).toBe(200)
    expect(await res.text()).toInclude('<h1>Hello</h1>')

    // 404 page
    const fail = await fetch(new Request(server.url + 'missing'))
    expect(fail.status).toBe(404)
    expect(await fail.text()).toInclude('<h1>404</h1>')

    // request CSS
    await site.build({ filters: ['**/*.css'] })
    const css = await fetch(new Request(server.url + '@system/design/base.css'))
    expect(await css.text()).toBe('/* hey */')

    server.stop()

    // await new Promise(resolve => {resolve() })
  })

})