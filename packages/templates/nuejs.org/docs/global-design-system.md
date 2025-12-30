
# Building a global design system
The `@base` directory is your global design system - the foundation that all sites inherit from. This is how you build the system that lets you spin up world-class sites with minimal code.

A complete design system has three pillars working together:

**Structural layout** (`@shared/layout/`) - Headers, footers, page assembly

**Structured data** (`@shared/data/`) - Navigation structure, metadata, shared content

**Visual presentation** (`@shared/design/`) - Typography, colors, spacing, component styles

**Optional extensions** (`@shared/lib/`) - Components, interactivity, and features that sites opt into

The goal: new sites are mostly content (`.md` files) with minimal CSS overrides for personality.


## The @base structure
Start by creating the `@base` directory at the root of your project. This becomes your foundation that all sites inherit from.

```
project/
├── @base/
│   ├── site.yaml
│   ├── @shared/
│   │   ├── layout/
│   │   ├── data/
│   │   ├── design/
│   │   └── lib/
│   ├── blog/
│   └── docs/
├── acme.com/
└── beta.org/
```

The `@base` directory is a working site. Run `nue` from the project root and preview it at `localhost:4000`. The look and feel should be plain or "headless" since it's the foundation other sites build upon. Think of it as the raw core that's easy to extend with project-specific personality.


### The @shared directory

The `@shared` directory contains code that all inheriting sites automatically receive. It has four main subdirectories:

**`layout/`** - HTML modules that assemble the page structure. Headers, footers, sidebars.

**`data/`** - YAML and JSON files that define navigation, metadata, and shared content.

**`design/`** - CSS files that load automatically in all pages. Your base styling layer.

**`lib/`** - Optional components and scripts that sites opt into using the `include` configuration.

This separation lets you control what's automatic versus what's optional. Core typography and navigation go in `layout/` and `design/` because every site needs them. Specialized charts or animation effects go in `lib/` because only some sites need them.


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

Sites that extend `@base` get these applications automatically. They can override any piece by creating matching file paths in their own directory. This means you define blog structure once and all sites inherit it, but each site can customize as needed.



## The layout layer
Layout modules are the HTML components that wrap around your content. Every page needs a header, footer, and other structural elements. Define them once in `@shared/layout/` and all inheriting sites get the same page structure.

```
@base/@shared/layout/
├── header.html
├── footer.html
└── head.html
```

Small systems can use one file instead:

```
@base/@shared/
└── layout.html    # all modules in one file
```


### Creating global modules
For semantic landmark elements like `<header>` and `<footer>`, use the tag name directly:

```html
<!-- @shared/layout/header.html -->
<header>
  <a href="/" class="logo">{ site_name }</a>
  <nav>
    <a href="/docs">Documentation</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
  </nav>
</header>
```

```html
<!-- @shared/layout/footer.html -->
<footer>
  <p>&copy; 2025 { site_name }</p>
  <nav>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</footer>
```

For non-semantic slots, use the `:is` attribute:

```html
<!-- @shared/layout/banner.html -->
<div :is="banner">
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0">Check out v2.0</a>
</div>
```


### Application layouts
Applications can define their own layout modules that override or extend the global ones:

```
@base/
├── @shared/
│   └── layout/
│       ├── header.html
│       └── footer.html
├── blog/
│   └── layout.html      # Blog-specific modules
└── docs/
    └── layout.html      # Docs-specific modules
```

Application modules automatically apply to pages within that application based on URL path. A blog post gets the blog header. A docs page gets the docs sidebar.


### Layout inheritance
Inheriting sites can add their own layout modules or override existing ones:

```
acme.com/
└── layout.html   # More modules, scanned before @base modules
```

Most sites inherit all layout modules from `@base` and override only what makes them unique.

See [Layout modules](/docs/layout-modules) for complete details on module syntax, available slots, and data access.



## The data layer
Data files define the information that flows through your templates. Navigation menus. Team members. Product listings. Site metadata. This is your information architecture - the content structure that stays consistent while individual sites add their personality through styling.

Any `.yaml` or `.json` file in the data directory becomes template data. JavaScript files can transform and enrich this data before it reaches your templates.


### Site metadata
The `site.yaml` file at your `@base` root defines global metadata and custom properties that all templates can access:

```yaml
# @base/site.yaml
meta:
  title: The UNIX of the web
  description: Standards-first web framework
  og: /img/social.png

# Custom properties
site_name: Nue
company_email: hello@nuejs.org

social_links:
  twitter: https://twitter.com/nuejs
  github: https://github.com/nuejs
```

Configuration properties like `site`, `content`, and `collections` are reserved for Nue's configuration system. Everything else becomes template data available in your layout modules and components.

