
# Nuedom: HTML first UI assembly
Nuedom (or just "Nue") is a markup language that extends HTML with just enough syntax to build websites, apps and SVG images. It's a different development model based on document structure rather than programmatic composition.

## UI assembly
Nue differs from React "composition" in both syntax and architecture:

**HTML over JavaScript** - In Nue, your UI is a document tree with data bindings and event listeners. In React, it's JavaScript functions returning objects. This difference changes the way you think about application structure.

**Standards first** - `<dialog>`, `<details>`, `<popover>`, form validation, scroll-snap, container queries. Modern HTML is interactive. Nue adds the missing pieces for dynamic behavior.

**DOM based** - Nue's AST maps directly to DOM operations. No virtual DOM, no reconciliation. A button is a `<button>`, not a "`<Button>`" component with 50KB of dependencies and hundreds of megabytes of runtime.

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

Check [Nue website](https://nuejs.org/docs/nuedom) for details.
