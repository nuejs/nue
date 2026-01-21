
# Building single-page apps
Single-page applications follow the same inheritance model as content sites. The key difference is that data comes from a server or database rather than Markdown files.

[screenshotss: glitch.design + CRM]

This guide covers:

**App inheritance** - How `@base → baseapp → individual apps` extends to single-page applications

**The base app layer** - Shared components, state management, and structural CSS

**Creating variations** - What makes each app unique (usually just one CSS file)

**Server isolation** - Any backend, any language, completely decoupled from the frontend

The goal: new apps inherit 90% of their code and differ only in visual identity.


### Get the template
This guide follows the multi-app template. Install it to explore the code as you read:

```sh
nue create multi-app
```

Start the backend server first:

```sh
cd server
bun src/server.js
```

Then in another terminal, start Nue:

```sh
nue
```

The template includes `@base`, a shared `baseapp`, two example apps (glitch.design and gradientz.io), and a Bun server with sample data.



## What is a single-page app
The traditional distinction: MPAs reload the page, SPAs update in place. But view transitions blur this line. A content site with smooth page transitions feels like an app. An app with full reloads feels like a website.

The real difference is data. Content sites pull from Markdown at build time. Single-page apps fetch from servers at runtime. Databases, APIs, headless CMS systems.

Common examples:

- Dashboards and admin panels
- E-commerce storefronts
- CRM and project management tools
- Social feeds and messaging

The installed multi-app is intentionally minimal, but the same patterns apply to all of these application types.


## How app inheritance works
The multi-app template has four directories:

```
@base/          → Global foundation (header, footer, design tokens)
baseapp/        → Shared app structure (components, state, layout)
glitch.design/  → First app variation
gradientz.io/   → Second app variation
server/         → Backend API (completely separate)
```

The two apps extend both `@base` and `baseapp`, inheriting everything functional while adding their own visual identity.

This pattern scales to multiple base apps for different needs:

```
@base/
basecrm/      → CRM pattern
baseshop/     → E-commerce pattern
```

Then variations branch from each:

```
startup.crm/    → extends [ @base, basecrm ]
enterprise.crm/ → extends [ @base, basecrm ]
fashion.shop/   → extends [ @base, baseshop ]
```

### What each layer provides

**@base** - Global chrome, design tokens, shared layout modules

**Base app** - Components, state management, data flow, structural CSS

**Individual app** - Visual identity, app-specific data source


The base app holds everything functional: Fix a bug in `baseapp/` and all variations get the fix. Add a feature and all variations inherit it. Override only what needs to differ. Individual apps hold only what makes them unique.


## The base app layer
The base app contains everything functional. Components, routing, data fetching, layout patterns. Individual apps inherit all of it.


### SPA entry point
The entry point is `baseapp/index.html`. The doctype declares this as a dynamic HTML file:

```html
<!doctype dhtml>

<article>
  <div/>

  <script>
    import { state } from 'state'
    state.setup({ route: '/:item', autolink: true })

    state.on('item', async ({ item }) => {
      const res = await fetch(item ? `/api/item/${item}` : '/api/items')
      const data = await res.json()

      item ? this.mount('item', ':first-child', data)
        : this.mount('gallery', ':first-child', { items: data })
    })

    state.init()
  </script>
</article>
```

The `dhtml` doctype tells Nue to process this as an interactive component rather than a static page. The development server routes all URLs matching the app to this single file. Visiting `/`, `/monochrome-s7`, or `/corruption-k5` all load the same entry point. The app reads the URL and renders the appropriate view.

### State setup

```js
import { state } from 'state'
state.setup({ route: '/:item', autolink: true })
```

The `route` parameter defines URL patterns. Here `/:item` captures everything after the slash as the `item` variable. Visiting `/monochrome-s7` sets `item` to `"monochrome-s7"`. Visiting `/` leaves `item` empty.

The `autolink` option intercepts clicks on internal links. Instead of full page reloads, links trigger state changes and the URL updates via History API. The page stays loaded while content swaps in place.

### The mount target

```html
<article>
  <div/>
  ...
</article>
```

The empty `<div/>` serves as the mount target. Components render here based on URL state.

### State listeners

```js
state.on('item', async ({ item }) => {
  const res = await fetch(item ? `/api/item/${item}` : '/api/items')
  const data = await res.json()

  item ? this.mount('item', ':first-child', data)
    : this.mount('gallery', ':first-child', { items: data })
})
```

When `item` changes, the callback fires. The logic branches: if `item` is empty (root URL), fetch all items from `/api/items`. If `item` has a value, fetch that specific item from `/api/item/:id`.

