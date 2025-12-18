
# Multi-site development

[diagram: @base → acme.com + beta.org + startup.com]

Multi-site development means building multiple websites from one shared codebase. Instead of maintaining separate projects, you create a foundation once and spin out variations. Each site inherits the core system and overrides only what makes it unique.

This is fundamentally different from how most frameworks work. React scaffolds a new 300MB project for each site. You copy components between repositories. You maintain duplicate code. Every site is isolated.

Nue changes this. You build the foundation in `@base`. Create your global design system in `@base/@shared`. Define application patterns for blogs and documentation. Then new sites inherit everything and override only what makes them unique. A client project becomes a few dozen lines of CSS and content. The focus shifts to content, not code.

This article explains how multi-site development works. We'll cover the two modes (multi-site and single-site), show how inheritance chains work, and walk through the file system patterns you'll use daily.


## Two development modes

Nue supports two ways of organizing your work. You can build multiple sites that share a foundation, or you can build standalone sites with no inheritance. Both modes use the same tools and conventions.


### Multi-site mode
Multi-site mode is when you have a `@base` directory containing shared code and multiple site directories that inherit from it.

```
project/
├── @base/
│   ├── @shared/
│   │   ├── design/
│   │   └── lib/
│   ├── blog/
│   └── docs/
├── acme.com/
│   ├── site.yaml
│   └── index.md
└── beta.org/
    ├── site.yaml
    └── index.md
```

Each site declares what it inherits in `site.yaml`:

```yaml
# acme.com/site.yaml
extend: [ @base ]
```

Run `nue serve` from the project root and all sites start together:

```
@base     → localhost:4000
acme.com  → acme-com.localhost:4000
beta.org  → beta-org.localhost:4000
```

The development server supports hot module replacement across all sites. Edit a file in `@base/@shared/design/` and see changes instantly in every browser tab. This is what makes multi-site development practical. You can refine the foundation and see results across your entire portfolio immediately.


### Single-site mode

Single-site mode is when you build a standalone website with no inheritance. The directory contains everything the site needs.

```
my-blog/
├── @shared/
│   ├── design/
│   └── lib/
├── posts/
├── site.yaml
└── index.md
```

Navigate into the directory and run `nue serve`. The site starts at `localhost:4000`. No inheritance chain, no `@base`, just one self-contained project.

This mode works for simple sites, experiments, or when you want complete isolation. It uses the same conventions as multi-site mode. The `@shared` directory works the same way. Layout modules work the same way. The difference is scope: everything stays within one directory.


## Multi-site development

Multi-site development is about organizing shared code so multiple sites can inherit from it. The mechanics are straightforward: sites declare what they extend, and Nue follows the inheritance chain to find files.

### The `@base` directory

The `@base` directory is your foundation. It contains the global design system in `@base/@shared` and any application patterns you want to reuse.

```
@base/
├── @shared/
│   ├── design/        # Auto-loaded styles
│   ├── lib/           # Optional components
│   └── data/          # Shared data
├── blog/
│   ├── layout.html
│   ├── styles.css
│   └── index.md
└── docs/
    ├── layout.html
    ├── styles.css
    └── index.md
```

The `@base` is actually a working site. You can preview it at `localhost:4000` when running the development server. The look and feel should be plain since it's the foundation other sites build upon. Think of it as a headless design system that demonstrates the patterns.

See [global design system](global-design-system) for details on what goes into `@shared` and how to organize your foundation.


### Extending sites

Sites inherit from `@base` using the `extend` configuration in `site.yaml`:

```yaml
# acme.com/site.yaml
extend: [ @base ]
```

You can extend multiple layers:

```yaml
# beta.org/site.yaml
extend: [ @base, startup ]
```

This creates an inheritance chain: `@base` → `startup` → `beta.org`. Files are resolved by scanning the chain in reverse order. If `beta.org` needs `colors.css`, Nue checks `beta.org/@shared/design/colors.css` first, then `startup/@shared/design/colors.css`, then `@base/@shared/design/colors.css`.

