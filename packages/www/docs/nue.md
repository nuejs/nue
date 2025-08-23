
# Nue: HTML first UI markup
A markup language that extends HTML with just enough syntax to build websites, single-page apps and dynamic SVG. It's a different development model based on document structure rather than JavaScript composition.

## Why HTML matters
The difference is architectural:

**Structure over logic** - Your UI component is a document tree structure that closely mimics the browser-native DOM structure. This structure can be manipulated and altered before rendering.

**Modern HTML** - `<dialog>`, `<details>`, `<popover>`, form validation, scroll-snap, container queries. Nue elevates this foundation with programmatic power.

**DOM based** - Nue's AST maps directly to DOM operations. No virtual DOM, no reconciliation. A button is a vanilla `<button>`, not a "<Button>" component with 50KB of dependencies.


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

