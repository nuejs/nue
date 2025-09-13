# Build system

Nue's build system works differently. When business logic, design, content, and structure live in separate files, the build process becomes remarkably simple.

## How it works

**Direct serving** - Nue serves files directly from your source folder. Request your SPA `/app/` and Nue processes `app/index.html` in real-time. No build step, no intermediate artifacts, no .dist directory to keep in sync.

**Universal HMR** - All asset types update instantly. Content, layouts, CSS, JavaScript, data, configuration — even server routes. Every change is a small diff operation reaching your browser in 10-20ms.

**Production builds** - Optimize what matters: the initial HTTP request. Make it as fast as possible by loading everything needed to render at once. No amount of JavaScript optimization can beat this approach.


## Development server
Nue processes files on request during development. The server can start instantly because there is no build step. When you request `/blog/my-post/` in the browser:

1. Nue finds `blog/my-post.md`
2. Processes the Markdown content
3. Combines it with layout modules
4. Applies CSS and JavaScript assets
5. Serves the complete HTML

This happens fast enough to feel instant because each processing step is lightweight.

Here's a new "Hot module replacement" section based on that code:

### Hot module replacement
HMR works through WebSocket connections. The server watches file changes and sends targeted updates based on file type:


**Markdown content** - DOM diffing updates only the changed content. Your scroll position, form inputs, and component state all persist.

**HTML components and layouts** - Smart reload that preserves application state while updating the affected components.

**SVG graphics** - Visual updates without page refresh for dynamic graphics and icons.

**CSS stylesheets** - Style injection and cleanup. New styles apply instantly, removed styles are cleaned up automatically.

**YAML configurations, JavaScript, and TypeScript changes** - resort to full page reload because these affect application state and logic.

Each file type gets precisely the update strategy it needs. No unnecessary full page reloads, no lost application state.




## Production builds

```bash
nue build
```

**HTML generation** - Markdown content processed through templates with all layout modules applied.

**CSS processing** - Stylesheets minified and optionally inlined into pages.

**JavaScript handling** - TypeScript converted to JavaScript. Reactive components transpiled to minimal client-side code.

**Asset optimization** - Images, fonts, and other assets copied with optimizations applied.

### Build performance

Small to medium sites consistently build under 100ms because:

**Simple file processing** - Each file type has straightforward processing rules. No complex dependency graphs.

**Tiny toolchain** - The 1MB Nue executable handles everything without spawning multiple processes.


### Optimization strategies

**CSS inlining** - Design systems built with constraints stay small enough to inline completely:

```yaml
design:
  inline_css: true
```

This eliminates the CSS network request entirely. The initial HTML download contains everything needed to render correctly.

**View transitions** - Built-in client-side navigation that feels like a single-page app:

```yaml
site:
  view_transitions: true
```

Pages load instantly after the first visit because CSS and JavaScript are cached.

**Precise loading** - JavaScript modules load exactly when needed. The Nue.js client runtime is 2.5KB gzipped.

**HTTP/2 friendly** - Multiple small, focused files work better with HTTP/2 than single large bundles.
