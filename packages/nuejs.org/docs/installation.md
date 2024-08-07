

# Installing Nue


## Status: Beta
You can use Nue to build production-ready websites, but with following limitations:

* **Sketchy Windows support.** Nue does not work under Windows but we're [working on it](https://github.com/nuejs/nue/issues/249)

* [Single-page applications](single-page-applications.html) are a central part of Nue's roadmap, but the main focus is currently on content-heavy multi-page applications. All SPA-related issues are marked [low priority](https://github.com/nuejs/nue/labels/low%20priority).


## System Requirements

* [Bun 1.0.10](//bun.sh/) or later. Recommended with *MacOS* and *Linux*.
* [Node.js 18.0.2](//nodejs.org/) or later. Recommended with *Windows* or if you don't want to install Bun


## 1. Install Bun
Install Bun on your system with the following command

``` sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

## 2. Install Nue
Nue comes with a [command line interface](command-line-interface.html) (CLI), which can be reused across multiple websites. You only need to install it once and after that, you have a generic `nue` executable available in your console:


``` sh
# Install Nue
bun install nuekit --global
```

You can verify the installation by running `nue --version`. If the output looks something like "Nue 0.5.2 • Bun 1.0.33", you can start building apps with Nue. You can either start from scratch with the help of a [tutorial](hello-world.html), or you can start with a template:




## Alternatively: Use Node { #node }
Nue also works with Node so you can, alternatively, install Nue with `pnpm`, `npm`, and `yarn`. For example:

``` sh
pnpm install nuekit --global
```

The default engine for Nue is Bun. That is: the command line interface starts with the `#!/usr/bin/env bun` shebang. To override this setting, and run Nue with Node, you can do the following:

``` sh
node $(which nue)
```

The `which` command locates the nue executable and starts it with node. Running `node $(which nue) --version` should output something like "Nue 0.5.2 / Node 21.6.2". You can create a permanent shortcut to this command with `alias`. For example:

``` sh
alias node-nue="node $(which nue)"
```

To make the above command permanent you should store the alias to your `~/.bashrc` or `~/.zshrc` depending on your system shell.



### VS Code Extension
Here's [Nue VS code extension](https://marketplace.visualstudio.com/items?itemName=yaoyuanzhang.nue&ssr=false) for Visual Studio Code users (optional).



### Problems?
Please post an [issue](//github.com/nuejs/nue/issues) if Nue does not work in your environment.
