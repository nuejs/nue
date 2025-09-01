import { fetch, routes } from '../src/server'

// clear routes
afterAll(() => routes.length = 0)

test('GET', async () => {
  get('/users', (c) => {
    return c.json({ users: ['alice', 'bob'] })
  })

  const res = await fetch(new Request('http://localhost/users'))
  const data = await res.json()

  expect(res.status).toBe(200)
  expect(data.users).toEqual(['alice', 'bob'])
})

test('POST', async () => {
  post('/api/users', async (c) => {
    const body = await c.req.json()
    return c.json({ created: body.name })
  })

  const res = await fetch(new Request('http://localhost/api/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'charlie' }),
    headers: { 'content-type': 'application/json' }
  }))
  const data = await res.json()

  expect(data.created).toBe('charlie')
})

test('route params', async () => {
  get('/users/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ userId: id })
  })

  const res = await fetch(new Request('http://localhost/users/123'))
  const data = await res.json()

  expect(data.userId).toBe('123')
})

test('middleware', async () => {
  use('/admin/*', (c, next) => {
    if (!c.req.header('authorization')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    return next()
  })

  get('/admin/users', (c) => {
    return c.json({ admin: true })
  })

  // Without auth header
  let res = await fetch(new Request('http://localhost/admin/users'))
  expect(res.status).toBe(401)

  // With auth header
  res = await fetch(new Request('http://localhost/admin/users', {
    headers: { authorization: 'Bearer token' }
  }))
  expect(res.status).toBe(200)
})

test('404', async () => {
  const res = await fetch(new Request('http://localhost/nonexistent'))
  expect(res.status).toBe(404)
})