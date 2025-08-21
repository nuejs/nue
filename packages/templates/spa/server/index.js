
import { Hono } from 'hono'

const server = new Hono()

server.get('/users', async (c) => {
  const { KV } = c.env
  const { keys } = await KV.list({ prefix: 'user:' })
  const users = await Promise.all(
    keys.map(async key => {
      const user = await KV.get(key.name, { type: 'json' })
      user.id = key.name.replace('user:', '')
      return user
    })
  )
  users.sort((a, b) => b.created - a.created)
  return c.json(users)
})

server.get('/users/:id', async (c) => {
 const { KV } = c.env
 const id = c.req.param('id')
 const user = await KV.get(`user:${id}`, { type: 'json' })

 if (!user) return c.json({ error: 'User not found' }, 404)
 return c.json({ ...user, id })
})

export default server
