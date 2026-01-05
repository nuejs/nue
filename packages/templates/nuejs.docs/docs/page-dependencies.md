
# Page dependencies
Page dependencies are the CSS, JavaScript, HTML components, and data files that each page needs to render and function. Nue automatically discovers and includes these files based on directory location and inheritance chain.


### Asset types
Nue scans for these file types:

**CSS files (.css)** - Styling that gets injected into the page head. Files load in order of specificity, from global foundation to page-specific overrides.

**JavaScript files (.js, .ts)** - Scripts that enhance behavior. Global scripts run on every page. Application scripts run only within their directory tree.

**HTML files (.html)** - Component libraries and layout modules

**Data files (.yaml, .json)** - Template data that becomes available to layout modules, components, and Markdown expressions.

When Nue builds a page, it scans the project structure and includes every relevant file automatically. You don't import dependencies manually. The directory structure and inheritance chain determine what each page receives.


## Single-site dependency discovery
In single-site projects, Nue scans three levels to find dependencies:

### Root level
Assets that apply to every page across the site:

```
global.css          # Site-wide styles
app.js              # Global JavaScript
layout.html         # Layout modules
site.yaml           # Site configuration and data
```

These files load on every page. They establish your site's foundation.

### Application level
Assets that apply only to pages within a specific directory:

```
blog/
├── blog.css        # Only loads on blog pages
├── layout.html     # Blog-specific layout modules
├── app.yaml        # Blog configuration and data
└── posts/
    └── first.md

docs/
├── docs.css        # Only loads on docs pages
├── components.html # Documentation-specific components
└── guide.md
```

When a user visits `/blog/posts/first`, Nue includes both root-level assets and `blog/` directory assets. The application directory acts as a namespace for related pages.

### Page level
Assets in the same directory as the page itself:

```
blog/css-is-awesome/
├── index.md        # The page
├── effects.css     # Only loads on this page
├── demo.html       # Page-specific components
└── data.yaml       # Page-specific data
```

Most pages use root and application assets. But when a page needs dedicated components or styling, this pattern keeps those assets isolated. Page-specific directories shoudl be avoided because page-level inheritance (reuse) is rare.


## Multi-site dependency discovery
In multi-site projects, dependencies cascade through the inheritance chain. When Nue needs a file, it scans backwards from the site through each extended layer until it finds a match.


### The inheritance chain
Sites declare what they extend in `site.yaml`:

```yaml
# acme.com/site.yaml
extend: [@base]
```

This creates a chain: `@base` → `acme.com`

For a page at `acme.com/blog/post.md`, Nue searches for dependencies in this order:

1. `acme.com/blog/` - Application level in the site
2. `acme.com/` - Root level in the site
3. `@base/blog/` - Application level in base
4. `@base/` - Root level in base
5. `@base/@shared/design/` - Shared design system
6. `@base/@shared/data/` - Shared data

The first match wins. If `acme.com/blog/blog.css` exists, Nue uses it and stops scanning. If not, it checks `@base/blog/blog.css`. This lets sites inherit the complete foundation and override only what makes them unique.

### Multiple inheritance layers
Chains can extend through multiple layers:

```yaml
# beta.org/site.yaml
extend: [@base, startup]
```

This creates: `@base` → `startup` → `beta.org`

Now dependency discovery scans:

1. `beta.org/blog/` - Site application
2. `beta.org/` - Site root
3. `startup/blog/` - Template application
4. `startup/` - Template root
5. `@base/blog/` - Base application
6. `@base/` - Base root
7. `@base/@shared/design/` - Shared design
8. `@base/@shared/data/` - Shared data

Each layer can override any file from layers below it. The site overrides the template. The template overrides the base. More specific layers take precedence.

### Shared directories
The `@shared` directory at the base level provides assets that all sites inherit automatically:

```
@base/
├── @shared/
│   ├── design/      # CSS that loads on every page
│   └── data/        # YAML/JSON available to all templates
├── blog/
│   ├── blog.css
│   └── layout.html
└── site.yaml
```

Assets in `@shared/design/` load before root-level assets, establishing the foundation. Every site that extends `@base` gets these files automatically. Sites can override individual files by creating matching paths in their own directory.

The `@shared/data/` directory works the same way for template data. Global team members, product catalogs, or configuration values that all sites need.


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

This separates landing page assets from truly global assets. The hero component and home page styling don't need to load on blog or documentation pages. They're specific to the home page but shared across all sites in the inheritance chain.


## Include and exclude
Control which assets load using `include` and `exclude` in `site.yaml`:

```yaml
# @base/site.yaml
include: [charts, effects/parallax]
exclude: [syntax-highlighting]
```

Patterns match fuzzily. `effects/parallax` would include both `effects/parallax.html` and `effects/parallax.css`. The `charts` pattern includes any file path containing "charts".

### Application overrides
Applications can define their own includes and excludes in `app.yaml`:

```yaml
# @base/blog/app.yaml
include: [syntax-highlighting]
exclude: [charts]
```

This adds to the site-level configuration. If the site includes `effects` and the blog includes `syntax-highlighting`, blog pages get both.

### Inheritance chain expansion
In multi-site setups, include and exclude arrays expand through the inheritance chain:

```yaml
# @base/site.yaml
include: [charts]

# startup/site.yaml
include: [effects]

# acme.com/site.yaml
include: [animations]
```

Pages at `acme.com` get all three: charts, effects, and animations. Each layer adds to the includes from layers below it. The same applies to exclude arrays.

This lets you define global includes at the base level, add template-specific includes in the middle layer, and add site-specific includes at the top. Everything combines.


## Single-page applications
SPA root files automatically include all assets from their directory tree:

```
app/
├── index.html      # SPA root
├── app.js          # Included
├── app.css         # Included
└── components/
    ├── user.html   # Included
    └── form.html   # Included
```

This ensures SPAs have access to all their components and utilities without explicit configuration. The entire application directory becomes a single dependency scope.


## Dependency order
Dependencies load in this sequence:

1. **Shared design** - `@base/@shared/design/` assets establish the foundation
2. **Base root** - `@base/` root-level assets
3. **Template root** - Middle inheritance layers
4. **Site root** - Top-level site assets
5. **Application** - Directory-specific assets for the current page
6. **Page** - Same-directory assets for the current page

CSS files load in this order so more specific styles can override general ones. JavaScript files load in this order so global utilities are available to application scripts. Components load in this order so sites can override base components.

Within each level, files load alphabetically. Use CSS layers to control styling precedence when load order matters.


