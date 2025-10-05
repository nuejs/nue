
# **Nuestate:** URL-first state management
Nuestate puts your application state in the URL by default. This makes bookmarking, sharing, and browser navigation work naturally without extra code. State changes automatically update the URL and trigger component re-renders.

The library provides a simple `state` proxy object for reading and writing application state directly. Changes are automatically persisted to the URL, browser storage, or kept in memory based on your configuration.


## Why URL-first?
Most state management solutions treat the URL as an afterthought. You have to manually sync state with the URL, handle browser navigation, and write extra code for bookmarking and sharing.

Nuestate flips this around. Your state lives in the URL by default, so these features work automatically:

**Bookmarking works** - Users can bookmark any application state and return to it later

**Sharing works** - Send someone a URL and they see exactly what you see

**Browser navigation works** - Back/forward buttons navigate through state changes

**Standard routing works** - Regular `<a href>` tags become SPA navigation with `autolink`

**No sync code** - No need to manually keep URL and state in sync

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

See the [State API documentation](/docs/state-api) for complete details on all methods and configuration options.

## Standard routing

Nuestate turns regular HTML links into SPA navigation with the `autolink` option:

```javascript
state.setup({
  route: '/app/:section/:id',
  autolink: true
})
```

Now standard `<a href>` tags automatically update state instead of reloading the page:

```html
<!-- These work as SPA navigation -->
<a href="/app/users">Users</a>
<a href="/app/users/123">User Details</a>
<a href="/app/products">Products</a>

<!-- External links still work normally -->
<a href="https://example.com">External Site</a>
```

When someone clicks `/app/users/123`, Nuestate automatically sets:
- `state.section = 'users'`
- `state.id = '123'`

No routing libraries, no special components. Just HTML links that work exactly as you'd expect, but faster.

## Storage types

Different storage types serve different purposes:

**URL parameters** - For shareable, bookmarkable state that defines what the user sees

**Session storage** - For user-specific data that should persist during the browser session

**Local storage** - For user preferences that should persist across sessions

**Memory** - For temporary data and UI state that doesn't need persistence

Choose the right storage type based on how long the data should live and whether it should be shareable.

## Less is More

Nuestate keeps both your API surface and your applications small:

**Small API** - Just read and write to the state object. No stores, reducers, actions, or complex patterns to learn.

**Less boilerplate** - No manual URL synchronization code. No setup for browser navigation. No extra logic for bookmarking and sharing.

**Smaller apps** - Under 2KB with zero dependencies. Your total bundle stays small when state management doesn't bloat it.

**Less to learn** - State works like any JavaScript object. If you understand `obj.prop = value`, you understand Nuestate.

The library does one thing well: manage application state with URL synchronization built in. Like a UNIX command.

## Installation

```bash
bun install nuestate
```

Or use it directly in the browser:

```html
<script type="module">
  import { state } from '//esm.sh/nuestate'
</script>
```