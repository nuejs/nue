
# Build system
Nue's build system works differently because of [separation of concerns](/docs/separation-of-concerns). When business logic, design, content, and structure live in separate files, complex bundlers like Vite or Turbopack become unnecessary.


## How separation enables simplicity
The architectural difference goes through the entire build system:

**No unnecessary bundling** - When files have single responsibilities, there's no need for bundlers. A CSS file loads as CSS and JavaScript modules load when needed.

**Surgical optimization** - Instead of bundling everything together and trying to optimize the result, Nue can optimize each concern independently. CSS can inline completely. JavaScript loads precisely. HTML has minimal markup.

**Direct file relationships** - Changes to one file affect only that file and its direct dependencies. No rebuild cascades through component graphs.

## Development server

### Direct serving approach
Nue processes files on request during development. No build step before you can start working, no `.dist` directory to keep in sync with your source files.

When you request `/blog/my-post/` in the browser:
1. Nue finds `blog/my-post.md`
2. Processes the Markdown content
3. Combines it with layout modules
4. Applies CSS and JavaScript assets
5. Serves the complete HTML

This happens fast enough to feel instant because Nue operates closer to standards (metal) and each processing step is lightweight.

### File processing by type

**CSS and JavaScript** - Served directly as written on development mode. No transformation neeed.

**TypeScript** - Converted to JavaScript on each request using Bun's built-in transpiler.

**Markdown files** - Processed through [Nuemark](/docs/nuemark) parser, combined with layout modules, and served as complete HTML pages.

**HTML pages** - Similar to Nuemark pages, but layout only.

**SPA entry points** - Two files served: server-side HTML and the dynamic parts compiled to JavaScript.


### Hot module replacement
HMR works through WebSocket connections. The server watches file changes and sends targeted updates to the browser.

**Content updates** (`.md`, `.html` pages) - Uses DOM diffing to update only changed content. Your scroll position stays put, form inputs remain filled, JavaScript state persists.

**Layout changes** (`.yaml` data, layout `.html`) - Triggers full page reload because layout changes affect page structure.

**URL changes** - When you create new pages or rename files, the browser automatically navigates to reflect the new structure.

**Component library updates** - When you modify reusable components, all pages using them update simultaneously.

**CSS changes** - New styles inject directly into the page. Removed styles are cleaned up. No page reload needed.

**SPA updates** - The app is re-mounted. No page reloads.

**Server route changes** - Backend API routes reload without restarting the development server. Nue offers full-stack HMR.


## Production builds

### Build process
Production builds generate everything into the `.dist` directory:

```bash
nue build
```

**HTML generation** - Markdown content processed through templates with all layout modules applied. Dynamic expressions resolved with build-time data.

**CSS processing** - Stylesheets minified and optionally inlined into pages. Unused styles removed when possible.

**JavaScript handling** - TypeScript converted to JavaScript. Reactive HTML components transpiled to minimal client-side code. Everything minified.

**Asset optimization** - Images, fonts, and other assets copied with appropriate optimizations applied.


### Build performance
Small to medium sites consistently build under 100ms. This happens because:

**Simple file processing** - Each file type has straightforward processing rules. No complex dependency graphs to resolve.

**1MB toolchain** - The tiny Nue executable handles everything without spawning multiple processes or loading heavy dependencies.


### Optimization strategies

Because files have single responsibilities, optimization strategies can be more surgical than bundler-based approaches.

**CSS inlining** - Design systems built with constraints stay small enough to inline completely:

```yaml
design:
  inline_css: true
```

This eliminates the CSS network request entirely. The initial HTML download contains everything needed to render the page correctly. Especially effective when your base CSS is smaller than most framework resets. It's impossible to beat this with any bundler strategy.

**View transitions** - Built-in client-side navigation that feels like a single-page app but works with regular HTML pages:

```yaml
site:
  view_transitions: true
```

Pages load instantly after the first visit because CSS and JavaScript are cached. The browser's native View Transitions API provides smooth animations between pages.

**Precise loading** - JavaScript modules load exactly when needed. No massive vendor bundles containing code you don't use. The Nue.js client runtime is 2.5KB gzipped - your application code stays proportionally minimal.

**HTTP/2 friendly** - Multiple small, focused files work better with HTTP/2 than single large bundles. The server can push exactly what each page needs.


