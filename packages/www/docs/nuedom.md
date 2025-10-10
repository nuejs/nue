
# **Nuedom:** HTML first UI assembly
Nuedom (or just "Nue") is a markup language that extends HTML with just enough syntax to build websites, apps and SVG images. It's a different development model based on document structure rather than programmatic composition.

## UI assembly
Nue differs from React "composition" in both syntax and architecture:

**HTML over JavaScript** - In Nue, your UI is a document tree with data bindings and event listeners. In React, it's JavaScript functions returning objects. This difference changes the way you think about application structure.

**Standards first** - `<dialog>`, `<details>`, `<popover>`, form validation, scroll-snap, container queries. Modern HTML is interactive. Nue adds the missing pieces for dynamic behavior.

**DOM based** - Nue's AST maps directly to DOM operations. No virtual DOM, no reconciliation. A button is a `<button>`, not a "<Button>" component with 50KB of dependencies and hundreds of megabytes of runtime.

### How it looks

```html
<!doctype html>

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

No validation library. No form state management. No modal component. No orchestration code. The browser provides everything through HTML - validation, form data serialization, popover control. The document structure IS the application architecture.

## Server and client
Nue runs seamlessly on server and client:

**Server-side rendering** - Generate static HTML with Nue's template engine. For content sites, blogs, documentation.

**Single-page applications** - Build fully dynamic SPAs with client-side routing and state management. The same syntax, the same mental model.

**Hybrid applications** - Start with SSR for fast initial loads and SEO. Add client-side interactivity where needed.

The same `.html` file works as a server template and a client component. No special markers, no "use client" directives, no hydration. Write once, run anywhere.

## Architectural constraints
Nue enforces [separation of concerns](/docs/separation-of-concerns) through built-in constraints:

**No style blocks** - CSS belongs in `.css` files, not embedded in HTML. Style blocks are stripped during processing.

**No inline styles** - The `style` attribute is ignored completely. All presentation decisions happen in your [design system](/docs/design-systems).

**Class name limits** - Maximum 3 class names per element (configurable). This prevents utility class bloat and forces systematic design thinking.

**Clean class syntax** - Class names must be valid CSS identifiers. No colons, no special characters, no framework artifacts.

These constraints aren't limitations - they're guardrails toward maintainable architecture. When you can't mix concerns, you're forced to separate them properly. The result is cleaner code that scales better and breaks less often.

## In-browser compilation
Nue compiles directly in the browser with a 2KB compiler - no build tools, no Babel, no webpack:

```html
<!doctype html>

<head>
  <title>Nue In-browser compilation</title>
  <script src="//esm.sh/nuedom" type="module"></script>
</head>

<template>
  <button :onclick="count++">
    Count: <b>{ count }</b>

    <script>
      this.count = 0
    </script>
  </button>
</template>
```

Save as HTML, open on localhost (http protocol needed for modules). The component auto-mounts and runs.

[View live demo](/docs/examples/nue-counter)

Nue syntax is simple enough to compile in real-time without massive toolchains. Compare this to React's Babel transform that requires hundreds of megabytes of dependencies just to turn JSX into JavaScript.

## Installation
For real projects, use Nuekit for the full development experience:

```bash
bun install --global nuekit
```

Or install Nue directly as a library:

```bash
bun install nuedom

## try the demo with in-browser compilation
bun bin/serve
```

For experiments and prototypes.

See the [HTML syntax reference](/docs/html-syntax) for the complete API.

