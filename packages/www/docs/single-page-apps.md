
# Single-page apps
Single-page applications (SPAs) in Nue are dynamic web apps that run entirely in the browser. Unlike content-focused apps that generate static pages, SPAs use client-side routing and state management to create fluid, app-like experiences without page reloads.


## Getting started
Create a SPA template to see how client-side applications work:

```bash
nue create spa
```

This generates a complete SPA structure:

```
├── index.html          # SPA entry point
├── ui/
|   └── lib.html        # UI components
├── server/             # Backend (CloudFlare compatible)
|   ├── index.js        # Hono-based router
|   └── users.json      # KV datastore
└── css/                # Design
 ```

The structure separates concerns. Routing and state live in `index.html`. UI components live in `ui/`. Server logic lives in `server/`. Design lives in CSS.


## SPA entry point
The `index.html` file controls your entire application. When you use `<!doctype dhtml>` with `<body>` scope, Nue automatically makes this file handle all routes within its directory - `/users`, `/settings`, `/dashboard`, or any other path.

```html
<!doctype dhtml>

<script>
  import { state } from 'state'

  // Configure routing with URL parameters
  state.setup({
    route: '/:id',
    autolink: true
  })
</script>

<body>
  <main>
    <article/>
  </main>

  <script>
    // update view based on state (URL)
    state.on('id', ({ id }) => {
      this.mount(id ? 'user' : 'users', 'article')
    })

    // initialize from current URL
    mounted() {
      state.init()
    }
  </script>
</body>
```

### How routing works

**SPA detection** - The combination of `<!doctype dhtml>` and `<body>` scope tells Nue this file should handle all routes in its directory. Any URL like `/123` or `/settings` gets routed to this file.

**URL parameters** - The `route: '/:id'` pattern captures URLs like `/123` or `/alice`. When someone visits `/123`, `state.id` becomes `"123"`.

**Automatic routing** - With `autolink: true`, regular `<a href="/123">` links update state instead of reloading the page. No special router components needed.

**Dynamic mounting** - The `state.on('id')` listener decides which component to display. If there's an ID, show the `user` component. If not, show the `users` list. See [dynamic mounting](#dynamic-mounting) later on this document.

**Browser navigation** - Back/forward buttons work automatically. Bookmarking works. Sharing URLs works. The browser's navigation just works.


## UI libraries
Like the SPA entry point, the dynamic UI components also live in `.html` files. These files can be found anywhere within the application directory, which in this case is the root.

### Users list component
The users component displays a table of all users with links to individual profiles:

```html
<!doctype dhtml>

<script>
  import { state } from 'state'
</script>

<article :is="users">
  <h1>Users</h1>

  <table>
    <tr :each="user in users">
      <td><a href="/{ user.id }">{ user.name }</a></td>
      <td><strong>{ user.email }</strong></td>
      <td>{ user.country }</td>
      <td>{ user.role }</td>
      <td><span class="status {user.status}">{ user.status }</span></td>
      <td><pretty-date :date="user.created"/></td>
    </tr>
  </table>

  <script>
    async mounted() {
      const users = await fetch('/users').then(r => r.json())
      this.update({ users })
    }
  </script>
</article>
```

**Standard HTML** - Notice now this is mostly standard HTML. A `<table>` with `<tr>` elements, semantic `<article>` structure, and regular `<a>` links. The dynamic parts are minimal additions - `:each` for loops, `{ }` for data binding, and one `mounted()` method. You're writing HTML that browsers understand natively, just enhanced with the minimum syntax needed for interactivity.


### User detail component
The user component shows detailed information for a single user:

```html
<article :is="user">
  <h1>{ name || email }</h1>

  <nav>
    <button onclick="history.go(-1)">Back</button>
  </nav>

  <dl>
    <dt>Registered</dt><dd><pretty-date :date="created"/></dd>
    <dt>Country</dt><dd>{ country }</dd>
    <dt>Email</dt><dd>{ email }</dd>
    <dt>Role</dt><dd>{ role }</dd>
    <dt>Status</dt><dd><span class="status {status}">{ status }</span></dt>
  </dl>

  <script>
    state.on('id', async ({ id }) => {
      const user = id && await fetch(`/users/${id}`).then(r => r.json())
      this.update(user)
    })
  </script>
</article>
```

**Semantic HTML** - Notice the `<dl>` (description list) element for displaying user properties. This is the semantically correct HTML for name-value pairs. Combined with `<nav>` for navigation and `<article>` for the main content, the structure tells browsers and screen readers exactly what each piece of content represents. Your design system handles the presentation - the HTML focuses purely on meaning and structure.


