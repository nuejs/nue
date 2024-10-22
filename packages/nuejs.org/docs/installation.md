
# Get started with Nue



## 1. Install Bun
Install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

## 2. Install Nue

```sh
# Install Nue
bun install nuekit --global
```

## 3. Create a website

```sh
# Create a website
nue create simple-blog
```

Done. You should now have a new browser tab pointing to: `http://localhost:8083/welcome/`:

[image]
  small: /img/create-welcome.png
  large: /img/create-welcome-big.png
  caption: The welcome screen after succesful setup


## 4. Learn UX development
Follow the [tutorial](tutorial.html).

- - -

## Details

### System requirements

- [Bun 1.0.10](//bun.sh/) or later. Recommended with *macOS* and *Linux*.
- [Node.js 18.0.2](//nodejs.org/) or later. Recommended with *Windows* or if you don't want to install Bun.


### No Windows support
Nue currently does not work under Windows, but we're very close to get this fixed.


### VS Code Extension
Is located [here](//marketplace.visualstudio.com/items?itemName=yaoyuanzhang.nue).


### Having problems?
Please post an [issue](//github.com/nuejs/nue/issues). Thank you!


## Node setup { #node }
Install Nue with `pnpm`, `npm` or `yarn`:

```sh
pnpm install nuekit --global
```

The default engine is Bun, so the [command line interface](command-line-interface.html) starts with `#!/usr/bin/env bun`. Do the following to override the shebang:

```sh
node $(which nue)
```

To make the above command permanent you should store the following alias to your `~/.bashrc` or `~/.zshrc` file:

```sh
alias node-nue="node $(which nue)"
```
