
# Layout modules
Layout modules are reusable HTML components that fill predefined slots around your content. Instead of one master template, you create individual modules - a header, a footer, a sidebar - and Nue assembles them to build the complete page.

This modular approach lets you mix and match different headers, footers, and sidebars for different sections of your site without duplicating the page structure.

## Available slots
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

The `main` and `article` elements are generated automatically and don't need modules. Other slots appear only when you create modules for them.


## Creating modules
Layout modules are HTML templates. Create them in any `.html` file.

### Semantic landmarks

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

### Other slots

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

### Head content

Add custom head elements with a `<head>` module:

```html
<head>
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*">
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
```

This content appears after the auto-generated head elements.

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

Or split them across multiple files:

```
@shared/
├── layout/
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
```

Common patterns:

```
site.html              # Global modules for all pages
blog/
  layout.html          # Blog-specific modules
docs/
  layout.html          # Documentation modules
```

Modules in application directories (like `blog/` or `docs/`) override global modules for pages in that application.


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

See [Multi-site development](multi-site-development) for details on inheritance chains.


## Disabling modules
Turn off modules through front matter:

```yaml
---
banner: false
aside: false
pagehead: false
---
```

This prevents those modules from rendering, giving you a cleaner page structure when certain elements aren't needed.


## Accessing data
Modules have access to all context data: front matter, site configuration, and YAML data files. Use curly braces to inject values:

```html
<header>
  <a href="/">{ site_name }</a>
  <p>{ tagline }</p>
</header>
```

See [Context data](context-data) for how data flows through the system.

