
import { join } from 'node:path'
import { createMockServer } from '../src/mock'
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'

let dir, server

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'nue-test-'))
  server = await createMockServer(dir)
})

afterEach(async () => {
  await rm(dir, { recursive: true })
})

function req(method, path, data, token) {
  const headers = { 'content-type': 'application/json' }
  if (token) headers.authorization = `Bearer ${token}`
  const body = data ? JSON.stringify(data) : null
  return new Request(`http://localhost/nue${path}`, { method, headers, body })
}

test('login', async () => {
  await Bun.write(join(dir, 'users.json'), JSON.stringify([
    { email: 'test@test.com', password: 'pass' }
  ]))
  
  server = await createMockServer(dir)
  const res = await server(req('POST', '/login', { 
    email: 'test@test.com', 
    password: 'pass' 
  }))
  
  const { token } = await res.json()
  expect(token).toBeDefined()
})

test('add person', async () => {
  const res = await server(req('POST', '/people', { name: 'John' }))
  expect(res.status).toBe(200)
  
  const file = Bun.file(join(dir, 'people.json'))
  const data = JSON.parse(await file.text())
  const { id, name } = data[0]
  expect(name).toBe('John')
  expect(id).toBeDefined()
})

test('auth required', async () => {
  const res = await server(req('GET', '/people'))
  expect(res.status).toBe(401)
})


