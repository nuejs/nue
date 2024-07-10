

# Page layout
Nue standardizes the structure of your web pages so you can use the same HTML between projects, but you can [write CSS](ux-development.html) to achieve wildly different designs.


## Headless markup
Lets start by creating `index.md` to an empty project folder with the following content:

``` md
# Hello, World!
```

This will genererate the following HTML:

```
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

This forms the basis for our _headless_ HTML markup, with absolutely no class names or styling included. This is the core idea of the global design system: you'll get the exact same markup between projects, but you can style them differently with CSS.


## Global layout
Nue offers a simple, [YAML-based syntax](#yaml) for defining all the site-wide navigation elements you may have: global header and footer, the burger menu, dropdown menus, and any other supporting menus and sidebars. This declarative method of describing your global elements is benefical for several reasons:

1. You can define the skeleton of your website and start the design work immediately without going deep with the content development.

1. You can define the basic website elements with YAML without ever touching HTML.

1. It always produces the exact markup that can be re-used accross projects.

1. It's easy to define new localized versions of your site by providing a different YAML file to override and extend the default locale. Note: this kind of localization is supported yet, but will be in the future.



### Header
Let's add a global header to our document. This happens with a `header` property in the `site.yaml` file:

``` yaml
header:
  Master navigation:
    - Documentation: /docs/
    - Blog: /blog/
    - About: /about/
  ...
```

Now our website has a new `header` element nested directly under the `body`. It has the following layout:

```
<body>

  <!-- global header for all the pages -->
  <header>
    <nav aria-label="Master navigation">
      <a href="/docs/">Documentation</a>
      <a href="/blog/">Blog</a>
      <a href="/about/">About</a></nav>
    </hav>
  </header>

  <main>
    ...
  </main>
</main>
```

The YAML syntax allows you to build navigation elements of any complexity. This website, for example, uses the following data for the header:


``` yaml
header:

  # Nue logo
  Branding:
    - image: /img/logo.svg
      size: 60 × 18
      url: /

  # Master navigation
  Site navigation:
    - Docs: /docs/
    - Blog: /blog/
    - label: Nue 1.0 Alpha is here! ›
      url: /blog/status-update-01/
      class: status badge

  # Call to actions
  Toolbar:
    - label: Try beta
      url: /docs/
    - ---
    - label: "*6.0k*"
      url: //github.com/nuejs/nue
      class: github badge
```

This generates three `<nav/>` elements inside the header:

```
<header>
  <nav aria-label="Branding">...</nav>
  <nav aria-label="Site navigation">...</nav>
  <nav aria-label="Toolbar">...</nav>
</header>
```


### Burger menu
Next we add a "burger menu" to our application by adding a `burger_menu` property to the `site.yaml` file. We use the same [syntax](#yaml) as we used for the header. For example:

``` yaml
burger_menu:
  - Home: /home/
  - Docs: /docs/
  - Blog: /blog/
```

This will add a a menu trigger element under the global header

```
<header>
  <nav aria-label="master_navigation">...</nav>
+ <button popovertarget="menu"></button>
</header>
```

And the actual popover menu is added to the end of the document body:

```
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

