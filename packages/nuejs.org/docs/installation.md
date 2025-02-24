
# Get Started with Nue

## 1. Install Bun

First, install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

## 2. Install Nue

Next, install Nue globally:

```sh
# Install Nue
bun install nuekit --global
```

## 3. Create a Website

Create your new website with:

```sh
# Create a website
nue create simple-blog
```

Done! Your browser should now open to: `http://localhost:8083/welcome/`:

[image]:
  caption: Welcome screen after successful setup
  src: /img/create-welcome.png

## 4. Follow the Tutorial

Check out the [step-by-step tutorial](tutorial.html) to learn how to build websites with Nue.

- - -

## Details

### System Requirements

- **Bun 1.0.10** or later. Recommended for *macOS* and *Linux*.
- **Node.js 18.0.2** or later. Recommended for *Windows* or if you prefer not to use Bun.

### No Windows Support

Nue is not currently tested or developed under Windows, so use it at your own risk.

### Having Problems?

Please post an [issue](//github.com/nuejs/nue/issues). Thank you!

## Node Setup

If you prefer to install Nue with `pnpm`, `npm`, or `yarn`, use:

```sh
pnpm install nuekit --global
```

The default engine is Bun, so the command line interface starts with `#!/usr/bin/env bun`. To override the shebang with Node, run:

```sh
node $(which nue)
```

To make this command permanent, add the following alias to your `~/.bashrc` or `~/.zshrc` file:

```sh
alias node-nue="node $(which nue)"
```
