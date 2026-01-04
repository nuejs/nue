
# Context data
Pages, layout modules, and components receive data from multiple sources:

- **YAML/JSON files** - Team members, products, navigation
- **Front matter** - Page-specific overrides
- **JavaScript processors** - Transform data, fetch from APIs
- **Component attributes** - Highest priority, passed directly to components

Data cascades similarly to configuration (site → app → front matter) with additional layers: `@shared/data/` at the @base, JavaScript processing for transformations, and component attributes at the top.


## Data files
Any `.yaml` or `.json` file in your project becomes template data. These files follow the same cascading hierarchy as configuration.


### Global data
Data shared across all sites lives in `@shared/data/`:

```
@shared/data/
├── products.yaml
├── plans.yaml
└── team.yaml
```

Example team data:

```yaml
# @shared/data/team.yaml
- name: Alice Johnson
  role: Lead Designer
  avatar: alice.jpg

- name: Bob Smith
  role: Frontend Developer
  avatar: bob.jpg
```

This data is available to all sites that extend `@base`.


### Site-level data
Root directory data applies to the entire site:

```
team.yaml              # Custom site-wide data
site.yaml              # Metadata and custom properties
```

Example site configuration:

```yaml
# site.yaml
meta:
  title: The UNIX of the web
  description: Standards-first web framework
  og: /img/social.png

# Custom properties
site_name: Acme Inc
company_email: hello@acme.com

social_links:
  twitter: https://twitter.com/acme
  github: https://github.com/acme
```

Configuration properties like `site`, `content`, and `collections` are reserved for Nue's configuration system. Everything else becomes template data.

### Application-level data

Application directories can have their own data:

```
blog/
├── app.yaml           # Metadata and custom properties
└── authors.yaml       # App-specific data

docs/
├── app.yaml
└── navigation.yaml
```

This data is available to all pages within that application.

### JSON files

JSON files work identically to YAML files but are typically machine-generated from tools like TypeDoc, API documentation generators, or build processes:

```json
{
  "api_version": "2.0",
  "endpoints": [
    {
      "path": "/users",
      "method": "GET",
      "description": "List all users"
    }
  ]
}
```

JSON data merges with YAML data at the same hierarchy level. Properties from both file types combine into a single context.


## Data manipulation
Transform and enrich your data using JavaScript or TypeScript. Place `.js` or `.ts` files in the same directory as your data files:

```
@shared/data/
├── products.yaml
├── team.yaml
└── process.js         # Data manipulation script
```

### Script signature

Export a default async function that receives and returns the accumulated data:

```javascript
// @shared/data/process.js
export default async function(data) {
  // data contains all merged YAML and JSON from this directory level

  // Add computed properties
  data.featured_products = data.products.filter(p => p.featured)

  // Enrich existing data
  data.team = data.team.map(member => ({
    ...member,
    avatar_url: `/img/team/${member.avatar}`
  }))

  // Return modified data
  return data
}
```

### Fetching external data

Since manipulation functions are async, you can fetch from external sources:

```javascript
// @shared/data/fetch-posts.js
export default async function(data) {
  // Fetch from headless CMS
  const response = await fetch('https://cms.example.com/api/posts')
  const posts = await response.json()

  // Add to context
  data.cms_posts = posts

  return data
}
```

This lets you integrate with headless CMS systems, databases, or any API that provides data for your templates.


### Processing order
Scripts run after all YAML and JSON files at the same level are merged:

1. Load all `.yaml` and `.json` files in the directory
2. Merge them into a single data object
3. Run any `.js` or `.ts` scripts in alphabetical order
4. Each script receives the current merged data and returns modified data



## Data cascade
Data precedence from lowest to highest priority:

1. **Start with global data** - Load all `@shared/data/*.yaml` and `*.json` files, then run any `.js`/`.ts` scripts
2. **Add site-level data** - From `site.yaml` and other root-level `.yaml` files
3. **Add app-level data** - From `app.yaml` and app-specific `.yaml` files
4. **Add page front matter** - Page-specific overrides
5. **Add component attributes** - Values passed directly to components override everything

The front matter metadata is flattened so that `title` property overrides `meta.title` from site.yaml or app.yaml. Properties with the same name are always overridden. For example, a `team` property at app level overrides the `team` array from site level.

Component attributes have the highest priority. When you write `[card title="Custom Title"]`, that `title` value overrides any title from front matter or configuration.



### Multi-site inheritance
In multi-site setups, data files are discovered through the inheritance chain. For a site that extends `@base`:

1. Load data from `@base/@shared/data/`
2. Load data from `@base/` root level
3. Load data from site root level
4. Load data from application level
5. Load page front matter

Later layers override earlier ones. This means you can define global products in `@base/@shared/data/products.yaml` and override specific products at the site level.


## Content collections
Collections defined in configuration become processed arrays. Each collection item includes all front matter properties plus generated metadata:

```javascript
// Collection item structure
{
  title: "Post Title",           // from h1 or front matter
  description: "Post summary",   // from first paragraph or front matter
  date: "2024-01-15",            // from front matter
  url: "/blog/post-slug/",       // generated from file path
  dir: "/blog/",                 // directory path
  slug: "post-slug",             // filename without extension
  author: "Jane Doe",            // from front matter
  tags: ["web", "design"],       // from front matter
  // ... plus any other front matter properties
}
```

### Generated properties

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
  // Production flag
  is_prod: false,

  // Flattened metadata (from meta namespace and front matter)
  "title": "My Site",
  "description": "Standards-first web framework",
  "author": "Jane Doe",

  // Site-level data
  "site_name": "Acme Inc",
  "company_email": "hello@acme.com",

  // Current page properties
  "url": "/blog/my-post/",
  "dir": "/blog/",
  "slug": "my-post",

  // Parsed content structure
  "headings": [
    { id: "hello", text: "Hello, World", level: 1 },
    { "id": "overview", "text": "Overview", "level": 2 },
    { "id": "features", "text": "Features", "level": 2 }
  ],

  // Built-in functions
  "markdown": function,

  // Team data from @shared/data/team.yaml (processed by scripts)
  "team": [
    {
      "name": "Alice Johnson",
      "role": "Lead Designer",
      "avatar": "alice.jpg",
      "avatar_url": "/img/team/alice.jpg"
    },
    {
      "name": "Bob Smith",
      "role": "Frontend Developer",
      "avatar": "bob.jpg",
      "avatar_url": "/img/team/bob.jpg"
    }
  ],

  // Content collection
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

## Using context data

### In layout modules

Access any data using curly braces:

```html
<header>
  <a href="/">{ site_name }</a>
  <nav>
    <a href="/blog">Blog</a>
    <a href="/docs">Docs</a>
  </nav>
</header>
```

### In Markdown

Use variables to inject dynamic values:

```md
Welcome to { site_name }

Contact us at { company_email }
```

### In components
All context data is available to custom components:

```html
<div :is="team-grid">
  <div :each="member in team">
    <img src="{ member.avatar_url }" alt="{ member.name }">
    <h3>{ member.name }</h3>
    <p>{ member.role }</p>
  </div>
</div>
```


### Built-in functions
**markdown function** - Process markdown content and return HTML:

```html
<div class="content">
  {{ markdown(post.description) }}
</div>
```

This function is automatically available in all templates and handles the same Nuemark syntax used in content files.

## Template examples

### Blog listing

```html
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

### Table of contents

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

Use in Markdown:

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

