# Page dependencies
Page dependencies are the CSS, JavaScript, HTML components, and data files that each page needs to render and function. Nue automatically discovers and includes these files based on directory location, inheritance chain, and the `include` configuration.


## Asset types
Nue scans for these file types:

**CSS files (.css)** - Styling that gets injected into the page head. Files load in order of specificity, from global foundation to page-specific overrides.

**JavaScript files (.js, .ts)** - Scripts that enhance behavior. Global scripts run on every page. Application scripts run only within their directory tree.

**HTML files (.html)** - Component libraries and layout modules.

**Data files (.yaml, .json)** - Template data that becomes available to layout modules, components, and Markdown expressions.

When Nue builds a page, it scans the project structure and includes every relevant file automatically. You don't import dependencies manually. The directory structure, inheritance chain, and `include` directive determine what each page receives.


## Single-site dependency discovery
In single-site projects, Nue scans three levels to find dependencies:

### Root level
Assets that apply to every page across the site:

```
global.css          # site-wide styles
app.js              # global JavaScript
layout.html         # layout modules
site.yaml           # site configuration and data
```

These files load on every page. They establish your site's foundation.

### Application level
Assets that apply only to pages within a specific directory:

```
blog/
├── blog.css        # only loads on blog pages
├── layout.html     # blog-specific layout modules
├── app.yaml        # blog configuration and data
└── posts/
    └── first.md

docs/
├── docs.css        # only loads on docs pages
├── components.html # documentation-specific components
└── guide.md
```

When a user visits `/blog/posts/first`, Nue includes both root-level assets and `blog/` directory assets. The application directory acts as a namespace for related pages.

### Page level
Assets in the same directory as the page itself:

```
blog/css-is-awesome/
├── index.md        # the page
├── effects.css     # only loads on this page
├── demo.html       # page-specific components
└── data.yaml       # page-specific data
```

Most pages use root and application assets. Page-specific directories should be avoided because page-level inheritance (reuse) is rare.


## Multi-site dependency discovery
In multi-site projects, dependencies cascade through the inheritance chain. When Nue needs a file, it scans backwards from the site through each extended layer until it finds a match.


### The inheritance chain
Sites declare what they extend in `site.yaml`:

```yaml
# acme.org/site.yaml
extend: [@base]
```

This creates a chain: `@base` → `acme.org`

For a page at `acme.org/blog/post.md`, Nue searches for dependencies in this order:

1. `acme.org/blog/` - application level in the site
2. `acme.org/` - root level in the site
3. `@base/blog/` - application level in base
4. `@base/` - root level in base

The first match wins. If `acme.org/blog/blog.css` exists, Nue uses it and stops scanning. If not, it checks `@base/blog/blog.css`. This lets sites inherit the complete foundation and override only what makes them unique.

### Multiple inheritance layers
Chains can extend through multiple layers:

```yaml
# beta.org/site.yaml
extend: [@base, startup]
```

This creates: `@base` → `startup` → `beta.org`

Now dependency discovery scans:

1. `beta.org/blog/` - site application
2. `beta.org/` - site root
3. `startup/blog/` - template application
4. `startup/` - template root
5. `@base/blog/` - base application
6. `@base/` - base root

Each layer can override any file from layers below it. The site overrides the template. The template overrides the base. More specific layers take precedence.


## Include and exclude
The `include` directive controls which folders load globally across all pages:

```yaml
# @base/site.yaml
include: [@design, @data]
```

This makes every file in `@design/` and `@data/` load on every page. The folder names are conventions - you could name them `styles/` and `content/` instead.

The `include` directive matches any file or folder anywhere in the inheritance chain. It searches through `@base`, any intermediate layers, and the current site.

### Selective includes
Include specific files or subdirectories:

```yaml
include: [@design, @lib/syntax.css, @lib/charts]
```

Patterns match fuzzily. `@lib/charts` includes both `@lib/charts.html` and `@lib/charts.css` if they exist, or everything in `@lib/charts/` if it's a directory.

### Excluding items
Sites can exclude specific items they don't need:

```yaml
# acme.org/site.yaml
extend: [@base]
exclude: [@design/components.css]
```

### Application includes
Applications can define their own includes in `app.yaml`:

```yaml
# @base/blog/app.yaml
include: [@lib/syntax.css]
```

This adds to the site-level configuration. If the site includes `@design` and the blog includes `@lib/syntax.css`, blog pages get both.

### Inheritance chain expansion
In multi-site setups, include and exclude arrays expand through the inheritance chain:

```yaml
# @base/site.yaml
include: [@design]

# startup/site.yaml
include: [effects]

# acme.org/site.yaml
include: [animations]
```

Pages at `acme.org` get all three: `@design`, `effects`, and `animations`. Each layer adds to the includes from layers below it. The same applies to exclude arrays.


## The home directory
Root-level `index.md` pages automatically include assets from a `home/` directory:

```
@base/
├── home/
│   ├── hero.html
│   └── home.css
├── blog/
├── docs/
└── index.md
```

This separates landing page assets from truly global assets. The hero component and home page styling don't load on blog or documentation pages. They're specific to the home page but shared across all sites in the inheritance chain.

## Dependency order
Dependencies load in this sequence:

1. **Included folders** - Assets from `include` directive load first
2. **Base root** - `@base/` root-level assets
3. **Template root** - Middle inheritance layers
4. **Site root** - Top-level site assets
5. **Application** - Directory-specific assets for the current page
6. **Page** - Same-directory assets for the current page

CSS files load in this order so more specific styles can override general ones. JavaScript files load in this order so global utilities are available to application scripts. Components load in this order so sites can override base components.

Within each level, files load alphabetically. Use CSS layers to control styling precedence independent of load order.

