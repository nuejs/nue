
# Configuration
Nue uses a three-tier configuration system. Site-wide settings in `site.yaml` provide defaults, app-level `app.yaml` files customize sections, and page front matter gives final control. The settings cascade: deeper level settings override parent settings.


## Configuration levels

### Site-wide settings (`site.yaml`)
Global configuration that affects the entire build:

```yaml
# Development server port (default: 4000)
# Override in command line: nue --port 9090
port: 8080

# Global site behavior. Cannot be overridden
site:
  # Enable view transitions between pages (default: false)
  view_transitions: true

  # Generate sitemap.xml automatically for SEO
  sitemap: true

  # Skip files/directories from processing
  # Appends to:
  #  node_modules package.json lock.yaml README.md Makefile .toml .rs .lock .lockb
  skip: [test/, @plans/]

# Design system settings. Cannot be overridden.
design:

  # Enforce central design system (default: false)
  central: true

  # Base stylesheet loaded first
  base: base.css

  # Limit class names per element (prevent utility abuse)
  max_class_names: 3

  # Inline all CSS in production builds
  inline_css: true


# Server infrastructure - cannot be overridden
server:
  # Server code directory (default: @system/server)
  dir: @system/server

  # SQL database file (relative to server dir)
  db: db/app.db

  # Key-value store data file (relative to server dir)
  kv: db/kv.json

  # Auto-reload server on changes during development
  reload: true


# Site-wide collections. Can be extended at app level
collections:

  # Collection name becomes variable for .html templates
  blog:
    # .md files to include (substring match)
    include: [posts/]

    # Required front matter fields
    require: [date]

    # Exclude if these fields exist
    skip: [draft]

    # Sort by front matter field and direction
    sort: date desc

    # Generate RSS feed
    rss: true

  team:
    include: [team/]
    require: [ role, email ]
    sort: name asc

# Client-side import-map. Can be overridden at app level.
import_map:
  app: /@system/app/index.js
  d3: /lib/d3.js


# Content processing defaults. Can be overridden
content:
  # Add IDs to headings for linking (default: false)
  heading_ids: true

  # Auto-wrap content in sections (default: false)
  sections: true

  # Assign class names to auto-generated sections
  sections: [hero, features, testimonials]

  # Wrap section content with inner div for layout control (default: null)
  section_wrapper: wrap


# Default metadata for all pages. Can be overridden
meta:
  # Default page title
  title: The UNIX of the web

  # Title template for non-home pages (%s replaced with title)
  title_template: "%s / Acme Inc (DEV)"

  # Default meta description
  description: Standards-first web framework

  # Favicon path
  favicon: /img/logo.svg

  # Open Graph image for social media previews
  og_image: /img/social.png

  # Site origin for absolute URLs (production only)
  origin: https://example.com

  # Viewport meta tag
  viewport: width=device-width,initial-scale=1

  # Default publish date. Usually set in front matter only
  pubDate: null

  # Theme color for mobile browsers
  theme_color: "#0066cc"

  # Default author
  author: Jane Doe

  # Search engine directives
  robots: index, follow

  # For absolute URLs in sitempa, RSS, and OG metadata (default: empty)
  origin:


# Metadata overrides in production builds
production:

  # The must-have production override
  origin: https://acme.com

  # If you have something different on localhost
  title_template: "%s / Acme Inc"


# Global asset loading settings on root level. Can be overridden

# Exclude files by name or pattern (fuzzy matching)
exclude: [ui/, syntax.css]

# Force include specific files despite exclusions
include: [ui/apps.css]
```

See [page dependencies](page-dependencies) for include/exclude details.


### Aliases
Nue recognizes common metadata aliases:

- `desc` → `description`
- `og` → `og_image`
- `date` → `pubDate`



### App-level overrides (`app.yaml`)
Directory-specific settings using nested namespaces. Can override site defaults or extend collections:

```yaml
# blog/app.yaml (for example)

# Metadata overrides
meta:
  # Override site title for the blog
  title: Blog Title

  # Override site author
  author: Blog Author

# Content processing overrides
content:
  sections: false


# Additional collections to site collections
collections:

  # Adds to existing site collections
  featured:
    include: [featured/]
    skip: [ todo ]
    sort: date desc

# Asset loading overrides: replaces site settings for this app

# Force include specific files
include: [blog-specific.css]

# Exclude unwanted files
exclude: [admin-ui.css]
```

### SVG processing (`app.yaml`)
Enable [SVG development](/docs/svg-development) in specific directories. This is an application-only setting in `app.yaml`:

```
# visuals/app.yaml (for example)
svg:
  # Process .svg files as Nue templates
  process: true

  # Embed fonts directly in SVG output
  fonts:
    Inter: @system/design/inter.woff2
```


### Page-level overrides (.md file front matter)
Individual page settings using flat properties. Highest priority, overrides both site and app settings:

```yaml
---
# Metadata using flat syntax (overrides site.meta and app.meta)

# Page-specific title
title: Page Title

# Page-specific description
description: Page description

# Page-specific social image
og_image: /img/page-specific.png

# Content settings using flat syntax (overrides site.content and app.content)
sections: [hero, features]

# Asset loading overrides
include: [special.css]
---
```


