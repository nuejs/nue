
# Configuration
Nue uses a three-tier configuration system. Site-wide settings in `site.yaml` provide defaults, app-level `app.yaml` files customize sections, and page front matter gives final control. The settings cascade: deeper level settings override parent settings.


## Site-wide settings
Global configuration in `site.yaml` that affects the entire site:

```yaml
# Development server port (default: 4000)
# Override in command line: nue --port 9090
port: 8080

# Global site behavior (site.yaml only)
site:

  # Origin URL for sitemap.xml and RSS feed
  origin: https://example.com

  # Enable view transitions between pages (default = false)
  view_transitions: true

  # Skip files/directories from processing
  # Appends to:
  #  node_modules package.json lock.yaml README.md Makefile .toml .rs .lock .lockb
  skip: [test/, @plans/]


# Design system settings (site.yaml only)
design:

  # Configure CSS @layer cascade order (added to head with style tag)
  layers: [ settings, elements, components ]

  # Limit class names per element to prevent utility abuse. Default 3.
  max_class_names: 3

  # Inline all CSS in production builds
  inline_css: true


# Server infrastructure (site.yaml only)
server:
  # Server code directory (default: @shared/server)
  dir: @shared/server

  # Auto-reload server on changes during development
  reload: true


# Alternatively: use a reverse proxy
server:

  # Point to your existing backend server
  url: http://localhost:5000

  # Which routes get forwarded to that server
  routes: [/api/, /private/]


# Site-wide collections (app.yaml can extend)
collections:

  # Collection name becomes variable for .html templates
  blog:
    # .md files to include (substring match)
    include: [posts/]

    # Required front matter fields
    require: [date]

    # Required tags property to include "design"
    tags: [ design ]

    # Exclude if these fields exist
    skip: [draft]

    # Sort by front matter field and direction
    sort: date desc

  team:
    include: [team/]
    require: [ role, email ]
    sort: name asc


# Sitemap generation (site.yaml only)
sitemap:
  # Generate sitemap.xml for search engines (default: false)
  enabled: true

  # Skip pages with these front matter fields
  skip: [draft, private]


# RSS feed generation (site.yaml only)
rss:
  # Generate /feed.xml with auto-discovery link tag (default: false)
  enabled: true

  # Use this collection for feed content
  collection: blog

  # Feed metadata displayed in RSS readers
  title: Acme developer blog
  description: Latest news on web technologies


# Client-side import-map. (app.yaml can override)
import_map:
  app: /@shared/app/index.js
  d3: /lib/d3.js


# Content processing defaults. (app.yaml can override)
content:
  # Add IDs to headings for linking (default: false)
  heading_ids: true

  # Auto-wrap content in sections (default: false)
  sections: true

  # Assign class names to auto-generated sections
  sections: [hero, features, testimonials]

  # Wrap section content with inner div for layout control (default: null)
  section_wrapper: wrap


# Default metadata for all pages. (app.yaml and front matter can override)
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

  # Viewport meta tag
  viewport: width=device-width,initial-scale=1

  # HTML lang attribute
  language: en-US

  # HTML dir attribute
  direction: <empty>

  # <body> class name attribute (for app/page specific styling)
  class: <empty>

  # Default publish date. Usually set in front matter only
  pubDate: null

  # Theme color for mobile browsers
  theme_color: "#0066cc"

  # Default author
  author: Jane Doe

  # Search engine directives
  robots: index, follow

# Global link definitions for Nuemark pages
links:
  # Example: See [dev branch][dev] on Github
  dev: //github.com/nuejs/nue/tree/dev/packages
  css_vars: //developer.mozilla.org/en-US/docs/Web/CSS/var


# Production overrides for metadata
production:

  # metadata override
  title_template: "%s / Acme Inc"

  # any value here overrides development data
  analytics_id: GA-PROD-789012
```

See [template data](template-data) for details.


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
---
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
    Inter: @shared/design/inter.woff2
```

