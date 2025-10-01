# Nueserver API
[Nueserver](nueserver) is a minimal HTTP server built for edge deployment. Write code using CloudFlare Workers patterns during local development.


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
Access environment-specific resources. Currently supports CloudFlare headers during development:

```javascript
post('/contact', async (c) => {
  // CloudFlare headers (mocked locally)
  const country = c.req.header('cf-ipcountry')
  const ip = c.req.header('cf-connecting-ip')

  const data = await c.req.json()
  return c.json({ ...data, country, ip })
})
```

Future versions will provide business model abstractions through `c.env`:

```javascript
// Coming: business model primitives
const { customers, leads, charges } = c.env

get('/api/customers', async (c) => {
  const all = await customers.all()
  return c.json(all)
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

The server handles everything automatically. Same code runs in development with `nue serve` and will run in production on CloudFlare Workers when deployment arrives.