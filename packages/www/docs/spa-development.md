
# Single-page application (SPA) development
Single-page applications in Nue are dynamic web apps that run entirely in the browser. Unlike content-focused apps that generate static pages, SPAs use client-side routing and state management to create fluid, app-like experiences without page reloads.

> **Local development only**: SPA's currently work only as a local mockup to get a glimpse of what's coming. Production deployments with CloudFlare integration and one data model come later. See [roadmap](roadmap) for details.


## Getting started
Here's the setup for the simplest of SPAs:

```bash
nue create spa
```

This gives you the following project structure:

```
├── index.html           # SPA entry point
├── ui/                  # UI components
|   ├── entry.html
|   └── table.html
├── server/
|   ├── index.js         # Route handlers
|   ├── data/            # Local data mocks
|   |   └── users.json   # Mock for user data
└── css/                 # Styling
```

Start development:

```bash
nue dev
```

This runs both frontend and backend together with hot reload for all assets.


## SPA architecture
Nue SPAs separate concerns into distinct layers that work together seamlessly.


### Entry point and routing
The `index.html` file controls your entire application. When you use `<!doctype dhtml>` with `<body>` scope, this file handles all routes within its directory.

```html
<!doctype dhtml>

<script>
  import { state } from 'state'
  state.setup({ route: '/:id', autolink: true })
</script>

<body>
  <main>
    <article/>
  </main>

  <script>
    state.on('id', ({ id }) => {
      this.mount(id ? 'user' : 'users', 'article')
    })

    mounted() {
      state.init()
    }
  </script>
</body>
```

### How it works

- URL parameters like `/:id` capture routes (`/123` sets `state.id = "123"`)
- The `autolink` option turns regular `<a href>` links into SPA navigation
- State listeners mount components based on URL changes
- Browser back/forward buttons work automatically
- The `this.mount()` method renders different components based on the URL


See [state API](state-api) and [HTML syntax](html-syntax) for details on dynamic state management and dynamic mounting.


### UI components
Components live in `.html` files and focus purely on structure and presentation:

```html
<article :is="users">
  <h1>Users</h1>

  <table>
    <tr :each="user in users">
      <td><a href="/{ user.id }">{ user.name }</a></td>
      <td>{ user.email }</td>
      <td>{ user.role }</td>
    </tr>
  </table>

  <script>
    async mounted() {
      const users = await fetch('/api/users').then(r => r.json())
      this.update({ users })
    }
  </script>
</article>
```

This is standard HTML with minimal additions. A `<table>` is a `<table>`, an `<a>` is an `<a>`. The dynamic parts (`:each`, `{ }` expressions) are just enough syntax to make HTML reactive.


### Data fetching
When component is mounted:

```javascript
async mounted() {
  const users = await fetch('/users').then(r => r.json())
  this.update({ users })
}
```


### Server side
Route handlers connect your UI to business models:

```javascript
get('/users', async (c) => {
  const { users } = c.env
  return c.json(await users.getAll())
})
```

### Data modeling
The future version of Nue will provide a [one data model](one-data-model) that works identically in local development and on the cloud. This model offers ready-made objects for common web development needs: authentication, lead generation, customer management, payments, and more.

During development, these models are automatically generated from JSON files in the `server/data/` folder. The `spa` template includes this `server/data/users.json` file:

```json
[
  {
    "name": "Sarah Chen",
    "email": "sarah.chen@example.com",
    "country": "Singapore",
    "role": "Product Manager",
    "status": "active"
  },
  {
    "name": "Marcus Johnson",
    "email": "marcus.j@example.com",
    "country": "USA",
    "role": "Frontend Developer",
    "status": "active"
  }
]
```

This model becomes available automatically with simple CRUD methods:

```javascript
// In your route handlers
const { users } = c.env

// Get all records
await users.getAll()

// Get single record
await users.get(id)

// Create new record
await users.create({ name: 'Charlie', email: 'charlie@example.com' })

// Update record
await users.update(id, { role: 'admin' })

// Delete record
await users.remove(id)
```

These models will be released according to the [roadmap](roadmap).


## Custom server
If you prefer full control over your backend or want to use your own technology stack, configure Nue as a proxy to your existing server:

```yaml
# site.yaml
server:
  url: http://localhost:5000
  routes: [/api/, /admin/]
```

### How it works
- Requests to `/api/users` get proxied to `http://localhost:5000/api/users`
- Requests to `/admin/dashboard` get proxied to `http://localhost:5000/admin/dashboard`
- All other requests (`/`, `/about/`) are served by Nue normally


### When to use this
- You already have a working backend (Express, FastAPI, Rails, Django)
- Your team prefers a specific backend language (Python, Go, Rust, PHP)
- You're integrating with existing infrastructure or databases
- You want immediate production deployment without waiting for CloudFlare integration

This approach gives you Nue's frontend benefits (minimal bundles, instant HMR, standards-based components) while keeping your backend exactly as it is. The proxy works identically in development and production.


## Local development with hot-reloading
Everything runs on one port with `nue dev`:

```
Frontend: http://localhost:4000
Backend:  http://localhost:4000/api/*
```

Changes to any part of your application reload instantly:

**Frontend changes** - Components, state, and UI update in milliseconds
**Backend changes** - Server routes reload without restarting
**Model changes** - Business logic propagates to both layers
**CSS changes** - Styles inject directly without page reloads


## Full template
The patterns you've learned scale to larger applications. To see how:

```bash
nue create full
```

The full template adds:

**Authentication flows** - Login, sessions, and route protection
**Advanced state patterns** - Search, filtering, pagination across collections
**Hybrid architecture** - Marketing site, documentation, and SPA in one project
**Shared design system** - Single CSS foundation for all applications

