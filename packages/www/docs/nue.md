
# Nue: HTML first UI markup
A markup language that extends HTML with just enough syntax to build websites, apps and SVG images. It's not another JavaScript framework, but a different development model based on document structure rather than programmatic composition.

## Why HTML matters
The difference isn't syntax - it's architecture:

**Structure over logic** - In Nue, your UI is a document tree with data bindings. In React, it's JavaScript functions returning objects. This fundamental difference changes everything about how you build.

**Modern HTML** - `<dialog>`, `<details>`, `<popover>`, form validation, scroll-snap, container queries. React emerged when HTML was static. Today's HTML is interactive - Nue just fills the gaps.

**DOM based** - Nue's AST maps directly to DOM operations. No virtual DOM, no reconciliation. A button is a `<button>`, not a "<Button>" component with 50KB of dependencies.

## Quick start
Open this code on browser:

```html
<!doctype html>
<script src="https://cdn.skypack.dev/nuedom" type="module"></script>

<button :onclick="count++">
  { count }

  <script>
    this.count = 0
  </script>
</button>
```

Save as HTML, open in localhost (http protocol needed for modules). The component auto-mounts and runs.

[View live demo](/docs/examples/nue-counter)


## The structural advantage
Document structure enables different patterns than programmatic composition:

```html
<!doctype html>
<script src="https://cdn.skypack.dev/nuedom"></script>

<!-- form with native validation -->
<form :onsubmit="submit">
  <input type="email" name="email" required>
  <textarea name="message" minlength="10" required></textarea>
  <button>Send</button>

  <script>
    async submit(e) {
      await fetch('/api/contact', {
        body: new FormData(e.target),
        method: 'POST'
      })
      success.showPopover()
    }
  </script>
</form>

<!-- native dialog for success -->
<dialog id="success" popover>
  <h2>Message sent!</h2>
  <button popovertarget="success">Close</button>
</dialog>
```

No validation library. No form state management. No modal component. No  orchestration. The browser provides everything through HTML - validation, form data serialization, popover control. The document structure IS the application architecture.


## Server and client
Nue runs seamlessly on server and client:

**Server-side rendering** - Generate static HTML with Nue's template engine. For content sites, blogs, documentation.

**Single-page applications** - Build fully dynamic SPAs with client-side routing and state management. The same syntax, the same mental model.

**Hybrid applications** - Start with SSR for fast initial loads and SEO. Add client-side interactivity where needed.

The same `.html` file works as a server template and a client component. No special markers, no "use client" directives, no hydration. Write once, run anywhere.



## Cleaner, more scaleable code
Rapidly assemble interface by focusing solely on structure. Let that other concerns of your app do their job in equal clarity:

- **Business model/logic (JS/TS/Rust/Go)** - Your application's core logic
- **Structure (HTML)** - How the model is laid on the page
- **Presentation (CSS)** - How it looks

Each concern scales independently. Your design system doesn't bloat your components. Your business logic doesn't tangle with your UI. Teams can work on different layers without conflicts.


## Timeless skills and products
Learn HTML from MDN, not framework documentation. Build with `<dialog>`, not `<Dialog>`

**Skills that last** - HTML, CSS, and JavaScript have been stable for decades. Framework APIs change every few years.

**Products that last** - Your Nue applications will work in browsers 10 years from now. They're accessible by default, SEO-friendly by nature, and maintainable by anyone who knows web standards.

**Documentation that lasts** - Reference MDN for how `<dialog>` works. It's authoritative, comprehensive, and permanent. No need to match framework versions with documentation versions.


## Less is More
The numbers tell the story:

- Counter: ~2.5KB
- Single-page apps: ~30kb-70kb
- Material UI Button: 100KB+

Your entire application can be smaller than a single React component. Less code means fewer bugs, faster development, easier maintenance.


## Installation
For real projects, use Nuekit for the full development experience:

```bash
bun install nuekit
```

Or install Nue directly as a library:

```bash
bun install nuedom
```

For experiments and prototypes, just include the script tag as shown in Quick start - perfect for CodePen, JSFiddle, or local HTML files.

See the [HTML syntax reference](/docs/html-syntax) for the complete API.

