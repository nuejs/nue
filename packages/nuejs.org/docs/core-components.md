
## Core components
Nue offers a set of built-in helper components to help you construct the layout modules.


### Navi
Most of your layout modules relate to navigation: the global header and footer, sidebars, and the burger menu typically consists of links to the various pages on your website. The `<navi/>` tag is a useful utility to render those links using the data on your [settings and data files](settings-and-data.html). Here is an example header:

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
  - "v1.0 is out!": /blog/v1.0/ "badge"
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
    <a href="/blog/v1.0/" class="badge">v1.0 is out!</a>
  </nav>
</header>
```

A quoted string ("badge") after the URL becomes a class name for the link.


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


### Pretty-date
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
