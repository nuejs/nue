
# Getting started
Install, create, develop:

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
nue dev    # Starts serving at http://localhost:4000
```

## Template types

**minimal** - Just `index.html` and `index.css` to start from scratch

**blog** - Simple Markdown based blog with minimal coding/configuration

**spa** - Single-page application with a simple server and UI

**full** - Full stack web with blog, docs, marketing pages, authentication, and SPA


## Upgrading
Update the global nue command to the newest version:

```
bun install --global nuekit@latest
```


## Upgrading from 1.0 to 2.0
Nue 2.0 is not backwards compatible with the previous version. The safest upgrade path is to install locally in your project:

```bash
bun install nuekit@latest
```

Run commands with `bunx`:

```bash
touch index.html
bunx nue serve
bunx nue build
```

This approach lets you test the new version without breaking anything. Once you've migrated all projects, switch to global installation:

```bash
bun remove --global nuekit
bun install --global nuekit@latest
```



## Why Bun?
Nue uses Bun exclusively because they share the same vision:

### Standards based
Bun uses browser APIs you already know: `fetch()`, `Request`, `Response`, `URL`, `Headers`, and `FormData`. No framework-specific APIs to learn. Code that works in the browser works in Bun.

### Rich in features
Core features like bundling, serving, and file handling are written in native code (Zig). No need for Vite, ESBuild, or separate build tools.

### Performance
Bun is faster than Node in almost every operation.

While Node support would be convenient, Bun-only is what enables Nue's extreme performance and simplicity. It's what makes the developer experience so special.


## Why --global?
Nue works like UNIX tools: `grep`, `sort`, or `git`. Just create an empty directory, add `index.html`, and run `nue`.


