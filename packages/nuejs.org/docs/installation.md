
# Get started with Nue



## 1. Install Bun
Install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

## 2. Install Nue
Install Nue:

```sh
# Install Nue
bun install nuekit --global
```

## 3. Create a website
Create your first Nue website:


```sh
# create an empty directory and cd to it
mkdir "simple-blog" && cd "$_"

# install nue demo: "simple-blog"
nue create "simple-blog"
```

Check your browser at `http://localhost:8083/welcome/`:

[image]
  small: /img/create-welcome.png
  large: /img/create-welcome-big.png
  caption: The welcome screen after succesfull setup


## 4. Learn UX development
Follow the [tutorial](tutorial.html)

- - -

## Details

### System Requirements

- [Bun 1.0.10](//bun.sh/) or later. Recommended with *macOS* and *Linux*.
- [Node.js 18.0.2](//nodejs.org/) or later. Recommended with *Windows* or if you don't want to install Bun.


### No Windows support
Nue does not currently work under Windows, but we're working on it


### VS Code Extension
Is located [here](//marketplace.visualstudio.com/items?itemName=yaoyuanzhang.nue)


### Having problems?
Please post an [issue](//github.com/nuejs/nue/issues). Thank you!


## Node setup { #node }
Istall Nue with `pnpm`, `npm`, and `yarn`:

```sh
pnpm install nuekit --global
```

The default engine is Bun so the [command line interface](command-line-interface.html) starts with `#!/usr/bin/env bun`. Do the following to override the shebang:

```sh
node $(which nue)
```

To make the above command permanent you should store the following alias to your `~/.bashrc` or `~/.zshrc` file:

```sh
alias node-nue="node $(which nue)"
```




