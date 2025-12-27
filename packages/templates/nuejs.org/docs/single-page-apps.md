
# Building single-page apps
Single-page applications are dynamic apps that run entirely in the browser. They inherit the global design system like any other application but use client-side routing and state management instead of generating static pages.

This guide shows you how to build SPAs that integrate seamlessly with your multi-site architecture.


## Where SPAs are heading
This document covers the basic building blocks for SPAs. Later, you'll see how to spin world-class apps without a design/engineering team, similar to how you spin websites today. SPAs are equally important for Nue as websites - the global design system approach works perfectly for both. The future involves multiple design options and more declarative development based on YAML configuration.

Here's a glimpse of what's possible:

[demo]

This is a full app with complex state management. Nue's standards-first approach uses minimal abstraction layers, resulting in a smaller footprint than a single React/ShadCN button. There's also a [Rust/WASM version](link) handling 150k rows.

But for now, lets focus on the building blocks available today.


## The admin template
Create a working SPA to see the structure:

```bash
nue create multi-site
```

This generates a user admin application that extends `@base`:

```
project/
├── @base/
│   ├── @shared/
│   │   ├── design/       # Inherited styling
│   │   └── mocks/        # Mock data
│   │       ├── users.json
│   │       └── user.json
│   └── site.yaml
└── admin/
    ├── app.yaml          # Application config
    ├── app.css           # App-specific styling
    ├── index.html        # SPA entry point
    └── components.html   # UI components
```

The admin app inherits all design from `@base/@shared/design/` and uses mock data files for development. This is the same inheritance pattern as blogs and documentation, just with client-side routing instead of static pages.


## Application structure
SPAs live as application directories that extend `@base`. Like blog and documentation apps, they inherit the global design system and override only what makes them unique.

The key difference: SPAs use `index.html` as the entry point that handles all routes within the application instead of generating static HTML pages.


## SPA entry point
The `index.html` file controls routing and component mounting:

```html
<!doctype dhtml>

<script>
  import { state } from 'state'

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
    state.on('id', ({ id }) => {
      const wrap = this.root.querySelector('article')
      this.mount(id ? 'user' : 'users', wrap)
    })

    mounted() {
      state.init()
    }
  </script>
</body>
```

### How routing works

**File-based routing** - Using `<!doctype dhtml>` with a `<body>` root element tells Nue this file handles all routes in its directory. Any URL like `/123` or `/settings` gets routed here.

**URL parameters** - The `route: '/:id'` pattern captures URLs. When someone visits `/123`, `state.id` becomes `"123"`.

**Automatic link handling** - With `autolink: true`, regular `<a href="/123">` links update state instead of reloading the page.

**Component mounting** - The `state.on('id')` listener decides which component to display based on URL changes.

**Browser integration** - Back/forward buttons work. Bookmarking works. Sharing URLs works. Standard browser navigation just works.

See [State API](state-api) for complete details on state management.


## UI components
Components live in `.html` files within the application directory. They use the same HTML syntax as other Nue components but run entirely in the browser.


### Users list component
Display all users with links to individual profiles:

```html
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
      const users = await fetch('/@shared/mocks/users.json').then(r => r.json())
      this.update({ users })
    }
  </script>
</article>
```

The component fetches from the mock data file during development. Standard HTML elements. Semantic structure. Regular links that state handles automatically.


### User detail component
Show detailed information for a single user:

```html
<article :is="user">
  <h1>{ name || email }</h1>

  <!-- nuestate detects native browser history events -->
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
      if (!id) return
      const user = await fetch(`/@shared/mocks/user.json`).then(r => r.json())
      this.update(user)
    })
  </script>
</article>
```


## Dynamic mounting
The `this.mount()` method switches between components based on application state. This is how SPAs work - instead of navigating to different pages, you mount different components in the same container.

```html
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

    mounted() {
      state.init()
    }
  </script>
</body>
```

### Passing data to components
Components receive data when mounted:

```javascript
// mount with state data
this.mount('user-profile', root, {
  userId: state.id,
  editMode: state.edit
})

// mount with fetched data
const userData = await fetch(`/@shared/mocks/user.json`).then(r => r.json())
this.mount('user-profile', root, userData)
```

### Component cleanup
Previous components are automatically unmounted when you mount new ones. No manual cleanup needed:

```javascript
state.on('view', ({ view }) => {
  const container = this.querySelector('main')

  // previous component cleaned up automatically
  this.mount(view == 'settings' ? 'settings-page' : 'dashboard', container)
})
```


## Mock data
During development, SPAs fetch from mock files in `@base/@shared/mocks/`:

```
@base/
└── @shared/
    └── mocks/
        ├── users.json
        ├── user.json
        └── products.json
```

Components fetch these files during development:

```javascript
async mounted() {
  const users = await fetch('/@shared/mocks/users.json').then(r => r.json())
  this.update({ users })
}
```

This keeps development simple. No backend server required to build and test the interface.


## Production backend
For production, configure a reverse proxy in `@base/site.yaml`:

```yaml
server:
  # point to your existing backend
  url: http://localhost:5000

  # which routes get forwarded
  routes: [/api/]
```

Then update components to use the API routes:

```javascript
async mounted() {
  const users = await fetch('/api/users').then(r => r.json())
  this.update({ users })
}
```

Routes matching the pattern get forwarded to your backend. Everything else stays with Nue.


## Styling SPAs
SPAs inherit all styling from `@base/@shared/design/`. Application-specific overrides go in the app directory:

```
admin/
├── app.yaml
├── app.css        # admin-specific overrides
├── index.html
└── components.html
```

The `app.css` file contains only what makes this application unique. Status badges. Table layouts. Form styling specific to the admin interface. The foundation handles everything else.

This is the same pattern as blog and documentation apps. Most styling comes from the global system. Applications add only what makes them different.


## Next steps
This covers building SPAs within the multi-site architecture. See [State API](state-api) for complete details on state management and routing patterns.

What's missing is world-class design. The templates coming later will provide that same Apple/Linear polish for apps too. Complex SPAs that are 90% done through inheritance.

