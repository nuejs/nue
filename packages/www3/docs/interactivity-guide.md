
# Adding interactivity
This guide shows you two approaches to adding interactive features to your global design system:

**Progressive enhancement** - Use JavaScript to enhance the static HTML

**Dynamic HTML components** - Add dynamic components that react to user input


## Progressive enhancement

Progressive enhancement adds JavaScript to make server-rendered HTML work better. The HTML structure stays the same. JavaScript improves the behavior.

Enhancement scripts live alongside their HTML in `@shared/lib/`:

```
@base/
└── @shared/
    └── lib/
        └── contact-form/
            ├── contact.html  # Form layout module
            └── contact.js    # Form enhancement
```

### Example

Create the form as a reusable module:

```html
<!-- @base/@shared/lib/contact-form/contact.html -->
<form :is="contact-form" action="/api/subscribe" method="POST">
  <input type="email" name="email" required>
  <button>Subscribe</button>
</form>
```

Embed it in the pagefoot slot:

```html
<!-- @base/@shared/layout/pagefoot.html -->
<pagefoot>
  <contact-form/>
</pagefoot>
```

See [Page layout](page-layout) for details on layout modules and slots.

This form works without JavaScript. It renders in the pagefoot slot and submits to your server. The page reloads with the response.

Now create the enhancement script:

```javascript
// @base/@shared/lib/contact-form/contact.js
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

Include both files in your site configuration:

```yaml
# @base/site.yaml
include: [contact-form]
```

The form renders in the pagefoot slot on every page. The script enhances it to submit via fetch instead of full page reload. If JavaScript fails, the form still works through standard browser submission.

### Web Components alternative

Web Components offer a standards-based API for the same pattern:

```javascript
// @base/@shared/lib/contact-form/contact.js
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


## Dynamic HTML components

Dynamic HTML components generate markup on the client based on changing data. Components live in `@shared/lib/` alongside any component-specific styling:

```
@base/
└── @shared/
    └── lib/
        └── search/
            ├── search.html  # Search component
            └── search.css   # Search-specific styling
```

### Example

```html
<!-- @base/@shared/lib/search/search.html -->
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

The search.css file contains styling specific to the search overlay - layout of the results list, positioning of the dialog, search-specific spacing. General styling like how inputs look comes from `@shared/design/inputs.css`. The component CSS only handles what's unique to this component.

Include it automatically for every site:

```yaml
# @base/site.yaml
include: [search]
```

Or include for a specific site only:

```yaml
# acme.com/site.yaml
include: [search]
```

### Mounting components

Dynamic HTML components can be embedded in three places depending on where you need the interactivity.

**In layout modules** for site-wide components:

```html
<!-- @base/@shared/layout/header.html -->
<header>
  <nav>...</nav>
  <button popovertarget="search">Search</button>
</header>

<!-- @base/@shared/layout/bottom.html -->
<bottom>
  <search-overlay/>
</bottom>
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


## Next steps

This covers adding interactivity to content sites. For building complete single-page applications with Nue, see [Building single-page apps](building-single-page-apps).