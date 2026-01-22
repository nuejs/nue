
# Setting up page layout
Nue generates semantic HTML structure for every Markdown page. This gives your design system clean layout to work with. Think of it like your custom *CSS Zen Garden* (those who remember), where one HTML file expressed hundreds of different designs through CSS alone.

This guide shows you how to set up this structure:

**Document body** - Semantic HTML elements (body, main, article) that wrap your content automatically.

**Layout modules** - Reusable components like headers, footers, and sidebars that fill predefined slots around your content.

**Content structure** - Dividers that split complex marketing pages into sections and blocks. Most documentation and blogs don't need these.

**Document head** - Meta tags and dependencies generated from front matter and configuration.



## Document body
When you create a Markdown file:

```md
# Hello, World!

This is my first page.
```

Nue generates a this HTML page:

```html
<html>
  <head>
    <!-- auto-generated meta tags, styles, scripts -->
  </head>
  <body>
    <main>
      <article>
        <h1>Hello, World!</h1>
        <p>This is my first page.</p>
      </article>
    </main>
  </body>
</html>
```

The structure gives you semantic HTML without configuration. Your content lives inside `<article>`, which lives inside `<main>`, which lives inside `<body>`. Search engines, screen readers, and browsers understand this structure immediately.


## Layout modules
Layout modules are reusable components that wrap around your content. A header module. A footer module. A sidebar module. Nue assembles them around your content to build the complete page.

A HTML page generated with modules looks like this:

```html
<html>
  <head>
    <!-- auto-generated -->
  </head>

  <body>
    <header>
      <!-- custom header module -->
    </header>
    <main>
      <aside>
        <!-- custom aside / "sidebar" module -->
      </aside>

      <article>
        <!-- the Markdown-based content comes here-->
      </article>
    </main>
    <footer>
      <!-- custom footer module -->
    </footer>
  </body>
</html>
```

Modules fill predefined slots: header, footer, aside, pagehead, and others. A documentation page might use header, aside, and footer. A marketing page might use header, pagehead, and footer. Same system, different combinations.

The `<main>` and `<article>` elements are always present. Other slots appear only when you create modules for them.

### Available slots

Modules fill these predefined positions in your page:

| Slot      | Purpose |
|-----------|---------|
| banner    | Temporary announcements above the header |
| header    | Global site header with navigation |
| subheader | Breadcrumbs or secondary navigation |
| aside     | Sidebars for documentation or catalogs |
| pagehead  | Hero sections for marketing pages or blog posts |
| pagefoot  | Call-to-action sections or article footers |
| beside    | Table of contents or complementary navigation |
| footer    | Global site footer |
| bottom    | Overlays or modals below the footer |


### Creating modules
Layout modules are HTML templates. Create them in any `.html` file. The filename can be anything, but a common name is to use `layout.html` and add multiple modules to it.

For semantic landmark elements like `<header>` and `<footer>`, use the tag name directly:

```html
<header>
  <a href="/" class="logo">{ site_name }</a>
  <nav>
    <a href="/docs">Documentation</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
  </nav>
</header>

<footer>
  <p>&copy; 2025 { site_name }</p>
  <nav>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</footer>
```

For non-semantic slots, use the `:is` attribute:

```html
<div :is="banner">
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0">Check out v2.0</a>
</div>

<section :is="pagehead">
  <h1>{ title }</h1>
  <p>{ description }</p>
</section>
```

## File organization
You can organize layout modules however makes sense for your project. A single file can contain multiple modules:

```html
<!-- layout.html -->

<header>
  <a href="/">{ site_name }</a>
  <nav>...</nav>
</header>

<footer>
  <p>&copy; 2025 { site_name }</p>
</footer>
```

Or split them across multiple files in @base or your site folder:

```
@layout/
├── header.html
├── footer.html
└── sidebar.html
```

```yaml
# site.yaml
include: [@design, @layout]
```

