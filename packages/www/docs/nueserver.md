
# **Nueserver:** Edge first development
Nueserver is an HTTP server built for edge deployment. Write code locally, deploy globally when ready.

> **Disclaimer** Nueserver currently works for local development only. It's the foundation for Nue's upcoming backend vision. See the [roadmap](roadmap) for details


## What is edge first
Most web frameworks treat edge deployment as an afterthought. You develop with Node locally, then discover your code doesn't work at the edge. You build with traditional databases, then learn edge can't maintain connections.

Every Next.js developer knows this journey:

**NPM everywhere** - Your `npm run dev` spins up a Node.js server. Full runtime, any npm package, unlimited memory. You install packages freely: bcrypt, sharp, mongoose.

**Database connections** - You connect to Postgres or MySQL. Connection pooling handles load. Prisma makes queries elegant. Your `.env.local` has `DATABASE_URL` pointing to localhost.

**Production reality** - You deploy and things break. Replace bcrypt with Web Crypto? Swap sharp for browser-compatible alternatives? Abandon your ORM for raw SQL? Set up Postgres edge proxies?

The problem: you develop one way and deploy another. Your simple app turns complex. Nueserver flips this. Your development environment uses edge-compatible patterns from day one.


## How it works
Nueserver provides a simple HTTP server with global route handlers. No classes, no imports, no server setup:

```javascript
get('/api/users', async (c) => {
  const users = await c.env.users.getAll()
  return c.json(users)
})

post('/api/users', async (c) => {
  const data = await c.req.json()
  const user = await c.env.users.create(data)
  return c.json(user, 201)
})

use('/admin/*', async (c, next) => {
  const auth = c.req.header('authorization')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)
  await next()
})
```

When working with Nuekit CloudFlare headers are mocked locally for edge-compatible development:

```javascript
post('/api/contact', async (c) => {
  const country = c.req.header('cf-ipcountry')
  const ip = c.req.header('cf-connecting-ip')

  const data = await c.req.json()
  return c.json({ ...data, country, ip })
})
```

When deployment arrives, these headers provide real geolocation and network data at the edge.


## Design principles
Nueserver draws inspiration from Hono's clean API while with the follwing differences:

**Global methods** - No Hono imports or server exports. Use `get()`, `post()`, or `use()` directly on the code.

**No HTML responses** - Use `c.json()` and `c.text()` only. HTML generation belongs in the frontend.

**No file serving** - Static assets are handled by the build system, not the server layer. Each concern stays in its domain.

**No complex routing** - Simple patterns that map to CloudFlare's routing capabilities. No regex routes, no complex parameter validation.

**No middleware chaining complexity** - Linear middleware execution with explicit `next()` calls. Predictable flow, easy debugging.

This focused API makes the server layer predictable and portable. Your HTTP logic stays clean while other layers handle their specific concerns.



## Installation

For real projects, use Nuekit for the full development experience:

```bash
bun install --global nuekit
```

Or install Nueserver directly as a library:

```bash
bun install nueserver
```

See the [Server API reference](server-api) for complete routing and context documentation.
