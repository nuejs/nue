
# Edge first
Most web frameworks treat edge deployment as an afterthought. You develop with Node locally, then discover your code doesn't work at the edge. You build with traditional databases, then learn edge can't maintain connections. Edge-first flips this - you develop with edge from day one, so what works locally works globally.


## The localhost trap
Every Next.js developer knows this journey. You start building with the tools you know:

**NPM everywhere** - Your `npm run dev` spins up a Node.js server. Full runtime, any npm package, unlimited memory. You install packages freely - bcrypt, sharp, mongoose. Everything works.

**Database connections** - You connect to Postgres or MySQL. Connection pooling handles load. Prisma makes queries elegant. Your `.env.local` has `DATABASE_URL` pointing to localhost or a cloud database.

**Production reality** - You deploy to production and things stop working. Replace bcrypt with Web Crypto? Swap sharp for browser-compatible alternatives? Abandon your ORM for raw SQL? Set up Postgres edge proxies or HTTP-based database access?

The problem is: you develop one way and deploy another. Your simple app turns complex. The codebase becomes harder to maintain and scale.



## Edge-first development
Edge-first means your development environment IS an edge environment. Same constraints, same APIs, same behavior:

```javascript
import { Hono } from 'hono'

// Hono server: same API locally and at the edge
const server = new Hono()

server.all('/api/*', async (c, next) => {

  // KV store for sessions - same API locally and globally
> const { KV } = c.env

  // handle authentication
  const user = await KV.get(`session:${sessionId}`)
  if (user) await next()

  // ...
})

server.get('/api/users', async (c) => {

  // SQLite locally, D1 globally
> const { DB } = c.env

  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})

export default server
```

**Same APIs** - The code above runs identically on your machine and on 200+ edge locations. No environment variables, no connection strings, no configuration drift.

**Same environment** - No choosing between serverless and edge. No environment-specific code. What runs locally runs globally without changes.


## The shift
One command: `nue serve`. Frontend and backend together. Hot reload everything: both client assets and server routes. No separate ports, no coordination overhead.

When your development environment matches production reality, you stop managing infrastructure and start writing functions. You stop debugging environment differences and start shipping features.


