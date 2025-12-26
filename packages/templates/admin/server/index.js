

// login
post('/api/login', async (c) => {
  const { users } = c.env
  const { email, password } = await c.req.json()

  const ret = await users.login(email, password)
  return ret ? c.json(ret) : c.json({ error: 'Invalid credentials' }, 401)
})

post('/api/logout', async (c) => {
  const { users } = c.env
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '')
  await users.logout(sessionId)
  return c.json({ success: true })
})

post('/api/leads', async (c) => {
  const { users } = c.env
  const country = c.req.header('cf-ipcountry')
  const data = await c.req.json()
  const user = await users.create({ ...data, country })
  console.log('created', user)
  return c.json(user)
})

// authenticated requests
use('/api/admin/*', async (c, next) => {
  const { users } = c.env
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '')
  if (await users.authenticate(sessionId)) await next()
  else return c.json({ error: 'Invalid session' }, 401)
})

get('/api/admin/all', async (c) => {
  const { leads } = c.env
  return c.json({ leads: await leads.getAll() })
})

get('/api/admin/leads/:id', async (c) => {
  const { leads } = c.env
  const lead = await leads.get(c.req.param('id'))
  return lead ? c.json(lead) : c.json({ error: 'Lead not found' }, 404)
})

del('/api/admin/leads/:id', async (c) => {
  const { leads } = c.env
  const lead = await leads.get(c.req.param('id'))
  if (!lead) return c.json({ error: 'Not found' }, 404)
  await lead.remove()
  return c.json({ success: true })
})



