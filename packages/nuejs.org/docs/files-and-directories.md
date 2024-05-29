

# Files and directories
Nue does not force you to any fixed directory structure so you can freely organize your files and folders. You can, for example, start small with a landing page and grow organically as you need more areas on your website:

[image.gridpaper]
  small: /img/directory-structures.png
  large: /img/directory-structures-big.png
  caption: Two new areas were added as the project grew up



## Applications
Nue is a multi-page application builder. That is: each directory on the root of your project folder is a separate *application* with it's own scripts, components, and styling.


### Application types
There are two kinds of applications:

1. *Multi-page applications* consist of one or more Markdown files. Good examples are documentation, blogging area, or a feature tour. These apps are rendered server-side so that they can be easily consumed by search engines. The use of client-side JavaScript is optional.

2. *Single-page applications* consist of a single `index.html` file that serves all HTML requests. These are admin dashboards, onboarding flows, surveys, or login pages. The application is rendered on the client side with reactive components. SPAs are often hidden from search engines.


[image.gridpaper]
  small: /img/mpa-vs-spa.png
  large: /img/mpa-vs-spa-big.png




### Home application
The root directory is a special app in such a way that subdirectories are not automatically included in the dependency graph. Only global directories are. However, you can use the `appdir` configuration variable on your front page to make it part of some applications:

```
appdir: home
```

With the above setting all assets inside the "home" directory become dependencies for your root level `index.md`.




## Application files


### Static files
Miscellaneous file types like `.png`, `.jpg`, `.txt`, `.csv`, or `.json` are copied directly to the distribution directory without any special processing.


### Configuration files

- `site.yaml`   — [Site-wide options](../reference/configuration-options.html) on the root directory
- `app.yaml`    — App-specific options inside an application directory

### Layout files
- `index.html`  - Turns the root/application directory into a single-page app
- `layout.html` — [Layout components](layout-components.html)


### Scripts
- `main.js` — Automatically imported [JavaScript module](js-modules.html). This can import other scripts
- `main.ts` — The main script in TypeScript


### Styles
The following file types are automatically imported (and hot-reloaded):

- `*.css` — stylesheets


### Components
- `*.nue` — reactive components




### Global files
Nue supports automatic dependency management in such a way that all assets (scripts, styles, and components) inside an application directory and all the subdirectories are automatically included on the pages inside the app.


Moreover, you can define directories that are global to all applications in your `site.yaml` file on the root directory:

```
globals: [ globals, modules, style, themes/brutal ]
```

The assets under global directories are automatically included on every page, regardless of where they reside on the file system.


### Library files
....







