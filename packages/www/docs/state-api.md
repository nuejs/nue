
# State API
Complete reference for Nuestate's state management API. For an overview and introduction, see the [Nuestate documentation](/docs/nuestate).

## state object

The main `state` object is a proxy that handles all reading and writing of application state. Import it from anywhere in your application:

```javascript
import { state } from 'state'
```

Note: Nuekit automatically maps `'state'` to `/@nue/state.js` via import maps, so you don't need to specify the full path.

Or use it directly from a CDN:

```html
<script type="module">
  import { state } from '//esm.sh/nuestate'
</script>
```

### Reading state

Access any property directly:

```javascript
console.log(state.view)     // current value or undefined
console.log(state.search)   // current value or undefined
console.log(state.user)     // current value or undefined
```

State is automatically populated from the current URL and browser storage when the application starts.

### Writing state

Set any property directly:

```javascript
state.view = 'users'
state.search = 'john'
state.user = { name: 'Alice', id: 123 }
```

State changes automatically trigger URL updates and storage persistence based on your configuration.

## state.setup()

Configure where different pieces of state should be stored and how routing should work.

```javascript
state.setup(config)
```

### Configuration options

**route** - Route pattern with parameters

```javascript
state.setup({
  route: '/app/:section/:id'
})

// Setting route parameters updates the URL path
state.section = 'products'  // URL: /app/products
state.id = '123'           // URL: /app/products/123
```

**query** - Array of properties that go in URL search parameters

```javascript
state.setup({
  query: ['search', 'filter', 'page']
})

// Setting query properties updates the URL search
state.search = 'shoes'     // URL: ?search=shoes
state.filter = 'active'    // URL: ?search=shoes&filter=active
state.page = 2            // URL: ?search=shoes&filter=active&page=2
```

**session** - Array of properties stored in sessionStorage

```javascript
state.setup({
  session: ['user', 'preferences', 'cart']
})

// These persist until the browser session ends
state.user = { name: 'Alice' }
state.cart = [{ id: 1, name: 'Shoes' }]
```

**local** - Array of properties stored in localStorage

```javascript
state.setup({
  local: ['theme', 'language', 'settings']
})

// These persist permanently on the device
state.theme = 'dark'
state.language = 'en'
```

**memory** - Array of properties kept only in memory

```javascript
state.setup({
  memory: ['temp_data', 'ui_state', 'removeId']
})

// These exist only while the page is loaded
state.temp_data = { processing: true }
state.ui_state = { modal_open: false }
state.removeId = 123  // ID for confirmation dialog
```

**emit_only** - Array of properties that only trigger events without storage

```javascript
state.setup({
  emit_only: ['deleted', 'saved', 'error']
})

// These fire events but don't persist anywhere
state.emit('deleted', userId)  // Triggers listeners without storing
```

**autolink** - Enable automatic link handling for SPA navigation

```javascript
state.setup({
  route: '/app/:section/:id',
  autolink: true
})

// Clicks on matching links automatically update state instead of page reload
```

### Complete configuration example

```javascript
state.setup({
  route: '/shop/:category/:product',
  query: ['search', 'color', 'size', 'page'],
  session: ['user', 'cart'],
  local: ['theme', 'currency'],
  memory: ['loading', 'errors', 'removeId'],
  emit_only: ['deleted', 'saved'],
  autolink: true
})
```

## state.on()

Listen to state changes with event handlers.

```javascript
state.on(properties, callback)
```

### Single property

```javascript
state.on('search', (changes) => {
  console.log('Search changed to:', changes.search)
})
```

### Multiple properties

```javascript
state.on('search filter page', (changes) => {
  console.log('Changed properties:', changes)
  // changes object contains only the properties that changed
})
```

**Note:** `state.on()` replaces any previous listener with the same property names, so you don't need to call `state.off()` to avoid duplicate listeners.

### Callback parameter

The callback receives a `changes` object containing only the properties that changed:

```javascript
state.on('user cart', (changes) => {
  if (changes.user) {
    console.log('User changed:', changes.user)
  }
  if (changes.cart) {
    console.log('Cart changed:', changes.cart)
    updateCartDisplay(changes.cart)
  }
})
```

### Async handlers

Event handlers can be async:

```javascript
state.on('search category', async (changes) => {
  const results = await fetchProducts(changes.search, changes.category)
  state.products = results
})
```

## state.emit()

Trigger events for emit-only properties without storing the value:

```javascript
state.setup({
  emit_only: ['deleted', 'saved', 'error']
})

// Fire event without persistence
state.emit('deleted', userId)

// Listen to emit-only events
state.on('deleted', ({ deleted }) => {
  console.log('User deleted:', deleted)
  refreshUserList()
})
```

## state.init()

Initialize state from the current URL. Call this after your UI is mounted:

```javascript
mounted() {
  state.init()  // Populates state from current URL and fires initial events
}
```

This is essential for SPAs to handle direct navigation to URLs with state parameters.

## Storage behavior

### URL parameters (route and query)

URL parameters are always strings:

```javascript
state.page = 2
console.log(state.page)        // "2" (string)
console.log(location.search)   // "?page=2"

state.active = true
console.log(state.active)      // "true" (string)
console.log(location.search)   // "?active=true"

// Objects become "[object Object]" - not useful
state.filter = { color: 'red' }
console.log(state.filter)      // "[object Object]" (string)
```

### Browser storage (session and local)

Session and local storage use JSON serialization:

```javascript
state.setup({ session: ['user'], local: ['settings'] })

// Objects are JSON.stringify'd on save, JSON.parse'd on read
state.user = { name: 'Alice', id: 123 }
console.log(typeof state.user.id)  // 'number' (restored from JSON)

// Arrays work the same way
state.settings = ['dark-mode', 'notifications']
console.log(Array.isArray(state.settings))  // true (restored from JSON)
```

### Memory storage

Memory storage keeps exact references to any JavaScript value:

```javascript
state.setup({ memory: ['cache', 'handler', 'domRef'] })

// Any object type works
const data = new Map()
state.cache = data
console.log(state.cache === data)  // true (same reference)

// Functions, DOM elements, etc.
state.handler = () => console.log('click')
state.domRef = document.querySelector('#myButton')
```

### Memory use cases

Memory storage is perfect for temporary UI state:

```javascript
state.setup({
  memory: ['removeId', 'selectedItems', 'dragState']
})

// Confirmation dialog
function showDeleteConfirm(userId) {
  state.removeId = userId  // Store ID for confirmation
}

// In delete confirmation component
state.on('removeId', ({ removeId }) => {
  if (removeId) {
    this.querySelector('dialog').showModal()
  }
})
```

## Route patterns

### Simple parameters

```javascript
state.setup({
  route: '/users/:id'
})

state.id = '123'  // URL: /users/123
```

### Multiple parameters

```javascript
state.setup({
  route: '/shop/:category/:product/:variant'
})

state.category = 'shoes'
state.product = 'sneakers'
state.variant = 'red-large'
// URL: /shop/shoes/sneakers/red-large
```

### Optional parameters

Use query parameters for optional values:

```javascript
state.setup({
  route: '/products/:category',
  query: ['color', 'size', 'page']
})

state.category = 'shoes'    // URL: /products/shoes
state.color = 'red'         // URL: /products/shoes?color=red
state.size = 'large'        // URL: /products/shoes?color=red&size=large
```

## Integration patterns

### SPA root component

```html
<!doctype dhtml>
<script>
  import { hasSession, logout } from 'app'
  import { state } from 'state'

  state.setup({
    query: ['type', 'query', 'start'],
    emit_only: ['deleted'],
    memory: ['removeId'],
    route: '/app/:id',
    autolink: true,
  })

  if (!hasSession()) location.href = '/login/'
</script>

<body>
  <header>
    <nav>
      <a href="/"><img src="/img/logo.png" width="60" height="22"></a>
      <a href="/app/">Contacts</a>
    </nav>
    <nav>
      <button class="plain" :onclick="logout(); location.href = '/'">Logout</button>
    </nav>
  </header>

  <main>
    <article/>
  </main>

  <confirm-delete/>

  <script>
    state.on('id', ({ id }) => {
      const wrap = this.root.querySelector('article')
      this.mount(id ? 'contact-details' : 'contact-list', wrap)
    })

    mounted() {
      console.log('app mounted')
      state.init()  // Initialize from current URL
    }
  </script>
</body>
```

### Component with state

```html
<product-filter>
  <input type="search"
    value="{ state.search }"
    :oninput="handleSearch">

  <select :onchange="handleCategory">
    <option value="">All categories</option>
    <option :each="cat in categories" value="{ cat }">{ cat }</option>
  </select>

  <div :each="product in products" key="{ product.id }">
    <h3>{ product.name }</h3>
    <p>${ product.price }</p>
  </div>

  <script>
    import { state } from 'state'

    state.setup({
      query: ['search', 'category'],
      memory: ['products', 'categories']
    })

    handleSearch(e) {
      state.search = e.target.value
    }

    handleCategory(e) {
      state.category = e.target.value
    }

    // React to state changes
    state.on('search category', async () => {
      const products = await fetchProducts(state.search, state.category)
      state.products = products
      this.update() // Trigger component re-render
    })

    async mounted() {
      const categories = await fetchCategories()
      state.categories = categories

      // Initial load if there's existing state
      if (state.search || state.category) {
        const products = await fetchProducts(state.search, state.category)
        state.products = products
      }

      this.update()
    }

    get products() {
      return state.products || []
    }

    get categories() {
      return state.categories || []
    }
  </script>
</product-filter>
```

### Manual updates

Components need manual updates after async state changes:

```javascript
state.on('user', async (changes) => {
  const profile = await fetchUserProfile(changes.user.id)
  state.profile = profile
  this.update() // Required for component re-render
})
```

### Initialization

Handle initial state from URLs:

```javascript
// URL: /products/shoes?color=red&page=2

console.log(state.category) // 'shoes'
console.log(state.color)    // 'red'
console.log(state.page)     // 2

// State is automatically populated from the current URL
```

## Error handling

### Invalid route parameters

Route parameters that don't match the pattern are ignored:

```javascript
state.setup({
  route: '/users/:id'
})

// Current URL: /about
state.id = '123'  // No effect, URL stays /about
```

### Storage limitations

Browser storage has size limits. Large objects may not persist:

```javascript
state.setup({ local: ['large_data'] })

try {
  state.large_data = hugeMegabyteObject
} catch (error) {
  console.log('Storage quota exceeded')
}
```

### Type conversion errors

Invalid JSON in URL parameters falls back to string:

```javascript
// URL: ?data=invalid-json
console.log(state.data)        // 'invalid-json' (string)
console.log(typeof state.data) // 'string'
```