The `include` directive makes every file in the folder available to all pages. Without it, layout modules in subdirectories won't be discovered.



### Common patterns:

```
site.html              # Global modules for all pages
blog/
  layout.html          # Blog-specific modules
docs/
  layout.html          # Documentation modules
```

Modules in application directories (like `blog/` or `docs/`) automatically apply to pages in that application.



## Module data
Modules have access to all context data: front matter, site configuration, and YAML data files. Use curly braces to inject values.

Here's a header module that uses data from site configuration:

```html
<!-- @base/layout/header.html -->
<header>
  <a href="/">{ site_name }</a>
  <nav>
    <a :each="item in header_nav" href="{ item.url }">
      { item.label }
    </a>
  </nav>
</header>
```

Define the navigation in your base configuration:

```yaml
# @base/site.yaml
site_name: Base Template
header_nav:
  - label: Documentation
    url: /docs
  - label: Blog
    url: /blog
  - label: About
    url: /about
```

Inheriting sites override with their own data:

```yaml
# acme.com/site.yaml
extend: [@base]
site_name: Acme Inc
header_nav:
  - label: Products
    url: /products
  - label: Pricing
    url: /pricing
  - label: Contact
    url: /contact
```

The header module stays reusable because sites override only the data, not the structure.

See [Context data](context-data) for how data flows through the system.



## Module inheritance
In multi-site development, modules follow the inheritance chain. When Nue needs a module, it scans backwards through the chain until it finds one:

1. Check the current site directory
2. Check each extended layer in reverse order
3. Check `@base`
4. Use the first match found

For example, with this inheritance chain: `@base` → `startup` → `acme.com`

When building a page at `acme.com/blog/post`, Nue searches for a header module:
1. `acme.com/blog/header.html`
2. `acme.com/header.html`
3. `startup/blog/header.html`
4. `startup/header.html`
5. `@base/blog/header.html`
6. `@base/header.html`

The first match wins. This means:
- Site-level modules override `@base` modules
- Application modules override site-level modules
- More specific paths override general ones

This lets you customize the header or footer for specific sections while reusing the base design. Most sites inherit all modules from `@base` and override only what makes them unique.


### Disabling modules
Turn off modules through front matter:


```yaml
---
banner: false
aside: false
pagehead: false
---
```

This prevents those modules from rendering, giving you a cleaner page structure when certain elements aren't needed.


## Content structure
This section covers structuring content inside the `<article>` element for rich marketing pages, landing pages, and visually complex layouts.

### Sections

Sections wrap your content in semantic `<section>` elements. Enable sectioning in your site or global @base configuration:

```yaml
# site.yaml or app.yaml
sections: true
```

Then use triple equals to create section breaks in your content:

```md
# Introduction
First section content...

===

## Features
Second section content...

===

## Technical Details
Third section content...
```

Generates:

```html
<article>
  <section>
    <h1>Introduction</h1>
    <p>First section content...</p>
  </section>
  <section>
    <h2>Features</h2>
    <p>Second section content...</p>
  </section>
  <section>
    <h2>Technical Details</h2>
    <p>Third section content...</p>
  </section>
</article>
```

The `===` divider creates explicit section boundaries. You control where sections break.


### Section classes
Assign semantic classes to sections:

```yaml
sections: [ hero, problem, solution, features, testimonials, cta ]
```

The first section gets class `hero`, the second gets `problem`, and so on. Use names that reflect content purpose, not visual style. Your design system uses these classes to style each section appropriately.

For a product page:

```yaml
sections: [ hero, benefits, how-it-works, pricing, faq, cta ]
```

These settings belong in `site.yaml` or `app.yaml`, not page front matter. They're design system decisions that ensure consistent structure across all pages in your site or application.


### Section wrapper
Wrap each section's content in an inner div for layout control:

```yaml
# site.yaml or app.yaml
section_wrapper: wrap
```

Generates:

```html
<section>
  <div class="wrap">
    <!-- content here -->
  </div>
</section>
```

