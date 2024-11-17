
# Layout modules
Simplifying page layout with simple, modular components


## Default layout

In Nue, the page layout is automatically generated around semantic HTML elements such as `<body>`, `<main>`, and `<article>`, which contain the Markdown-rendered content. This automatic process ensures that the core structure of your pages is consistent and follows web standards.

Here’s what the default HTML layout looks like in the Chrome Developer Console for a simple Markdown page containing just `# Hello, World!`:

[image.bordered]
  small: /img/default-layout.png
  large: /img/default-layout-big.png
  size: 400 x 262

## Custom layout modules

This basic HTML layout can be enhanced with custom layout modules, which are written using a [templating syntax](template-syntax.html) that closely resembles regular HTML. Layout modules allow you to define reusable components that help build a coherent structure across your application.

For example, a website might use the following HTML snippets for its global header, footer, and burger menu:

```html
<!-- Site header -->
<header>
  <navi :items="mastnav"/>
  <navi :items="toolbar"/>
  <button popovertarget="menu"/>
</header>

<!-- Site footer -->
<footer>
  <span><img src="/img/logo.svg" alt="Nue logo"></span>
  <navi :items="footernav"/>
</footer>

<!-- Burger menu -->
<dialog @name="bottom" popover id="menu">
  <button popovertarget="menu"></button>
  <navi :items="burger_menu"/>
</dialog>
```

This code defines the global layout for the site and highlights the modular approach Nue employs. Remarkably, this is all the HTML required to define the global layout, in contrast to JavaScript monoliths where similar functionality can require thousands of lines of code.


## Slots
In Nue, layout modules are designed to fill predefined slots in your page structure. Below are some typical modules you might create, each corresponding to a specific slot in the layout:

| Module name   | Typical use case                                          |
|---------------|-----------------------------------------------------------|
| “banner”      | Temporary news banners above the master header            |
| “header”      | Global, site-wide header                                  |
| “subheader”   | Breadcrumbs or subnavigations                             |
| “main”        | Full control over content inside the main element         |
| “aside”       | Sidebars in documentation or product catalogs             |
| “pagehead”    | Hero area for blog entries or marketing pages             |
| “pagefoot”    | Call-to-action sections                                   |
| “beside”      | Table of contents or other complementary navigations      |
| “footer”      | Global footer                                             |
| “bottom”      | Overlays, burger menus, or banners below the main footer  |


### Slot positions
Here's how the slots map to the DOM, determining where each layout module is positioned within the page structure.

[image.bordered]
  small: /img/layout-slots.png
  large: /img/layout-slots-big.png
  size: 500 x 543

### Defining a module

To create a specific module, such as the "banner", you need to create an `.html` file containing the HTML for the module and use the `@name` attribute:

```html
<div @name="banner">
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>
```

For HTML5 landmark elements like `header`, `footer`, `aside`, and `main`, you do not need to use the `@name` attribute; simply specify them directly. For example, here’s how to create a site-wide master navigation:

```html
<header>
  <img src="/img/logo.svg" alt="Site Logo">
  <nav>
    <a href="/docs">Docs</a>
    <a href="/blog">Blog</a>
  </nav>
</header>
```

### Template syntax

The layout modules support an HTML-based [template language](template-syntax.html) that includes features like loops and conditionals. They also have full access to your [data and metadata](content.html), enabling dynamic content generation.

Modules can be stored in any `.html` file, such as `layout.html`. A single file can contain multiple layout modules, providing flexibility in organizing your code.

### Global, application, and page-specific modules

Layout modules can be defined in different scopes:

- **Global modules**: These are defined in a [global directory](project-structure.html#globals) and are accessible throughout your application.
- **Application-specific modules**: These modules reside within a specific application directory (e.g., `blog/layout.html`), making them visible only within that application.
- **Page-specific modules**: You can define modules within a leaf directory (e.g., `blog/announcing-v2.0/layout.html`), which are specific to that page.

### Overriding modules

If modules with the same name are defined in different scopes, the more specific module will override the globally specified one. For example, a "banner" module inside the blog directory will take precedence over a globally defined "banner" module.

### Disabling modules

In some cases, you may want to disable specific layout modules. For example, on the blog index page, you might want to omit certain layout components that are present on individual blog entries. This can be done by setting the desired layout components to `false` in your YAML configuration. Here’s an example:

```yaml
aside: false
pagehead: false
pagefoot: false
```

This configuration can be placed in either the application-level YAML file or directly within a page's front matter. By disabling modules, you can customize the layout for specific pages, ensuring a cleaner and more focused presentation of content.

## Special modules

### Main

You can completely restructure the contents of your `<main>` element:

```html
<main>
  <h1>Hello, World!</h1>

  <aside>
    <slot for="pagehead"/>
  </aside>

  <article>
    <slot for="content"/>
  </article>
</main>
```

In this structure, the `<slot/>` element is used to render the contents of all other modules, including the contents of the Markdown document. This allows for a flexible arrangement of your main content and supplementary information.

### Root

For extensive customization, you can override the entire `<html>` element. This enables you to tailor every aspect of the document, including the document head:

```html
<html>
  <head>
    <!-- system meta elements (auto-generated) -->
    <slot for="head"/>

    <!-- custom meta elements -->
    <meta property="og:description" :content="og_description">
  </head>

  <body>
    <main>
      <h1>{ title }</h1>

      <!-- slot for the Markdown content and its sections -->
      <slot for="content"/>
    </main>
  </body>
</html>
```

This structure gives you complete control over the HTML document's layout and elements.

### Head

The contents of your document's `<head>` element are auto-generated based on your project settings and the [dependencies](project-structure.html#dependencies) specified for your page.

You can add custom metadata, external scripts, styles, and other elements to the head section using a `<head>` element. For example:

```html
<head>
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';">
</head>
```

After your custom elements are included, the rendered contents of your head would look like this:

```html
<head>
  <!-- user data -->
  <title>Hello, World!</title>
  <meta name="description" content="A Nue demo">
  <link rel="icon" type="image/png" href="/favicon.png">

  <!-- scripts and styles -->
  <link rel="stylesheet" href="/hello.css">
  <script src="/hello.js" type="module"></script>

  <!-- system metadata -->
  <meta name="generator" content="Nue">
  <meta name="viewport" content="...">
  ...

  <!-- custom head content -->
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';" />
</head>
```

This structure allows you to maintain auto-generated metadata while still providing the flexibility to add custom configurations as needed.
