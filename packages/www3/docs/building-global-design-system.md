
# Building a global design system
A global design system is your entire `@base` directory. It contains the shared foundation in `@base/@shared` that all sites inherit from, plus application patterns like blogs and documentation that sites can use and customize. This is what enables the 90% reuse principle: you build the foundation once, and new sites need only minimal overrides to express their unique personality.

This guide walks through organizing your `@base` directory. We'll cover what goes where, why each directory exists, and how to think about what belongs in the shared foundation versus what should be site-specific. The goal is a system where any site you build is a single CSS file providing personality and the rest is (AI-assisted) content.

The examples follow the structure created by `nue create multi-site`, which demonstrates the essential organization without going deep into design implementation.


## Creating the @base structure

Start by creating the `@base` directory at the root of your project. This becomes your foundation that all sites inherit from.

```
project/
├── @base/
│   ├── site.yaml
│   ├── @shared/
│   │   ├── design/
│   │   ├── lib/
│   │   └── data/
│   ├── blog/
│   └── docs/
├── acme.com/
└── beta.org/
```

The `@base` directory is a working site. Run `nue` from the project root and preview it at `localhost:4000`. The look and feel should be plain or "headless" since it's the foundation other sites build upon. Think of it as the raw core that is easy to extend with project-specific look and feel.


### The @shared directory

The `@shared` directory contains code that all inheriting sites automatically receive. It has three main subdirectories:

**`design/`** - CSS files that load automatically in all pages. This is your base styling layer that sites inherit by default.

**`lib/`** - Optional components, effects, and scripts that sites opt into using the `include` configuration.

**`data/`** - YAML, JSON, dynamic, and fetched data that templates have access during server-side rendering.

This separation lets you control what's automatic versus what's optional. Base typography and layout go in `design/` because every site needs them. Specialized chart components or animation effects go in `lib/` because only some sites need them.


### Application directories
Applications like `blog/` and `docs/` sit at the `@base` root level alongside `@shared`. These define patterns that sites inherit and can customize.

```
@base/
├── @shared/
├── blog/
│   ├── layout.html
│   ├── blog.css
│   ├── index.md
│   └── first-post.md
└── docs/
    ├── layout.html
    ├── docs.css
    ├── index.md
    └── getting-started.md
```

Sites that extend `@base` get these applications automatically. They can override any piece by creating matching file paths in their own directory or extend with differing file names. This means you define blog structure once and all sites inherit it, but each site can customize as needed.


## The @shared/design directory

The `design/` directory contains CSS files that automatically load in all inheriting sites. This is your foundation layer where you define the visual system that everything else builds upon.

Typical organization:

```
@base/@shared/design/
├── globals.css
├── colors.css
├── typography.css
├── buttons.css
├── inputs.css
└── layout.css
```

Each file focuses on one aspect of the design system. The exact organization depends on your needs. Some systems split components into multiple files (buttons.css, forms.css, cards.css). Others keep everything in one components.css. There's no right answer, just what makes sense for your system.


### What belongs in design/
Files in `design/` should define the patterns that make your sites feel consistent. Typography scales. Color systems. Spacing rhythms. Layout primitives. Component styles. These are the decisions you want to make once and have cascade everywhere.

The strategy is finding balance between shared and site-specific. If you work with brands that have distinctive typography, your typography.css should be minimal or even absent. You want enough shared foundation to avoid duplication, but not so much that it constrains individual site expression.

Think about what stays the same across your sites versus what changes. Layout grids probably stay the same. Color palettes/variables definitely change. Button structure probably stays the same. Button styling change. This thinking guides what goes in `design/` versus what sites override.


### CSS layers
Use CSS layers to control styling precedence across the inheritance chain:

```yaml
# @base/site.yaml
design:
  layers: [base, layout, components]
```

Each file uses `@layer` to specify which layer it belongs to. This gives you predictable control over which styles take precedence without depending on file load order. Sites can define their own layer structure that builds on top of the base layers. Use CSS layers to control styling precedence. Nue doesn't guarantee stylesheet load order.


## The @shared/lib directory

The `lib/` directory contains optional extensions that sites choose to include. Unlike `design/` which loads automatically, files in `lib/` are opt-in.

Example organization:

```
@base/@shared/lib/
├── components/
│   ├── tabs.html
│   ├── modal.html
│   └── charts.html
├── effects/
│   ├── parallax.css
│   ├── hovers.css
│   └── reveal.css
└── scripts/
    ├── analytics.js
    ├── viewport.js
    └── keyboard.js
```

