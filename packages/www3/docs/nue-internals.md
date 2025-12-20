
# Nue internals

## Packages

Nue frontend ecosystem weights under 500KB with zero external dependencies when installed. It holds following packages:

**[nuekit](https://github.com/nuejs/nue/tree/master/packages/nuekit)** - Multi-site web framework

**[nuedom](https://github.com/nuejs/nue/tree/master/packages/nuedom)** - HTML syntax for server- and client-side components

**[nuemark](https://github.com/nuejs/nue/tree/master/packages/nuemark)** - Markdown flavour for rich, interactive pages

**[nueglow](https://github.com/nuejs/nue/tree/master/packages/nueglow)** - Code highlighting that outputs semantic HTML

**[nueyaml](https://github.com/nuejs/nue/tree/master/packages/nueyaml)** - Unproblematic YAML format for structured content

**[nuestate](https://github.com/nuejs/nue/tree/master/packages/nuestate)** - URL first state management for single-page applications

Each package solves one problem. Together they form a complete system for building websites and applications. No external dependencies means no version conflicts, no supply chain risks, no surprise breaking changes from upstream packages. One installation serves unlimited sites.

This focused environment eliminates the complexity that comes with large dependency trees. You're working with a stable, predictable system where every piece is designed to work together. Less abstraction layers. Less debugging mysterious package interactions. Less time spent on tooling problems.

## Multi-site hot reloading

Hot module replacement in Nue works differently from traditional bundler-based systems. Instead of building to a dist folder and watching for changes, Nue serves files directly from your source directories and compiles on demand.

### How it works

When you run `nue serve`, the development server starts watching all files across your inheritance chain. Files compile in memory as the browser requests them.

**On-demand compilation:**
- HTML components compile to JavaScript when requested
- TypeScript files transpile to JavaScript on the fly
- Markdown files process through the complete rendering pipeline: layout generation, meta tags, dependency collection, component mounting
- CSS files serve directly without transformation

The browser receives working code, but nothing gets written to disk. This eliminates the build step during development.

### Surgical updates

When you edit a file, Nue detects the change and sends updates to the browser via WebSocket. Each file type updates differently:

**HTML components** - The changed component remounts with new code. Page state preserves: form values stay filled, dialogs remain open, scroll position holds.

**CSS files** - Modified styles patch into the existing stylesheet. The page doesn't reload.

**Content files (Markdown and YAML)** - The server re-renders the complete HTML and sends it through the WebSocket. The new HTML diffs against the current DOM and only changed sections patch. Components remount where needed. Page state preserves across the update.

This applies to any content change. Edit navigation in a YAML file and only the header updates. Change a paragraph in Markdown and only that text patches. Modify a layout module or custom component and it remounts without losing page state. The rest of the page stays intact.

### Multi-site awareness

The development server tracks which site is open in each browser tab. When you edit a file, the server checks which sites inherit it and pushes updates only to the relevant tabs.

Open your `@base` site in one tab and an inheriting site in another. Edit a shared CSS file and both tabs update simultaneously. Edit a site-specific file and only that site's tab updates.

This works because each tab maintains its own WebSocket connection. The server knows which site each connection represents and routes updates accordingly. You see the impact of your changes across your entire system in real time, but only where those changes apply.

The development experience scales with your architecture. Whether you're working on one site or ten, HMR responds to changes in milliseconds.