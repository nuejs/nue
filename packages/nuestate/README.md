
# Nuestate: URL-first state management
Nuestate puts your application state in the URL by default. This makes bookmarking, sharing, and browser navigation work naturally without extra code. State changes automatically update the URL and trigger component re-renders.

## Why URL-first?
Most state management solutions treat the URL as an afterthought. You have to manually sync state with the URL, handle browser navigation, and write extra code for bookmarking and sharing.

With Nuestate your state lives in the URL by default, so these features work automatically:

- **Bookmarking** - Users can bookmark any application state and return to it later
- **Sharing** - Send someone a URL and they see exactly what you see
- **Browser navigation** - Back/forward buttons navigate through state changes
- **Standard routing** - `<a href>` tags become SPA navigation with `autolink`
- **No sync code** - No need to manually keep URL and state in sync


## How it works

Import and use the state object anywhere in your application:

```javascript
import { state } from 'state'

// Read and write state
state.view = 'users'     // URL updates to include view=users
state.search = 'john'    // URL becomes ?view=users&search=john
```

Configure where different pieces of state should live:

```javascript
state.setup({
  route: '/app/:section/:id',
  query: ['search', 'filter', 'page'],
  session: ['user', 'preferences'],
  local: ['theme', 'language']
})

// Route parameters update the URL path
state.section = 'products'
state.id = '123'
// URL becomes: /app/products/123

// Query parameters update the URL search
state.search = 'shoes'
// URL becomes: /app/products/123?search=shoes
```

Listen to state changes:

```javascript
state.on('search filter', async (changes) => {
  const results = await fetchResults(changes.search, changes.filter)
  state.results = results
})
```

Use state directly in components with standard DOM events:

```html
<input value="{ state.search }" :oninput="state.search = $event.target.value">
```

See the [State API documentation](https://nuejs.org/docs/state-api) for complete details on all methods and configuration options.