You can organize this however makes sense. Some systems use flat files. Others group by type. The key is that sites explicitly choose what they need.


### What belongs in lib/
Put specialized functionality here. Components that only some sites need. Animation effects that would be distracting on minimal sites. Scripts for specific features. Anything optional goes in `lib/` rather than forcing all sites to load it.

The decision: would every site in your system use this? If yes, it probably belongs in `design/`. If no, put it in `lib/` and let sites opt in.


### How sites include components
Sites use the `include` configuration in their `site.yaml`:

```yaml
# acme.com/site.yaml
extend: [@base]
include: [components/tabs, components/charts, effects]
```

The matching is fuzzy. `components/tabs` includes just that component. `effects` includes everything in the effects directory. Sites can also exclude specific items to avoid unnecessary files from increasing page weight or causing unwanted functionality:

```yaml
exclude: [effects/parallax]
```

Application folders can define their own includes in `app.yaml`. Both arrays expand through the inheritance chain, so a site gets includes from `@base`, the site level, and the application level.

You can also define includes in @base/site.yaml to make specific libraries auto-load for all inheriting sites. This is useful for functionality that every site needs but doesn't belong in the design layer.


## Application patterns
Applications like blogs and documentation live at the `@base` root level. These define reusable patterns that all inheriting sites get automatically.

```
@base/
├── @shared/
├── blog/
│   ├── layout.html      # Blog-specific layout modules
│   ├── blog.css         # Blog-specific styles
│   ├── index.md         # Blog home page
│   └── posts/
│       ├── first.md
│       └── second.md
└── docs/
    ├── layout.html      # Docs-specific layout modules
    ├── docs.css         # Docs-specific styles
    ├── index.md         # Docs home page
    └── getting-started.md
```

Each application can have its own layouts, styles, and content structure. These cascade to all inheriting sites through the inheritance chain. A site with `extend: [@base]` automatically gets `/blog/` and `/docs/` routes with all the styling and structure defined here.


### Application assets
The `layout.html` and CSS files in each application directory automatically apply to pages within that application. This lets you define patterns once. Blog posts get blog styling. Documentation pages get docs styling. The system handles it automatically based on the URL path.

Sites can override these by creating matching directory structures. If `acme.com` wants a different blog header, it creates `acme.com/blog/layout.html` with its own layout modules. The inheritance chain means the site version takes precedence.


### The @base as preview
Since `@base` is a working site, you can preview these applications with `nue serve` at `localhost:4000/blog/` and `localhost:4000/docs/`. This lets you develop and test application patterns before sites inherit them.

The preview should be plain. You're building patterns, not final designs. Think headless design system. Sites add personality through overrides.



## Home folder
Your home page often needs its own components and styling that don't belong in the shared foundation or application directories. Use a `home/` folder to keep these separate:

```
@base/
├── @shared/
├── blog/
├── docs/
├── home/
│   ├── hero.html
│   └── home.css
└── index.md
```

This separates root-level assets shared across all applications from home page assets, which typically need specialized styling that doesn't belong in the foundation.


## First inheriting site
Create a site directory and declare what it extends:

```
project/
├── @base/
├── acme.com/
│   ├── site.yaml
│   ├── acme.css
│   └── index.md
```

The `site.yaml` declares inheritance:

```yaml
# acme.com/site.yaml
extend: [@base]
```

That's it. The site inherits everything from `@base/@shared` and gets all the application patterns. Run `nue` from the project root and the site appears at `acme-com.localhost:4000` with full access to the foundation.


### The 10% override principle
Most sites should need only minimal overrides to create their unique expression. A typical site might have one root-level CSS file that defines colors, adjusts spacing, and adds personality:

```
acme.com/
├── site.yaml
├── acme.css        # Site-specific overrides
├── index.md
└── img/
    └── logo.svg
```

If a site needs more than 10% custom code, either the foundation is missing essential patterns or the site is genuinely unique. The goal is maximum reuse with targeted overrides. Nothing stops you from building another @base for a whole different kind of design branch.


### Testing inheritance
Add some content to your site and verify it inherits the foundation properly. Navigation should work. Typography should look right. Layout patterns should apply. If something doesn't work, trace through the inheritance chain to see where the file should come from.

Common issues are usually configuration. Make sure the `extend` array is correct. Check that files are in the right directories. Verify `nue` is running from the project root, not from inside a site directory.


## Next steps
Your foundation is ready. See [Setting up page layout](page-layout) for creating layout modules and [Adding interactivity](interactivity) for progressive enhancement patterns.


