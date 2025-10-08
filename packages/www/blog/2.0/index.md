
---
title: **Nue 2.0:** The UNIX of the web
# date: 2023-09-18
---

Here's Nue 2.0 — a complete website development environment in 1MB.

[console]


## The entire ecosystem in 1MB
Nue is made of small, focused tools that do one thing well.

[nue-stack]
What used to be 500MB is now 1MB


## What's new

### Complete rewrite
Nuekit was rebuilt from scratch with a clear focus: do one thing well. The new architecture serves files directly from your source directory during development. No temporary `.dist/dev` folder, no build step before you start working. Just create files and see them in the browser.

We also switched from supporting both Bun and Node to Bun only. This decision enables the entire framework to stay lean while delivering better performance.


### HTML templating
All HTML files now use the same `.html` extension. The document type declaration determines how Nue processes each file:

```html
<!-- Server-rendered page -->
<!doctype html>

<!-- Dynamic, client-rendered page -->
<!doctype dhtml>

<!-- Server-side component library -->
<!html lib>

<!-- Client-side library -->
<!dhtml lib>

<!-- Isomorphic library -->
<!html+dhtml>
```

When you omit the doctype, Nue detects the type automatically based on your markup. If your file has event handlers or imports, it becomes dynamic. If it's pure content structure, it renders server-side.

This replaces the old `.dhtml` extension system with a more flexible approach that follows HTML standards.


### Zero dependencies
Nue 2.0 has no external dependencies. Everything needed to build websites lives in that 1MB executable:

- Custom CSS parser
- Custom YAML parser (Nueyaml)
- Custom DOM implementation for server-side rendering and testing

Building without dependencies gives us full control over the entire stack. Each tool does one thing well and communicates seamlessly with the others. This is how you build frameworks the UNIX way: small, focused tools that work together perfectly.

This gives us a lean developer experience without the typical framework bloat.


### New features

**SVG development** - Process SVG files as templates with full HMR support. Embed your design system styles and fonts directly into standalone graphics. Mix HTML and SVG naturally using `<html>` tags that become `<foreignObject>` automatically.

**Sitemap generation** - Enable in your config and Nue generates `sitemap.xml` automatically from your pages. Skip pages with draft or private flags.

**RSS feeds** - Point at any content collection and get a complete RSS feed with auto-discovery link tags. Perfect for blogs and documentation sites.


### SPA development
Single-page applications get a new development model built on Nuestate. Define your route patterns in one place and let the URL drive your application. Regular `<a href>` links become SPA navigation automatically with the `autolink` option.

The upcoming [universal data model](universal-data-model) will unify how data flows through SPAs, but the foundation is here now: clean separation between routing, data model, state, and the UI layer.


### New tools

**Nuestate** - URL-first state management that puts application state in the URL by default. Bookmarking, sharing, and browser navigation work automatically without extra code. No stores, no reducers, no actions. Just read and write to a state object.

**Nueserver** - "Edge-first" backend development. Write server code once and run it identically on your machine and across global edge locations.

**Server proxy** - Not ready for edge-first? Configure Nue to proxy API calls to your existing backend.


### New templates
Four options for different needs:

**minimal** - Just `index.html` and `index.css` to start from scratch

**blog** - Simple Markdown based blog with minimal coding/configuration

**spa** - Single-page application with a simple server and UI

**full** - Full stack web with blog, docs, marketing pages, authentication, and SPA


## Why Bun
Nue and Bun share the same vision for web development.

**Standards based** - Bun uses browser APIs you already know: `fetch()`, `Request`, `Response`, `URL`, `Headers`, and `FormData`. No framework-specific APIs to learn. Code that works in the browser works in Bun.

**Rich in features** - Core features like bundling, serving, and file handling are written in native code (Zig). No need for Vite, ESBuild, or separate build tools.

**Performance** - Bun is faster than Node

While Node support would be convenient, Bun-only is what enables Nue's extreme performance and simplicity. It's what makes the developer experience special.


## Upgrading from 1.0
Nue 2.0 is not backwards compatible with version 1.0. The safest upgrade path is to install locally in your project:

```bash
bun install nuekit@latest
```

Run commands with `bunx`:

```bash
bunx nue serve
bunx nue build
```

This lets you test the new version without breaking anything. Once you've migrated all projects, switch to global installation:

```bash
bun install --global nuekit@latest
```

## Get started

```bash
# Install Bun 1.2+ (if you don't have it yet)
curl -fsSL https://bun.sh/install | bash

# Install Nuekit globally
bun install --global nuekit

# Create your first project
nue create blog    # or minimal, spa, full
```

Start developing:

```bash
nue    # Starts serving at http://localhost:4000
```