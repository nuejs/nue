
import { createProxy } from '../../src/worker/proxy.js'

test('proxy forwards matching requests', async () => {
  global.fetch = async (url) => {
    expect(url).toBe('http://backend.com/api/users')
    return new Response('ok')
  }

  const proxy = createProxy({
    routes: ['/api'],
    url: 'http://backend.com'
  })

  const request = new Request('http://localhost/api/users')
  const response = await proxy(request)

  expect(response.status).toBe(200)
})

test('proxy ignores non-matching requests', async () => {
  const proxy = createProxy({
    routes: ['/api'],
    url: 'http://backend.com'
  })

  const request = new Request('http://localhost/static/file.css')
  const response = await proxy(request)

  expect(response).toBe(null)
})

test('proxy preserves method and query', async () => {
  global.fetch = async (url, opts) => {
    expect(url).toBe('http://backend.com/api/search?q=test')
    expect(opts.method).toBe('POST')
    return new Response('ok')
  }

  const proxy = createProxy({
    routes: ['/api'],
    url: 'http://backend.com'
  })

  const request = new Request('http://localhost/api/search?q=test', {
    method: 'POST',
    body: 'data'
  })

  await proxy(request)
})