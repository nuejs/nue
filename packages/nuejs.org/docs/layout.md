
# Layout modules
In Nue, the page layout is automatically generated around semantic HTML elements, such as `<body>`, `<main>`, and `<article>`, which encapsulate the Markdown-rendered content. This automated process ensures that the core structure of your pages is both consistent and compliant with web standards.

Here’s what the default HTML layout looks like in the Chrome Developer Console for a Markdown page containing just `# Hello, World!`:

[image.bordered]
  small: /img/default-layout.png
  large: /img/default-layout-big.png
  size: 400 x 262

### The role of layout modules
This base HTML can be enhanced with custom HTML-based layout modules, which are written using a templating language closely resembling regular HTML. Layout modules allow you to define reusable components that help build a structured and coherent layout across your application.

For example, a website might use the following simple HTML snippets for its global header, footer, and burger menu:

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

This code defines the global layout for the site and highlights the modular approach Nue employs. Remarkably, this is all the HTML code required to define the global layout, in stark contrast to JavaScript monoliths, where similar functionality can require thousands of lines of code to achieve the same result.

### Benefits of the layout approach
Nue's layout approach offers several advantages:

- **Modular design**: By using layout modules, Nue allows developers to define reusable components that can be easily integrated and maintained. This modularity streamlines the development process, making it easier to update or replace individual components without affecting the entire layout.

- **Simplicity and clarity**: The focus on clean, semantic HTML ensures that the generated code is easy to read and understand, promoting accessibility and better SEO outcomes.

- **Reduced complexity**: Minimizing reliance on JavaScript for templating helps avoid the pitfalls of complex JS monoliths, leading to faster development cycles and improved performance.

- **Flexibility**: The ability to customize layouts at different scopes (global, application-specific, and page-specific) provides developers with the flexibility to create tailored experiences.

- **Dynamic content handling**: The support for a templating language that includes loops and conditionals, along with access to data and metadata, enhances the functionality of the layout modules, allowing for dynamic and interactive content generation.

## Creating modules
In Nue, you can define various layout modules to enhance your page structure. Below are the different modules you can create:

[image.bordered]
  small: /img/layout-slots.png
  large: /img/layout-slots-big.png
  size: 500 x 543

| Module name   | Typical use case                                           |
|---------------|-----------------------------------------------------------|
| “banner”      | For temporary news banners above the master header        |
| “header”      | The global, site-wide header                              |
| “subheader”   | Typically for breadcrumbs or subnavigations              |
| “main”        | To take full control of content inside the main element   |
| “aside”       | Typically for sidebars in documentation or product catalogs|
| “pagehead”    | The "hero" area for blog entries or marketing pages      |
| “pagefoot”    | Mostly for call-to-actions                                |
| “beside”      | Table of contents or other complementary navigations      |
| “footer”      | The global footer                                         |
| “bottom”      | Overlays, burger menus, or banners below the main footer  |

### Defining a module
To create a specific module, such as the "banner," you need to create a `.html` file containing the HTML for the module and use the `@name` attribute:

```html
<div @name="banner">
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>
```

For HTML5 landmark elements like `header`, `footer`, `aside`, and `main`, you do not need to use the `@name` attribute; you can specify them directly. For example, here’s how to create a site-wide master navigation:

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
The layout modules support an HTML-based [template language](template-syntax.html) that includes features like loops and conditionals. Additionally, they have full access to your [data and metadata](settings-and-data.html#data), allowing for dynamic content generation.

Modules can be stored in any file with a `.html` suffix, such as `layout.html`. A single file can contain multiple layout modules, providing flexibility in organizing your code.

### Global, application, and page-specific modules
Layout modules can be defined in various scopes:

- **Global modules**: These are defined in a [global directory](project-structure.html#globals) and are accessible throughout your application.

- **Application-specific modules**: These modules reside within a specific application directory (e.g., `blog/layout.html`), making them visible only within that application.

- **Page-specific modules**: You can also define layout modules within a leaf directory, such as `blog/announcing-v2.0/layout.html`, which are specific to that page.

### Overriding modules
If modules with the same name are defined in different scopes, the more specific module will override the globally specified one. For instance, a "banner" module inside the blog directory will take precedence over any globally defined "banner" module.

### Disabling modules
In some cases, you may want to disable specific layout modules. For example, on the blog index page, you might want to omit layout components that are present on individual blog entries. This can be accomplished by setting the desired layout components to `false` in your YAML configuration. Here’s how to do it:

```yaml
aside: false
pagehead: false
pagefoot: false
```

This configuration can be placed in either the application-level YAML file or directly within a page's front matter. By disabling these modules, you can customize the layout for specific pages, ensuring a cleaner and more focused presentation of content.

## Special modules
### Main
You can completely restructure the contents of your `<main>` element as follows:

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

In this structure, the `<slot/>` element is used to render the contents of all other modules, along with the contents of the Markdown document. This allows for a flexible arrangement of your main content and supplementary information.

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

By using this structure, you have complete control over the HTML document's layout and elements.

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
