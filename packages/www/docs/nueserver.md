
# Nueserver: Edge-first development
Nueserver is an HTTP server that runs identically in development and on CloudFlare Workers. Write code once, deploy everywhere. No environment variables, no connection strings, no platform-specific adaptations.


## Why edge-first
Most web frameworks treat edge deployment as an afterthought. You develop with Node locally, then discover your code doesn't work at the edge. You build with traditional databases, then learn edge can't maintain connections.

Every Next.js developer knows this journey:

**NPM everywhere** - Your `npm run dev` spin
s up a Node.js server. Full runtime, any npm package, unlimited memory. You install packages freely - bcrypt, sharp, mongoose.

**Database connections** - You connect to Postgres or MySQL. Connection pooling handles load. Prisma makes queries elegant. Your `.env.local` has `DATABASE_URL` pointing to localhost.

**Production reality** - You deploy to production and things break. Replace bcrypt with Web Crypto? Swap sharp for browser-compatible alternatives? Abandon your ORM for raw SQL? Set up Postgres edge proxies?

The problem: you develop one way and deploy another. Your simple app turns complex.

## The edge-first approach

Nueserver flips this. Your development environment IS an edge environment. Same constraints, same APIs, same behavior:

```javascript
// Works locally and globally
get('/api/users', async (c) => {
  // SQLite locally, D1 globally - same API
  const { DB } = c.env
  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})

post('/api/login', async (c) => {
  // JSON files locally, CloudFlare KV globally - same API
  const { KV } = c.env
  const sessionId = crypto.randomUUID()
  await KV.put(`session:${sessionId}`, userData)
  return c.json({ sessionId })
})
```

**Same APIs** - The code above runs identically on your machine and on 200+ edge locations.

**Same environment** - No choosing between serverless and edge. No environment-specific code. What runs locally runs globally.

**Same development flow** - One command: `nue serve`. Frontend and backend together with hot reload for everything.

## How it works

### Database abstraction
SQLite in development becomes CloudFlare D1 in production. Both are available through `c.env` and use the same prepared statement API:

```javascript
get('/api/users', async (c) => {
  const { DB } = c.env
  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})

post('/api/users', async (c) => {
  const { DB } = c.env
  const { name } = await c.req.json()
  const result = await DB.prepare('INSERT INTO users (name) VALUES (?)').bind(name).run()
  return c.json({ id: result.lastInsertRowid })
})
```

No connection strings. No environment variables. No database client configuration.

### Key-value storage
JSON files locally become CloudFlare KV globally. Available through `c.env` with the same API for sessions, caching, and simple data:

```javascript
post('/api/login', async (c) => {
  const { KV } = c.env
  const sessionId = crypto.randomUUID()
  await KV.put(`session:${sessionId}`, { user: 'alice' })
  return c.json({ sessionId })
})

get('/api/session', async (c) => {
  const { KV } = c.env
  const sessionId = c.req.header('authorization')
  const session = await KV.get(`session:${sessionId}`, { type: 'json' })
  return c.json(session)
})
```

Automatic JSON serialization. Distributed edge storage without code changes.

### CloudFlare headers
Edge-specific features work in both environments through the same request API:

```javascript
post('/api/contact', async (c) => {
  const country = c.req.header('cf-ipcountry')
  const ip = c.req.header('cf-connecting-ip')

  const data = await c.req.json()
  return c.json({ ...data, country, ip })
})
```

Geolocation and network data available during development. No environment detection needed.

## Development benefits

**Instant startup** - No build step. Routes work immediately. Hot reload updates both client and server code.

**Zero configuration** - Define routes as global functions. No imports, no server setup, no middleware configuration.

**Testable by design** - Mock databases and KV storage let you unit test business logic without external dependencies.

**True full-stack development** - Frontend and backend on the same port. State management works across both layers.

## Architecture patterns

**Business model separation** - Keep HTTP routing separate from data operations. Model functions handle business logic, routes handle HTTP concerns.

**Edge-native features** - CloudFlare headers work in both environments. Geolocation, IP detection, and security features available during development.

**Progressive enhancement** - Start with simple JSON APIs. Add authentication, caching, and database operations without architectural changes.

When your development environment matches production reality, you stop managing infrastructure and start shipping features.

## Installation

For real projects, use Nuekit for the full development experience:

```bash
bun install nuekit
```

Or install Nueserver directly as a library:

```bash
bun install nueserver
```

See the [Server API reference](server-api) and [Server testing](server-testing) for complete routing, context, D1, KV, and testing documentation.

