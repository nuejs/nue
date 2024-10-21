
# Layout
This document explains the default HTML layout of your pages and how you can customize it for specific applications and pages.


## Default layout
Here's what the default HTML layout look on Chrome developer console for a Markdown page with just `# Hello, World!` on it:

[image.bordered]
  small: /img/default-png
  large: /img/default-layout-big.png
  size: 400 x 262



## Slots
You can alter the generated HTML by filling the various "slots" in the default  These slots are named as follows:

[image.bordered]
  small: /img/layout-slots.png
  large: /img/layout-slots-big.png
  size: 500 x 543


[table]
  Slot name     | Use case
  “banner”      | For temporary news banners above the master header
  “header”      | The global, site-wide header
  “subheader”   | Typically for "breadcrumbs" or subnavigations
  “main”        | To take full control of contents inside the the main element
  “aside”       | Typically for sidebars in documentation or product catalogue apps
  “pagehead”    | The "hero" area for blog entries or marketing pages
  “pagefoot”    | Mostly for call-to-actions
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



### Scopes: global, application, and page
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

Use a `<slot/>` element to render the contents of all other modules and the contents of the Markdown document.


### Root
You can go extreme and override the entire `html` element in which case you can customize everything, including the document head:

```html
<html>
  <head>
    <!-- system meta elements (auto-generated) -->
    <slot for="head"/>

    <!-- custom meta elements -->
    <meta property="og:description" :content="og_description">
  </head>

  <!-- custom body layout -->
  <body>
    <main>
      <h1>{ title }</h1>

      <!-- slot for the Markdown content and it's sections -->
      <slot for="content"/>
    </main>
  </body>

</html>
```


### Head
The contents of your document's`<head>` element are auto-generated based on your project settings and what [dependencies](project-structure.html#dependencies) your page has.

You can add custom metadata, external scripts and styles, and other extra elements to the head section with a "<head>" element. For example:


```html
<head>
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

  <!-- custom head content  -->
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'self'; img-src https://*; child-src 'none';" />
</head>
```

## Page layout
Nue [extends](content.html) the basic Markdown syntax to make it suitable for assembling rich web pages. This content is nested inside an `article` element:


```html
<body>
  <main>
    <article>
>     <section>
>       <p>The content goes here</p>
>     </section>
    </article>
  </main>
</body>
```


### Sections
The content is always nested inside one or more section elements. A multi-section HTML output looks like this:

```html
<article>

> <section>
    <h1>Hello, World!</h1>
    <p>First section</p>
  </section>

> <section>
    <h2 id="hello-again">
      <a href="#hello-again" title="Hello again"></a>Hello again
    </h2>
    <p>Another section</p>
  </section>

</article>
```

The `section` elements are direct descendants of the article and cannot occur anywhere else on the page.



### Section classes
You typically want to define classes for the sections for styling purposes. These classes (and IDs) can be defined explicitly after the section separator. For example:


```md
\--- •#my-id.class-name•

# Section title
And a description
```

This will generate the following:

```html
<article>
  <section id="ux" class="features">...</section>
  ...
</article>
```

However, it's better to define these classes in the application data or the document's front matter. For example, the [front page](/) of this website has the following:

```yaml
sections: [hero, features, explainer, status, feedback]
```

Defining the classes outside the Markdown keeps the content clean and raises fewer questions from the copywriters.












