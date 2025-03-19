
# Core components
This section outlines the built-in server-side components in Nue, designed to assist you with common layout tasks.

## Navi
Navigation is a fundamental aspect of web design, including elements like global headers, footers, sidebars, and burger menus. These navigational elements serve as wrappers for links that guide users through your site. The `<navi/>` tag is a useful utility for rendering these links based on the data defined in your [information architecture](content-authoring.html#ia). Here’s an example of how to create a header with navigation:

```html
<header>
  <!-- Logo -->
  <a href="/">
    <img src="/img/logo.svg" alt="Logo">
  </a>

  <!-- Master navigation -->
  <navi :items="mastnav"/>
</header>
```

### Example navigation data
Here’s how you can define the navigation data in a `site.yaml` file:

```yaml
mastnav:
  - Documentation: /docs/
  - About: /about/
  - Blog: /blog/
  - "v1.0 is out!": /blog/v1.0/ "badge"
```

When this data is utilized, your header will render as follows:

```html
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

In this example, a quoted string ("badge") after the URL will be converted into a class name for the corresponding link.

### Hierarchical navigation
You can also supply hierarchical data for the `<navi>` tag, which helps create structured navigation menus:

```yaml
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

When you use `<navi :items="footer"/>`, it renders the following structure:

```html
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

### Adding images and buttons
You can also include images and buttons in your navigation configuration. Here’s an example:

```yaml
main_navigation:
  - image: /img/logo.png
    class: logo
    url: /

  - Product: /product/
  - Pricing: /pricing/
  - FAQ: /faq/

  - url: /get-started/
    label: Get Started
    role: button
```

### Why this is good
Using the `<navi>` component offers several advantages:

- **Centralized management**: It allows you to manage your information architecture from a single location, making updates easier and more consistent.
- **Clean layout modules**: Your layout modules remain simple and easy to read, as the navigation structure is automatically generated from your defined data.

## Markdown
The `<markdown>` component renders a Markdown-formatted string provided in the `content` attribute. This feature enables you to use Markdown in your metadata — typically for titles and descriptions — and then render it as HTML within your layout modules:

```html
<markdown :content="description"/>
```

## Pretty-date
The `<pretty-date>` component displays a formatted date value provided in the `date` attribute. This is particularly useful in blogging areas and helps present dates in a more user-friendly manner:

```html
<pretty-date :date="date"/>
```

Here’s an example of a "hero" area for a blog entry that utilizes both the `markdown` and `pretty-date` components:

```html
<header @name="pagehead">
  <pretty-date :date="date"/>

  <h1><markdown :content="title"/></h1>

  <div class="description">
    <markdown :content="description"/>
  </div>
</header>
```

## Table of contents
The built-in `<toc/>` component automatically generates a table of contents from the current Markdown document, focusing on its second and third-level headings (h2 and h3). This tag works seamlessly for all your Markdown files without requiring additional setup:

```html
<toc class="toc"/>
```

The HTML output will resemble the following:

```html
<div aria-label="Table of contents" class="toc">
  <nav>
    <a href="#default-layout">
      <strong>Default layout</strong>
    </a>
  </nav>
  <nav>
    <a href="#slots"><strong>Slots</strong></a>
    <a href="#filling-the-slots">Filling the slots</a>
    <a href="#template-inheritance">Template inheritance</a>
    <a href="#disabling">Disabling slots</a>
  </nav>
  <nav>
    ...
  </nav>
</div>
```


## Page list
The built-in `<page-list>` tag allows you to render a list of pages, such as blog entries or other index content, directly within your templates. This tag is ideal for creating dynamic lists that automatically update as you add new content to your site.

To see how to collect and customize the pages in your list, refer to the [content collections](content-collections.html) documentation.
