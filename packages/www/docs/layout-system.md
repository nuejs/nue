
# Layout system

Most websites share common elements like headers, footers, navigation, and sidebars across pages. Nue's layout system lets you define these once and reuse them everywhere - whether your pages are static or dynamic.

## How it works

Every page starts with a basic HTML structure. Your content gets wrapped automatically:

```html
<html>
  <head>
    <!-- auto-generated head -->
  </head>
  <body>
    <main>
      <article>
        <!-- your content here -->
      </article>
    </main>
  </body>
</html>
```

Here's what Chrome DevTools shows for a simple `.md` file with just `# Hello, World!`:

[image.bordered]
  small: /img/default-layout.png
  large: /img/default-layout-big.png
  size: 400 x 262

This gives you semantic HTML out of the box. But you'll want to add your own header, footer, and other common elements.

## Slots and blocks

Nue uses **slots** — predefined positions where you can insert **layout blocks**. Think of slots as empty containers and blocks as the HTML that fills them:

[image.bordered]
  small: /img/layout-slots.png
  large: /img/layout-slots-big.png
  size: 500 x 543

Available slots:

| Slot name    | Purpose                                            |
|--------------|----------------------------------------------------|
| "banner"     | Temporary announcements above the header           |
| "header"     | Global site header                                 |
| "subheader"  | Breadcrumbs or secondary navigation                |
| "aside"      | Sidebars for documentation or catalogs             |
| "pagehead"   | Hero areas for blog posts or marketing pages       |
| "pagefoot"   | Call-to-action sections                            |
| "beside"     | Table of contents or complementary navigation      |
| "footer"     | Global footer                                      |
| "bottom"     | Overlays or menus below the main footer            |

## Creating layout blocks

Layout blocks are just HTML templates. Create them in any `.html` file.

### HTML5 landmarks

For semantic elements like `<header>` and `<footer>`, use the tag name directly:

```html
<header>
  <a href="/" class="logo">{ site_name }</a>
  <nav>
    <a href="/docs">Documentation</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
  </nav>
  <button popovertarget="menu">Menu</button>
</header>

<footer>
  <p>&copy; 2025 { site_name }. All rights reserved.</p>
  <nav>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</footer>
```

### Other slots

For non-semantic slots, use the `:is` attribute:

```html
<div :is="banner">
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>

<section :is="pagehead">
  <h1>{ title }</h1>
  <p>{ description }</p>
</section>
```

### Head content

Add custom head elements with a `<head>` block:

```html
<head>
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';">
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
```

This content gets added after the auto-generated head elements.

## File organization

You can organize layout blocks however you want:

```
site.html          // global blocks
blog/
  layout.html      // blog-specific blocks
  post.html        // individual post layout
docs/
  layout.html      // documentation blocks
```

A single file can contain multiple blocks. Put your header, footer, and navigation all in one file if you prefer.

## Override behavior

More specific blocks override global ones:

- `blog/layout.html` blocks override `site.html` blocks for blog pages
- `blog/post.html` blocks override `blog/layout.html` for individual posts
- Page-level front matter overrides everything

## Disabling blocks

Turn off blocks through YAML configuration:

```yaml
# In app.yaml or page front matter
banner: false
aside: false
pagehead: false
```

## Content scope

By default, your content renders inside `<article>`. Change this with the `scope` setting:

```yaml
scope: main
```

Available scopes:
- `article` (default) - Content goes in `<article>`
- `main` - Content goes in `<main>`
- `body` - Content goes in `<body>`
- `html` - Content replaces everything, including `<head>`

### HTML pages

For `.html` files, your root element defines the scope automatically:

```html
<!doctype html>
<main>
  <h1>Full control of main element</h1>
</main>
```

### Dynamic HTML pages

Dynamic HTML pages use the same layout block system:

```html
<!doctype dhtml>
<main>
  <h1>Full control of main element</h1>
</main>
```

The `dhtml` doctype marks the page as client-rendered. Like server-rendered HTML pages, your root element defines the scope. The layout block system works exactly the same way.

This gives you complete control over the page structure while still benefiting from Nue's block system.