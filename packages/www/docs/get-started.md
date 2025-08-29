# Getting started


```bash
# Install Bun (if you don't have it)
curl -fsSL https://bun.sh/install | bash

# Install Nuekit globally
bun install --global --production nuekit

# Create your first project
nue create blog    # or minimal, spa, full
```

Start building:

```bash
nue     # Starts at http://localhost:4000
```

## Why Bun?
Nue uses Bun exclusively because they share the same vision:

### Standards first
Bun uses browser APIs you already know: `fetch()`, `Request`, `Response`, `URL`, `Headers`, and `FormData`. No framework-specific APIs to learn. Code that works in the browser works in Bun.

### Close to metal
Core features like bundling, serving, and file handling are written in native code (Zig). No need for Vite, ESBuild, or separate build tools. Your project stays lean with fewer dependencies.

### Edge first
File storage, databases (SQLite), caching, and WebSockets work out of the box. The same code runs locally and on edge platforms like CloudFlare. No separate development setup needed.

### Performance
Faster installs, faster builds, faster everything. Bun's speed plus Nue's clean architecture delivers order-of-magnitude performance gains over mainstream frameworks.

While Node support would be convenient, Bun-only is what enables Nue's extreme performance and simplicity. It's what makes the developer experience so special.

## Why global install?
Nue works like UNIX tools: `grep`, `sort`, or `git`. Just create an empty directory, add `index.html`, and run `nue`. No 300MB of dependencies. No complex scaffolding. Start building immediately.

## Why the --production flag?
The --production flag excludes development dependencies, keeping the install size smaller. Most installs don't need development tools anyway.


## Project templates

### minimal
A single HTML file and CSS stylesheet. Shows how little scaffolding you need while keeping the same hot reloading experience as larger projects.

### blog
Content-focused site with collections, layouts, and Nuemark. Demonstrates how content creators and developers work independently.

### spa
Single-page application with user management, database integration, and routing. Uses Hono server with CloudFlare-compatible storage and hot reloading for both client and server.

### full
Production-ready foundation for ambitious projects. Includes design system, authentication, CRM demo, isolated business logic, test suite, and both MPA/SPA areas working together.

