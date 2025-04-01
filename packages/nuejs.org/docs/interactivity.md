
# Interactivity
The view layer in Nue defines your interface with semantic HTML, but interactivity brings it to life. Nue distributes tasks across views, the model, and controllers, ensuring interfaces stay simple and scalable.

## How it works
Interactivity in Nue follows a clear cycle:
1. **Detect actions**: Views capture user inputs like clicks or typing.
2. **Process logic**: The model handles business rules and data updates.
3. **Manage state**: The router or model tracks changes to app state.
4. **Refresh views**: Views re-render with new data.
5. **Coordinate flow**: Controllers oversee app-wide tasks like navigation or shortcuts.

This keeps each layer focused — views don’t compute, models don’t render, and controllers tie it all together without bloating any single part.

## Event handlers
Views use event handlers to kick off this cycle, listening for user actions and passing them to the model:

```html
<script>
  import { model } from './model/index.js'
</script>

<form @name="chat-form" @submit.prevent="submit">
  <textarea name="body"></textarea>
  <button class="primary"><icon key="send"/></button>
  <script>
    submit(e) {
      const body = e.target.body.value.trim()
      if (body) {
        const user = model.users.get(this.id)
        user.threads.reply(body)
        e.target.body.value = ''
      }
    }
  </script>
</form>
```

Here, the view detects a form submission (step 1), sends the input to the model for processing (step 2), and clears the field. The model updates its state (step 3), which triggers a re-render elsewhere (step 4). No complex logic lives in the view — just a bridge to the model.

## Routing
Routing in Nue drives navigation and state in single-page applications (SPAs), playing the controller role in the MVC pattern. Unlike React’s component-centric routing, Nue’s router — imported from `/@nue/app-router.js` — centralizes state and URL management, keeping views focused on display. It maps routes to data and components, syncing the app’s state with the browser’s URL. See the [router API](/docs/app-router.html) for full details.

Configure it like this:

```js
router.configure({
  url_params: ['search', 'start', 'sort', 'asc'],
  route: '/app/:type/:id'
})
```

### Trigger component
This updates the route:

```html
<div @name="search-input" class="search" data-accesskey="/">
  <icon key="search"/>
  <input @input="search" :value="value" type="search" placeholder="Search..." :autofocus="value">
  <kbd><strong>⌘</strong></kbd><kbd>K</kbd>
  <script>
    value = router.state.search
    search(e) {
      router.set({ type: 'search', search: e.target.value, start: null })
    }
  </script>
</div>
```

### Listener component
This responds to route changes:

```html
<section @name="content-panel">
  <header>
    <h2>{ renderHeader() }s</h2>
    <nav>...</nav>
  </header>
  <div id="content_wrap"/>
  <script>
    mounted() {
      router.bind('search start sort asc', args => {
        const data = model.filter(args)
        this.mountChild('data-collection', content_wrap, data)
        this.update()
      })
    }
    renderHeader() { /* header logic */ }
  </script>
</section>
```

The trigger sets state (step 3), and the listener fetches data via the model (step 2) and mounts a component (step 4). The router coordinates it all (step 5).


### Permanent state
The router in Nue goes beyond URL arguments, serving as a full state management system for URL, session, and persistent data. You configure it with different storage types like this:

```js
router.configure({
  route: '/app/:type/:id',
  url_params: ['search', start', 'sort', 'asc'],
  session_params: ['nav_opened'],
  persistent_params: ['show_grid_view']
})
```

URL params sync with the address bar, session params persist across refreshes, and persistent params — like `show_grid_view` — store user preferences in local storage. Here’s an example toggling a grid view:

```html
<nav @name="view-toggler">
  <button @click="toggleGridView"
    :aria-pressed="!router.state.show_grid_view"
    title="Toggle table view"><icon key="list"/></button>

  <button @click="toggleGridView"
    :aria-pressed="router.state.show_grid_view"
    title="Toggle grid view"><icon key="grid"/></button>

  <script>
    toggleGridView() {
      router.toggle('show_grid_view')
    }
  </script>
</nav>
```

The router API doesn’t care where data is stored — URL, session, or local storage — making state management effortless. You can switch storage types (e.g., from session to persistent) without views needing to know, keeping the system flexible and views blissfully unaware.



## Controllers
React devs manage interactivity within components, but Nue uses controllers — standalone scripts that handle app-wide concerns. Think of them as coordinators between the model and views, offloading tasks like navigation or keyboard shortcuts. This keeps views pure and models logic-focused, a separation unfamiliar in React but natural in MVC-style systems.

### Bootstrap controller
This starts the app:

```js
import { router } from '/@nue/app-router.js'
import { model } from '../model/index.js'
import { mount } from '/@nue/mount.js'

router.configure({
  route: '/app/:type/:filter',
  url_params: ['query', 'id', 'start', 'sort', 'asc', 'grid']
})

model.on('authenticated', async () => {
  mount('load-screen', window.app)
  await model.load()
  mount('app', window.app)
})

addEventListener('route:app', async () => {
  if (!model.authenticated) mount('login', window.app)
  await model.initialize()
})
```

### Keyboard controller
This handles shortcuts:

```js
import { router } from '/@nue/app-router.js'

document.addEventListener('keydown', e => {
  const { target, key } = e
  if (target.oninput || target.form) return

  if (key == 'Escape' && !document.querySelector(':popover-open')) {
    router.del('id')
  }

  if ('jk'.includes(key)) {
    const next = getNext(key == 'j')
    next?.focus()
    if (router.state.id) next?.click()
  }
})
```

Controllers manage flow (step 5), letting other layers stay lean. Examples include form validation, tooltips, or analytics tracking.
