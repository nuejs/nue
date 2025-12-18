
# Page layout
Every page in Nue starts with a semantic HTML structure that's generated automatically. Your content gets wrapped in meaningful elements, meta tags are added, and layout modules assemble around your content to form the complete page.

## Automatic page structure

When you create a Markdown file:

```md
# Hello, World!

This is my first page.
```

Nue generates a complete HTML page:

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

A page with modules looks like this:

```html
<html>
  <head>
    <!-- auto-generated -->
  </head>
  <body>
    <header>
      <!-- header module -->
    </header>
    <main>
      <aside>
        <!-- aside module -->
      </aside>
      <article>
        <!-- your content -->
      </article>
    </main>
    <footer>
      <!-- footer module -->
    </footer>
  </body>
</html>
```

Modules fill predefined slots: header, footer, aside, pagehead, and others. A documentation page might use header, aside, and footer. A marketing page might use header, pagehead, and footer. Same system, different combinations.

The `<main>` and `<article>` elements are always present. Other slots appear only when you create modules for them.

See [Layout modules](layout-modules) for creating modules and understanding all available slots.

## Disabling modules

Turn off modules in front matter when you don't need them:

```yaml
---
header: false
aside: false
---
```

This gives you a cleaner page structure without the disabled elements.

## Head generation

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


