# Building a global design system
A global design system is a shared foundation that all your sites inherit from. You build it once and every new project gets the same layouts, components, and styling automatically.

This foundation lives in the `@base` directory:

**Layout** - Headers, footers, sidebars, and server-side components

**Design** - Typography, colors, spacing, and component styles

**Extensions** - Optional features and interactivity that sites opt into

New sites are mostly content (`.md` files) with targeted overrides for personality, letting you kickstart new projects rapidly with AI.

Global design system is the defining feature of the Nue framework.


## Multi-site directory structure
Create a local multi-site setup so you can experiment while reading:

```sh
nue create multi-site
```

This installs:

```sh
@base          # global design system
acme.org       # website example
beta.com       # alternate design
nuejs.docs     # docs site only
design.blog    # blog only
```

Run `nue` from the project root and open several browser tabs:

```sh
localhost:4000              # @base preview
acme.org.localhost:4000     # site instance
beta.com.localhost:4000     # alternate instance
```

Edits appear in real time across all tabs. Change something in `@base` and watch it cascade to every site.


### The @base directory
Here's the structure created by `nue create multi-site`:

```
@base
├── site.yaml
├── layout.html
├── index.md
├── 404.md
├── @design
│   ├── base.css
│   ├── components.css
│   ├── elements.css
│   └── global.css
├── @lib
│   ├── app.css
│   ├── forms.js
│   └── syntax.css
├── blog
│   ├── app.yaml
│   ├── layout.html
│   ├── blog.css
│   ├── index.md
│   └── *.md
├── docs
│   ├── app.yaml
│   ├── layout.html
│   ├── docs.css
│   └── index.md
└── img
    └── filler.svg
```

The `@base` directory is a working site you can preview at `localhost:4000`. The look and feel should be plain or "headless" since it's the foundation other sites build upon. Think of it as the raw core that's easy to extend with project-specific personality.


### Inheriting sites
Sites inherit from `@base` by declaring the extension in their `site.yaml`:

```
acme.org
├── site.yaml
├── acme.css
├── index.md
├── docs
│   ├── app.yaml
│   └── *.md
└── img
    └── shot.webp
```

```yaml
# acme.org/site.yaml
extend: [@base]
```

That's it. The site inherits everything from `@base` and gets all the application patterns. It appears at `acme.org.localhost:4000` with full access to the foundation.


## The include system
The `include` directive in `site.yaml` controls which folders and files load automatically:

```yaml
# @base/site.yaml
include: [@design]
```

This makes every CSS file in `@design/` load on every page of every inheriting site. The include directive matches any file or folder anywhere in the inheritance chain - it searches through `@base`, any intermediate layers, and the current site.

The `@` prefix is purely a naming convention for clarity. You could name it `design/`, `styles/`, or anything else. Even `@base` is just a convention - name it `foundation/` or `core/` if you prefer.

Inheriting sites receive these includes automatically. They can add their own:

```yaml
# acme.org/site.yaml
extend: [@base]
include: [extras]
```

Now `acme.org` loads both `@base/@design/` and `acme.org/extras/`.


### Excluding items
Sites can exclude specific items they don't need:

```yaml
# acme.org/site.yaml
extend: [@base]
exclude: [@design/components.css]
```


## The design layer
The `@design/` directory contains CSS files that load on every page. This is where you define the visual system: typography, colors, spacing, component styles.

```
@design
├── base.css        # resets, custom properties
├── elements.css    # HTML elements (links, lists, tables)
├── components.css  # buttons, cards, forms
└── global.css      # site-wide patterns
```

The exact organization depends on your needs. Some systems use more files, others fewer. The key is that everything here loads automatically through the `include` directive.


### What belongs in @design
Files here should define patterns that make your sites feel consistent. Typography scales. Color systems. Spacing rhythms. Component styles. These are decisions you make once and have cascade everywhere.

Think about what stays the same across your sites versus what changes. Layout grids probably stay the same. Color palettes definitely change. Button structure probably stays the same. Button colors change. This thinking guides what goes in `@design/` versus what sites override.


### CSS layers
CSS cascade layers let you control which styles take precedence regardless of file load order or selector specificity. A style in a higher layer always wins over a lower layer. This makes multi-site architectures manageable - you know exactly where overrides should go.

Configure layers in `site.yaml`:

```yaml
# @base/site.yaml
design:
  layers: [base, ui, app, site]
```

This generates an inline `<style>` tag before all stylesheets that establishes the layer order:

```html
<style>@layer base, ui, app, site;</style>
```

CSS files then declare which layer they belong to:

```css
@layer base {
  :root { --spacing: 1rem; }
}
```

The recommended layers for multi-site development:

