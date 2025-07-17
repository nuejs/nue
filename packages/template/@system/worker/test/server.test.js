
import { loadSchema } from '../data/load.js'
import { env } from './mocks.js'
import server from '../server.js'

await loadSchema(env.DB)

env.ADMIN_EMAIL = 'test@test.com'
env.ADMIN_PASSWORD = 'test'


test('post contact', async () => {
  const req = new Request(`http://localhost/api/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'cf-ipcountry': 'FI',
    },
    body: JSON.stringify({ email: 'test@test.com' })
  })

  const resp = await server.fetch(req, env)
  expect(await resp.json()).toMatchObject({ id: 1, country: 'FI' })
})


test('failed auth', async () => {
  const req = new Request(`http://localhost/admin/contacts`)
  const resp = await server.fetch(req, env)
  expect(resp.status).toBe(401)
})

async function login() {
  const req = new Request(`http://localhost/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'test'
    })
  })
  return await server.fetch(req, env)
}

test('login', async () => {
  const resp = await login()
  expect(resp.status).toBe(200)
  const { sessionId } = await resp.json()
  expect(sessionId.length).toBe(36)
})

test('get contacts', async () => {
  const resp = await login()
  const { sessionId } = await resp.json()

  // authenticated request
  const req = new Request(`http://localhost/admin/contacts`, {
    headers: { 'Authorization': `Bearer ${sessionId}` }
  })

  const resp2 = await server.fetch(req, env)
  expect(resp2.status).toBe(200)
})

test('logout', async () => {
  const resp = await login()
  const { sessionId } = await resp.json()

  const req3 = new Request(`http://localhost/admin/logout`, {
    headers: { 'Authorization': `Bearer ${sessionId}` }
  })

  const resp3 = await server.fetch(req3, env)
  expect(await resp3.json()).toEqual({ success: true })
  expect(resp3.status).toBe(200)

})
