
# Server testing API
Complete reference for testing edge-first business models with Nueserver's mock environment. The testing API provides SQLite and KV storage mocks that match the CloudFlare runtime APIs exactly.

## Mock environment
Import the mock environment for testing:

```javascript
import { env } from 'nueserver/mock'
```

The `env` object provides `DB` and `KV` properties that implement the same APIs as CloudFlare D1 and KV storage. Both operate solely in memory.

## Database API (env.DB)
Access the database through `env.DB`, which provides an in-memory SQLite database with the CloudFlare D1 API:

**prepare(sql)** - Create a prepared statement
**exec(sql)** - Execute SQL directly
**batch(statements)** - Execute multiple statements in a transaction

### Prepared statement methods
**first(...params)** - Execute and return first row
**all(...params)** - Execute and return all rows
**run(...params)** - Execute and return metadata
**bind(...params)** - Bind parameters and return new statement

## Key-value API (env.KV)
Access the KV store through `env.KV`, which provides a Map-based store with the CloudFlare KV API:

**get(key, options)** - Retrieve a value. Use `{ type: 'json' }` for objects
**put(key, value)** - Store a value. Objects are automatically JSON serialized
**delete(key)** - Remove a key
**list(options)** - List keys with optional `prefix` and `limit`


## Model factory pattern
Create testable business models using factory functions that accept the environment:

```javascript
// model/crm.js
export function createCRM(env) {
  const { DB, KV } = env

  async function addContact(data) {
    const result = await DB.prepare(
      'INSERT INTO contacts (name, email) VALUES (?, ?)'
    ).bind(data.name, data.email).run()

    return { ...data, id: result.lastInsertRowid }
  }

  async function getContacts() {
    return await DB.prepare('SELECT * FROM contacts ORDER BY created DESC').all()
  }

  async function cacheContact(contact) {
    await KV.put(`contact:${contact.id}`, contact)
  }

  return { addContact, getContacts, cacheContact }
}
```

## Testing business models
Test data operations independently of HTTP routes:

```javascript

// Bun testing interfaces are auto-imported
// import { test, expect } from 'bun:test'

import { env } from 'nueserver/mock'
import { createCRM } from './model/crm.js'

test('addContact creates contact with ID', async () => {
  // Set up test schema
  await env.DB.exec(`
    CREATE TABLE contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const crm = createCRM(env)
  const contact = await crm.addContact({
    name: 'Alice Johnson',
    email: 'alice@example.com'
  })

  expect(contact.id).toBe(1)
  expect(contact.name).toBe('Alice Johnson')
})

test('cacheContact stores in KV', async () => {
  const crm = createCRM(env)
  const contact = { id: 1, name: 'Alice', email: 'alice@example.com' }

  await crm.cacheContact(contact)

  const cached = await env.KV.get('contact:1', { type: 'json' })
  expect(cached.name).toBe('Alice')
})
```

## Authentication model pattern
Test session management and authentication logic:

```javascript
// model/auth.js
export function createAuth(env) {
  const { KV } = env

  async function createSession(userData) {
    const sessionId = crypto.randomUUID()
    await KV.put(`session:${sessionId}`, {
      ...userData,
      created: Date.now()
    })
    return sessionId
  }

  async function getUser(sessionId) {
    return await KV.get(`session:${sessionId}`, { type: 'json' })
  }

  return { createSession, getUser }
}

// auth.test.js
test('session management', async () => {
  const auth = createAuth(env)

  const sessionId = await auth.createSession({
    email: 'user@example.com',
    role: 'admin'
  })

  const user = await auth.getUser(sessionId)
  expect(user.email).toBe('user@example.com')
  expect(user.role).toBe('admin')
})
```

## Route integration
Models integrate cleanly into route handlers:

```javascript
// server/index.js
import { createCRM } from './model/crm.js'
import { createAuth } from './model/auth.js'

get('/api/contacts', async (c) => {
  const crm = createCRM(c.env)
  const contacts = await crm.getContacts()
  return c.json(contacts)
})

post('/api/contacts', async (c) => {
  const crm = createCRM(c.env)
  const data = await c.req.json()
  const contact = await crm.addContact(data)
  return c.json(contact, 201)
})

post('/api/login', async (c) => {
  const auth = createAuth(c.env)
  const { email, password } = await c.req.json()

  // Validate credentials...
  const sessionId = await auth.createSession({ email })
  return c.json({ sessionId })
})
```

## Testing patterns
### Schema setup
Create test tables before each test:

```javascript
test('contact operations', async () => {
  await env.DB.exec(`
    CREATE TABLE contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `)

  // Test operations...
})
```

### Batch operations
Test transaction patterns:

```javascript
test('batch contact creation', async () => {
  const crm = createCRM(env)
  const contacts = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
  ]

  const statements = contacts.map(contact =>
    env.DB.prepare('INSERT INTO contacts (name, email) VALUES (?, ?)')
      .bind(contact.name, contact.email)
  )

  await env.DB.batch(statements)

  const result = await env.DB.prepare('SELECT COUNT(*) as count FROM contacts').first()
  expect(result.count).toBe(2)
})
```

### Complex queries
Test business logic with joins and conditions:

```javascript
test('contact search', async () => {
  const crm = createCRM(env)

  // Set up test data...

  const results = await crm.searchContacts({ query: 'alice', limit: 10 })
  expect(results.length).toBe(1)
  expect(results[0].name).toBe('Alice Johnson')
})
```

## Environment isolation
Each test gets a fresh, isolated environment. Tests don't affect each other and can run in parallel:

```javascript
test('first test', async () => {
  await env.KV.put('key', 'value1')
  const value = await env.KV.get('key')
  expect(value).toBe('value1')
})

test('second test', async () => {
  // KV is empty again
  const value = await env.KV.get('key')
  expect(value).toBe(null)
})
```

This isolation ensures reliable, predictable tests that can be executed independently.
