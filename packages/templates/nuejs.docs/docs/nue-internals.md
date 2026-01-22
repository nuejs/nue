
# Nue internals
How separation of concerns enables multi-site development

## Architecture

**Separation of concerns** - Separation of concerns is the core architectural decision that defines how Nue works. Content, structure, and presentation are kept in separate files and the separation is enforced at the framework level.

Content lives in Markdown files. HTML tags are not allowed inside Markdown. Structure lives in HTML template files. CSS-in-JS, inline styles, and utility classes are rejected during build. Style blocks inside components are stripped. The number of class names per element is limited. Presentation lives in standalone CSS files.

When styles live in separate files, they become sharable across components, pages, and sites.

**Inheritance chains** - With content, structure, and presentation in separate files, each can cascade independently through directory hierarchies. A site declares `extend: [@base]` and receives all CSS, layouts, components, and data from that foundation. Multiple sites can extend the same base. Sites can extend other sites. The inheritance resolver walks backward through the chain until it finds each requested file.

This creates global design systems by default. Typography defined in `@base/@design/` applies to every inheriting site. A site overrides only what differs. New sites require minimal code because they inherit most of their functionality from the shared codebase.


**Web standards** - Separation of concerns defines Nue's API surface. Structure is defined with HTML. Presentation uses CSS. Behavior is JavaScript. Each concern maps directly to its web standard without framework-specific abstractions layered on top.

Templates are HTML files. Styles are CSS files that load via standard `<link>` or `<style>` elements. Scripts are ES modules that run natively in browsers.

This direct mapping means browser DevTools show your actual code. CSS changes apply without complex HMR logic because the browser's native style recalculation handles updates. The framework adds minimal runtime overhead by delegating to platform APIs wherever possible.



## Dependencies
Nue has zero external dependencies. Every package is written from scratch and maintained within the same repository. This eliminates version conflicts, supply chain risks, and breaking changes from upstream packages.

The entire stack weighs under 500KB:

**[nuekit](//github.com/nuejs/nue/tree/master/packages/nuekit)** - The framework core: build system, dev server, multi-site HMR

**[nuedom](//github.com/nuejs/nue/tree/master/packages/nuedom)** - HTML-based template syntax for reactive and static components

**[nuemark](//github.com/nuejs/nue/tree/master/packages/nuemark)** - Markdown parser with support for rich content layouts

**[nueglow](//github.com/nuejs/nue/tree/master/packages/nueglow)** - Syntax highlighter that outputs semantic HTML for design system styling

**[nueyaml](//github.com/nuejs/nue/tree/master/packages/nueyaml)** - YAML parser with stricter, more predictable behavior

**[nuestate](//github.com/nuejs/nue/tree/master/packages/nuestate)** - State management driven by URL and history API

Each package does one thing. They compose through well-defined interfaces rather than deep integration. This follows the UNIX philosophy: small tools that work together. When something breaks, you know where to look. When you need to understand behavior, you read one focused codebase instead of tracing through layers of abstraction.



## Build system

Nue's build system is different from React-based bundlers. Instead of building to a dist folder, Nue serves files directly from your inheritance chain and compiles on demand. When you request a file, the server transpiles it in memory and sends it back. You can freely reorganize your files and sites and the system won't break as there is nothing to sync.

The dev server handles multiple sites simultaneously. Each site gets its own subdomain on localhost. Request `acme.localhost:4000` and the server resolves files through acme's inheritance chain. Request `beta.localhost:4000` and it resolves through beta's chain. Both sites run from the same server instance with shared resources loaded once.

Any change you make to your source files triggers updates to your browser tabs through WebSocket connections. Each tab maintains its own connection. The server tracks which site each tab represents and routes updates only where they apply. Edit a file in `@base` and all inheriting sites update. Edit a site-specific file and only that site's tabs update.

The HMR handles content and presentation differently based on what changed:

**Design system development** - Stylesheet edits patch directly into the page without reload. The browser's native style recalculation applies changes immediately. Component edits trigger a remount of only the affected component while preserving page state: form inputs keep their values, scroll position stays fixed, dialogs remain open. Layout module changes rebuild just the relevant slot without touching the article content.

**Content development** - Markdown edits diff against the current DOM and patch only the changed elements. Edit a paragraph and that paragraph updates. Add a heading and it inserts in place. YAML data changes propagate to every template expression that references the modified value. The system tracks these dependencies at build time so updates are surgical rather than page-wide.

This architecture eliminates the wait between editing and seeing results. Changes appear in milliseconds across every site that inherits them.