### Component mounting

```js
this.mount('gallery', ':first-child', { items: data })
```

The `mount()` method renders a component into a target element. First argument is the component name. Second is a CSS selector (or a DOM node) for where to render. Third is the data to pass.

Different URL states mount different components. Root URL mounts the gallery with all items. Detail URL mounts the item view with one item. Same mount point, different content based on URL.

### Initialization

```js
state.init()
```

This reads the current URL and triggers the appropriate listener. Handles direct URL access, page refreshes, and bookmarked links.


### Components
The components referenced by `mount()` are defined in the same `index.html` file, after the entry point:

```html
<gallery class="gallery">
  <a :each="el in items" href="/{ el.id }">
    <item :bind="el"/>
  </a>
</gallery>

<item class="item">
  <h2>{ title }</h2>
  <p>{ desc }</p>
  <figure>
    <img src="/base.jpg" class="img-{ index }">
  </figure>
</item>
```

For larger apps, components can live in separate files. A `components.html` file, or a dedicated `app/` directory with multiple files organized by feature. Include them in `site.yaml`:

```yaml
include: [ app/ ]
```

The gallery example keeps everything in one file for simplicity. The pattern stays the same regardless of file organization.

These components define structure and data binding. No colors, no spacing, no visual effects. The design system handles presentation through CSS. This separation is what makes variations possible: same components, different styling.



### Base CSS
The base app includes `gallery.css` for layout patterns that all variations share:

```css
.gallery {
  display: grid;
  gap: 2em 3em;

  @media (width > 900px) {
    grid-template-columns: 1fr 1fr;
  }
}
```

Grid behavior, spacing rhythm, responsive breakpoints. Nothing site-specific. No colors, no typography, no decorative effects. Just structure.

The `@layer app` wrapper (in the full file) places these styles in the cascade below site-specific overrides. Individual apps can refine or replace any pattern without fighting specificity.



## Creating variations
Each app is a directory with minimal overrides:

```
glitch.design/
├── base.jpg      # App-specific imagery
├── glitch.css    # Visual identity
└── site.yaml     # Inheritance declaration
```

### The extend chain
The configuration declares what to inherit:

```yaml
# glitch.design/site.yaml
extend: [ @base, baseapp ]
brand_name: Glitch!
```

That's the entire configuration. The app inherits layouts from `@base`, components and behavior from `baseapp`, and layers its own CSS on top.


### Visual identity
One CSS file defines the complete visual personality:

```css
@layer site {
  :root {
    --bgcolor: #050505;
    --border: #333;
  }

  .gallery .item:hover header {
    opacity: 1;
  }

  .img-2 {
    transform: scale(2.5);
    transform-origin: 0 0;
  }
}
```

Colors, typography, hover effects, image treatments. Everything that makes one variation feel different from another lives here.

[screenshot: glitch.design detail view]

A different app, different aesthetic, same underlying code.



## The backend
The `server/` directory in the template is just for convenience. In real projects, the backend is typically a separate repository, a managed service, or an existing API. It could be Django on Heroku, Express on Vercel, a headless CMS like Sanity, or a commerce platform like Shopify.

Nue doesn't care. The frontend makes HTTP requests. The backend responds with JSON. Everything else is up to you.

The template uses Bun's built-in server with no dependencies:

```js
const server = Bun.serve({
  routes: {
    '/api/items': async req => {
      const hostname = getHostName(req)
      return Response.json(await getItems(hostname))
    },

    '/api/item/:key': async req => {
      const hostname = getHostName(req)
      return Response.json(await getItem(hostname, req.params.key))
    }
  }
})
```

This is the simplest possible setup to demonstrate the pattern. Replace it with whatever fits your stack.


### Proxy configuration
Nue routes API requests through configuration:

```yaml
# @base/site.yaml
server:
  url: http://localhost:3000
  routes: [ /api/ ]
```

Requests matching `/api/` pass through to your server. Everything else serves from the Nue build.

### Multi-tenant patterns
The server can identify which app is making the request from the hostname:

```js
'/api/items': async req => {
  const hostname = getHostName(req)
  return Response.json(await getItems(hostname))
}
```

Same API structure, different data per app. The gallery example uses YAML files as a fake database:

```
server/data/
├── glitch.design.yaml
└── gradientz.io.yaml
```

In production this could be PostgreSQL queries, headless CMS calls, or Shopify API requests. The pattern stays the same.


## Next steps
See [HTML syntax](/docs/html-syntax) for building dynamic components with loops, conditionals, and event handlers.

See [State API](/docs/state-api) for details on URL-first routing and the state system.
