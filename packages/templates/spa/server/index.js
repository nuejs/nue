
import { Hono } from 'hono'

const server = new Hono()

server.get('/users', async (c) => {
  const { KV } = c.env
  const { keys } = await KV.list({ prefix: 'user:' })
  const users = await Promise.all(
    keys.map(key => KV.get(key.name, { type: 'json' }))
  )
  users.sort((a, b) => b.created - a.created)
  return c.json(users)
})

export default server
