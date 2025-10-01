
# **Nuekit:** Standards first web framework
Nuekit offers a complete client/server development environment for content sites and single-page applications in a single, 1MB executable. It takes HTML, CSS; and JavaScript to their absolute peak.


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

**Full stack**: Server route changes reload instantly without restarting the development server.

**Creative flow**: When the feedback loop disappears, development becomes exploration. Try design variations instantly. Test content changes without losing context. The creative process stays unbroken.


## Extreme performance
Nuekit achieves new levels of speed:

**Closer to metal**: Built on Bun's native APIs for file operations and WebSocket connections. Fewer abstractions mean direct hardware utilization. Native glob patterns, built-in transpilation, zero-copy file serving.

**Separation of concerns**: When business logic, design, content, and structure live in separate files, complex bundlers become unnecessary. Each layer optimizes independently without coordination overhead.

**Minimalism**: Less code executes faster. The entire client runtime weighs 2.5KB gzipped. Your applications become proportionally lightweight - single-page apps smaller than individual React components.

Build times measure in milliseconds, not seconds. Hot reload happens in under 20ms. The development experience approaches native application responsiveness while maintaining web deployment simplicity.


## Installation
Check [Getting started](getting-started) for details.
