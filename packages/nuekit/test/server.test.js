
import { testDir, writeAll, removeAll } from './test-utils.js'
import { createServer } from '../src/server.js'


await writeAll([
  ['index.html', '<h1>Home</h1>'],
  ['about.html', '<h1>About</h1>'],
  ['style.css',  'body { color: red; }'],
])

const server = createServer({
  port: 0,
  dist: testDir
}, async (path, query) => {
  if (path == '/dynamic') return { path: 'index.html', code: 200 }
  if (path == '/missing') return { path: null }
  if (path == '/') return { path: 'index.html' }
  return { path: path.slice(1) }
})

afterAll(async () => {
  await removeAll()
  server.stop()
})

test('serves static files', async () => {
  const res = await server.fetch(new Request('http://localhost/style.css'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('body { color: red; }')
})

test('serves html files', async () => {
  const res = await server.fetch(new Request('http://localhost/about.html'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('<h1>About</h1>')
})

test('handles index.html for directories', async () => {
  const res = await server.fetch(new Request('http://localhost/'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('<h1>Home</h1>')
})

test('calls callback for html files', async () => {
  const res = await server.fetch(new Request('http://localhost/dynamic'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('<h1>Home</h1>')
})

test('passes query string to callback', async () => {
  let capturedQuery
  const testServer = createServer({
    dist: testDir
  }, async (path, query) => {
    capturedQuery = query
    return { path: 'index.html' }
  })

  await testServer.fetch(new Request('http://localhost/test?foo=bar'))
  expect(capturedQuery).toBe('?foo=bar')

  testServer.stop()
})

test('returns 404 for missing files', async () => {
  const res = await server.fetch(new Request('http://localhost/missing'))
  expect(res.status).toBe(404)
  expect(await res.text()).toBe('404 | Not found')
})

test('handles worker requests', async () => {
  const workerServer = createServer({
    dist: testDir,
    worker: (req) => {
      if (new URL(req.url).pathname == '/api/test') {
        return new Response('worker response')
      }
    }
  })

  const res = await workerServer.fetch(new Request('http://localhost/api/test'))
  expect(res.status).toBe(200)
  expect(await res.text()).toBe('worker response')

  workerServer.stop()
})

test('handles SSE connections', async () => {
  const res = await server.fetch(new Request('http://localhost/', {
    headers: { accept: 'text/event-stream' }
  }))

  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('text/event-stream')
})

test('broadcast sends to SSE clients', async () => {
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