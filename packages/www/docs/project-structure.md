
# Project structure
Nue projects use a file-based routing system where your directory structure maps directly to your website's URLs. Understanding how Nue organizes files helps you build maintainable sites that scale from simple pages to complex applications.


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

A single HTML file and stylesheet - no configuration, no scaffolding, no setup ceremony. Just open `index.html` in a browser and you have a working site. This demonstrates Nue's zero-friction approach: your project structure is your site structure.


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
    ├── first.md
    └── second.md
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



## Larger projects

```bash
nue create full
```

For serious applications, the `@shared/` directory separates your application's foundation from individual apps. This division enables application "assembly" - apps focus purely on structure (HTML/Markdown) while the system handles all other concerns:

```
├── @shared/           # centralized system
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

### System directories

These directories have fixed names and special behavior:

```
@shared/
├── design/           # CSS design system (auto-loaded client-side)
├── ui/               # UI components. On server & Client. (auto-loaded client-side)
├── data/             # YAML data for HTML templates (server-side processing)
└── server/           # Backend code (not frontend assets)
```

### Recommended directories
These client-side directories follow naming conventions but aren't hardcoded:

```
@shared/
├── lib/              # Third-party libraries to import
└── app/              # Business logic / data models (imported)
```

It's recommended to add these to import map in site.yaml. For example:

```yaml
# In site.yaml
import_map:
  app: /@shared/app/index.js
  lib: /@shared/lib/
```

This enables clean imports on your frontend code:

```javascript
import { login } from 'app'           // @shared/app/index.js
import * as d3 from 'lib/d3'          // @shared/lib/d3.js
```

With the system layer handling design, behavior, and logic, application development can focus solely on content and structure. Your system remains simple as your website/business grows.


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
File names determine routing:

```
index.html             → /
about.md               → /about/
contact/index.md       → /contact/
contact/thanks.md      → /contact/thanks
app/index.html         → /app/ (handles all /app/* routes)
admin/index.html       → /admin/ (handles all /admin/* routes)
404.md                 → custom error page
```

See [page dependencies](page-dependencies) for details