- **base** - Resets, custom properties, fundamental styles
- **ui** - Components and complex element structures that override base
- **app** - Application-specific patterns (blog layouts, docs navigation)
- **site** - Individual site overrides with highest precedence

This is just a recommendation. Adjust the layers to fit your system. The key benefit is predictable cascade control without fighting specificity or worrying about file order.


## The lib directory
The `@lib/` directory contains optional extensions that aren't included globally. Unlike `@design/` which loads everywhere, files in `@lib/` are available for applications and inheriting sites to opt into.

```
@lib
├── app.css       # application-specific styles
├── forms.js      # form enhancement script
├── syntax.css    # code syntax highlighting
├── uilib/        # component library
│   ├── tabs.html
│   ├── modal.html
│   └── tabs.css
└── graphs/       # charting utilities
    ├── charts.html
    ├── charts.js
    └── charts.css
```

Folders within `@lib/` can contain everything needed for a feature: layout modules, scripts, and styles together. Include the folder and you get all of it.

Applications include what they need in their `app.yaml`:

```yaml
# @base/blog/app.yaml
include: [@lib/syntax.css]
```

Inheriting sites can also include from `@lib/`:

```yaml
# acme.org/site.yaml
extend: [@base]
include: [@lib/uilib, @lib/graphs]
```


### What belongs in @lib
Put specialized functionality here. Styles that only some applications need. Scripts for specific features. Component libraries. Anything optional goes in `@lib/` rather than forcing all pages to load it.

The decision: would every page across all sites use this? If yes, put it in `@design/` and add to the global `include`. If no, put it in `@lib/` and let applications opt in.


## Layout modules
Layout modules are HTML components that wrap around your content. Headers, footers, sidebars. Define them once and all inheriting sites get the same page structure.

In the simple setup, all modules live in a single file at the `@base` root:

```html
<!-- @base/layout.html -->

<header>
  <a href="/" class="logo">{ site_name }</a>
  <nav>
    <a :each="item in navigation" href="{ item.href }">
      { item.label }
    </a>
  </nav>
</header>

<footer>
  <p>&copy; 2025 { site_name }</p>
</footer>
```

For semantic landmark elements like `<header>` and `<footer>`, use the tag name directly. For non-semantic slots, use the `:is` attribute:

```html
<div :is="banner">
  <strong>New release!</strong>
  <a href="/blog/v2">Check out v2.0</a>
</div>

<section :is="pagehead">
  <h1>{ title }</h1>
  <p>{ description }</p>
</section>
```


### Application layouts
Applications can define their own layout modules:

```html
<!-- @base/blog/layout.html -->

<aside>
  <nav>
    <a :each="post in posts" href="{ post.url }">
      { post.title }
    </a>
  </nav>
</aside>
```

Application modules automatically apply to pages within that application. Blog posts get the blog sidebar. Docs pages get the docs navigation.


### Layout inheritance
Inheriting sites can override layout modules by creating their own `layout.html`:

```
acme.org/
└── layout.html   # overrides or extends @base modules
```

Most sites inherit all layout modules from `@base` and override only what makes them unique.

See [Layout modules](/docs/layout-modules) for complete details on available slots and module syntax.


## Site configuration and data
For simple setups, all configuration and data lives in `site.yaml`:

```yaml
# @base/site.yaml

# include directive
include: [@design]

# metadata
meta:
  title: My Framework
  description: Standards-first web framework
  og: /img/social.png

# custom properties available in templates
site_name: Nue
company_email: hello@nuejs.org

# navigation data
navigation:
  - label: Documentation
    href: /docs
  - label: Blog
    href: /blog
  - label: About
    href: /about

footer_links:
  - label: Privacy
    href: /privacy
  - label: Terms
    href: /terms

# social links
social:
  twitter: //twitter.com/nuejs
  github: //github.com/nuejs
```

Layout modules and components access this data using curly braces:

```html
<header>
  <a href="/">{ site_name }</a>
  <nav>
    <a :each="item in navigation" href="{ item.href }">
      { item.label }
    </a>
  </nav>
</header>
```

### Splitting data into files
As your data grows, you can split it into separate files. Add `.yaml` files at the root level:

```
@base
├── site.yaml
├── navigation.yaml
├── team.yaml
└── products.yaml
```

Or create a dedicated data directory and include it:

```
@base
├── site.yaml
├── @data
│   ├── navigation.yaml
│   ├── team.yaml
│   └── products.yaml
```

```yaml
# @base/site.yaml
include: [@design, @data]
```

All YAML files merge into the template context. Use whatever organization makes sense for your system.


### Application configuration
Applications have their own `app.yaml` for app-specific settings:

```yaml
# @base/blog/app.yaml
include: [@lib/syntax.css]

# collection for blog posts
collection: posts
```