The wrapper div lets your design system apply max-width constraints to content while allowing the section's background to extend full-width. Common pattern for centered content with edge-to-edge backgrounds.

Like sections configuration, this belongs in `site.yaml` or `app.yaml`. It's a design system setting that affects how all pages render.


## Blocks
Blocks wrap content in divs with your chosen class name. Any class from your design system works:

```md
[.note]
  ### Important Note
  This content is wrapped in a div with class "note"
```

Generates:

```html
<div class="note">
  <h3>Important Note</h3>
  <p>This content is wrapped in a div with class "note"</p>
</div>
```

The class name is entirely up to you. Use whatever makes sense for your design system:

```md
[.warning]          → <div class="warning">...</div>
[.testimonial]      → <div class="testimonial">...</div>
[.pricing-tier]     → <div class="pricing-tier">...</div>
[.photo-gallery]    → <div class="photo-gallery">...</div>
```

### Nested divs

Blocks automatically create nested divs based on content structure. The first heading level determines how content is grouped:

```md
[.features]
  ### Feature One
  First feature description

  ### Feature Two
  Second feature description
```

Since the first heading is `h3`, each `h3` creates a nested div:

```html
<div class="features">
  <div>
    <h3>Feature One</h3>
    <p>First feature description</p>
  </div>
  <div>
    <h3>Feature Two</h3>
    <p>Second feature description</p>
  </div>
</div>
```

Use triple dashes for explicit nested divs:

```md
[.testimonials]
  "Great product!"
  - Sarah Chen

  ---

  "Changed our workflow"
  - Michael Park
```

Generates:

```html
<div class="testimonials">
  <div>
    <p>"Great product!"</p>
    <p>- Sarah Chen</p>
  </div>
  <div>
    <p>"Changed our workflow"</p>
    <p>- Michael Park</p>
  </div>
</div>
```

### Common layouts

**Grid layouts** - For responsive multi-column layouts:

```md
[.grid]
  ### Feature One
  First feature description

  ### Feature Two
  Second feature description

  ### Feature Three
  Third feature description
```

**Stack layouts** - For vertical arrangements with consistent spacing:

```md
[.stack]
  ### Design
  Focus on systematic design

  ### Engineering
  Built for performance

  ### Content
  Pure content structure
```

These work because your CSS defines how `.grid` and `.stack` behave. Nuemark provides the structure. Your design system controls the presentation.

### Nested blocks

Blocks can nest inside each other:

```md
[.feature]
  ## Main Feature
  Feature description

  [.grid]
    ### Sub-feature A
    Description A

    ### Sub-feature B
    Description B
```

Generates:

```html
<div class="feature">
  <h2>Main Feature</h2>
  <p>Feature description</p>

  <div class="grid">
    <div>
      <h3>Sub-feature A</h3>
      <p>Description A</p>
    </div>
    <div>
      <h3>Sub-feature B</h3>
      <p>Description B</p>
    </div>
  </div>
</div>
```

### How structure maps to HTML

Content structure creates semantic HTML that your design system can style predictably:

**Sections** create `<section>` elements that group related content. Search engines and screen readers understand these boundaries.

**Blocks** create `<div>` elements with your chosen classes. The design system uses these classes to control layout, spacing, and visual style.

**Nested divs** create the structure needed for grid and stack layouts. Each nested div becomes a grid item or stack element.

The key principle: you define structure and meaning in Markdown. The design system defines presentation in CSS. They stay separate.


## Document head
Nue automatically generates `<head>` content based on your front matter and configuration:

```yaml
---
title: My Page
description: A page about something
---
```

Generates:

```html
<head>
  <title>My Page</title>
  <meta name="description" content="A page about something">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- CSS and JS dependencies -->
</head>
```

You can add custom head content with a `<head>` module. Your custom elements appear after the auto-generated ones.

See [Page dependencies](page-dependencies) for how CSS and JavaScript files get included, and [Configuration](configuration) for all available metadata options.

