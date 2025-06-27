
# Hyperstate

## Introduction

Hyperstate is a minimal state management library designed to work with Hyper. It handles URL synchronization, browser storage, and reactive updates in just a few kilobytes. State changes automatically update the URL and trigger component re-renders.

The library provides a simple `state` proxy object that lets you read and write application state directly. Changes are automatically persisted to session storage, local storage, or kept in memory based on your configuration.

## Rationale

Most state management solutions are either too complex or don't handle URL synchronization well. Hyperstate fills this gap by:

**URL-first approach** - Your application state lives in the URL by default. This makes features like bookmarking, sharing, and browser navigation work naturally without extra code.

**Zero configuration** - No stores, reducers, or actions. Just read and write to the state object like any JavaScript object.

**Storage flexibility** - Choose where each piece of state lives: URL params, query string, session storage, local storage, or memory.

**Tiny footprint** - Under 2KB gzipped. No dependencies.

## Examples

### Basic setup

```javascript
import { state } from 'hyperstate.js'

// Configure which data goes where
state.setup({
  route: '/contacts/:id',
  query: ['search', 'page'],
  session: ['user'],
  local: ['theme'],
  memory: ['temp_data']
})

// Use state anywhere
state.search = 'john'  // Updates URL: ?search=john
state.user = { name: 'Alice' }  // Saves to sessionStorage
state.theme = 'dark'  // Saves to localStorage
```

### Listen to changes

```javascript
// Listen to specific state changes
state.on('search page', (changes) => {
  console.log('Search or page changed:', changes)
})

// Listen to user data changes
state.on('user', ({ user }) => {
  updateUserProfile(user)
})
```

### Route parameters

```javascript
// Setup route with parameters
state.setup({
  route: '/products/:category/:id',
  query: ['color', 'size']
})

// Navigate programmatically
state.category = 'shoes'
state.id = '123'
// URL becomes: /products/shoes/123

// Add query params
state.color = 'red'
state.size = 'large'
// URL becomes: /products/shoes/123?color=red&size=large
```

### Hyper component integration

```html
<script>
  import { state } from 'hyperstate.js'

  state.setup({
    query: ['search', 'filter'],
    memory: ['items']
  })
</script>

<div>
  <input type="search"
    value="${ state.search }"
    :oninput="state.search = $event.target.value">

  <select :onchange="state.filter = $event.target.value">
    <option value="">All items</option>
    <option value="active">Active</option>
  </select>

  <div :each="item in filteredItems" key="${ item.id }">
    ${ item.name }
  </div>

  <script>
    // React to state changes
    state.on('search filter', async () => {
      const items = await fetchItems(state.search, state.filter)
      state.items = items
      this.update()
    })

    get filteredItems() {
      return state.items || []
    }
  </script>
</div>
```