Application config merges with site config. Properties in `app.yaml` override matching properties from `site.yaml` for pages within that application.

See [Configuration](/docs/configuration) for complete list of available options.


## Application directories
Applications like `blog/` and `docs/` live at the `@base` root level. These define reusable patterns that all inheriting sites get automatically.

```
@base/blog
├── app.yaml        # application config
├── layout.html     # blog-specific modules
├── blog.css        # blog-specific styles
├── index.md        # blog home page
└── *.md            # blog posts
```

Each application can have its own layouts, styles, and content. Sites with `extend: [@base]` automatically get `/blog/` and `/docs/` routes with all the structure defined here.


### Overriding applications
Sites can override any piece by creating matching paths:

```
acme.org/blog/
├── app.yaml        # override blog config
└── layout.html     # override blog layout
```

The inheritance chain means site-level files take precedence over `@base` files. This lets you customize the blog header for one site while keeping everything else shared.


### The @base as preview
Since `@base` is a working site, preview applications at `localhost:4000/blog/` and `localhost:4000/docs/`. This lets you develop and test patterns before sites inherit them.

The preview should be plain. You're building patterns, not final designs. Sites add personality through overrides.


## Scaling up
The flat structure works well for small and medium setups. As your system grows, you might want more organization.

For larger systems, create a `@shared/` directory with subdirectories:

```
@base
├── site.yaml
├── @shared
│   ├── layout
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sidebar.html
│   ├── design
│   │   ├── base.css
│   │   ├── typography.css
│   │   ├── colors.css
│   │   └── components.css
│   ├── data
│   │   ├── navigation.yaml
│   │   ├── team.yaml
│   │   └── products.yaml
│   └── lib
│       ├── charts.html
│       ├── modal.html
│       └── effects.css
├── blog
├── docs
└── index.md
```

Update your includes to match:

```yaml
# @base/site.yaml
include: [@shared/design, @shared/layout]
```

The system works the same way. You're just organizing files into more specific directories as complexity grows.


### When to scale up
Signs you might need more structure:

- Multiple people working on the design system
- More than 10-15 CSS files
- Complex data that benefits from separate files
- Many reusable components

Start simple. Add structure when you feel the need, not before.


## First inheriting site
Create a site directory with minimal files:

```
acme.org
├── site.yaml
├── acme.css
└── index.md
```

The `site.yaml` declares inheritance:

```yaml
# acme.org/site.yaml
extend: [@base]
site_name: Acme Inc
```

The site inherits everything from `@base`. Run `nue` from the project root and it appears at `acme.org.localhost:4000`.


### The 10% override principle
Most sites should need only minimal overrides. A typical site might have one CSS file that defines colors, adjusts spacing, and adds personality:

```css
/* acme.org/acme.css */
:root {
  --primary: #2563eb;
  --accent: #f59e0b;
}

header {
  background: var(--primary);
}
```

If a site needs more than 10% custom code, either the foundation is missing essential patterns or the site is genuinely unique. The goal is maximum reuse with targeted overrides.


### Testing inheritance
Add content and verify the site inherits properly:

- Navigation should work
- Typography should look right
- Layout patterns should apply

If something doesn't work, check:

1. The `extend` array in `site.yaml`
2. File paths match what you expect
3. You're running `nue` from the project root


## Content inheritance
Content files (`.md`) inherit just like everything else. The same `@base` content renders through each site's design lens. Visit `acme.org.localhost:4000/blog/` and `beta.com.localhost:4000/blog/` to see identical content with different styling.

This is useful for:

- Previewing how content looks across different designs
- Sharing documentation or legal pages across sites
- Testing design changes against real content

When building for production, local content takes precedence. If `acme.org/blog/` has its own posts, the `@base/blog/` posts aren't built for that site. But if a site has no local content in a directory, all base content gets built.


## Beyond content sites
The same inheritance model works for single-page applications. An app can extend multiple base directories:

```yaml
# dashboard.app/site.yaml
extend: [@base, baseapp]
```

Here `@base` provides global chrome (header, footer, design tokens) while `baseapp` provides app-specific components, state management, and structural CSS. The dashboard inherits from both and adds only its visual identity.

This pattern scales to multiple base apps:

```
@base/        → global foundation
basecrm/      → CRM components and patterns
baseshop/     → e-commerce components and patterns
```

Then variations branch from each:

```yaml
# startup.crm/site.yaml
extend: [@base, basecrm]

# fashion.shop/site.yaml
extend: [@base, baseshop]
```

See [Building single-page apps](/docs/single-page-apps) for the complete guide.


## Next steps
Your foundation is ready. See [Setting up page layout](/docs/page-layout) for creating layout modules and [Adding interactivity](/docs/interactivity) for progressive enhancement patterns.

