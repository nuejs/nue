
import { testDir, writeAll, removeAll } from './test-utils'
import { broadcast, createServer } from '../src/tools/server'

await writeAll([
  ['index.html', '<h1>Home</h1>'],
  ['style.css',  'body { color: red; }'],
])

const server = createServer({
  port: 0,
  dist: testDir

}, async (pathname) => {
  if (pathname == '/html') return { content: '<p>Hello</p>' }
  if (pathname == '/css') return { content: 'body {}', type: 'text/css' }
  if (pathname == '/custom-404') return { content: 'Not found', status: 404 }
  if (pathname == '/') return Bun.file(`${testDir}/index.html`)
  if (pathname == '/not-found') return null
  return Bun.file(`${testDir}${pathname}`)
})

afterAll(async () => {
  await removeAll()
  server.stop()
})

test('static file', async () => {
  const res = await server.fetch(new Request('http://localhost/style.css'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('body { color: red; }')
})


test('/', async () => {
  const res = await server.fetch(new Request('http://localhost/'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('<h1>Home</h1>')
})

test('html response', async () => {
  const res = await server.fetch(new Request('http://localhost/html'))
  expect(await res.text()).toBe('<p>Hello</p>')
  expect(res.headers.get('content-type')).toInclude('text/html')
})

test('custom mime type', async () => {
  const res = await server.fetch(new Request('http://localhost/css'))
  expect(await res.text()).toBe('body {}')
  expect(res.headers.get('content-type')).toBe('text/css')
})

test('custom 404 response', async () => {
  const res = await server.fetch(new Request('http://localhost/custom-404'))
  expect(res.status).toBe(404)
  expect(await res.text()).toBe('Not found')
})

test('not found', async () => {
  const res = await server.fetch(new Request('http://localhost/not-found'))
  expect(res.status).toBe(404)
  expect(await res.text()).toBe('404 Not Found')
})

test('custom handler', async () => {
  const server = createServer({
    port: 0,
    dist: testDir,
    handler: (req) => {
      if (new URL(req.url).pathname == '/api/test') {
        return new Response('handler response')
      }
    }
  }, async ({ pathname }) => Bun.file(`${testDir}${pathname}`))

  const res = await server.fetch(new Request('http://localhost/api/test'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('handler response')

  server.stop()
})

test('HMR WebSocket connection', async () => {
  const ws = new WebSocket(`ws://localhost:${server.port}`)

  await new Promise((resolve) => { ws.onopen = resolve })

  expect(ws.readyState).toBe(WebSocket.OPEN)
  ws.close()
})


test('broadcast', async () => {
  const ws = new WebSocket(`ws://localhost:${server.port}`)

  await new Promise((resolve) => {
    ws.onopen = resolve
  })

  const messagePromise = new Promise((resolve) => {
    ws.onmessage = (event) => {
      resolve(JSON.parse(event.data))
    }
  })

  broadcast({ type: 'reload' })

  const message = await messagePromise
  expect(message).toEqual({ type: 'reload' })

  ws.close()
})