
# Nueserver API
Nueserver is a minimal HTTP server that runs identically in development and on CloudFlare Workers. Write once, deploy everywhere.

# Design principles
Nueserver draws inspiration from Hono's clean API while staying focused on [separation of concerns](separation-of-concerns). The design prioritizes simplicity and edge-first development over comprehensive features.

**Minimal surface area** - Only the essentials for HTTP handling. No templating, no file serving, no kitchen sink features. Other layers handle their concerns.

**Edge-native APIs** - Built around Web Standards (Request, Response) and CloudFlare primitives (D1, KV). What works locally works globally.

**Global functions** - Routes are simple function calls, not class methods or framework abstractions. Write `get('/users', handler)` anywhere in your code.

**Context over magic** - Everything flows through the explicit context object. No hidden globals, no framework-specific request parsing, no implicit dependencies.


## What's different from Hono

**No HTML responses** - Use `c.json()` and `c.text()` only. HTML generation belongs in the frontend.

**No file serving** - Static assets are handled by the build system, not the server layer. Each concern stays in its domain.

**No complex routing** - Simple patterns that map to CloudFlare's routing capabilities. No regex routes, no complex parameter validation.

**No middleware chaining complexity** - Linear middleware execution with explicit `next()` calls. Predictable flow, easy debugging.

This focused API makes the server layer predictable and portable. Your HTTP logic stays clean while other layers handle their specific concerns.


## Quick start

```javascript
get('/api/users', async (c) => {
  return c.json([{ id: 1, name: 'Alice' }])
})

post('/api/users', async (c) => {
  const user = await c.req.json()
  return c.json(user, 201)
})
```

## Route handlers

### get(path, handler)
Handle GET requests:

```javascript
get('/users', async (c) => {
  return c.json(users)
})

get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = users.find(u => u.id == id)
  return c.json(user)
})
```

### post(path, handler)
Handle POST requests:

```javascript
post('/users', async (c) => {
  const data = await c.req.json()
  const user = createUser(data)
  return c.json(user, 201)
})
```

### del(path, handler)
Handle DELETE requests:

```javascript
del('/users/:id', async (c) => {
  const id = c.req.param('id')
  deleteUser(id)
  return c.json({ deleted: id })
})
```

### use(path, middleware)
Add middleware that runs before route handlers:

```javascript
use('/admin/*', async (c, next) => {
  const auth = c.req.header('authorization')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)
  await next()
})

// Global middleware
use(async (c, next) => {
  console.log(c.req.method, c.req.url)
  await next()
})
```

## Route patterns

### Static routes
```javascript
get('/users', handler)
get('/api/status', handler)
```

### Parameters
```javascript
get('/users/:id', handler)          // /users/123
get('/posts/:slug/comments', handler) // /posts/hello/comments
```

### Wildcards
```javascript
use('/admin/*', middleware)         // Matches /admin/users, /admin/settings
get('/files/*', handler)           // Matches any path under /files
```

## Context object

Every handler receives a context object with request and response helpers.

### Request (c.req)

```javascript
get('/example', async (c) => {
  // Get route parameters
  const id = c.req.param('id')
  
  // Get query parameters
  const page = c.req.query('page')     // single param
  const params = c.req.query()         // all params as object
  
  // Get headers
  const auth = c.req.header('authorization')
  
  // Parse request body
  const data = await c.req.json()      // JSON
  const text = await c.req.text()      // plain text
})
```

### Response helpers (c)

```javascript
get('/example', async (c) => {
  // JSON response
  return c.json({ message: 'Hello' })
  
  // JSON with status
  return c.json({ error: 'Not found' }, 404)
  
  // Text response
  return c.text('Hello world')
  
  // Status then JSON
  return c.status(201).json({ created: true })
})
```

### Environment (c.env)
Access CloudFlare bindings or local environment:

```javascript
get('/data', async (c) => {
  const { DB, KV } = c.env
  
  // SQL database (SQLite locally, D1 globally)
  const users = await DB.prepare('SELECT * FROM users').all()
  
  // Key-value store (JSON locally, KV globally)  
  const session = await KV.get('session:123', { type: 'json' })
  
  return c.json({ users, session })
})
```

## Edge-first patterns

### Database access
Same API locally and globally:

```javascript
get('/users', async (c) => {
  const { DB } = c.env
  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})
```

### Key-value storage
JSON files locally, CloudFlare KV globally:

```javascript
post('/login', async (c) => {
  const { KV } = c.env
  const sessionId = crypto.randomUUID()
  await KV.put(`session:${sessionId}`, userData)
  return c.json({ sessionId })
})
```

### CloudFlare headers
Available in both environments:

```javascript
post('/contact', async (c) => {
  const country = c.req.header('cf-ipcountry')
  const ip = c.req.header('cf-connecting-ip')
  
  return c.json({ country, ip })
})
```

## Middleware patterns

### Authentication
```javascript
use('/api/*', async (c, next) => {
  const token = c.req.header('authorization')
  if (!isValid(token)) {
    return c.json({ error: 'Invalid token' }, 401)
  }
  await next()
})
```

### CORS
```javascript
use(async (c, next) => {
  const response = await next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
})
```

### Logging
```javascript
use(async (c, next) => {
  const start = Date.now()
  const response = await next()
  console.log(`${c.req.method} ${c.req.url} - ${Date.now() - start}ms`)
  return response
})
```

## Error handling

Errors return 500 automatically:

```javascript
get('/might-fail', async (c) => {
  // This error becomes a 500 response
  throw new Error('Something went wrong')
})
```

Return custom errors:

```javascript
get('/users/:id', async (c) => {
  const user = findUser(c.req.param('id'))
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  return c.json(user)
})
```

## Development workflow

Routes are global functions. No imports needed:

```javascript
// Define routes anywhere
get('/health', async (c) => {
  return c.json({ status: 'ok' })
})

// Use middleware
use('/admin/*', requireAuth)

// Handle different methods
post('/webhook', handleWebhook)
del('/cache/:key', clearCache)
```

The server handles everything automatically. Same code runs in development with `nue serve` and in production on CloudFlare Workers.