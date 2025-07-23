import { testDir, writeAll, removeAll } from './test-utils.js'
import { createServer } from '../src/server.js'

await writeAll([
  ['index.html', '<h1>Home</h1>'],
  ['about.html', '<h1>About</h1>'],
  ['style.css',  'body { color: red; }'],
  ['404.html', '<h1>Not Found</h1>']
])

const server = createServer({
  port: 0,
  dist: testDir
}, async ({ pathname }) => {
  if (pathname == '/dynamic') return Bun.file(`${testDir}/index.html`)
  if (pathname == '/missing') return Bun.file(`${testDir}/404.html`)
  if (pathname == '/') return Bun.file(`${testDir}/index.html`)
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


test('index.html for directories', async () => {
  const res = await server.fetch(new Request('http://localhost/'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('<h1>Home</h1>')
})

test('404 for missing files', async () => {
  const res = await server.fetch(new Request('http://localhost/missing'))
  expect(res.status).toBe(404)
  expect(await res.text()).toBe('<h1>Not Found</h1>')
})

test('worker requests', async () => {
  const workerServer = createServer({
    port: 0,
    dist: testDir,
    worker: (req) => {
      if (new URL(req.url).pathname == '/api/test') {
        return new Response('worker response')
      }
    }
  }, async ({ pathname }) => Bun.file(`${testDir}${pathname}`))

  const res = await workerServer.fetch(new Request('http://localhost/api/test'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('worker response')

  workerServer.stop()
})

test('SSE', async () => {
  const res = await server.fetch(new Request('http://localhost/', {
    headers: { accept: 'text/event-stream' }
  }))

  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('text/event-stream')
})

test('broadcast', async () => {
  const res = await server.fetch(new Request('http://localhost/', {
    headers: { accept: 'text/event-stream' }
  }))

  const reader = res.body.getReader()

  server.broadcast({ type: 'reload' })

  const { value } = await reader.read()
  const text = new TextDecoder().decode(value)
  expect(text).toBe('data:{"type":"reload"}\n\n')

  reader.releaseLock()
})