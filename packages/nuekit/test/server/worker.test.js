
import { importRoutes, createWorker } from '../../src/server/worker.js'
import { testDir, write, removeAll } from '../test-utils'
import { routes, fetch, matches } from 'nueserver'


// create server
beforeAll(async () => {
  await write('index.ts', `
    get('/api/users', (c) => {
      return c.json(['jane'])
    })
  `)
})

afterAll(async () => await removeAll())


test('importRoutes', async () => {

  await importRoutes({ dir: testDir })

  // routes
  expect(routes.length).toBe(1)

  // match function
  expect(matches('GET', '/api/users')).toBeTrue()

  // GET
  let resp = await fetch(new Request('http://localhost/api/users'))
  expect(await resp.json()).toEqual(['jane'])

  // 404
  resp = await fetch(new Request('http://localhost/static/file.css'))
  expect(resp.status).toBe(404)
})


test('createWorker', async () => {

  await createWorker({ dir: testDir, reload: true })

  // GET
  let resp = await fetch(new Request('http://localhost/api/users'))
  expect(await resp.json()).toEqual(['jane'])
})
