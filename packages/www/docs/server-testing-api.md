
# Server testing API
Nueserver comes with a testing API with SQLite and KV storage mocks that match the CloudFlare runtime APIs. You can use these mocks to develop your business model that works locally and globally on the edge.

## Mock environment
Import the mock environment for testing:

```javascript
import { env } from 'nueserver/mock'
```

The `env` object provides `DB` and `KV` properties that implement the same APIs as CloudFlare D1 and KV storage. Both operate solely in memory.

### Database API

**prepare(sql)** - Create a prepared statement:

```javascript
const stmt = env.DB.prepare('SELECT * FROM users WHERE id = ?')
```

**exec(sql)** - Execute SQL directly:

```javascript
await env.DB.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL)
`)
```

**batch(statements)** - Execute multiple statements in a transaction:

```javascript
const statements = [
  env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind('Alice'),
  env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind('Bob')
]
await env.DB.batch(statements)
```

### Prepared statement methods

**first(...params)** - Execute and return first row:

```javascript
const user = await stmt.first(123)
```

**all(...params)** - Execute and return all rows:

```javascript
const users = await stmt.all()
```

**run(...params)** - Execute and return metadata:

```javascript
const result = await stmt.run('Alice', 'alice@example.com')
console.log(result.lastInsertRowid) // Auto-increment ID
```

**bind(...params)** - Bind parameters and return new statement:

```javascript
const boundStmt = stmt.bind(123)
const user = await boundStmt.first()
```

### Chaining parameters

Parameters can be bound and additional parameters passed:

```javascript
const stmt = env.DB.prepare('SELECT * FROM users WHERE role = ? AND status = ?')
const boundStmt = stmt.bind('admin')
const users = await boundStmt.all('active') // role='admin', status='active'
```

## Key-value testing (KV)

Access the KV store through `env.KV`, which provides a Map-based store with the CloudFlare KV API:

```javascript
const { KV } = env
```

### KV API

**get(key, options)** - Retrieve a value:

```javascript
// Get as string (default)
const value = await env.KV.get('session:123')

// Get as JSON
const session = await env.KV.get('session:123', { type: 'json' })
```

Returns `null` if key doesn't exist.

**put(key, value)** - Store a value:

```javascript
// Store string
await env.KV.put('config:theme', 'dark')

// Store object (auto-serialized to JSON)
await env.KV.put('session:123', { user: 'alice', created: Date.now() })
```

Objects are automatically JSON.stringify'd on storage.

**delete(key)** - Remove a key:

```javascript
const deleted = await env.KV.delete('session:123')
// Returns true if key existed, false otherwise
```

**list(options)** - List keys with optional filtering:

```javascript
// List all keys
const result = await env.KV.list()

// List with prefix
const sessions = await env.KV.list({ prefix: 'session:' })

// Limit results
const recent = await env.KV.list({ limit: 10 })

// Result structure:
{
  keys: [{ name: 'session:123' }, { name: 'session:456' }],
  list_complete: true,
  cursor: null
}
```


## Developing testable business models
Your business model contains the core data operations and business logic of your application - functions that create users, process orders, manage sessions, and handle all the essential operations your app performs. Keeping this logic separate from HTTP routes makes it portable across different environments, easy to unit test without spinning up servers, and allows you to change your web framework without rewriting your core application logic. The factory pattern achieves this separation by accepting an environment object as a parameter and returning an object with your business methods, making the same code work identically in development, testing, and production.


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
Unit test your business operations using the mock environment to simulate database and key-value operations. Write tests that verify your data logic works correctly without any HTTP complexity.


```javascript

// Bun testing interfaces are auto-imported
// import { test, expect } from 'bun:test'

import { env } from 'nueserver/mock'
import { createCRM } from './model/crm.js'

test('addContact creates contact with ID', async () => {

  // Set up test schema
  await env.DB.exec(`
    CREATE TABLE contacts (...)
  `)

  // create CRM instance
  const crm = createCRM(env)

  // test a matho
  const contact = await crm.addContact({
    name: 'Alice Johnson',
    email: 'alice@example.com'
  })

  expect(contact.id).toBe(1)
  expect(contact.name).toBe('Alice Johnson')
})


// another test
test('cacheContact stores in KV', async () => {
  const crm = createCRM(env)
  const contact = { id: 1, name: 'Alice', email: 'alice@example.com' }

  await crm.cacheContact(contact)

  const cached = await env.KV.get('contact:1', { type: 'json' })
  expect(cached.name).toBe('Alice')
})

// etc..
```


## Route integration
Use the factory pattern in route handlers by passing c.env to create model instances. This maintains clean separation between HTTP concerns and business logic.RetryClaude can make mistakes. Please double-check responses.

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

// etc...
```

