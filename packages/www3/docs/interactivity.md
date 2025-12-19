
# Interactivity

Your global design system handles most everything through CSS - styling, layout, basic interactions, and motion. HTML provides semantic structure. JavaScript adds behavior where CSS and HTML can't reach.

This means JavaScript solves specific problems rather than driving the architecture. When a form should stay on the same page after submission, you add JavaScript. When a search overlay needs to render filtered results as someone types, you add JavaScript. The design system still controls how everything looks. JavaScript just adds the behavior.

There are three approaches to adding interactivity, each serving different needs:

**Native HTML** uses browser-provided interactive elements like accordions and dialogs. No JavaScript needed. The HTML is server-rendered and works immediately.

**Progressive enhancement** adds JavaScript to make server-rendered HTML work better. Forms submit without page navigation. Links intercept clicks for smoother transitions. The HTML structure stays the same - JavaScript just improves the behavior.

**Dynamic rendering** generates HTML on the client when the markup needs to change based on user input or live data. Search overlays that filter results, shopping carts that update quantities, data tables that sort and paginate. These need client-side rendering because the markup structure itself changes.

This guide covers all three approaches and when to use each one.


## Native HTML first

**Approach 1: Use browser-provided interactive elements**

HTML provides interactive elements that work without JavaScript. Accordions, dialogs, tooltips, popovers - these are built into the browser. Use them first.

Native HTML lives in your server-rendered layout modules and components. The HTML is generated at build time and sent to the browser ready to work. No JavaScript required for the interaction to function.

### Accordions with details

```html
<details>
  <summary>What is Nue?</summary>
  <p>A content-first web framework built on web standards.</p>
</details>
```

Click the summary and the content expands. No JavaScript needed.

### Dialogs and popovers

```html
<button popovertarget="info">More info</button>

<dialog popover id="info">
  <h3>Additional information</h3>
  <p>Dialog content here</p>
</dialog>
```

The browser handles opening, closing, focus management, and keyboard navigation.

### Forms

```html
<form action="/api/subscribe" method="POST">
  <input type="email" name="email" required>
  <button>Subscribe</button>
</form>
```

Forms submit to your server by default. The browser handles validation, data serialization, and navigation.

Native HTML should always be your starting point. Only add JavaScript when you need behavior the browser doesn't provide.


## Progressive enhancement

**Approach 2: Enhance server-rendered HTML with JavaScript**

Progressive enhancement means building features that work without JavaScript first, then adding JavaScript to make them better. A form submits to the server. Then you add JavaScript so it submits without navigating away. The core functionality stays the same. JavaScript just makes the experience smoother.

This is the most common way to add interactivity in Nue. The HTML is already server-rendered. Your design system already handles the styling. JavaScript enhances what's there.

### Basic form enhancement

Start with working HTML:

```html
<form action="/api/subscribe" method="POST">
  <input type="email" name="email" required>
  <button>Subscribe</button>
</form>
```

This form works without JavaScript. Click the button and it submits to your server. The page reloads with the response.

Add JavaScript to enhance it:

```javascript
// @shared/ui/forms.js
document.querySelectorAll('form[action^="/api/"]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))

    await fetch(form.action, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    location.href = '/thanks'
  })
})
```

Now the form submits via fetch. No page reload, smoother experience. But if JavaScript fails to load or is disabled, the form still works through the standard browser submission.

This pattern extends to any interaction where you're adding behavior to existing HTML. Navigation that intercepts link clicks. Accordions that animate open and closed. Tabs that switch content. The HTML structure exists. JavaScript makes it feel better.

### Web Components vs querySelector

Web Components offer a standards-based API for the same enhancement pattern. Both approaches add behavior to existing HTML. The difference is organization and preference.

```javascript
// querySelector approach
document.querySelectorAll('details').forEach(el => {
  el.addEventListener('toggle', (e) => {
    // custom behavior
  })
})

// Web Component approach
class Accordion extends HTMLElement {
  connectedCallback() {
    this.addEventListener('toggle', (e) => {
      // same custom behavior
    })
  }
}
customElements.define('my-accordion', Accordion)
```

Both accomplish the same goal. The querySelector version is more direct - select elements, add listeners, done. The Web Component version provides lifecycle hooks and a standard component API. If you need those features or prefer that structure, use Web Components. For most cases, querySelector requires less code and gets you to the same place.

**Note:** Don't use Shadow DOM in Web Components. Shadow DOM creates style isolation, which breaks your global design system. Web Components in Nue work as light wrappers around existing HTML that respect your global CSS.

### Where to place enhancements

Progressive enhancement scripts belong in `@shared/ui/` where they load automatically on all pages. In multi-site development, this directory is part of your global design system in `@base` - the foundation that all your sites inherit from.

```
@base/
└── @shared/
    └── ui/
        ├── forms.js       # Form submission enhancements
        ├── navigation.js  # Link interception
        └── keyboard.js    # Global keyboard shortcuts
```

Scripts in `@shared/ui/` run once when the page loads across all sites that extend your base. They select elements with `querySelector` and add behavior site-wide. This keeps enhancement logic centralized - you write it once and every site that inherits from `@base` gets the behavior.

