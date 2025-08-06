
import { Hono } from 'hono'
import { createAuth } from './model/auth.js'
import { createCRM } from './model/crm.js'

const server = new Hono()

server.get('/api', async (c) => {
  const { version } = c.env
  return c.json({ version })
})

// login
server.post('/api/login', async (c) => {
  const { email, password } = await c.req.json()
  const auth = createAuth(c.env)

  if (auth.validate(email, password)) {
    const sessionId = await auth.addSession({ email })
    return c.json({ sessionId })
  }

  return c.json({ error: 'Invalid credentials' }, 401)
})

server.post('/api/contacts', async (c) => {
  const country = c.req.header('cf-ipcountry')
  const data = await c.req.json()
  const contact = await createCRM(c.env).addContact({ ...data, country })
  return c.json(contact)
})


// authenticated requests
server.use('/admin/*', async (c, next) => {
  const user = await createAuth(c.env).getUser(c.req)
  if (!user) return c.json({ error: 'Invalid session' }, 401)
  await next()
})

// contacts
server.get('/admin/contacts', async (c) => {
  const crm = createCRM(c.env)
  const contacts = await crm.getContacts(c.req.query())
  return c.json(contacts)
})

server.get('/admin/contacts/:id', async (c) => {
  const crm = createCRM(c.env)
  const id = parseInt(c.req.param('id'))

  const customer = await crm.getContact(id)
  if (!customer) return c.json({ error: 'Customer not found' }, 404)

  return c.json(customer)
})

server.delete('/admin/contacts/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json(createCRM(c.env).deleteContact(id))
})

// search
server.get('/admin/search', async (c) => {
  const crm = createCRM(c.env)
  const query = c.req.query('q')

  if (!query) return c.json({ error: 'Query parameter required' }, 400)

  const results = await crm.search(query)
  return c.json(results)
})

// logout
server.get('/admin/logout', async (c) => {
  return c.json({ success: await createAuth(c.env).logout(c.req) })
})

export default server