See [Configuration](configuration) for complete list of meta properties.


### Shared data files
The `@shared/data/` directory holds YAML and JSON files that define content shared across all sites. This is where your global information architecture lives.

Typical organization:

```
@base/@shared/data/
├── navigation.yaml
├── team.yaml
└── products.yaml
```

Define your site navigation structure once:

```yaml
# @base/@shared/data/navigation.yaml
main:
  - label: Documentation
    href: /docs
  - label: Blog
    href: /blog
  - label: About
    href: /about

footer:
  - label: Privacy
    href: /privacy
  - label: Terms
    href: /terms
  - label: Contact
    href: /contact
```

Your layout modules reference this data to build navigation:

```html
<!-- @shared/layout/header.html -->
<header>
  <a href="/">{ site_name }</a>
  <nav>
    <a :each="item in navigation.main" href="{ item.href }">
      { item.label }
    </a>
  </nav>
</header>
```

```html
<!-- @shared/layout/footer.html -->
<footer>
  <p>&copy; 2025 { site_name }</p>
  <nav>
    <a :each="item in navigation.footer" href="{ item.href }">
      { item.label }
    </a>
  </nav>
</footer>
```

Team data, product information, or any content that appears across sites works the same way. Define it once in `@shared/data/`, reference it in your templates.


### Data manipulation
Transform and enrich your data using JavaScript or TypeScript. Place `.js` or `.ts` files in the data directory:

```javascript
// @shared/data/process.js
export default async function(data) {

  // add computed properties
  data.featured_products = data.products.filter(p => p.featured)

  // enrich existing data
  data.team = data.team.map(member => ({
    ...member,
    avatar_url: `/img/team/${member.avatar}`
  }))
}
```

Since these functions are async, you can fetch from external sources like headless CMS systems or databases.

See [Context data](/docs/context-data) for complete details on data files, processing, and the data cascade.



## The design layer
The `design/` directory contains CSS files that automatically load in all inheriting sites. This is where you define the visual system - typography, colors, spacing, component styles.

Example organization:

```
@base/@shared/design/
├── globals.css
├── colors.css
├── typography.css
├── buttons.css
├── inputs.css
└── layout.css
```

Each file focuses on one aspect of the design system. The exact organization depends on your needs. Some systems split components into multiple files. Others keep everything in one file. There's no right answer, just what makes sense for your system.


### What belongs in design/
Files in `design/` should define the patterns that make your sites feel consistent. Typography scales. Color systems. Spacing rhythms. Layout primitives. Component styles. These are the decisions you make once and have cascade everywhere.

The strategy is finding balance between shared and site-specific. If you work with brands that have distinctive typography, your typography.css should be minimal or even absent. You want enough shared foundation to avoid duplication, but not so much that it constrains individual site expression.

Think about what stays the same across your sites versus what changes. Layout grids probably stay the same. Color palettes definitely change. Button structure probably stays the same. Button colors change. This thinking guides what goes in `design/` versus what sites override.


### CSS layers
Use CSS layers to control styling precedence across the inheritance chain:

```yaml
# @base/site.yaml
design:
  layers: [base, layout, components]
```

Each file uses `@layer` to specify which layer it belongs to. This gives you predictable control over which styles take precedence without depending on file load order. Sites can define their own layer structure that builds on top of the base layers.


## The lib directory
The `lib/` directory contains optional extensions that sites choose to include. Unlike `design/` and `layout/` which load automatically, files in `lib/` are opt-in.

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

The decision: would every site in your system use this? If yes, it probably belongs in `design/` or `layout/`. If no, put it in `lib/` and let sites opt in.


### How sites include components
Sites use the `include` configuration in their `site.yaml`:

```yaml
# acme.com/site.yaml
extend: [@base]
include: [components/tabs, components/charts, effects]
```

The matching is fuzzy. `components/tabs` includes just that component. `effects` includes everything in the effects directory. Sites can also exclude specific items:

```yaml
exclude: [effects/parallax]
```

Application folders can define their own includes in `app.yaml`. Both arrays expand through the inheritance chain, so a site gets includes from `@base`, the site level, and the application level.

You can also define includes in `@base/site.yaml` to make specific libraries auto-load for all inheriting sites.


## Application directories
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

That's it. The site inherits everything from `@base/@shared` and gets all the application patterns. Run `nue` from the project root and the site appears at `acme.com.localhost:4000` with full access to the foundation.


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
Your foundation is ready. See [Setting up page layout](/docs/page-layout) for creating layout modules and [Adding interactivity](/docs/interactivity) for progressive enhancement patterns.