### Reusable components
Create small, focused components that work across your entire application:

```html
<time :is="pretty-date">
  { formatDate(date) }

  <script>
    const opts = { year: 'numeric', month: 'short', day: 'numeric' }

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', opts)
    }
  </script>
</time>
```

**Single responsibility** - This component does one thing: format dates. It uses the browser's native `Intl.DateTimeFormat` instead of a date library. The `:date` attribute passes data cleanly without props drilling or context providers. Write small, focused components that solve specific problems using web standards - the UNIX philosophy (do one thing well) applied to UI development.



Looking at single-page-apps.md, I'd add a new section called **Dynamic component mounting** right after the "UI libraries" section (around line 90) and before the "Development workflow" section (around line 160).

Here's what to add:


## Dynamic mounting
The `this.mount()` method lets you change which component displays based on application state. This is the core mechanism that makes SPAs work - instead of navigating to different pages, you mount different components in the same container.

```html
<!doctype dhtml>

<script>
  import { state } from 'state'

  state.setup({
    route: '/:section/:id'
  })
</script>

<body>
  <main>
    <article/>
  </main>

  <script>
    // Listen to route changes and mount appropriate components
    state.on('section id', ({ section, id }) => {
      const root = this.querySelector('article')

      if (section == 'users') {
        this.mount(id ? 'user-detail' : 'user-list', root)
      } else if (section == 'products') {
        this.mount('product-catalog', root)
      } else {
        this.mount('home-page', root)
      }
    })

    // Initialize from current URL
    mounted() {
      state.init()
    }
  </script>
</body>
```

### Passing data to components

Components can receive data when mounted:

```javascript
// Mount with state data
this.mount('user-profile', root, {
  userId: state.id,
  editMode: state.edit
})

// Mount with API data
const userData = await fetch(`/api/users/${state.id}`).then(r => r.json())
this.mount('user-profile', root, userData)
```

### Component cleanup

When you mount a new component, the previous component is automatically unmounted and cleaned up. No manual cleanup needed:

```javascript
// This automatically unmounts the previous component
state.on('view', ({ view }) => {
  const container = this.querySelector('main')

  // Previous component is cleaned up automatically
  this.mount(view == 'settings' ? 'settings-page' : 'dashboard', container)
})
```

This mounting system is what makes Nue SPAs feel like traditional multi-page sites while maintaining the performance benefits of client-side routing.



## Development workflow
SPAs work best when you start with your data model and build the interface around it.


### Start with data structure
Define your data model first. In the SPA template, users have this structure:

```json
{
  "id": "1",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "country": "United States",
  "role": "admin",
  "status": "active",
  "created": "2024-01-15T10:30:00Z"
}
```

While our app has a super simple data model it still shapes how you build components. Each field becomes a display element, each relationship becomes navigation.


### Build static components
Start with hard-coded data to establish your UI structure:

```html
<article :is="users">
  <h1>Users</h1>
  <table>
    <tr>
      <td><a href="/1">Alice Johnson</a></td>
      <td>alice@example.com</td>
      <td>admin</td>
    </tr>
  </table>
</article>
```

Focus on structure, not data loading. Get the HTML semantics right first.

### Add data loading
Replace static content with API calls:

```html
<script>
  async mounted() {
    const users = await fetch('/users').then(r => r.json())
    this.update({ users })
  }
</script>
```

Now your static structure becomes dynamic without changing the template.


### Connect routing
Link components through the SPA entry point and state listeners:

```javascript
// In index.html
state.on('id', ({ id }) => {
  const root = document.querySelector('article')
  this.mount(id ? 'user' : 'users', root)
})
```

This gives you client-side routing and URL-based state in a fraction of the code you'd need with traditional SPA frameworks. See the [State API reference](/docs/state-api) for complete state management details.  and [Server development](/docs/server-development) for backend integration.


## Scaling up
The patterns you've learned here scale to enterprise-grade applications. To see more advanced implementations:

```bash
nue create full
```

The full template demonstrates how these basic concepts extend to complex real-world scenarios:

**SPA + MPA integration** - Combining single-page apps with content areas like blogs and documentation

**Separated business logic** - Moving data operations to dedicated modules (`app.js`) for better testing and organization

**Advanced state patterns** - Search, filtering, and pagination using the same state listeners you learned here

**Authentication flows** - Login pages and session management with server integration

**More complex backend** - CloudFlare D1 (SQL) for contacts and leads, KV storage for authentication and session management.

The same concepts apply - state listeners, component mounting, and URL-based routing. Just more of them, organized for maintainability and team collaboration.
