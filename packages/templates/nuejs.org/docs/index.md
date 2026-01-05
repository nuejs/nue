
# Get started
The steps to get your first multi-site setup up and running with HMR:


```sh
curl -fsSL https://bun.sh/install | bash   # 1. install Bun
bun install --global nuekit                # 2. install Nue
nue create multi-site                      # 3. install multi-site
```

This creates a project with multiple connected sites:

```
@base/       # Global design system
acme.com     # Example company site
bigger.co    # Alternate look and feel
admin.dev    # Single-page app example
...
```

Start watching them all with `nue` command in the multi-site directory. This launches the sites on separate subdomains of localhost:

```bash
nue
  -> @base        http://localhost:4000
  -> acme.com     http://acme.com.localhost:4000
  -> bigger.co    http://bigger.co.localhost:4000
...
```


## Upgrading
Update the global nue command to the newest version:

```bash
bun install --global nuekit@latest
```

## Why Bun?
Nue uses Bun exclusively because they share the same vision:

**Web standards** - Bun uses browser APIs you already know: `fetch()`, `Request`, `Response`, `URL`, `Headers`, and `FormData`. No framework-specific APIs to learn.

**Key features built-in** - Core features like JS minification, bundling, serving, and file handling are written in native code (Zig). No need for Vite, ESBuild, or separate build tools.

**Performance** - Bun is faster than Node in almost every operation.


## Why global install?
Nue works like UNIX tools: `grep`, `sort`, or `git`. Just create an empty directory, add `index.html`, and run `nue`. One installation serves unlimited sites instead of 300MB+ per project.