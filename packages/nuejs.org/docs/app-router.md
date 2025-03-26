
# Application router
In Nue, the application router — available at `/@nue/app-router.js` — is the backbone of single-page applications (SPAs). It acts as a controller in the MVC pattern, managing state and URLs while coordinating the model and views. It tracks URL, session, and persistent data, keeping your app in sync with the browser.

## Usage
Import and configure it:

```js
import { router } from '/@nue/app-router.js'

router.configure({
  route: '/app/:type/:filter',
  url_params: ['query', 'id', 'start', 'sort'],
  session_params: ['nav_open'],
  persistent_params: ['grid_view']
})

router.initialize({ root: document.body })
```

- `route`: Sets the URL pattern (e.g., `/app/users/active`).
- `url_params`: Tracks query params like `?query=test`.
- `session_params`: Persists across refreshes (sessionStorage).
- `persistent_params`: Stores long-term prefs (localStorage).
- `initialize`: Starts event listeners, optionally scoped to a DOM root.

## State management
The router unifies state:

### `router.state`
Returns the current state:

```js
// URL: /app/users/active?query=test&start=10
console.log(router.state)

{
  type: 'users',
  filter: 'active',
  query: 'test',
  start: 10,
  nav_open: true,
  grid_view: false
}
```

Combines path params, query params, and stored data.

### `router.set(data, value)`
Updates state and URL:

```js
router.set({ query: 'new', start: '0' })  // /app/users/active?query=new&start=0
router.set('filter', 'all')               // /app/users/all?query=new&start=0
```

- `data`: Object or string key.
- `value`: (Optional) Value if `data` is a string.
Preserves unrelated params unless overridden.

### `router.toggle(key, [flag])`
Flips a boolean state:

```js
router.toggle('grid_view')  // Toggles grid_view true/false
```

Returns the new value, updates storage if persistent.

### `router.del(key)`
Clears a state key:

```js
router.del('query')  // /app/users/active?start=0
```

### Example
Toggle a view mode:

```html
<nav @name="view-toggler">
  <button @click="toggleGridView" :aria-pressed="!router.state.grid_view">
    <icon key="list"/>
  </button>
  <button @click="toggleGridView" :aria-pressed="router.state.grid_view">
    <icon key="grid"/>
  </button>
  <script>
    toggleGridView() {
      router.toggle('grid_view')
    }
  </script>
</nav>
```

The router abstracts storage — views don’t care if `grid_view` is in localStorage or the URL.

## Event binding
Listen for state changes:

### `router.on(names, callback)`
Runs on param changes:

```js
router.on('type', data => {
  console.log(data.type)  // 'users'
})
```

Stays active until `cleanup()`.

### `router.bind(propertyNames, callback, [namespace])`
Runs on specific param changes:

```js
router.bind('query start', (state) => {
  const data = model.filter(state)
  mount('results', main, data)
})

router.bind('id:user', (state) => {
  if (state.id) mount('user-detail', aside, model.get(state.id))
}, 'details')
```

Namespaces like `:user` (think jQuery’s event namespaces) group bindings. A repeat call to `bind` with the same property and namespace replaces the old handler if both match — perfect for component updates.

## Browser integration
The router handles:
- **Clicks**: Intercepts `<a href="/app/...">` links, updates state, and pushes history.
- **Back/Forward**: Syncs state via `popstate`, triggers bindings.

No extra setup needed.

## Coordinating layers
Tie model and views together:

```js
router.bind('type filter query', async (state) => {
  const data = await model.getItems(state)
  mount('item-list', main, data)
})

router.bind('id:detail', (state) => {
  if (state.id) mount('item-detail', aside, model.get(state.id))
  else aside.innerHTML = ''
}, 'sidebar')
```

Views trigger updates:

```html
<input @input="e => router.set({ query: e.target.value })" type="search"/>
```

The router’s storage-agnostic API — URL, session, or persistent — lets you switch data homes without rewriting views or model logic.

## Cleanup
Reset the router:

```js
router.cleanup()
```

Clears state and bindings — useful for hot module reloads or app resets.