
# Content-focused apps
Content-focused apps are websites where the content drives the experience. Blogs, documentation sites, marketing pages, company websites, and portfolios all fall into this category.

## Getting started
Create a blog template to see how content-focused apps work:

```bash
nue create blog
```

This generates a complete content-focused structure:

```
├── site.yaml          # global configuration
├── layout.html        # shared header and footer
├── index.md           # front page
├── index.css          # design
└── posts/
    ├── header.html    # blog post hero section
    ├── first.md       # example post
    └── second.md      # example post
```

The structure separates the concerns. Content lives in Markdown files. Design lives in CSS. Templates live in HTML. Configuration lives in YAML.


## Layout modules
Content-focused apps share common elements across pages. Headers, footers, navigation, and hero sections appear on multiple pages. Instead of repeating this HTML, you create layout modules that Nue assembles automatically.

### Global layout
Put site-wide elements in `layout.html` at your project root:

```html
<header>
  <a href="/" class="logo">{ site_name }</a>
  <nav>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>

<footer>
  <p>&copy; 2025 { site_name }. All rights reserved.</p>
  <nav>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</footer>
```

This header and footer appear on every page automatically. The `{ site_name }` variable comes from your `site.yaml` configuration.


### Section-specific layout
Create area-specific modules by placing layout files in subdirectories:

```
blog/
├── layout.html        # blog-specific modules
├── my-first-entry.md
├── form-follows-function.md
└── content-first.md
```

Modules in `blog/layout.html` only apply to pages in the `blog/` directory. They override global modules when both exist.


### Blog post headers
Blog posts often need special hero sections with titles, dates, and author information. Create these with the `pagehead` slot:

```html
<!-- In posts/header.html or blog/layout.html -->
<section :is="pagehead">
  <h1>{ title }</h1>
  <time>{ date }</time>
  <p>{ description }</p>
</section>
```

This appears above your post content, creating a consistent header design across all blog posts.


## Writing with Nuemark
Nuemark is Nue's content format. It extends standard Markdown with layout capabilities, making it perfect for content-focused apps.

### Basic content
Write naturally using standard Markdown:

```md
---
title: Getting started with design systems
date: 2024-01-15
description: How to build consistent interfaces
---

# Getting started with design systems

Design systems create consistency across your entire product. They're not just style guides - they're the foundation for scalable interface development.

## Key principles

**Start with constraints** - Fewer choices lead to more consistent outcomes.

**Design tokens first** - Define colors, spacing, and typography before building components.

**Document everything** - If it's not documented, it doesn't exist.
```

The front matter provides metadata for your layout modules and collections. The content becomes the main article body.

### Rich layouts

Use Nuemark's block syntax to create structured layouts:

```md
[.hero]
  # Transform your interface development
  Build consistent, maintainable designs that scale with your team.

  [button "Learn more" href="/docs/"]
  [button.primary "Get started" href="/get-started/"]

[.stack]
  ## Design tokens
  Central source of truth for colors, spacing, and typography.

  ## Component library
  Reusable interface elements that follow your design system.

  ## Documentation
  Living style guide that stays in sync with your code.
```

This creates semantic HTML structure that your design system can style consistently. No CSS classes mixed into your content.

### Custom components

Extend Nuemark with custom tags for rich content elements:

```html
<!-- In layout.html or components library -->
<blockquote :is="testimonial">
  <p>{ quote }</p>
  <footer>
    <cite>{ author }</cite>
    <span>{ role } at { company }</span>
  </footer>
</blockquote>

<div :is="stats">
  <div :each="stat in stats">
    <strong>{ stat.number }</strong>
    <span>{ stat.label }</span>
  </div>
</div>
```

Use these components in your Markdown content:

```md
[testimonial]
  quote: This framework changed how our team builds interfaces
  author: Sarah Chen
  role: Lead Designer
  company: Example Corp

[stats]
  stats:
    - number: 50%
      label: Faster development
    - number: 90%
      label: Fewer bugs
    - number: 100%
      label: Designer satisfaction
```

## Collections

Content-focused apps need to organize and display groups of related content. Collections make this automatic.


### Configuring collections
Define collections in your `site.yaml`:

```yaml
collections:
  blog:
    match: [posts/*.md]
    sort: date desc

  docs:
    match: [docs/**/*.md]
    sort: order asc

  team:
    match: [team/*.md]
    sort: name asc
```

Collections automatically gather matching files and make them available as variables in your templates.

### Displaying collections

Use collections in your Markdown content to create dynamic lists:

```md
---
title: Latest blog posts
---

# Our blog

Stay updated with the latest insights on design and development.

[blog-entries]

---

[button "View all posts" href="/blog/"]
```

Create the `blog-entries` component to render your collection:

```html
<!-- In layout.html -->
<div :is="blog-entries">
  <article :each="post in blog" class="post-preview">
    <h2><a href="{ post.url }">{ post.title }</a></h2>
    <time>{ post.date }</time>
    <p>{ post.description }</p>
  </article>
</div>
```

