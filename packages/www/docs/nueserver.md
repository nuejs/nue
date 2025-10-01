# **Nueserver:** Edge first development
Nueserver is an HTTP server built for edge deployment. Write code using CloudFlare Workers patterns during local development, deploy globally when ready.


## Why edge first
Most web frameworks treat edge deployment as an afterthought. You develop with Node locally, then discover your code doesn't work at the edge. You build with traditional databases, then learn edge can't maintain connections.

Every Next.js developer knows this journey:

**NPM everywhere** - Your `npm run dev` spins up a Node.js server. Full runtime, any npm package, unlimited memory. You install packages freely: bcrypt, sharp, mongoose.

**Database connections** - You connect to Postgres or MySQL. Connection pooling handles load. Prisma makes queries elegant. Your `.env.local` has `DATABASE_URL` pointing to localhost.

**Production reality** - You deploy and things break. Replace bcrypt with Web Crypto? Swap sharp for browser-compatible alternatives? Abandon your ORM for raw SQL? Set up Postgres edge proxies?

The problem: you develop one way and deploy another. Your simple app turns complex. Nueserver flips this. Your development environment uses edge-compatible patterns from day one.


## Disclaimer
Nueserver currently works for local development only. It's the foundation for Nue's complete backend vision, which includes CloudFlare Workers deployment and business model abstractions like `customers`, `leads`, `charges`, and `items` available through `c.env`.

This vision enables [frontend-only development](frontend-only-development) where you describe your business and Nue builds it. See the [roadmap](roadmap) for details on when deployments and business model concepts launch.


## How it works
Nueserver provides a simple HTTP server with global route handlers. No classes, no imports, no server setup:

```javascript
get('/api/users', async (c) => {
  const users = await fetchUsers()
  return c.json(users)
})

post('/api/users', async (c) => {
  const data = await c.req.json()
  const user = await createUser(data)
  return c.json(user, 201)
})

use('/admin/*', async (c, next) => {
  const auth = c.req.header('authorization')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)
  await next()
})
```

Routes work immediately. No build step, no configuration. Hot reload updates both client and server code instantly.

CloudFlare headers are mocked locally for edge-compatible development:

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
Nueserver draws inspiration from Hono's clean API while staying focused on [separation of concerns](separation-of-concerns). The design prioritizes simplicity and edge-first development over comprehensive features.

**Minimal surface area** - Only the essentials for HTTP handling. No templating, no file serving, no kitchen sink features. Other layers handle their concerns.

**Edge-native APIs** - Built around Web Standards (Request, Response). What works locally works globally.

**Global functions** - Routes are simple function calls, not class methods or framework abstractions. Write `get('/users', handler)` anywhere in your code.

**Context over magic** - Everything flows through the explicit context object. No hidden globals, no framework-specific request parsing, no implicit dependencies.


### What's different from Hono

**No HTML responses** - Use `c.json()` and `c.text()` only. HTML generation belongs in the frontend.

**No file serving** - Static assets are handled by the build system, not the server layer. Each concern stays in its domain.

**No complex routing** - Simple patterns that map to CloudFlare's routing capabilities. No regex routes, no complex parameter validation.

**No middleware chaining complexity** - Linear middleware execution with explicit `next()` calls. Predictable flow, easy debugging.

This focused API makes the server layer predictable and portable. Your HTTP logic stays clean while other layers handle their specific concerns.



## Installation

For real projects, use Nuekit for the full development experience:

```bash
bun install nuekit
```

Or install Nueserver directly as a library:

```bash
bun install nueserver
```

See the [Server API reference](server-api) for complete routing and context documentation.