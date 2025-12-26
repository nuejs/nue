# Getting started

```bash
# Install Bun 1.2+ (if you don't have it yet)
curl -fsSL https://bun.sh/install | bash

# Install Nuekit globally
bun install --global nuekit

# Create your first multi-site setup
nue create multi-site
```

This creates a project with three connected sites:

```
@base/        # Your global design system
acme.com/     # Example company site
admin/        # Single-page app
```

Start developing:

```bash
nue
```

This launches all sites in development mode with hot reload:

```bash
@base      -> http://localhost:4000
acme.com   -> http://acme-com.localhost:4000
admin      -> http://admin.localhost:4000
```

Sites run on separate subdomains of localhost.


## Upgrading
Update the global nue command to the newest version:

```bash
bun install --global nuekit@latest
```

## Why Bun?
Nue uses Bun exclusively because they share the same vision:

**Web standards** - Bun uses browser APIs you already know: `fetch()`, `Request`, `Response`, `URL`, `Headers`, and `FormData`. No framework-specific APIs to learn.

**More features** - Core features like bundling, serving, and file handling are written in native code (Zig). No need for Vite, ESBuild, or separate build tools.

**Fast** - Bun is faster than Node in almost every operation.


## Why global install?
Nue works like UNIX tools: `grep`, `sort`, or `git`. Just create an empty directory, add `index.html`, and run `nue`. One installation serves unlimited sites instead of 300MB+ per project.