This automatically displays all posts from your `blog` collection, sorted by date in descending order.


### Collection metadata
Collections provide rich metadata for each item:

```javascript
// Available for each collection item
{
  title: "Post title",           // from front matter
  date: "2024-01-15",           // from front matter
  description: "Post summary",   // from front matter
  url: "/posts/my-post/",       // generated from filename
  // ... any other front matter properties
}
```

Use this metadata to create rich previews, category filters, or search functionality.


## HTML pages for structure
While Nuemark handles most content needs, sometimes you need full structural control. Compare the same homepage implemented with HTML:


```html
<!doctype html>

<main>
  <section class="hero">
    <h1>Our blog</h1>
    <p>Stay updated with the latest insights on design and development.</p>
  </section>

  <section class="featured-posts">
    <div class="post-grid">
      <article :each="post in blog.slice(0, 3)">
        <h3><a href="{ post.url }">{ post.title }</a></h3>
        <time>{ post.date }</time>
        <p>{ post.description }</p>
      </article>
    </div>
  </section>
</main>
```

### Trade-offs

**HTML gives you full layout control** - You can create any structure, nest elements however you want, and add forms or interactive elements anywhere.

**But content gets mixed with layout** - Writers can't safely edit the page without potentially breaking the structure. The hero section, newsletter signup, and content list are all tangled together.

**Design system constraints disappear** - With full HTML control, developers can create any structure, and add class names as they will.This breaks the design system's ability to enforce consistency through semantic elements and predefined components.

Choose HTML when you need precise structural control that Nuemark can't express. Choose Nuemark when content should be editable by non-developers and consistency matters more than layout flexibility.


## Add interactivity
Content-focused apps often need interactive elements like newsletter signups, contact forms, or feedback widgets. Create these as dynamic, resusable HTML:

```
<!-- In components.html (a new document) -->

<!dhtml>

<form :is="member-form" :onsubmit="submit">
  <label>
    <h3>Email</h3>
    <input type="email" name="email" required autocomplete="email">
  </label>

  <label>
    <h3>Feedback</h3>
    <textarea name="comment" rows="4"
      placeholder="Optional, but highly valued!"></textarea>
  </label>

  <p>
    <button>Join mailing list</button>
  </p>

  <script>
    async submit(e) {
      const data = Object.fromEntries(new FormData(e.target))
      await postMember(data)
      location.href = '/contact/thanks'
    }
  </script>
</form>
```

Use this component in your content:


```md
# About our company

We believe technology should serve people, not the other way around.

## Stay connected

[member-form]
```

The same component works on your layout modules too - in content pages, footers, or sidebars. Add it to your site footer in `layout.html`:

```
<footer>
  <section>
    <h3>Stay updated</h3>
    <p>Get our latest insights delivered to your inbox.</p>
>   <member-form/>
  </section>

  <p>&copy; 2025 { site_name }. All rights reserved.</p>
</footer>
```

[.note]
  ### Note
  Nuemark uses square bracket syntax `[member-form]` for content authors, and layout files uses HTML syntax `<member-form/>`.



## Content-first workflow
Content-focused apps work best when you start with content and add structure around it.

### Start with content
Write your content first using standard Markdown. Don't worry about layout or styling initially:

```md
# About our company
We believe technology should serve people, not the other way around.

## Our mission
To build software that makes complex things simple.

## Our team
We're a small group of ambitious designers and developers.

[team]

```

Your structural data lives in YAML (or in database, explained [later](/docs/server-development)):

```yaml
// in team.yaml
team:
  - name: Sarah Chen
    role: Lead Designer
    avatar: sarah.jpg

  - name: Marcus Rodriguez
    role: Frontend Developer
    avatar: marcus.jpg

  - name: Emma Thompson
    role: Content Strategist
    avatar: emma.jpg

  - name: David Kim
    role: Backend Engineer
    avatar: david.jpg
```

### Add structure
Create reusable components for structured content:

```html
<div :is="team" class="{ class }">
  <div :each="member in team" class="card">
    <img src="/img/team/{ member.avatar }" alt="{ member.name }">
    <h3>{ member.name }</h3>
    <p>{ member.role }</p>
  </div>
</div>
```

Enrich your content with Nuemark capabilities:


```md
# About our company
We believe technology should serve people, not the other way around.

## Our mission
To build software that makes complex things simple.

[.columns]
  ## Our team

  [team.stack]

  ---
  [image]
    small: /img/team/team.png
    large: /img/team/team@2x.png
...
```


### Start drafting your design
Your CSS should be the single source of truth for all visual decisions:

```css
.stack {
  display: flex;
  flex-wrap: wrap;
  /* ... */
}

.card {
  background-color: var(--base-50);
  box-shadow: var(--card-shadow);
  /* ... */
}

.columns {
  column-count: var(--count, 2);
  column-gap: var(--m);
  /* ... */
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  /* ... */
}
```

This separation lets content creators focus on writing while designers control presentation through the design system. Neither blocks the other.


