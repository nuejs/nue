
# Server development
Edge-first development means writing server code that works identically on your machine and across 200+ global edge locations. ie. your development environment IS an edge environment. Here's how it looks:

```javascript
import { Hono } from 'hono'

const server = new Hono()

server.get('/api/users', async (c) => {
  // SQLite locally, D1 globally - same API
  const { DB } = c.env
  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})

server.post('/api/login', async (c) => {
  // JSON files locally, CloudFlare KV globally - same API
  const { KV } = c.env
  const sessionId = crypto.randomUUID()
  await KV.put(`session:${sessionId}`, userData)
  return c.json({ sessionId })
})

export default server
```

Same code runs everywhere. No connection strings, no environment variables, no platform-specific adaptations. See [Edge first](/docs/edge-first) for conceptual details.


## Setting up
Create a full-stack application to see how edge-first development works:

```bash
nue create full
```

This generates a complete backend structure in `@system/server/`:

```
@system/server/
├── index.js         # Hono-based routes
├── model/           # Business logic
│   ├── index.js     # The business model
│   ├── auth.js      # Authentication
│   └── utils.js     # Utilities
├── db/              # Database and storage
│   ├── app.db       # SQLite database
│   ├── kv.json      # Key-value data
│   └── init/        # Schema and sample data
└── test/            # Unit and integration tests
```

Configure the server in `site.yaml`:

```yaml
server:
  db: db/app.db
  kv: db/kv.json
  reload: true
```

Start development with one command:

```bash
nue serve
```

This runs both frontend and backend together with hot reload for all changes - client assets, server routes, and database schema.


## Database integration
Edge environments use SQLite locally and CloudFlare D1 globally. Both expose the same prepared statement API, so your code works everywhere without changes.

### Schema and migrations

Database schema lives in `db/init/schema.sql`:

```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT NOT NULL,
  country TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Sample data in `db/init/sample-data.sql` provides realistic development data. The `load-data.js` script initializes both schema and sample data during development.


### Data access patterns
The template uses factory functions that accept the environment and return data access methods:

```javascript
export function createCRM(env) {
  const { DB } = env

  async function getContacts({ query, start = 0, length = 20 }) {
    const sql = `SELECT * FROM contacts 
                 WHERE email LIKE ? 
                 ORDER BY created DESC 
                 LIMIT ? OFFSET ?`
    
    const results = await DB.prepare(sql)
      .bind(`%${query}%`, length, start)
      .all()
    
    return { results: results.map(createContact) }
  }

  return { getContacts }
}
```

This pattern separates data access from business logic while maintaining the same API across environments.

## Key-value storage
Use KV storage for sessions, caching, and simple data that doesn't need SQL queries. Local development uses JSON files, production uses CloudFlare KV.

### Session management
Authentication patterns work the same locally and globally:

```javascript
export function createAuth(env) {
  const { KV } = env

  async function addSession(userData) {
    const sessionId = crypto.randomUUID()
    await KV.put(`session:${sessionId}`, {
      ...userData,
      created: Date.now()
    })
    return sessionId
  }

  async function getUser(req) {
    const sessionId = req.header('Authorization')?.replace('Bearer ', '')
    return sessionId && await KV.get(`session:${sessionId}`, { type: 'json' })
  }

  return { addSession, getUser }
}
```

The KV API handles JSON serialization automatically and provides the same interface whether you're storing in local files or distributed edge storage.


## Business model separation
To keep your code clean and easty to maintain it's important to separate your business logic from HTTP routing. Model functions handle data operations, while routes handle HTTP concerns like authentication and response formatting.

### Model layer
Business logic lives in plain, testable functions that accept environment and return operations:

```javascript
// In model/crm.js
export function createCRM(env) {
  const { DB } = env

  async function addContact(data) {
    const result = await DB.prepare(`
      INSERT INTO contacts (name, email, country) VALUES (?, ?, ?)
    `).bind(data.name, data.email, data.country).run()

    return { ...data, id: result.lastInsertRowid }
  }

  return { addContact }
}
```

### Route layer
Routes handle HTTP specifics and delegate business logic to model functions:

```javascript
// In index.js
server.post('/api/contacts', async (c) => {

  // All CloudFlare headers are also mocked locally
  const country = c.req.header('cf-ipcountry')
  const data = await c.req.json()
  
  const contact = await createCRM(c.env).addContact({ ...data, country })
  return c.json(contact)
})
```
This separation makes business logic testable independently of HTTP concerns. See full list of [CloudFlare headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/).


## Authentication
Our authentication uses bearer tokens with KV storage for sessions:

```javascript
server.use('/admin/*', async (c, next) => {
  const user = await createAuth(c.env).getUser(c.req)
  if (!user) return c.json({ error: 'Invalid session' }, 401)
  await next()
})
```

### Client integration
Frontend code uses the same authentication tokens locally and in production:

```javascript
// In @system/app.js
export async function login(email, password) {
  const { sessionId } = await post('/api/login', { email, password })
  localStorage.$sid = sessionId
}

function getAuthHeader() {
  const sid = localStorage.$sid
  return sid ? { Authorization: `Bearer ${sid}` } : {}
}
```

Browser `localStorage` persists sessions across page reloads while remaining secure for SPA authentication flows.

## Testing
Test business logic independently using mock databases and KV storage:

```javascript
// In test/mock.js
export const env = {
  DB: new Database(':memory:'),  // In-memory SQLite
  KV: new Map()                  // Mock KV with Map
}

// In test/crm.test.js
test('addContact', async () => {
  const crm = createCRM(env)
  const contact = await crm.addContact({
    email: 'test@example.com',
    country: 'US'
  })
  
  expect(contact.id).toBe(1)
})
```

Mock environments let you test data operations without external dependencies while using the same business logic code that runs in production.


## External servers
For existing backends or non-JavaScript servers, configure Nue as a proxy:

```yaml
server:
  url: http://localhost:5000
  routes: [/api/, /admin/]
```

This forwards matching routes to your external server while serving static assets through Nue. Mix edge-first development with legacy systems or alternative languages.

The proxy configuration works in both development and production, letting you incrementally adopt edge-first patterns while maintaining existing infrastructure.


## Preparing for deployment
Edge-first development means your local code is already deployment-ready. When CloudFlare Workers deployment arrives (see [Roadmap](/docs/roadmap)), your existing code will work without changes.

The model, server routes, and databases will transition automatically from local files to distributed edge infrastructure. You can already build with confidence that your architecture scales globally.

Of course, if you're comfortable with the Wrangler tool, you can already push the static site from .dist to production along with the server directory.



