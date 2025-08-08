
import { createWorker, matches } from '../../src/server/worker.js'
import { testDir, writeAll, removeAll } from '../test-utils'

afterAll(async () => await removeAll())

test('worker handles requests', async () => {
  await writeAll([
    ['index.ts', `export default {
      routes: [{ path: "/api/*", method: "GET" }],
      fetch: () => new Response("api response")
    }`],
  ])

  const worker = await createWorker({ dir: testDir })

  // Matching request
  const apiRequest = new Request('http://localhost/api/users')
  const apiResponse = await worker(apiRequest)
  expect(await apiResponse.text()).toBe('api response')

  // Non-matching request
  const staticRequest = new Request('http://localhost/static/file.css')
  const staticResponse = await worker(staticRequest)
  expect(staticResponse).toBe(null)
})


test('matches routes correctly', () => {
  const routes = [
    { path: '/exact', method: 'GET' },
    { path: '/api/*', method: 'POST' },
    { path: '/users/:id', method: 'GET' }
  ]

  // Exact match
  expect(matches(routes, { url: '/exact', method: 'GET' })).toBe(true)
  expect(matches(routes, { url: '/exact', method: 'POST' })).toBe(false)

  // Wildcard match
  expect(matches(routes, { url: '/api/users', method: 'POST' })).toBe(true)
  expect(matches(routes, { url: '/api', method: 'POST' })).toBe(false)

  // Parameter match
  expect(matches(routes, { url: '/users/123', method: 'GET' })).toBe(true)
  expect(matches(routes, { url: '/users', method: 'GET' })).toBe(false)
})