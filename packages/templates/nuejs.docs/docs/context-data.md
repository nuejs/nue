
# Context data
Pages, layout modules, and components receive data from multiple sources. Data cascades through the inheritance chain with this priority (lowest to highest):

1. **Global data** - From `@base/site.yaml` and included data directories
2. **Site-level data** - From inheriting site's `site.yaml`
3. **App-level data** - From `app.yaml`
4. **Page front matter** - Page-specific overrides
5. **Component attributes** - Values passed directly to components

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