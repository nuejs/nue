
# Get started with Nue

## 1. Install Bun

First, install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

Nue uses Bun for its superior web standards support, including native CSS parsing. Check details on why Nue prefers Bun over Node.js from our [FAQ](faq.html).


## 2. Install Nue

Next, install Nue globally:

```sh
# Install Nue
bun install --global nuekit
```

Nue uses global installation because it is a command line tool like Git or Docker. Just go to a directory and type `nue` to develop.


## 3. Install app

Create your first app with:

```sh
nue create simple-blog
```

Alternatively, start with a multipage app

```sh
nue create simple-mpa
```

Done! Your browser should now open to: `http://localhost:8083/`:

- - -

## Details

### System Requirements

- **Bun 1.2** or later. Recommended for *macOS* and *Linux* and *Windows*.
- **Node.js 20.8** or later, if you prefer not using Bun.


### Known issues

- **Windows support** — Windows tests pass, but support remains uncertain. Currently, no team member uses Windows.

- **Reactive components** — Reactive components start to struggle with complex nested loops and conditionals.


### Having Problems?

Please post an [issue](//github.com/nuejs/nue/issues).


## Node Setup

If you prefer to install Nue with `pnpm`, `npm`, or `yarn`, use:

```sh
pnpm install --global nuekit esbuild lightningcss
```

The default engine is Bun, so the command line interface starts with `#!/usr/bin/env bun`. To override the shebang with Node, run:

```sh
node $(which nue)
```

To make this command permanent, add the following alias to your `~/.bashrc` or `~/.zshrc` file:

```sh
alias node-nue="node $(which nue)"
```
