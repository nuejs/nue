
# Layout
A global design system standardizes the structure of your web pages, allowing you to use the same HTML markup, while applying different external CSS, to achieve a wide range of designs.

Nue extends this basic idea to span your entire website. You continue using YAML and Markdown for your content, but now you can also use YAML to describe your information architecture. This includes all your navigational elements, the global header, the global footer, and the "burger menu".



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


## Sections
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


## Generic blocks
Content authors can write [blocks of content](content.html#blocks) with class names that are part of your design system:

```html
<div class="note">
  <h2>Note</h2>
  <p>Web design is 100% content and 95% typography</p>
</div>
```

Common class names to implement in your CSS are: "note", "warning", "alert" or "info".


### Flex layouts
Content writers can create content blocks with nested items so that they form a [flex layout](//developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox). For example:

```html
<div class="flexbox">

  <!-- first item -->
  <div>
    <h3>First item</h3>
    <p>Some content</p>
  </div>

  <!-- second item -->
  <div>
    <h3>Second item</h3>
    <p>Some content</p>
  </div>
</div>
```

Depending on the semantics of your design system, the container can have a generic name such as "stack" or "flexbox" which can be shared across the different areas of your website. The name can also be page-specific such as "feature-card", which is better suited for marketing content.


### Grid layouts
[Grid](tags.html#grid) is a built-in Markdown extension for more complex [gird layouts](//developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids). It's like a flex box but allows you to set up class names for the individual items, and you can make the items [reactive](reactivity.html#web-components) by turning them into Web Components.

```html
<div class="grid">

  <!-- first item -->
  <div class="card" is="grid-item">
    <h3>First item</h3>
    <p>Some content</p>
  </div>

  <!-- second item -->
  <div class="card" is="grid-item">
    <h3>Second item</h3>
    <p>Some content</p>
  </div>

  <!-- third item -->
  <div class="card" is="grid-item">
    <h3>Third item</h3>
    <p>Some content</p>
  </div>
</div>
```

### Grid items
You can configure class names and a [web component instance](reactivity.html#grid-items) for your grid items:

```yaml
grid_item_class: card
grid_item_component: gallery-item
```

While you can also set up these properties directly on the grid tag, it's better to set up these globally so that the syntax of adding grids narrows down to just writing `[grid]` without the need to remember the attributes. This keeps your content clean from extra, layout-specific definitions.



### Markdown generated HTML
Markdown content can reside within sections, blocks, and grid items. The generated HTML is restricted to: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `strong`, `em`, `a`, `ul`, `li`, `blockquote`, and `code`.












### Tabs
Tabbed layouts are rendered with the standard [tablist](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role) and [tabpanel](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tabpanel_role) roles:


```html
<div class="tabs" is="aria-tabs">

  <div role="tablist">
    <a role="tab" aria-selected>First</a>
    <a role="tab">Second</a>
    <a role="tab">Third</a>
  </nav>

  <ul>
    <li role="tabpanel">
      <h2>First content block</h2>
      <p>Full Nuemark support on blocks</p>
    </li>

    <li role="tabpanel" hidden>
      <h2>Second block</h2>
      <img src="hello.png" loading="lazy">
    </li>

    <li role="tabpanel" hidden>
      <h2>Second block</h2>
      <img src="hello.png" loading="lazy">
    </li>
  </ul>

</div>
```

Nue uses the "aria-tabs" web component to implement the show/hide behavior for the tab panes. This implementation is found in [nuemark.js](//github.com/nuejs/nue/blob/master/packages/nuemark/src/browser/nuemark.js) which is automatically included when the tabs component is in use.


## Code
Nue has built-in support for [syntax highlighting](syntax-highlighting.html) in the Markdown fenced code blocks. They are rendered as follows:

```html
<pre>
  <code language="typescript">
    <sup>// a comment</sup>
    <em>"A string value"</em>
    ...
  </code>
</pre>
```

Code blocks with a title are rendered as follows:

```html
<figure>
  <figcaption>
    Title of the codeblock <b>with formatting</b>
  </figcaption>

  <pre>
    <code language="rust">
      ...
    </code>
  </pre>
</figure>
```


### Multi-code blocks
Multiple code blocks can be nested inside a single parent element:

```html
<div class="my-class-for-multiblocks">
  <figure>...</figure>
  <figure>...</figure>
  <figure>...</figure>
</div>
```

### Code tabs
Multiple code blocks can be tabbed so that a maximum of one code block is visible at once:

```html
<div class="tabs" is="aria-tabs">

  <div role="tablist">
    <a role="tab" aria-selected>First</a>
    <a role="tab">Second</a>
    <a role="tab">Third</a>
  </nav>

  <ul>
    <li role="tabpanel"><figure>...</figure></li>
    <li role="tabpanel" hidden><figure>...</figure></li>
    <li role="tabpanel" hidden><figure>...</figure></li>
  </ul>
</div>
```

The implementation is similar to standard [tabs](#tabs), but the markup is plain code and not generic content.


## Wrappers
Tables, code blocks and tabs can be nested inside a wrapper element to allow more visual design around the element:


```html
<div class="•gradient-wrap•">
  <table>
    ...
  </table>
</div>
```





## Standardized HTML
After describing your headers and footers in the `layout.html` file, the default page layout for Markdown content looks like this:

[image.bordered /img/page-layout.svg]
  caption: Standard page layout blocks
  size: 598 × 667 px


To see this in practice lets create an `index.md` file with the following content:

```md
# Hello, World!
```

This will generate the following HTML:

```html
<!DOCTYPE html>

<html lang="en-US" dir="ltr">
  <head>
    <!-- user metadata -->
    <title>Hello, World!</title>

    <!-- system metadata -->
    <meta name="generator" content="Nue">
    <meta name="date.updated" content="...">
    <meta name="viewport" content="...">
  </head>

  <!-- document body for styling -->
  <body>
    <main>
      <article>
        <section>
          <h1>Hello, World!</h1>
        </section>
      </article>
    </main>
  </body>

</html>
```

This forms the basis for our markup, which has no styling information included in any format. Not in the style attribute, nor class name attribute. This is the core idea of the global design system: You'll get a *headless* markup that you can style in different ways.



#### The head element
The contents of your head element are auto-generated based on your [settings](settings.html) and [project structure](project-structure.html). For example, if you have the files `hello.css` and `hello.js` in your project root and a `site.yaml` file with the following data:

```yaml
favicon: /favicon.png
description: A Nue demo
```

Your head element will be rendered as follows:

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
  <meta name="date.updated" content="...">
  <meta name="viewport" content="...">
  ...
</head>
```


# Custom layouts
The design system consists of various "slots" that you can fill or replace with custom template content. The slots are named as follows:

[image.bordered /img/custom-layout.svg size="569 × 634 px"]


For example, if you want to add a custom banner above the global header you'd create a layout module called "banner":

```html
<div •@name="banner"•>
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>
```

The bolded slot names (header, footer, and aside) don't require the `@name` attribute, because the slot is identified directly from the HTML tag name. For example, a custom `aside` tag is always placed prior to the `main` element:

```html
<aside>
  <h3>{ hello }</h3>
</aside>
```

The layouts are written in a HTML-based [template language](template-syntax.html) and the template variables have access to the [project data](project-structure.html#data).

The modules can be stored in any file with a `.html` suffix such as `layout.html` and the file can contain multiple layout components.



### Area-specific layouts
You can customize the layout of all the different areas of your website like the documentation or blogging area. Think custom sidebars, blog entry "hero" layouts, or custom footers. The area-specific layouts override any existing layouts defined globally at the root level.

This documentation area, for example, has the following documentation-specific layouts in [docs/layout.html](//github.com/nuejs/nue/blob/master/packages/nuejs.org/docs/layout.html):


```html
<!-- main sidebar (left) -->
<aside id="sidebar" popover>
  <button popovertarget="sidebar">&times;</button>
  <navi :items="sidenav"/>
</aside>


<!-- complementary sidebar (right) -->
<aside @name="complementary">
  <h3>{ lang.this_page }</h3>
  <toc is="observing-nav"/>

  <div class="zen-toggle">
    <h5>Zen Mode</h5>
    <label class="toggle">
      <input type="checkbox" is="zen-toggle">
    </label>
  </div>
</aside>

<!-- the back button below the global header -->
<nav @name="subheader">
  <button popovertarget="sidebar"/>
  <strong>{ lang.menu } &rsaquo; { title }</strong>
</nav>
```

### Leaving out layouts { #disabling }
Sometimes you want to leave out some layouts. For example, the blog index page might want to disable the layout components that are available on the actual blog entries. This happens by setting the desired layout components to `false`. For example:

```yaml
aside: false
pagehead: false
pagefoot: false
```



### Main Layout
You can override the `main` element by re-defining it in a layout file. For example:

```html
<main>
  <h1>Hello, World!</h1>

  <!-- slot for the Markdown content -->
  <slot for="content"/>
</main>
```

[.warning]
  ### Warning
  Overriding the main element breaks you out of the global design system.


### Root layout
You can go extreme and override the entire `html` element in which case you can customize everything inside the html element, including the document head:

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


## Built-in helper components
You can use several built-in helper components when building your layouts. For example, the blogging area on this website takes advantage of several built-in components in the blog entry "hero" area:

```html
<header @name="pagehead">

  <!-- pretty-date: Pretty prints the "date" metadata  -->
  <pretty-date/>

  <!-- Markdown component to render the page title -->
  <h1><markdown :content="hero_title || title"/></h1>

  <!-- custom <author/> component -->
  <author :bind="authors[author || authors.default]"/>

</header>
```

Here are all the helper components:


### `<navi>`
Renders an ARIA compatible navigational element based on the data given in the `items` attribute. The data must be formatted in a specific [YAML format](page-layout.html#yaml) which supports multiple types of navigation types: Flat, hierarchical, and more complex dropdown navigation menus.

This website, for example, uses the `<navi/>` component in the sidebar of the documentation area:

```html
<aside id="sidebar" popover>
  <button popovertarget="sidebar">&times;</button>
  <navi :items="sidenav"/>
</aside>
```
You can use an optional `label` attribute as the value for the `aria-label` HTML attribute for the generated `<nav/>` element.


### `<markdown>`
Renders a Markdown-formatted string given in the `content` attribute.

### `<pretty-date>`
Pretty-prints a date value given in the `date` attribute.


### `<toc>`
Renders a table of contents from the current Markdown document.

```html
<nav aria-label="Table of Contents">
  <a href="#less-but-better" class="level-2">Less, but better</a>
  <a href="#a-different-mindset" class="level-2">A different mindset</a>
  <a href="#global-design-system" class="level-3">Global Design System</a>
  <a href="#web-standards-model" class="level-3">Web Standards Model</a>
  ...
</nav>
```

Only second and third level headings (h2, h3) are included in the navigation. You can enhance a web component with JavaScript by adding an `is` attribute on the component. For example:

```html
<toc is="observing-nav"/>
```


### Custom components
You can create custom layout components and custom Markdown extensions for content authors with Nue's layout syntax. Here, for example, is a generic author component:

```html
<div @name="author" class="author">
  <span><img :src="img" width="36" height="36"></span>

  <aside>
    <b>{ name }</b>
    <a href="//x.com/{ username }">@{ username }</a>
  </aside>
</div>
```

Check out the documentation for [custom components](template-syntax.html#custom-components).



