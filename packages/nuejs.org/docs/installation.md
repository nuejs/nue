
---
title: Getting started with Nue / Nue docs
class: no-aside
---

# Installing Nue

[.note]
  ### Status: Beta
  You can use Nue to build production-ready websites, but with following limitations:

  * **Sketchy Windows support.** Nue does not work under Windows but we're [working on it](https://github.com/nuejs/nue/issues/249)

  * **No support for single-page applications.** There is a tutorial on [building a simple SPA](//localhost:8082/docs/tutorials/build-a-simple-spa.html), but the support for full-blown reactive applications is very much in progress. All issues regarding Nue JS are marked as [low priority](https://github.com/nuejs/nue/labels/low%20priority) because the focus is currently on content-heavy multi-page applications.


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
Nue comes with a [command line interface](reference/command-line-interface.html) (CLI), which can be reused across multiple websitess. You only need to install it once and after that you have a generic `nue` executable available in your console:


``` sh
# Install Nue
bun install nuekit --global
```

You can verify the installation by running `nue --version`. If the output looks something like "Nue 0.5.2 • Bun 1.0.33", you can start building apps with Nue. You can either start from scratch with the help of a [tutorial](tutorials/build-a-simple-blog.html), or you can start with a template:




## Alternatively: Use Node { #node }
Nue also works with Node so you can alternatively install Nue with `pnpm`, `npm`, and `yarn`. For example:

``` sh
pnpm install nuekit --global
```

The default engine for Nue is Bun. That is: the command line interface starts with the `#!/usr/bin/env bun` shebang. To override this setting, and run Nue with Node, you can do the following:

``` sh
node $(which nue)
```

The `which` command locates the nue executable, and starts it with node. Running `node $(which nue) --version` should output something like "Nue 0.5.2 / Node 21.6.2". You can create a permanent shortcut to this command with `alias`. For example:

``` sh
alias node-nue="node $(which nue)"
```

To make the above command permanent you should store the alias to your `~/.bashrc` or `~/.zshrc` depending on your system shell.



### VS Code Extension
Here's [Nue VS code extension](https://marketplace.visualstudio.com/items?itemName=yaoyuanzhang.nue&ssr=false) for Visual Studio Code users (optional).



### Problems?
Please post an [issue](//github.com/nuejs/nue/issues) if Nue does not work on your environment.




