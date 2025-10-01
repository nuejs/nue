
get('/users', async (c) => {
  const { users } = c.env
  return c.json(await users.all())
})

get('/users/:id', async (c) => {
  const { users } = c.env
  const id = c.req.param('id')
  const user = await users.get(id)
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json(user)
})