The first match wins. This means sites can override any file from the inheritance chain by creating a file with the same path.


### Inheritance chain scanning

When Nue needs a file, it scans the inheritance chain in reverse order until found. This applies to everything: CSS files, layout modules, images, application pages, even 404 pages.

Request for `/blog/about`:
1. Check `beta.org/blog/about.md`
2. Check `startup/blog/about.md`
3. Check `@base/blog/about.md`
4. Return first match or 404

Request for `/@shared/design/colors.css`:
1. Check `beta.org/@shared/design/colors.css`
2. Check `startup/@shared/design/colors.css`
3. Check `@base/@shared/design/colors.css`
4. Return first match or 404

This scanning makes inheritance practical. You don't declare dependencies manually. You don't configure module resolution. Files in the inheritance chain are automatically available to sites that extend them.

See [page dependencies](page-dependencies) for complete details on how CSS, JS, HTML, and YAML files are resolved for each request.


### URL mapping

Markdown files map directly to URLs. The file system is the router.

```
acme.com/index.md              → /
acme.com/about.md              → /about
acme.com/blog/index.md         → /blog/
acme.com/blog/first-post.md    → /blog/first-post
acme.com/404.md                → custom error page
```

Assets like CSS and JavaScript files are also URL-addressable:

```
acme.com/styles.css            → /styles.css
acme.com/blog/blog.css         → /blog/blog.css
acme.com/script.js             → /script.js
```

If a file isn't found in the site directory, Nue scans the inheritance chain. This means `/@shared/design/colors.css` resolves from whichever layer provides it, usually `@base/@shared/design/colors.css`.


### Development server

The development server starts all sites simultaneously when you run `nue serve` from the project root.

```
@base     → localhost:4000
acme.com  → acme-com.localhost:4000
beta.org  → beta-org.localhost:4000
```

Site names with dots become hyphens in the subdomain: `acme.com` becomes `acme-com.localhost:4000`. This keeps the URLs consistent and easy to remember.

The server supports production preview mode for testing minified assets and inlined CSS:

```
acme.production.localhost:4000
```

This shows exactly what gets deployed without running a separate build step.


### Mass builds and HMR

Multi-site development enables two powerful capabilities: mass builds and cross-site hot module replacement.

**Mass builds** mean rebuilding all sites in under a second. Run `nue build` and every site in your project compiles with shared code deduplicated. Twenty sites build as fast as one because they're mostly rendering the same foundation.

**Cross-site HMR** means editing a file in `@base/@shared/design/` and seeing changes instantly across all open browser tabs. The system is smart about what to update. Edit CSS and only styles refresh. Change markdown content and only the content area updates. Modify a client-side component and it hot-reloads. Update navigation data in YAML and only the navigation refreshes. Your scroll position and browser state stay intact. Each tab updates independently based on what changed.

This makes iterating on the foundation practical. You can have `acme.com` and `beta.org` open side by side, adjust the typography in your global design system, and watch both sites update live.


## Single-site development

Single-site development is simpler. Everything lives in one directory with no inheritance chain. This works for standalone sites, experiments, or when you want complete isolation.

### Minimal site

The absolute minimum is an HTML or Markdown file:

```
my-site/
└── index.md
```

Or with some styling:

```
my-site/
├── index.css
└── index.md
```

This is a complete working site. Run `nue serve` and it starts at `localhost:4000`.


### Blog example

A typical blog uses layout modules, application-specific styling, and content files:

```
my-blog/
├── site.yaml
├── layout.html        # Global header and footer
├── styles.css
├── index.md
└── posts/
    ├── header.html    # Page header layout
    ├── first.md
    └── second.md
```

The `layout.html` file contains slot-based layout modules that wrap your content. The `posts/header.html` provides a page header (often called "hero" in other systems) specific to blog posts.

