
# Nuekit
**The entire web ecosystem in 1MB**

While Next.js applications can [grow to 1.4GB](migration) with hundreds of dependencies, Nuekit delivers the complete development experience in a single, minuscule executable. Content sites, single-page applications, design systems, server routes, and database integration. No configuration theater, no dependency management, no framework updates that break everything.

[complex image showing transformation from bloated Next.js to minimal Nue structure]
  sitemap/rss/collections


## Rapid application assembly
Nuekit separates applications into structure and system layers. Applications contain only HTML and Markdown - the skeletal framework of your interface. The system layer handles design, behavior, data, and business logic. This separation enables assembly-line development where you combine semantic markup with prepared components.


### User interfaces
```html
<form :onsubmit="submit">
  <label>
    <h3>Email</h3>
    <input name="email" type="email" autofocus class="fullsize">
  </label>
  
  <button>Sign In</button>
  
  <script>
    async submit(e) {
      await login(e.target.email.value)
      location.href = '/dashboard'
    }
  </script>
</form>
```

Semantic HTML with minimal reactive syntax. Business logic imported from the system layer. Design handled by CSS classes from your design system.

### Single-page apps  
```html
<!doctype dhtml>

<body>
  <nav>
    <a href="/users">Users</a>
    <a href="/settings">Settings</a>
  </nav>
  
  <main>
    <article/>
  </main>
  
  <script>
    state.on('route', ({ route }) => {
      this.mount(route || 'dashboard', 'article')
    })
  </script>
</body>
```

URL-based routing with automatic navigation. Components mount based on state changes. Standard HTML links become SPA navigation automatically.

### Content and pages
```md
---
title: Getting Started
sections: [hero, features, testimonials]
---

[.hero]
  # Transform your workflow
  Build consistent interfaces without the complexity

  [button "Get Started" href="/docs"]

[.features]
  ## Design System First
  Central CSS controls all visual decisions
  
  ## Component Assembly  
  Mix and match prepared components
```

Rich content creation with layout blocks. Design system classes provide consistent styling. Content creators work independently without breaking builds.


### SVG development

```xml
<!--
  @include [base.css, table.css]
-->
<svg width="400" height="300">
  <rect :each="item in data" 
    width="{ item.width }" 
    height="{ item.height }"
    class="bar { item.status }"/>
    
  <html>
    <table>
      <tr :each="row in tableData">
        <td>{ row.label }</td>
      </tr>
    </table>
  </html>
</svg>
```

Develop SVG visuals with design system integration and embedded HTML. Live-reload from `my-graphic.svg?hmr` for instant updates to data, CSS, and markup without browser reload.



## HMR everything

Traditional development requires constant context switching. Edit Markdown or CSS, then reload page. Change layout, lose form state. Update server routes, restart everything. Nuekit maintains your development flow across every type of change.

**Immediate updates**: Content changes update through DOM diffing while preserving scroll position and form state. CSS modifications inject directly without page reloads. Component library updates cascade to all pages using them.

**Full-stack development**: Server route changes reload instantly without restarting the development server. Database schema updates reflect immediately. Frontend and backend develop in perfect sync.

**Creative flow**: When the feedback loop disappears, development becomes exploration. Try design variations instantly. Test content changes without losing context. The creative process stays unbroken.


## Edge first development
Most frameworks develop with Node.js locally then discover their code doesn't work at the edge. Nuekit inverts this - your development environment IS an edge environment. Same constraints, same APIs, same behavior from localhost to global deployment.

```javascript
server.get('/api/users', async (c) => {
  // SQLite locally, D1 globally - identical API
  const { DB } = c.env
  const users = await DB.prepare('SELECT * FROM users').all()
  return c.json(users)
})
```

When development matches production reality, deployment becomes trivial. No environment variables, no connection strings, no platform-specific adaptations.

## Extreme performance
Nuekit achieves incredible speed in three ways:

**Closer to metal**: Built on Bun's native APIs for file operations, WebSocket connections, and SQL databases. Fewer abstractions mean direct hardware utilization. Native glob patterns, built-in transpilation, zero-copy file serving.

**Separation of concerns**: When business logic, design, content, and structure live in separate files, complex bundlers become unnecessary. Each layer optimizes independently without coordination overhead.

**Minimalism**: Less code executes faster. The entire client runtime weighs 2.5KB gzipped. Your applications become proportionally lightweight - single-page apps smaller than individual React components.

Build times measure in milliseconds, not seconds. Hot reload happens in under 20ms. The development experience approaches native application responsiveness while maintaining web deployment simplicity.


## Installation
Check [Getting started](get-started) for details.
