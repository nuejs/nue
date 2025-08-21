# Project structure

Nue projects are just files and folders. No special directories, no build configurations, no framework scaffolding. Your file structure becomes your website structure.

## How it works

Files map directly to URLs:

```
index.html          → /
about.html          → /about
blog/index.html     → /blog/
blog/first-post.md  → /blog/first-post/
```

Any HTML or Markdown file becomes a page. CSS files become stylesheets. Everything else passes through unchanged.

## Minimal project

```bash
nue create minimal
```

Creates:

```
├── index.css
└── index.html
```

A single-page site. The HTML becomes your homepage, the CSS styles it. Perfect for landing pages, portfolios, or simple static sites.

## Blog

```bash
nue create blog
```
Creates:

```
├── site.yaml
├── layout.html       # global header and footer
├── index.css
├── index.md
└── posts/
    ├── header.html   # page header aka. "hero" layout
    ├── css-is-awesome.md
    ├── design-systems.md
    └── fast.md
```

A content-focused site with shared layouts and automatic post collections. The `layout.html` provides common structure, while `posts/` contains your Markdown content. The `site.yaml` configures collections and metadata.


## Single-page application

```bash
nue create spa
```

Creates:

```
├── css/
│   ├── spa.css
│   └── status.css
├── index.html
├── server/
│   ├── index.js
│   └── users.json
├── site.yaml
└── ui/
    └── users.html
```

A client-side application with separate CSS, UI components, and a CloudFlare-compatible backend. The `index.html` controls routing and state, while `ui/` contains individual page components. The `server/users.json` acts as a KV datastore, and `server/index.js` uses Hono for seamless CloudFlare deployment.

## Full application

```bash
nue create full
```

The serious template. Shows how to build maintainable, scalable architectures using Nue's separation of concerns:

```
├── @system/           # centralized system
├── app/               # application pages
├── blog/              # content areas
├── contact/
├── docs/
├── img/
├── login/
├── index.md
├── 404.md
└── site.yaml
```

## System architecture

The `@system/` folder is standardized across all larger Nue projects:

```
@system/
├── app/               # client model/logic (can be folder for complex models)
├── design/            # CSS design system
│   ├── base.css
│   ├── button.css
│   ├── content.css
│   ├── dialog.css
│   └── ...
├── layout/            # server templates
│   ├── components.html
│   ├── footer.html
│   └── header.html
├── server/            # server (Hono-based, CloudFlare compatible)
│   ├── db/
│   ├── index.js
│   ├── model/
│   └── test/
├── ui/                # reusable dynamic components (keyboard.js, tooltips.js)
└── data/              # SSR content
```

This creates true separation of concerns:

**Design lives in one place** - The `design/` folder contains your entire design system. Change a color variable, update the whole site.

**Logic stays separate** - Client logic in `app.js`, server logic in `server/`, no mixing.

**Content is pure** - Markdown files with no embedded styles or JavaScript.

**Layouts are reusable** - Shared templates in `layout/` that any app can use.

## Application areas

Apps become lean and focused:

```
app/                   # main application (SPA)
├── app.yaml           # app-specific config
├── index.html         # handles all /app/* routes
└── ui/
    ├── contact.html
    ├── contacts.html
    └── shared.html

blog/                  # content area
├── *.md               # Nuemark syntax

docs/                  # documentation
├── *.md

admin/                 # separate SPA
├── index.html         # handles all /admin/* routes
└── ui/

svg/                   # graphics
├── *.html             # Nue templates for SVG
├── *.svg              # processed via svg/app.yaml
└── app.yaml           # SVG processing config
```

## Development workflow

With this structure, development becomes assembly:

**Content creators** work in `.md` files using Nuemark syntax
**Developers** focus on structure in `.html` files
**Designers** control everything through the design system
**Nobody steps on each other**

The design system ensures consistency across all areas. Whether someone is building the main app, writing blog posts, or creating admin interfaces, everything follows the same visual language automatically.

## File types

**`.html`** - Pages, components, and layouts
**`.md`** - Content using Nuemark syntax
**`.css`** - Stylesheets (loaded automatically)
**`.js`** - Client-side JavaScript
**`.ts`** - TypeScript (transpiled to JavaScript)
**`.svg`** - Graphics (processed via app.yaml config)
**`.yaml`** - Configuration and data
**`404.md`** or **`404.html`** - Custom error pages

## Routing

Nue uses file-based routing with SPA support:

```
index.html             → /
about.md               → /about/
contact/index.md       → /contact/
contact/thanks.md      → /contact/thanks/
app/index.html         → /app/ (handles all /app/* routes)
admin/index.html       → /admin/ (handles all /admin/* routes)
404.md                 → custom error page
```

SPA roots (like `app/index.html`) automatically handle all sub-routes within their directory. Routes like `/app/users` or `/app/customers/10` are handled by the `app/index.html` file.

## Configuration cascade

Configuration follows a hierarchy:

1. **`site.yaml`** - Global settings
2. **`app/app.yaml`** - App-specific overrides
3. **Front matter** - Page-specific overrides

This lets you set defaults globally while customizing specific areas or pages as needed.

