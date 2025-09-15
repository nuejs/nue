# Template data
Nue templates receive data from multiple sources that cascade and combine into a single context. Understanding how this data flows from YAML files to templates is essential for building dynamic sites.


## Data files
Any `.yaml` file in your project becomes template data. Data files follow the same cascading hierarchy as [configuration](configuration):

**Site level** - Root directory:

```
team.yaml              # Custom site-wide data
site.yaml              # Metadata and custom properties only
```

Example metadata and custom properties in site.yaml:

```yaml

# site.yaml metadata
meta:
  title: The UNIX of the web
  description: Standards first web framework
  og: /img/social.png

# custom properties
site_name: Acme Inc
company_email: hello@acme.com

social_links:
  twitter: https://twitter.com/acme
  github: https://github.com/acme
```

All configuration properties (`site`, `content`, `collections`, ...) are skipped from templates data.

**App level** - Subdirectories:

```
blog/
├── app.yaml           # Metadata and custom properties only
└── authors.yaml       # App specific data

docs/
├── app.yaml
└── navigation.yaml
```

**Global data**

```
@shared/data/
├── products.yaml
├── plans.yaml
└── social.yaml
```

## Data compilation
Data precedence from lowest to highest priority:

1. **Start with global data** - Load all `@shared/data/*.yaml` files
2. **Add root-level data** - From `site.yaml`  and other root level .yaml files
3. **Add app-level data** - From `app.yaml` and app-specific .yaml files
4. **Add page front matter** - Page-specific overrides

The front matter metadata is flattened so that `title` property would override `meta.title` in site.yaml or app.yaml. Properties with the same name are always overridden, ie: "team" property on app level would override the team array on root level.


### Content collections
Collections defined in [configuration](configuration) become processed arrays. Each collection item includes all front matter properties plus generated metadata:

```javascript
// Collection item structure
{
  title: "Post Title",           // from h1 or front matter
  description: "Post summary",   // from subtitle (h1 + p) or front matter
  date: "2024-01-15",            // from front matter
  url: "/blog/post-slug/",       // generated from file path
  dir: "/blog/",                 // directory path
  slug: "post-slug",             // filename without extension
  author: "Jane Doe",            // from front matter
  tags: ["web", "design"],       // from front matter

  // ... plus any other front matter properties
}
```

#### Generated properties
- `is_prod` - `true` when site is built for production
- `url` - Complete URL path generated from file path and name
- `dir` - Directory path where the file is located
- `slug` - Filename without extension, used for URL-friendly identifiers
- Sorting applied as defined in collection configuration
- Only files matching the `match` patterns are included


## Content parsing
Nue automatically extracts content structure and metadata from pages:

**Headings array** - All headings are parsed and made available as structured data:

```javascript
headings: [
  { id: "hello", text: "Hello, World", level: 1 },
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "getting-started", text: "Getting started", level: 2 },
  { id: "basic-usage", text: "Basic usage", level: 3 },
  { id: "advanced-features", text: "Advanced features", level: 2 }
]
```

**Title and description** - Automatically extracted from content structure:
- `title` - From the first `<h1>` element in the content
- `description` - From the first paragraph following an `<h1>`, or from a standalone paragraph

Front matter values override these automatically parsed values.

## Template context
Here's what a typical template context looks like as JSON:

```javascript
{
  // production flag
  is_prod: false,

  // flattened metadata (from meta namespace and front matter)
  "title": "My Site",
  "description": "Standards-first web framework",
  "author": "Jane Doe",

  // root-level data from YAML files
  "site_name": "Acme Inc",
  "company_email": "hello@acme.com",

  // current page properties
  "url": "/blog/my-post/",
  "dir": "/blog/",
  "slug": "my-post",

  // parsed content structure
  "headings": [
    { id: "hello", text: "Hello, World", level: 1 },
    { "id": "overview", "text": "Overview", "level": 2 },
    { "id": "features", "text": "Features", "level": 2 }
  ],

  // built-in functions to process markdown to HTML
  "markdown": function,

  // team data from @shared/data/team.yaml
  "team": [
    {
      "name": "Alice Johnson",
      "role": "Lead Designer",
      "avatar": "alice.jpg"
    },
    {
      "name": "Bob Smith",
      "role": "Frontend Developer",
      "avatar": "bob.jpg"
    }
  ],

  // content collection
  "blog": [
    {
      "title": "Design Systems at Scale",
      "date": "2024-01-15",
      "url": "/blog/design-systems-scale/",
      "dir": "/blog/",
      "slug": "design-systems-scale",
      "description": "Building maintainable design systems",
      "author": "Alice Johnson",
      "tags": ["design", "systems"]
    },
    {
      "title": "Web Standards First",
      "date": "2024-01-10",
      "url": "/blog/web-standards-first/",
      "dir": "/blog/",
      "slug": "web-standards-first",
      "description": "Why standards matter",
      "tags": ["standards", "web"]
    }
  ]
}
```

## Built-in functions

### markdown function
Process markdown content and return HTML:

```html
<div class="content">
  {{ markdown(post.description) }}
</div>
```

This function is automatically available in all templates and handles the same Nuemark syntax used in content files.


## Template examples

### Basic template
Access any data using Nue's template syntax:

```html
<!doctype html>

<article>
  <h1>{ site_name } blog</h1>

  <ul>
    <li :each="post in blog">
      <a href="{ post.url }">
        <h2>{ post.title }</h2>
        <time>{ post.date }</time>
        <div>{{ markdown(post.description) }}</div>
      </a>
    </li>
  </ul>
</article>
```

### Table of contents component
Create a `[toc]` tag using the parsed headings data:

```html
<nav :is="toc">
  <h3>Table of contents</h3>
  <ul>
    <li :each="heading in tocHeadings">
      <a href="#{ heading.id }">{ heading.text }</a>
    </li>
  </ul>

  <script>
    // Filter to show only h2 headings
    this.tocHeadings = this.headings.filter(h => h.level == 2)
  </script>
</nav>
```

Use in Nuemark content:

```md
# Hello, world

[toc]

## First section
Lorem ipsum dolor sit amet...

## Second section
More content here...
```

### Breadcrumb navigation
Use the `dir` and `slug` properties for navigation:

```html
<nav :is="breadcrumbs">
  <a href="/">Home</a>
  <span :if="dir != '/'">
    <span>/</span>
    <a href="{ dir }">{ dir.replace('/', '') }</a>
  </span>
  <span :if="slug">
    <span>/</span>
    <span>{ slug }</span>
  </span>
</nav>
```

This automatically generates breadcrumbs like: Home / blog / my-post