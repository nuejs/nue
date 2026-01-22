# Context data
Pages, layout modules, and components receive data from multiple sources. Data cascades through the inheritance chain with this priority (lowest to highest):

1. **Global data** - From `@base/site.yaml` and included data directories
2. **Site-level data** - From inheriting site's `site.yaml`
3. **App-level data** - From `app.yaml`
4. **Dynamic data** - From JS processors that can fetch data from external sources
5. **Page front matter** - Page-specific overrides
6. **Component attributes** - Values passed directly to components

Properties with the same name are overridden by higher layers. Component attributes always win.

See [Building a global design system](/docs/global-design-system) for how to organize data files.


## Content parsing
Nue automatically extracts structure and metadata from pages:

**Title and description** - Extracted from content:
- `title` - From the first `<h1>` element
- `description` - From the first paragraph following an `<h1>`

Front matter values override these.

**Headings array** - All headings parsed as structured data:

```js
headings: [
  { id: 'intro', text: 'Introduction', level: 1 },
  { id: 'getting-started', text: 'Getting started', level: 2 },
  { id: 'basic-usage', text: 'Basic usage', level: 3 }
]
```

**Page properties** - Generated from file path:
- `url` - Complete URL path
- `dir` - Directory path
- `slug` - Filename without extension
- `is_prod` - `true` when built for production


## Content collections
Collections defined in configuration become arrays with front matter plus generated metadata:

```js
{
  title: 'Post Title',
  description: 'Post summary',
  date: '2024-01-15',
  url: '/blog/post-slug/',
  dir: '/blog/',
  slug: 'post-slug',
  author: 'Jane Doe',
  tags: ['web', 'design']
}
```


## Dynamic data
Fetch data from external sources like headless CMS systems, databases, or APIs. Configure a processor in `site.yaml`:

```yaml
# @base/site.yaml
processor: @data/process.js
```

The processor runs for every page during build or serve. It receives the current page and accumulated data, and returns additional context:

```js
// @data/process.js
export default async function(page, data) {
  return { random: Math.random() }
}
```

### Page argument
Information about the page being generated:

```js
{
  url: '/blog/design-systems/',
  dir: '/blog/',
  slug: 'design-systems',
  name: 'design-systems',
  base: 'design-systems.md',
  ext: '.md',
  path: 'blog/design-systems.md',
  filepath: 'sites/acme/blog/design-systems.md',
  folder: 'sites',
  site: 'acme',
  mtime: Date,
  text: AsyncFunction,   // raw file content
  parse: AsyncFunction,  // parsed front matter + content
}
```

### Data argument
The accumulated context so far - site config, app config, and front matter merged:

```js
{
  is_prod: false,
  title: 'Design Systems at Scale',
  description: 'Building maintainable design systems',
  author: 'Alice Johnson',
  date: '2024-01-15',
  tags: ['design', 'css'],
  url: '/blog/design-systems/',
  dir: '/blog/',
  slug: 'design-systems',
  // ... other site/app data
}
```

### Examples

**Fetch from headless CMS:**

```js
let posts = null

export default async function(page, data) {
  if (!posts) {
    const res = await fetch('https://cms.example.com/api/posts')
    posts = await res.json()
  }

  return { posts }
}
```

**Per-page related content:**

```js
export default async function(page, data) {
  if (page.dir == '/blog/') {
    const related = data.posts
      .filter(p => p.slug != page.slug)
      .slice(0, 3)
    return { related }
  }
}
```

**Different data per site:**

```js
const endpoints = {
  acme: 'https://acme-cms.com/api',
  beta: 'https://beta-cms.com/api',
}

export default async function(page, data) {
  const api = endpoints[page.site]
  const res = await fetch(`${api}/products`)
  return { products: await res.json() }
}
```

### Multiple processors
Apps can define their own processors in `app.yaml`:

```yaml
# blog/app.yaml
processor: blog-data.js
```

All configured processors run in order - `@base` processor first, then app processor. Returned data merges into the context.


## Using data

### In layout modules

```html
<header>
  <a href="/">{ site_name }</a>
  <nav>
    <a :each="item in navigation" href="{ item.href }">
      { item.label }
    </a>
  </nav>
</header>
```

### In Markdown

```md
Welcome to { site_name }

Contact us at { company_email }
```

### In components

```html
<div :is="team-grid">
  <div :each="member in team">
    <img src="{ member.avatar }" alt="{ member.name }">
    <h3>{ member.name }</h3>
    <p>{ member.role }</p>
  </div>
</div>
```

### Built-in functions

**markdown** - Process markdown and return HTML:

```html
<div class="content">
  {{ markdown(post.description) }}
</div>
```


## Examples

### Table of contents

```html
<nav :is="toc">
  <ul>
    <li :each="h in tocHeadings">
      <a href="#{ h.id }">{ h.text }</a>
    </li>
  </ul>

  <script>
    this.tocHeadings = this.headings.filter(h => h.level == 2)
  </script>
</nav>
```

### Blog listing

```html
<ul>
  <li :each="post in blog">
    <a href="{ post.url }">
      <h2>{ post.title }</h2>
      <time>{ post.date }</time>
    </a>
  </li>
</ul>
```

### Breadcrumbs

```html
<nav :is="breadcrumbs">
  <a href="/">Home</a>
  <span :if="dir != '/'">
    / <a href="{ dir }">{ dir.replace('/', '') }</a>
  </span>
  <span :if="slug">
    / { slug }
  </span>
</nav>
```