
# Content authoring: Structured data
Sophisticated websites need more than content and layout modules—they require structured data to define organization, enrich content, and drive functionality. Nue uses clean YAML files to keep this data separate from content and presentation, powering your site with clarity and flexibility.

## Types of data
Nue organizes data into three key types, each serving a distinct purpose in your website.

### Information architecture
This data outlines your site’s structure—navigation, hierarchies, and connections. Define it in YAML, like in `site.yaml`:

```yaml
documentation:
  Getting started:
    - Why Nue: /docs/
    - Installation: /docs/installation.html
  Building sites:
    - Content: /docs/content-authoring.html
    - Data: /docs/data.html
```

This hierarchy shapes navigation menus or sidebars directly, no extra coding needed.

### Content metadata
Metadata adds context to your content—titles, dates, SEO fields. It’s typically set in a page’s front matter:

```yaml
# blog/post.md
---
title: "Building a Design System"
description: "A systematic approach to mathematical design"
author: "John Doe"
date: 2024-01-15
og_image: "/images/design-system.jpg"
---
```

This keeps content files clean while feeding layouts and search engines.

### Application data
Application-specific data supports functionality—think product details or team info. Store it in a separate YAML file, like `team.yaml`:

```yaml
team:
  - name: Sarah Chen
    role: Design Engineer
    bio: "Focused on mathematical design systems"
    twitter: "@sarahchen"
  - name: James Smith
    role: Frontend Architect
    bio: "Standards-first development advocate"
    twitter: "@jamessmith"
```

Use this data in templates or islands wherever it’s needed.

## Data inheritance
Nue’s data flows through three levels—global, application, and page—ensuring consistency with room for overrides.

### Global data
Set site-wide defaults in `site.yaml`:

```yaml
title_template: "%s / Nue Framework"
description: "The standards-first web framework"
author: "Tero Piirainen"
og_image: "/images/nue-og.jpg"
```

### Application data
Override globals for specific areas in files like `blog.yaml`:

```yaml
title: "Blog"
title_template: "%s / Blog"
description: "Latest writings about standards-first development"
og_image: "/images/blog-og.jpg"
```

### Page data
Fine-tune individual pages in front matter:

```md
# blog/design-system.md
---
title: "Mathematical Design Systems"
description: "Creating interfaces through calculated precision"
og_image: "/images/math-design.jpg"
---
```

Data cascades from global to page, balancing uniformity and control.

## Why YAML?
Nue picks YAML for its readability and natural fit with content hierarchies. Compare this:

```yaml
Building websites:
  - Step-by-step tutorial: tutorial.html
  - Content: content-authoring.html
```

To JSON’s noisier equivalent:

```json
{
  "Building websites": [
    {"Step-by-step tutorial": "tutorial.html"},
    {"Content": "content-authoring.html"}
  ]
}
```

YAML’s simplicity shines for content-driven data, avoiding the complexity of JavaScript state or typed systems when it’s not needed.
