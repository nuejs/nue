
# Data in Nue

Content and presentation alone aren't enough to build sophisticated websites. The third essential element is structured data: the information that defines your site's organization, enriches your content, and powers dynamic features. By keeping data separate and clean, we enable:

1. Clean information architecture. Your site structure lives in simple YAML files.

2. Content enrichment. Metadata and relationships enhance content without cluttering it.

3. True separation of state. Application data remains isolated from content and presentation.

4. Natural inheritance patterns. Data flows logically from global settings to specific pages.

5. Automated organization. Content collections and relationships emerge from clean structures.

Instead of mixing data into JavaScript state management or framework-specific stores, Nue uses a straightforward YAML-based system that keeps data clear and accessible.


# Types of data

At its core, Nue handles three distinct types of structured data that power your website's organization and functionality:

## Information architecture

Information architecture defines how content is organized and connected across your site. This includes navigation structures, content hierarchies, and relationships between different sections. Think of it as the blueprint that determines how users move through your content.

The structure is elegantly defined in YAML:

```yaml
documentation:
  Getting started:
    - Why Nue: /docs/
    - Installation: /docs/installation.html
  Building sites:
    - Content: /docs/content.html
    - Data: /docs/data.html
```

This clean hierarchy translates directly into navigation elements, sidebars, and breadcrumbs without additional complexity.

Yes, you're absolutely right. Content collections are more of a bridge between data and content - they're essentially an automated way to aggregate and organize content pieces. They deserve their own focused section later in the documentation.

Here's how I'd enhance the examples for the other data types:

## Content metadata
Metadata provides essential context about your content pieces. This includes:

- Titles and descriptions
- Authors and publication dates
- SEO properties
- Open Graph data
- Custom fields specific to your needs

```yaml
# In a blog post's front matter
title: "Building a Design System"
description: "A systematic approach to mathematical design"
author: "John Doe"
date: 2024-01-15
og_image: "/images/design-system.jpg"
category: "Design Engineering"
```

## Application data
Application data covers the specific information your site needs to function:

- Product information
- Team member details
- Configuration settings
- Language tokens
- Dynamic content collections

```yaml
# team.yaml
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

This separation ensures your application logic remains focused on functionality while content stays clean and accessible. You define the data once, then use it consistently across your site wherever needed.


### Why YAML?

YAML strikes the perfect balance between human readability and structural power. While TypeScript enthusiasts might argue for JSON with type definitions, YAML's clarity makes it the superior choice for content-oriented data:

```yaml
Building websites:
  - Step-by-step tutorial: tutorial.html
  - Project structure: project-structure.html
  - Content: content.html
```

The same structure in JSON or TypeScript would require more syntactic noise while offering no real benefits for content data. YAML's native support for deep hierarchies matches how we naturally think about content organization. And for those concerned about YAML's historical quirks (like the infamous "Norway problem"), modern YAML parsers have long since resolved these edge cases.

When your data serves content rather than application logic, YAML's clarity creates better developer experience and more maintainable systems.


## Data inheritance

Nue implements a clean, three-level inheritance system for data that flows from global settings down to individual pages. This layered approach maintains consistency while allowing precise control when needed.

### Global data
The foundation starts with `site.yaml`, which defines site-wide settings and defaults:

```yaml
# site.yaml
title_template: "%s / Nue Framework"
description: "The standards-first web framework"
author: "Tero Piirainen"
og_image: "/images/nue-og.jpg"
```

### Application data
Applications like blogs or documentation can override global settings in their own configuration:

```yaml
# blog/blog.yaml
title: "Blog"
title_template: "%s / Blog"
description: "Latest writings about standards-first development"
og_image: "/images/blog-og.jpg"
```

### Page data
Individual pages have full control through front matter:

```yaml
# blog/design-system.md
---
title: "Mathematical Design Systems"
description: "Creating interfaces through calculated precision"
og_image: "/images/math-design.jpg"
---
```

Data flows naturally from global to specific, with each layer having the power to extend or override what came before. This creates a system that's both consistent and flexible - global changes propagate automatically, while individual pages maintain their autonomy when needed.

This inheritance model embodies true separation of concerns: configuration stays isolated from content, making both easier to maintain and update.

