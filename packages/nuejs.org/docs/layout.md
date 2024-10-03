
# Layout
This document explains the default HTML layout of your pages and how you can customize it for specific applications and pages.


## Default layout
Here's what the default HTML layout look on Chrome developer console for a Markdown page with just `# Hello, World!` on it:

[image.bordered]
  small: /img/default-layout.png
  large: /img/default-layout-big.png
  size: 400 x 262



## Slots
You can alter the generated HTML by filling the various "slots" in the default layout. These slots are named as follows:

[image.bordered]
  small: /img/layout-slots.png
  large: /img/layout-slots-big.png
  size: 500 x 543


[table]
  Slot name     | Typical use
  “banner”      | For temporary news banners above the master header
  “header”      | The global, site-wide header
  “subheader”   | For "breadcrumbs" or subnavigations
  “main”        | To take full control of contents inside the the main element
  “aside”       | For sidebars in documentation or product catalogue apps
  “pagehead”    | The "hero" area for blog entries or marketing pages
  “pagefoot”    | Call-to-action areas
  “beside”      | Table of contents or other complementary navigations
  “footer”      | The global footer
  “bottom”      | Overlays, burger menus, or banners below the main footer


### Filling the slots
To fill a specific slot, say the "banner" you create a `.html` file with a [server-component](server-components.html) and give the component a name using a `@name="banner"` attribute:

```html
<div •@name="banner"•>
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>
```

HTML5 landmark element names: `header`, `footer`, `aside`, and `main` don't require the "@name" attribute and you can specify them as is. For example, here's the a site-wide master navigation:

```html
<header>
  <img src="/img/logo.svg">
  <nav>
    <a href="/docs">Docs</a>
    <a href="/docs">Blog</a>
  </nav>
</header>
```

The layout modules support a HTML-based [template language](template-syntax.html) with loops and conditionals and they have full access to your [data and metadata](settings-and-data.html#data).

The modules can be stored in any file with a `.html` suffix such as `layout.html` and a single file can contain multiple layout modules.



### Template inheritance
The layout modules can be specified globally in a [global directory](project-structure.html#globals) or they can reside inside a specific application directory (like blog), in which case they are only visible within the application. You can also define page-specific layout modules inside a leaf directory, such as "blog/announcing-v2.0/layout.html".

Modules with the same name override the more globally specified modules. So for a "banner" module inside a blog directory overrdes any globall specified "banner".


### Disabling slots { #disabling }
Sometimes you want to leave out specific layout modules. For example, the blog index page should disable the layout components that are available on the individual blog entries. This happens by setting the desired layout components to `false`. For example:

```yaml
aside: false
pagehead: false
pagefoot: false
```


## Special slots

### Head
The contents of your document's`<head>` element are auto-generated based on your project settings and what [dependencies](project-structure.html#dependencies) your page has. You can add custom metadata, external scripts and styles, and other extra elements to the head section with a "custom_head" element. For example:


```html
<head @name="custom_head">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';">
</head>
```

After the contents of your head would be rendered like this:

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

  <!-- custom head stuff -->
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';" />
</head>
```



### Main
You can completely restructure the contents of your `main` as follows:

```html
<main>
  <h1>Hello, World!</h1>

  <aside>
    <slot for="layout.pagehead"/>
  </aside>

  <article>
    <slot for="layout.content"/>
  </article>
</main>
```

Use a `<slot/>` element to render the contents of all other modules and the contents of the Markdown document.


### Root
You can go extreme and override the entire `html` element in which case you can customize everything, including the document head:

```html
<html>
  <head>
    <!-- system meta elements (auto-generated) -->
    <slot for="layout.head"/>

    <!-- custom meta elements -->
    <meta property="og:description" :content="og_description">
  </head>

  <!-- custom body layout -->
  <body>
    <main>
      <h1>{ title }</h1>

      <!-- slot for the Markdown content and it's sections -->
      <slot for="layout.content"/>
    </main>
  </body>

</html>
```


## Helper components
Nue offers a set of built-in helper components to help you construct the layout modules.


### Navi
Most of your layout modules relate to navigation: the global header and footer, sidebars, and the burger menu typically consists of links to the various pages on your website. The `<navi/>` tag is a useful utility to render those links using the data  on your [settings and data files](settings-and-data.html). Here is an example header:

```
<header>
  <!-- logo -->
  <a href="/">
    <img src="/img/logo.svg" alt="Logo">
  </a>

  <!-- master navigation -->
  <navi :items="mastnav"/>
</header>
```

Here is the navigation data in `site.yaml`:

```
mastnav:
  - Documentation: /docs/
  - About: /about/
  - Blog: /blog/
```

The header would render as follows

```
<header>
  <a href="/">
    <img src="/img/logo.svg" alt="Logo">
  </a>
  <nav>
    <a href="/docs/">Documentation</a>
    <a href="/about/">About</a>
    <a href="/blog/">Blog</a>
  </nav>
</header>
```

#### Hierarchical navigation
You can also supply hierarchical data for the navi tag:

```
footer:
  Product:
    - Download: /download/
    - Features: /features/
    - Pricing: /pricing/
    - Docs: /docs/

  Company:
    - About us: /about/
    - Blog: /blog/
    - Careers: /careers/
    - Customers: /customers/
```

Now `<navi :items="footer"/>` would render the following:

```
<div>
  <nav>
    <h3>Product</h3>
    <a href="/download/">Download</a>
    <a href="/features/">Features</a>
    <a href="/pricing/">Pricing</a>
    <a href="/docs/">Docs</a>
  </nav>

  <nav>
    <h3>Company</h3>
    <a href="/about/">About us</a>
    <a href="/blog/">Blog</a>
    <a href="/careers/">Careers</a>
    <a href="/customers/">Customers</a>
  </nav>
</div>
```


### Markdown
Renders a Markdown-formatted string given in the `content` attribute.

```
<markdown :content="description"/>
```


### Ppretty-date
Pretty-prints a date value given in the `date` attribute.

```
<pretty-date :date="date"/>
```

Here is an example "hero" area for a blog entry that uses the `markdown` and `pretty-date` tags:


```html
<header @name="pagehead">
  <pretty-date :date="date"/>

  <h1><markdown :content="title"/></h1>

  <div class="description">
    <markdown :content="title"/>
  </div>
</header>
```



### Table of contents
Use the built-in `<toc/>` tag to render the table of contents parsed from the current Markdown document and it's second and third level headings (h2, h3):

```
<toc class="toc"/>
```

This Markdown document, for example renders the following:

```html
<div aria-label="Table of contents" class="toc">
  <nav>
    <a href="#default-layout">
      <strong>Default layout</strong></a>
  </nav>
  <nav>
    <a href="#slots"><strong>Slots</strong></a>
    <a href="#filling-the-slots">Filling the slots</a>
    <a href="#template-inheritance">Template inheritance</a>
    <a href="#disabling">Disabling slots</a></nav>
  <nav>
  ...
</div>
```