For application-specific enhancements, place scripts in the application directory:

```
@base/
└── docs/
    └── ui/
        └── sidebar.js   # Documentation-specific behavior
```

Sites can override or extend these enhancements by creating matching paths in their own directories. See [Multi-site development](multi-site-development) for how the inheritance chain works.


## Dynamic HTML components

**Approach 3: Generate HTML on the client with reactive components**

Dynamic HTML components generate markup on the client based on changing data. This is fundamentally different from progressive enhancement. Instead of enhancing HTML that's already there, you're creating HTML in response to user input or live data.

The clearest example is a search overlay. As someone types, you fetch matching results and render them in a list. You could build this with querySelector and innerHTML - select the container, fetch data, build HTML strings, insert them into the DOM. But this approach breaks down quickly. Managing loops, handling empty states, updating individual items, dealing with nested structures - the code becomes fragile and hard to maintain.

Dynamic HTML components solve this by providing a reactive templating system. You define what the markup should look like and the component handles creating, updating, and removing elements as the data changes.

### Search overlay example

The CMD+K search pattern common on documentation sites:

```html
<dialog :is="search-overlay">
  <input type="search" :oninput="search" placeholder="Search...">

  <div class="results">
    <article :each="result in results">
      <a href="{ result.url }">
        <h3>{ result.title }</h3>
        <p>{ result.excerpt }</p>
      </a>
    </article>
  </div>

  <p :if="!results.length">No results found</p>

  <script>
    this.results = []

    async search(e) {
      const response = await fetch(`/api/search?q=${e.target.value}`)
      this.update({ results: await response.json() })
    }
  </script>
</dialog>
```

The component handles everything automatically. The `:each` loop creates an article for every result. The `:if` conditional shows the empty state when appropriate. When you call `this.update()` with new results, the component figures out what changed and updates only the affected DOM nodes.

Building this with querySelector would mean writing code to create elements, insert them at the right positions, remove old ones, handle edge cases. The logic for what should appear gets mixed with the mechanics of DOM manipulation. Dynamic HTML components separate these concerns - you define the structure, the component handles the updates.

### Common use cases

Dynamic HTML components work best when markup needs to change based on data that updates frequently or unpredictably:

- **Search overlay** - Filter and render results as user types (CMD+K pattern)
- **Shopping cart** - Add/remove items, update quantities and totals
- **Data tables** - Client-side sorting, filtering, and pagination
- **Multi-step forms** - Show/hide fields based on previous answers
- **Autocomplete** - Dynamic dropdown results from API
- **Comment sections** - Real-time voting, replies, nested threads
- **Notification feed** - New items appearing, dismissing, marking as read
- **Product filters** - Update product grid based on selected categories

The common pattern: dynamic lists that filter, sort, or update based on user input or live data. Cases where the markup structure itself needs to change, not just the behavior of existing elements.

### Mounting components

Dynamic HTML components can be embedded in three places depending on where you need the interactivity.

**In layout modules** for site-wide components:

```html
<!-- @shared/layout/header.html -->
<header>
  <nav>...</nav>
  <button popovertarget="search">Search</button>
</header>

<!-- @shared/layout/bottom.html -->
<bottom>
  <search-overlay/>
</bottom>
```

The search button in the header triggers the overlay that lives in the bottom slot.

**In Markdown content** using bracket syntax:

```md
# Product Catalog

Browse our products with live filtering.

[product-filter]
```

Content authors can drop interactive components into pages without touching code.

**In custom Markdown extensions** for reusable patterns:

```html
<!-- @shared/lib/components.html -->
<div :is="product-filter">
  <input type="search" :oninput="filter">
  <article :each="product in filtered">
    <h3>{ product.name }</h3>
  </article>

  <script>
    // component logic
  </script>
</div>
```

Now `[product-filter]` works anywhere in your content. The component logic stays in one place while content authors use it throughout the site.

Nue handles component mounting and hot module replacement automatically. Similar to how the browser takes care of Web Components, Nue's runtime manages the lifecycle of your components. When you update a component during development, only that component refreshes while preserving your application state.

See [Markdown extensions](markdown-extensions) for details on creating custom tags and [Layout modules](layout-modules) for integrating components into page structure.


## Choosing an approach

The decision starts with what HTML already provides, then moves to enhancement or generation based on your needs.

**Use native HTML when:**
- The browser already provides the functionality
- Examples: accordions (details/summary), dialogs (dialog/popover), form validation
- No JavaScript needed

**Use progressive enhancement when:**
- HTML is already server-rendered
- You're adding behavior to existing elements
- Examples: form submissions without navigation, link interception, keyboard shortcuts
- The structure doesn't change, only the behavior

**Use dynamic HTML components when:**
- Markup needs to change based on data
- You need loops, conditionals, or reactive updates
- Examples: search overlays, shopping carts, data tables, filters
- Building with querySelector would mean manual DOM manipulation

Start with native HTML. Most interactions can be handled by what the browser already provides. Add progressive enhancement when you need custom behavior on existing elements. Reach for dynamic components when you need to generate HTML on the client in response to changing data.