Now we have an easily customizable menu that is compatible with the standard [Popover API][//developer.mozilla.org/en-US/docs/Web/API/Popover_API].



### Footer
The global footer is defined similarly with a `footer` property in `site.yaml`. We'll add the following in there:

``` yaml
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

```
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


## Navigation syntax
Nue offers an easy YAML-based syntax for defining navigational elements: inside your headers, footers, and sidebars. The basic syntax is this:

``` yaml
Navi title:
  - Link 1 label: /first/link
  - Link 2 label: /second/link "badge"
  - ...
```

Which generates the following navigation layout:

```
<nav aria-label="Navi title">
  <a href="/first/link">Link 1 label</a>
  <a href="/second/link" class="badge">Link 2 label</a>
  ...
</hav>
```

#### Nav items
The individual items can be images, horizontal lines, links with extra properties, or just plain text:

``` yaml
Rich navigation:
  - image: /img/logo.png
    size: 100 x 30
    alt: The logo
    url: /

  - ---

  - label: Link label
    url: /link/url
    class: badge
    role: button

  - label: Just some text
    class: info
```

The above generates this:

```
<nav aria-label="Rich navigation">
  <a href="/">
    <img src="/img/logo.png" width="100" height="30" alt="The logo">
  </a>
  <hr>
  <a href="/link/url" class="badge" role="button">
    Link 1 label
  </a>
  <p class="info">Just some text</p>
</nav>
```

### Categorized navi
Categorized navigations in footers and sidebars have the following YAML syntax:

``` yaml
Categories:
  Category 1:
    - Label: /link
    - Label: /link

  Category 2:
    - Label: /link
    - Label: /link
```

This will generate the following:


```
<div aria-label="Categories">
  <nav>
    <h3>Category 1</h3>
    <a href="/link">Label</a>
    <a href="/link">Label</a>
  </nav>

  <nav>
    <h3>Category 2</h3>
    <a href="/link">Label</a>
    <a href="/link">Label</a>
  </nav>
</div>
```


### Dropdown menus
Dropdown menus can be defined as follows


``` yaml
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


```
<nav aria-label="Navigation">
  <a href="/docs/">Docs</a>
  <a href="/blog/">Blog</a>

  <!-- the dropdown -->
  <span aria-haspopup>
    <a aria-expanded="false">More</a>

    <nav>
    </nav>
  </span>
```

The standard [aria-haspopup](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup) and [aria-expanded](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded) roles can be used on your CSS to implement the dropdown behaviour.


[.note]
  ### Note
  In the future, there will be a demonstration of a full, animated Stripe-like dropdown menu.



## Content area
Nue [extends](content.html) the basic Markdown syntax to make it suitable for assembling web pages. This content is nested inside an `article` element:


```
<body>
  <main>
   <article>
>     <!-- the content goes here -->
    </article>
  </main>
</body>
```


### Sections
Content writers can split the content area into sections. The HTML output looks like this:

```
<article>
  <section>
    <h1>Hello, World!</h1>
    <p>First section</p>
  </section>

  <section>
    <h2 id="hello-again">
      <a href="#hello-again" title="Hello again"></a>Hello again
    </h2>
    <p>Another section</p>
  </section>
</article>
```

The `section` elements are direct descendants to the article and cannot occur anywhere in the page.



### Section classes
You typically want to define classes for the sections for styling purposes. These classes (and id's) can be defined explicitly after the section separator. For example:


``` yaml
--- •#my-id.class-name•

# Section title
And a description
```

This will generate the following:

```
<article>
  <section id="ux" class="features">...</section>
  ...
</article>
```

However, it's better to define these classes in the application data or in the document's front matter. For example, the [front page](/) of this website has the following:

```
sections: [hero, features, explainer, status, feedback]
```

Defining the classes outside the Markdown keeps the content clean and raises fewer questions from the copywriters.


### Blocks
Content authors can write [blocks of content](content.html#blocks) with class names that are part of your design system:

```
<div class="note">
  <h2>Note</h2>
  <p>Web design is 100% content and 95% typography</p>
</div>
```

Common class names to implement on your CSS are "note", "warning", "alert", or "info".


### Flex layouts
Content writers can create content blocks with nested items so that they form a [flex layout](//developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox). For example:

```
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

Depdending on the semantics of your design system, the container can have a generic name such as "stack" or "flexbox" which can be shared across the different areas of your website. The name can also be area-specific such as "feature-cards", which is better suited for marketing content.


### Grid layouts
[Grid](tags.html#grid) is a built-in Markdown extension for more complex [gird layouts](//developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids). It's like flex box, but allows you to setup class names and for the indiviual items and you can turn the items into web components so that they become [reactive](reactivity.html#web-components).


```
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

You can setup class names and the component instance globally or locally on your [application data](project-structure.html#data):

```
item_class: card
item_component: card_component
```

You can also setup these properties directly on the grid tag, but it's better to setup these globally so that the syntax of adding grids narrows down to just writing `[grid]` without the need to remember the attributes. This keeps your content clean from extra, layout-specific definitions.




## Basic built-in tags


### Button
Buttons are rendered like this:

```
<a role="button" href="/docs/">Learn more</a>
```

Buttons are implemented as links with `role="button"` because they don't require JavaScript to work. So you might want to this on your CSS code:

``` css
button, [role="button"] {
  ...
}
```

Common modifier classes to implement are `.primary` and `.secondary`. You also might want to implement the `[disabled]` attribute.


### Image
Images are rendered as follows:

```
<img src="hello.webp" loading="lazy">
```

They can also have captions:

```
<figure>
  <img src="less.webp" loading="lazy">
  <figcaption>Less is More</figcaption
</figure>
```

They can be nested inside a link:

```
<a href="/docs/">
  <figure>
    <img src="book.svg" loading="lazy">
    <figcaption>View documentation</figcaption
  </figure>
</a>
```

They can be [responsive](//developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

```
<img
  srcset="planet.png 450w, planet-big.png 900w"
  sizes="(max-width: 600px) 450px, 900px"
  alt="This is the alt text"
  loading="eager"
  class="tall">
```

[Art direction](//web.dev/articles/codelab-art-direction) is supported:

```
<picture>
  <source src="ui-tall.png" media="(max-width: 750px)" type="image/png">
  <source src="ui-wide.png" media="(min-width: 750px)" type="image/png">
  <img src="ui-wide.png" loading="lazy">
</picture>
```

They can use classes from your design system:

```
<img class=•"heroic"• src="hello.webp" loading="lazy">
```


### Video
Videos are rendered as a native HTML5 video element:

```
<video class="heroic" width="1000" poster="hello.png">
  <source src="hello.webm" type="video/webm">
  <source src="hello.mp4" type="video/mp4">
</video>
```


### Tables
Tables are rendered as standard HTML:

```
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


```
<section class="tabs" is="aria-tabs">

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

</section>
```

Nue uses "aria-tabs" web component to implement the show/hide behaviour for the tabl panes. This implementation is found in [nuemark.js](//github.com/nuejs/nue/blob/master/packages/nuemark/src/browser/nuemark.js) which is automatically included when the tabs component is in use.


## Code
Nue has a built-in support for [syntax highlighting](syntax-highlighting.html) in the Markdown fenced code blocks. They are rendered as follows:

```
<pre>
  <code language="typescript">
    <sup>// a comment</sup>
    <em>"A string value"</em>
    ...
  </code>
</pre>
```


### Multi-code blocks
Multiple code blocks can be nested inside a single parent element:

```

```

### Code tabs
Multiple code blocks can be tabbed so that maximum one code block is visible at once:


```
```


## Wrappers
Tables, code blocks, and tabs can be nested inside a wrapper element to allow more visual design around them:


```
<div class="gradient-wrap">
  <table>
    ...
  </table>
</div>
```








