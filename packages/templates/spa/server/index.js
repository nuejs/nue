
import { Hono } from 'hono'

const server = new Hono()

server.get('/api', async (c) => {
  const country = c.req.header('cf-ipcountry')
  const timezone = c.req.header('cf-timezone')
  const { version='foo' } = c.env
  return c.json({ version, country, timezone })
})

export default server