See [layout system](layout-system) for details on how slots and modules work.


### Full website

A complete site with multiple applications looks like this:

```
my-site/
├── @shared/
│   ├── design/        # Auto-loaded styles
│   ├── lib/           # Optional components
│   └── data/          # Shared data
├── blog/
├── docs/
├── contact/
├── img/
├── index.md
├── 404.md
└── site.yaml
```

This structure mirrors what you'd put in `@base` for multi-site development. The difference is scope: everything stays within this one site directory.


### Special directories

These directories have fixed names and special behavior in Nue:
```
@shared/
├── design/           # Base design (auto-loaded client-side)
├── lib/              # Optional components and scripts
├── data/             # YAML data for templates (server-side)
└── ui/               # UI components (auto-loaded client-side)
```

**`design/`** contains CSS files that load automatically in all pages. This is your base styling layer.

**`lib/`** contains optional components, effects, and scripts that sites opt into using the `include` configuration.

**`data/`** holds YAML files that templates can access during server-side rendering.

**`ui/`** contains UI components that load automatically. These can be server-side layout modules or client-side reactive components.

You can make any directory auto-load like `design/` and `ui/` by adding it to the `include` array in `@base/site.yaml`. This lets you organize auto-loaded assets however makes sense for your system.

The `@shared` directory works the same way in both single-site and multi-site modes. In multi-site mode, it lives in `@base/@shared` and sites inherit from it. In single-site mode, it lives at the root and serves just that one site.


### Home folder

Your home page assets can go in a `home/` folder to separate them from root-level assets that are shared across all applications:

```
my-site/
├── @shared/
├── blog/
├── docs/
├── home/              # Home page specific assets
│   ├── hero.html
│   └── styles.css
├── index.md
└── site.yaml
```

This keeps your root directory clean when you have many applications and your home page needs specific components or styling.


## File system reference

This section covers the technical details of how files map to URLs and what each file type does.

### File types

**`.html`** - Pages, layout modules, and components

**`.md`** - Content using Nuemark syntax

**`.css`** - Stylesheets (auto-loaded from specific directories)

**`.js`** - Client-side JavaScript

**`.ts`** - TypeScript (transpiled to JavaScript)

**`.yaml`** - Configuration and data

**`.png`, `.jpg`, `.svg`, `.mp4`, etc.** - Static assets served directly

See [file types reference](file-types) for complete details on how each file type works.


### Directory structure patterns
Applications typically use this structure:

```
blog/
├── layout.html        # Application-specific layouts
├── blog.css           # Application-specific styles
├── index.md           # Application home page
└── posts/
    ├── first.md
    └── second.md
```

The `layout.html` and `styles.css` files automatically apply to all pages within the `blog/` directory and its subdirectories. This lets you define patterns once for the entire application.

Nue has no strict file naming conventions. The `blog.css` could be named `styles.css` and `layout.html` file could be `blog-layout.html`. Nue scans for components and the first match wins. For example, when building a page's `<header>`, Nue looks for a header component in the inheritance chain and uses the first one it finds.

In multi-site mode, inheriting sites get these applications automatically and can override or extend them by creating matching directory structures with their own assets.


## Wrapping up
You now understand how multi-site development works in Nue. The key ideas are simple: sites inherit from a shared foundation, files are resolved through an inheritance chain, and the file system maps directly to URLs.

Multi-site mode lets you build a foundation once and spin out variations. Single-site mode gives you a simpler structure when you don't need inheritance. Both modes use the same conventions and tools.

The power comes from the combination: a global design system in `@base/@shared`, application patterns like blogs and documentation, and site-specific overrides that create unique expressions from the shared foundation. Your first site takes time to build. Your second site is mostly content and a few overrides. Your twentieth site takes an afternoon.

See [global design system](global-design-system) for building your foundation and [getting started](getting-started) for setting up your first project.



