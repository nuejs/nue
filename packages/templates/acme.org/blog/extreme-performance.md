
---
date: 2025-09-15
---

# Extreme performance
Today the web performance industry optimizes the wrong things. Complex bundlers, code splitting, and tree shaking treat symptoms while ignoring the root cause: JavaScript dependency for basic functionality.


[placeholder.blue height="450"]


## The bundler trap
Modern web development assumes you need complex build tools to achieve performance. Webpack configurations span hundreds of lines. Vite promises speed through clever caching. Next.js provides automatic optimization through framework magic.

These tools work around a fundamental problem: applications that require JavaScript to render basic content. When your page needs 200KB of JavaScript to display a blog post, optimization becomes an arms race. Bundle splitting, lazy loading, and preloading try to make the inevitable download faster.

But faster delivery of unnecessary code is still unnecessary code. The real win is not needing the code at all.


## Progressive enhancement
The web was designed as a layered medium. HTML provides structure and content. CSS adds presentation. JavaScript enables interaction. Each layer enhances the previous one.

This architecture enables extreme performance through careful layering:

**HTML first** - Content and structure load immediately. No JavaScript required for reading, navigation, or basic functionality. Screen readers work. Search engines index everything. Users get instant content.

**CSS enhancement** - Visual design loads as a separate layer. Typography, colors, spacing, and layout enhance the structured content. The page becomes beautiful as styles load.

**JavaScript optional** - Interactive features enhance the styled content. Form validation, dynamic updates, and complex interactions layer on top. But the core experience works without them.

Most web applications need surprisingly little JavaScript. Content sites need none. Marketing pages need minimal interaction. Even complex applications can render their initial state as HTML.

## Going extreme

With proper layering, you can achieve performance that no bundler can match: everything needed to render the page in the first HTML response.

### CSS inlining

Modern CSS best practices keep stylesheets small enough to inline completely:

```yaml
# In site.yaml
design:
  inline_css: true
```

When your entire design system weighs less than Tailwind's reset CSS, inlining becomes viable. The initial HTML download contains everything needed for perfect rendering. No secondary requests, no flash of unstyled content, no layout shifts.

This eliminates the CSS network request entirely. While bundlers debate optimal chunking strategies, inlined CSS delivers instantaneous rendering. Nothing can beat zero network requests.


[placeholder.red height="250"]


### HTML-driven interactivity

Many "interactive" features work with pure HTML:

```html
<!-- Expandable content -->
<details>
  <summary>Advanced options</summary>
  <div>Content hidden by default</div>
</details>

<!-- Modal dialogs -->
<button popovertarget="settings">Settings</button>
<dialog id="settings" popover>
  <h2>Settings</h2>
  <button popovertarget="settings">Close</button>
</dialog>

<!-- Form validation -->
<form>
  <input type="email" required>
  <input type="url" required>
  <button>Submit</button>
</form>
```

No JavaScript required. The browser provides rich interactivity through semantic HTML. Your "complex" interface becomes a collection of standard elements.

### Minimal JavaScript

When JavaScript is needed, modern approaches keep it tiny:

```html
<!-- Component with minimal enhancement -->
<form onsubmit="handleSubmit(event)">
  <input name="email" type="email" required>
  <button>Subscribe</button>

  <script>
    async function handleSubmit(e) {
      e.preventDefault()
      const data = new FormData(e.target)
      await fetch('/subscribe', { method: 'POST', body: data })
      location.href = '/thanks'
    }
  </script>

</form>
```

The form works without JavaScript - server-side processing handles submission. JavaScript enhances with smoother UX. Total enhancement cost: 200 bytes.

## The performance hierarchy

Different optimization strategies have dramatically different impact:

**Bundler optimization** - 10-30% improvement. Code splitting, tree shaking, and compression optimize delivery of necessary code.

**Framework switching** - 50-70% improvement. Moving from React to lighter alternatives reduces baseline JavaScript requirements.

**Progressive enhancement** - 80-95% improvement. Making JavaScript optional eliminates most performance bottlenecks.

**CSS inlining** - 99% improvement for initial render. Zero network requests for visual presentation beats any bundler optimization.

The biggest gains come from architectural decisions, not build tools.

## Measuring what matters

Traditional metrics miss the point:

**Time to Interactive** becomes irrelevant when the page is interactive immediately through HTML.

**First Contentful Paint** happens instantly when CSS is inlined and content is in HTML.

**Cumulative Layout Shift** becomes zero when all styling loads with initial HTML.

**Lighthouse scores** improve dramatically when you need fewer resources to begin with.

The ultimate performance optimization is not needing to optimize. When your architecture eliminates bottlenecks, complex tooling becomes unnecessary.

## The benefits

Extreme performance changes user experience fundamentally:

**Instant loading** - Pages render immediately. No loading states, no progressive enhancement delays, no "app is loading" screens.

**Reliable experience** - Works on slow connections, old devices, with JavaScript disabled. Progressive enhancement ensures universal access.

**Simple deployment** - No build complexity, no CDN configuration, no cache invalidation strategies. Static HTML files work everywhere.

**Maintainable codebase** - Less JavaScript means fewer bugs. Smaller surface area means easier debugging. Standard HTML/CSS means longer-lasting code.

**Lower costs** - Less bandwidth, less server processing, less CDN usage. Extreme performance is also extreme efficiency.

The web's layered architecture enables performance that modern frameworks can't achieve. HTML, CSS, and minimal JavaScript create experiences faster than any bundler optimization. When you optimize architecture instead of build tools, users notice the difference.
