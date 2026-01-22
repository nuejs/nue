# Adding interactivity
Here are the key approaches to adding interactive features to your global design system:

**Progressive enhancement** - Use JavaScript to enhance the static HTML

**Dynamic HTML components** - Add dynamic components that react to user input

**Global JavaScript** - App-wide behavior via UI controllers

**External libraries** - Third-party code via import maps


## Progressive enhancement
Progressive enhancement adds JavaScript to make server-rendered HTML work better. The HTML structure stays the same. JavaScript improves the behavior.

The recommended place for enhancement scripts is `@lib/`:

```
@base/
└── @lib/
    └── contact-form/
        ├── contact.html    # server-side rendered form
        └── contact.js      # client enhancement
```

### Example
Create the form as a reusable module:

```html
<!-- @base/@lib/contact-form/contact.html -->

<form :is="contact-form" action="/api/subscribe" method="POST">
  <input type="email" name="email" required>
  <button>Subscribe</button>
</form>
```

Embed it in the pagefoot slot:

```html
<!-- @base/layout.html -->

<section :is="pagefoot">
  <contact-form/>
</section>
```

See [Page layout](page-layout) for details on layout modules and slots.

This form works without JavaScript. It renders in the pagefoot slot and submits to your server. The page reloads with the response.

Now create the enhancement script:

```js
// @base/@lib/contact-form/contact.js
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

Include the folder in your site configuration:

```yaml
# @base/site.yaml
include: [@lib/contact-form]
```

The form renders in the pagefoot slot on every page. The script enhances it to submit via fetch instead of full page reload. If JavaScript fails, the form still works through standard browser submission.


### Web Components alternative

Web Components offer a standards-based API for the same pattern:

```js
// @base/@lib/contact-form/contact.js
class ContactForm extends HTMLElement {
  connectedCallback() {
    this.addEventListener('submit', async (e) => {
      // same enhancement logic
    })
  }
}
customElements.define('contact-form', ContactForm)
```

Both approaches accomplish the same goal. The querySelector version is more direct - select elements, add listeners, done. The Web Component version provides lifecycle hooks and a standard component API.

Use Web Components if you need those features or prefer that structure. For most cases, querySelector requires less code.

**Note:** Don't use Shadow DOM in Web Components. Shadow DOM creates style isolation, which breaks your global design system. Web Components in Nue work as light wrappers around existing HTML that respect your global CSS.


### With view transitions
When view transitions are enabled in your site configuration:

```yaml
# @base/site.yaml
site:
  view_transitions: true
```

Pages transition smoothly without full reloads. But this means enhancement scripts that run on page load won't re-run when users navigate. The DOM changes, but your event listeners are attached to elements that no longer exist.

The solution is the `route` event, which fires after each navigation:

```js
// @base/@lib/contact-form/contact.js
addEventListener('route', () => {
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
})
```

The `route` event fires after each navigation. Your script re-attaches listeners to the new page content.

For application-specific logic, use the scoped event:

```js
// only runs when navigating within /blog/
addEventListener('route:blog', () => {
  // blog-specific enhancements
})
```

Web Components don't need this wrapper. The browser automatically calls `connectedCallback` when elements mount to the DOM, whether from initial page load or view transition.


## Dynamic HTML components

Dynamic HTML components generate markup on the client based on changing data. Components live in `@lib/` alongside any component-specific styling:

```
@base/
└── @lib/
    └── search/
        ├── search.html  # search component
        └── search.css   # search-specific styling
```

### Example

```html
<!-- @base/@lib/search/search.html -->

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

The search.css file contains styling specific to the search overlay - layout of the results list, positioning of the dialog, search-specific spacing. General styling like how inputs and dialogs look comes from `@design/`. The component CSS only handles what's unique to this component.

Include it automatically for every site:

```yaml
# @base/site.yaml
include: [@lib/search]
```

Or include for a specific site only:

```yaml
# acme.org/site.yaml
include: [@lib/search]
```

### Mounting components
Dynamic HTML components can be embedded in three places depending on where you need the interactivity.

**In layout modules** for site-wide components:

```html
<!-- @base/layout.html -->

<header>
  <nav>...</nav>
  <button popovertarget="search">Search</button>
</header>

<div :is="bottom">
  <search-overlay/>
</div>
```

The search button in the header triggers the overlay that lives in the bottom slot.

**In Markdown content** using bracket syntax:

```md
# Product Catalog

Browse our products with live filtering.

[image-gallery]
```

Content authors can drop interactive components into pages without touching code.


### When to use dynamic components
Dynamic HTML components work best when markup needs to change based on data that updates frequently or unpredictably:

- **Search overlay** - Filter and render results as user types (CMD+K pattern)
- **Shopping cart** - Add/remove items, update quantities and totals
- **Multi-step forms** - Show/hide fields based on previous answers
- **Comment sections** - Real-time voting, replies, nested threads
- **Product filters** - Update product grid based on selected categories

The common pattern: dynamic lists that filter, sort, or update based on user input or live data. Cases where the markup structure itself needs to change, not just the behavior of existing elements.


## Global JavaScript
Some interactive behavior needs to work across your entire application, not just specific components. Keyboard shortcuts that work on every page. Analytics that track all user actions. Tooltip systems that enhance any element with a data attribute.

These cross-cutting concerns don't belong in individual components. They need their own space as global controllers that run once and manage application-wide behavior.

### UI controllers

Create controllers in a dedicated folder and include it globally:

```
@base/
└── @ui/
    ├── keyboard.js
    ├── analytics.js
    └── tooltips.js
```

```yaml
# @base/site.yaml
include: [@design, @ui]
```

Example keyboard controller:

```js
// @base/@ui/keyboard.js
document.addEventListener('keydown', (evt) => {
  const { target, key } = evt

  if (key == 'Escape') {
    // close modals, clear forms
  }

  if (key == '/') {
    // focus search
  }
})
```

The controller runs globally. Any component can trigger the behavior, but the logic lives in one place.

### When to use global JavaScript

Use global controllers for:

- **Keyboard shortcuts** - App-wide key commands
- **Analytics** - Tracking across all pages
- **Tooltips** - Enhance any element with data attributes
- **Focus management** - Tab trapping, escape handling
- **Third-party scripts** - Analytics, chat widgets, external integrations

The pattern: one script handles behavior that spans multiple components and pages. Individual components stay focused on their own structure and local interactions.


## External libraries
The modern web platform provides surprisingly complete functionality out of the box. Before reaching for a library, check if native APIs can handle your needs. When you do need external code, download minimal versions to `@lib/` and configure them through `import_map`.

### Recommended structure
Download libraries to `@lib/`:

```
@base/@lib/
├── d3.js
└── utils.js
```

Configure imports in `site.yaml`:

```yaml
import_map:
  d3: /@lib/d3.js
  utils: /@lib/utils.js
```

Use in your JavaScript modules:

```js
import * as d3 from 'd3'
import { formatCurrency } from 'utils'
```

### External scripts
Non-module scripts like Google Analytics load through layout modules:

```html
<!-- @base/layout.html -->

<head>
  <script async src="https://www.googletagmanager.com/gtag/js"></script>
</head>
```

Or in the "bottom" slot for scripts that should load after page content:

```html
<div :is="bottom">
  <script src="/heavy-widget.js"></script>
</div>
```


## Next steps
This covers adding interactivity to content sites. For building complete single-page applications with Nue, see [Building single-page apps](building-single-page-apps).

