
# Configuration
Nue configuration lives in `site.yaml` at your project root.


## Dev server
Configure the local development environment port:

```yaml
# Development server port (default: 4000)
port: 8080
```

Override the port from command line:
```bash
nue --port 9090
```

## Site settings
Global site behavior:

```yaml
site:
  # Enable view transitions between pages (default: false)
  view_transitions: true
```

## Content processing
Control how Markdown content is processed:

```yaml
content:
  # Add IDs to headings for linking (default: false)
  heading_ids: false

  # Auto-wrap content in sections (default: false)
  sections: true

  # Assign class names to auto-generated sections
  sections: [hero, features, testimonials]

  # Wrap section content with inner div for layout control
  section_wrapper: wrap
```

See [Nuemark syntax](nuemark-syntax) for details on sections.


## Import map

Extend the client-side import map with custom modules:

```yaml
import_map:
  app: /@system/app/index.js
  d3: /lib/d3.js
```

This lets you import modules by name instead of path:

```javascript
import { login } from 'app'
import * as d3 from 'd3'
```


# Server configuration
Custom server/backend configuration options:

```yaml
server:
  # Server code directory (default: @system/server)
  dir: @system/server

  # Local SQL database, D1 compatible (relative to server dir)
  db: db/app.db

  # Key-value store, CloudFlare KV compatible (relative to server dir)
  kv: db/kv.db

  # Auto-reload server on changes (default: true)
  reload: true
```

See [Backend development](/docs/backend-development) for usage.


## Collections
Define content collections for blogs, documentation, or any grouped content:

```yaml
collections:

  # Collection name becomes variable
  blog:
    # Files to include (glob patterns: * = any, ** = any depth)
    match: [posts/*.md]

    # Sort by front matter field
    sort: date desc

  docs:
    match: [docs/**/*.md]
    sort: order asc

  team:
    match: [team/*.md]
    sort: name asc
```

Collections become accessible in templates:

```html
<article :each="post in blog">
  <h2>{ post.title }</h2>
  <time>{ post.date }</time>
</article>
```


### Sort options
- Any front matter field (`date`, `title`, `order`, etc.)
- Direction: `asc` or `desc`


## Design system
Enforce design system constraints:

```yaml
design:
  # Enforce central design system (default: false)
  strict: true

  # Base stylesheet loaded first
  base: base.css

  # Exclude patterns from auto-loading
  exclude: [table, syntax]

  # Limit class names per element (prevent utility class abuse)
  max_class_names: 3

  # inline all css in production build
  inline_css: true
```

See [Design systems](design-systems) for philosophy and [CSS development](css-development) for usage.

## SVG processing
Generate dynamic SVGs with Nue templates. Configure per directory via `app.yaml`:

```yaml
# svg/app.yaml
svg:
  # Process .svg files as Nue templates (default: false)
  process: true

  # Embed fonts directly in SVG output
  fonts:
    Inter: @system/design/inter.woff2
    Mono: @system/design/mono.woff2
```

When enabled, `.svg` files can use Nue syntax for dynamic graphics. See [SVG development](/docs/svg-development) for usage.


## Metadata
Configure HTML meta tags and SEO:

```yaml
meta:
  # Page title
  title: The UNIX of the web

  # Meta description
  description: Standards-first web framework

  # Favicon path
  favicon: /img/logo.svg

  # Title template for non-home pages
  # %s is replaced with page title
  title_template: "%s / Acme Inc"

  # Open Graph image (social media previews)
  og_image: /img/social-preview.png

  # Origin for absolute URLs (production only)
  origin: https://example.com

  # Viewport settings (default shown)
  viewport: width=device-width,initial-scale=1

  # Article publish date (for blog posts)
  pubDate: 2024-01-15

  # Theme color for mobile browsers
  theme_color: "#0066cc"

  # Author meta tag
  author: Jane Doe

  # Search engine directives
  robots: index, follow
```

### Aliases
Nue recognizes common metadata aliases:

- `desc` → `description`
- `og` → `og_image`
- `date` → `pubDate`


### Overrides
Configuration follows a cascade: global settings in `site.yaml` can be overridden by app-level settings in subdirectories (like `blog/app.yaml`), which can be overridden by page-level front matter. All overrides happen with root-level property names:


```yaml
 ---
 title: Custom Page Title
 description: Overrides global description
 og_image: /img/page-specific.png
 ---
```

Outside metadata, the following properties can be overriden with root level property name in both app-level and front matter:

```
# content.heading_ids in site.yaml
heading_ids: true

# content.sections in site.yaml
sections: [ hero, features, manifesto ]

# design.exclude in site.yaml
exclude: [ syntax, typography ]
```

