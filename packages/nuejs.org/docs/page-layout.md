
# Page layout
A global design system standardizes the structure of your web pages, allowing you to use the same HTML markup, while applying different external CSS, to achieve a wide range of designs.


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

## Global navigation { #navigation }
Nue offers a simple, [YAML-based syntax](#nav-syntax) for defining all the site-wide navigation elements: Global header and footer, the burger menu, dropdown menus and any other complementary menus you may have. This declarative syntax is beneficial for several reasons:

1. It always produces the same markup across projects that you can rely on when styling your website. This adapts to the idea of the global design system.

2. You can define your information architecture and start the CSS development immediately without going deep with the content.

3. It's easy to define new localized versions of your site by providing a different YAML file to override and extend the default locale. Note: This kind of localization is not supported yet, but will be in the future.



### Global header
Let's add a global header to our document. This happens with a `header` property in the `site.yaml` file:

```yaml
header:
  Master navigation:
    - Documentation: /docs/
    - Blog: /blog/
    - About: /about/
  ...
```

Now our website has a new `header` element nested directly under the `body`. It has the following layout:

```html
<body>

  <!-- global header for all the pages -->
  <header>
    <nav aria-label="Master navigation">
      <a href="/docs/">Documentation</a>
      <a href="/blog/">Blog</a>
      <a href="/about/">About</a></nav>
    </nav>
  </header>

  <main>
    ...
  </main>
</main>
```

The YAML syntax allows you to build navigation elements of any complexity. This website, for example, uses the following data for the header:


```yaml
header:
  Branding:
    - image: /img/logo.svg
      class: logo
      alt: Nue logo
      size: 60 × 18
      url: /

  Site navigation:
    - Docs: /docs/
    - Blog: /blog/
    - Nue 1.0 beta: /blog/nue-1-beta/ "status pill"

  Toolbar:
    - image: /icon/x-logo.svg
      url: //x.com/tipiirai
      class: social
      alt: X logo
      size: 39 x 39

    - text: 6.0k
      url: //github.com/nuejs/nue
      class: github pill
```

This generates three `<nav/>` elements inside the header:

```html
<header>
  <nav aria-label="Branding">...</nav>
  <nav aria-label="Site navigation">...</nav>
  <nav aria-label="Toolbar">...</nav>
</header>
```


### Burger menu { #burger }
Next, we add a "burger menu" to our application by adding a `burger_menu` property to the `site.yaml` file. We use the same [syntax](#nav-syntax) as we used for the header. For example:

```yaml
burger_menu:
  - Home: /home/
  - Docs: /docs/
  - Blog: /blog/
```

This will add a menu trigger element under the global header.

```html
<header>
  <nav aria-label="master_navigation">...</nav>
+ <button popovertarget="menu"></button>
</header>
```

The actual popover menu is added to the end of the document body:

```html
<body>
  <main>
    ...
  </main>

  <dialog id="menu" popover>
    <button popovertarget="menu">×</button>
    <nav>
      <a href="/home/">Home</a>
      <a href="/docs/">Docs</a>
      <a href="/blog/">Blog</a>
    </nav>
  </dialog>
</body>
```

Now we have an easily customizable menu that is compatible with the standard [Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API).



### Global footer
The global footer is defined similarly with a `footer` property in `site.yaml`. We'll add the following in there:

```yaml
footer:
  Branding:
    - image: /img/logo.svg
      size: 65 × 19
      url: /

  Categories:
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


Now our website has a global footer element right after the `main` element. It has the following layout:

```html
<footer>
  <nav aria-label="Branding">
    <a href="/">
      <img src="/img/logo.svg" width="65" height="19">
    </a>
  </nav>

  <div aria-label="Categories">
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
</footer>
```


## Navigation syntax { #nav-syntax }
Here is the basic syntax for defining navigational elements:

```yaml
Navi title:
  - Link 1 text: /first/link
  - Link 2 text: /second/link "pill"
  - ...
```

This generates the following HTML:

```html
<nav aria-label="Navi title">
  <a href="/first/link">Link 1 text</a>
  <a href="/second/link" class="pill">Link 2 text</a>
  ...
</nav>
```

#### Nav items
The individual items can be images, horizontal lines, links with extra properties, or just plain text:

```yaml
Rich navigation:
  - image: /img/logo.png
    size: 100 x 30
    alt: The logo
    url: /

  # separator
  - ---

  - text: Link text
    url: /link/url
    class: pill
    role: button

  - text: Just some text
    class: info

  # class shortcut
  - Another: /second/url "cute"
```

The above generates this:

```html
<nav aria-label="Rich navigation">
  <a href="/">
    <img src="/img/logo.png" width="100" height="30" alt="The logo">
  </a>
  <hr>
  <a href="/link/url" class="pill" role="button">
    Link 1 text
  </a>
  <span class="info">Just some text</span>

  <a href="/second/url" class="cute">Another</a>
</nav>
```

### Categorized navi
Categorized navigations are typically used in the global footer and in any sidebar you may have. You can define them as follows:

```yaml
Categories:
  Category 1:
    - Text: /link
    - Text: /link

  Category 2:
    - Text: /link
    - Text: /link
```

This will generate the following:


```html
<div aria-label="Categories">
  <nav>
    <h3>Category 1</h3>
    <a href="/link">Text</a>
    <a href="/link">Text</a>
  </nav>

  <nav>
    <h3>Category 2</h3>
    <a href="/link">Text</a>
    <a href="/link">Text</a>
  </nav>
</div>
```


### Dropdown menus
Dropdown menus can be defined as follows


```yaml
Navigation:
  - Docs: /docs/
  - Blog: /blog/

  # The dropdown
  - More:
    - About Us: /about/
    - Contact: /contact/
    - FAQ: /faq/
```

This will generate the following:


```html
<nav aria-label="Navigation">
  <a href="/docs/">Docs</a>
  <a href="/blog/">Blog</a>

  <!-- the dropdown -->
  <span aria-haspopup>
    <a aria-expanded="false">More</a>

    <nav>
      <a href="/about/">About Us</a>
      <a href="/contact/">Contact</a>
      <a href="/faq/">FAQ</a>
    </nav>
  </span>
</nav>
```

The standard [aria-haspopup](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup) and [aria-expanded](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded) roles can be used on your CSS to implement the dropdown behavior.


[.note]
  ### Note
  In the future, there will be a demonstration of a full, animated Stripe-like dropdown menu.



## Markdown content { #md }
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


### Blocks
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

The design of these tags should be [context-specific](css-best-practices.html#fff). For example, technical content is typically styled different from marketing content.


## Built-in tags


### Button
Buttons are rendered as follows:

```html
<a role="button" href="/docs/">Learn more</a>
```

Buttons are essentially links with a `role="button"` attribute because links don't require JavaScript to work.

Design systems commonly have different styles for primary and secondary buttons so it's a common pattern to implement them in your CSS. You also might want to provide styling for the `[disabled]` attribute.


### Image
Images are rendered as follows:

```html
<figure>
  <img src="hello.webp" loading="lazy">
</figure>
```

They can have captions:

```html
<figure>
  <img src="less.webp" loading="lazy">
  <figcaption>Less is More</figcaption>
</figure>
```

They can be nested inside a link:

```html
<a href="/docs/">
  <figure>
    <img src="book.svg" loading="lazy">
    <figcaption>View documentation</figcaption>
  </figure>
</a>
```

They can be [responsive](//developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images):

```html
<figure>
  <img
    srcset="planet.png 450w, planet-big.png 900w"
    sizes="(max-width: 600px) 450px, 900px"
    alt="This is the alt text"
    loading="eager"
    class="tall">
</figure>
```

[Art direction](//web.dev/articles/codelab-art-direction) is supported:

```html
<figure>
  <picture>
    <source src="ui-tall.png" media="(max-width: 750px)" type="image/png">
    <source src="ui-wide.png" media="(min-width: 750px)" type="image/png">
    <img src="ui-wide.png" loading="lazy">
  </picture>
</figure>
```

They can use classes from your design system:

```html
<figure class=•"heroic"•>
  <img src="hello.webp" loading="lazy">
</figure>
```


### Video
Videos are rendered as a native HTML5 video element:

```html
<video class="heroic" width="1000" poster="hello.png">
  <source src="hello.webm" type="video/webm">
  <source src="hello.mp4" type="video/mp4">
</video>
```


### Tables
Tables are rendered as standard HTML:

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Work title</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Alice Johnson</td>
      <td>alice.johnson@demo.ai</td>
      <td>Copywriter</td>
    </tr>

    <tr>
      <td>John Smith</td>
      <td>john.smith@demo.ai</td>
      <td>UX developer</td>
    </tr>

    ...

  </tbody>
</table>
```


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


