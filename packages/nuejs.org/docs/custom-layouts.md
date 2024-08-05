

# Custom layouts
The design system consists of various "slots" that you can fill or replace with custom template content. The slots are named as follows:

[image.bordered /img/custom-layout.svg]


For example, if you want to add a custom banner above the global header you'd create a layout module called "banner":

```
<div •@name="banner"•>
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>
```

The bolded slot names (header, footer, and aside) don't require the `@name` attribute, because the slot is identified directly from the HTML tag name. For example, a custom `aside` tag is always placed prior to the `main` element:

```
<aside>
  <h3>{ hello }</h3>
</aside>
```

The layouts are written in an HTML-based [template language](template-syntax.html) and the template variables have access to the [project data](project-structure.html#data).

The modules can be stored in any file with a `.html` suffix such as `layout.html` and the file can contain multiple layout components.



### Area-specific layouts
You can customize the layout of all the different areas of your website like the documentation- or blogging area. Think custom sidebars, blog entry "hero" layouts, or custom footers. The area-specific layouts override any existing layouts defined globally at the root level.

This documentation area, for example, has the following documentation- specific layouts in [docs/layout.html](//github.com/nuejs/nue/blob/dev/packages/nuejs.org/docs/layout.html):


```
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

``` yaml
aside: false
pagehead: false
pagefoot: false
```



### Main Layout
You can override the `main` element by re-defining it in a layout file. For example:

```
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

```
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

      <!-- slot for the markdown content and it's sections -->
      <slot for="content"/>
    </main>
  </body>

</html>
```


## Built-in helper components
You can use several built-in helper components when building your layouts. For example, the blogging area on this website takes advantage of several built-in components in the blog entry "hero" area:

```
<header @name="pagehead">

  <!-- pretty-date: pretty prints the "date" metadata  -->
  <pretty-date/>

  <!-- markdown component to render the page title -->
  <h1><markdown :content="hero_title || title"/></h1>

  <!-- custom <author/> component -->
  <author :bind="authors[author || authors.default]"/>

</header>
```

Here are all the helper components:


### `<navi>`
Renders an ARIA compatible navigational element based on the data given in the `items` attribute. The data must be formatted in a specific [YAML format](page-layout.html#yaml) which supports multiple types of navigation types: flat, hierarchical, and more complex dropdown navigation menus.

This website, for example, uses the `<navi/>` component in the sidebar of the  documentation area:

```
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

```
<nav aria-label="Table of Contents">
  <a href="#less-but-better" class="level-2">Less, but better</a>
  <a href="#a-different-mindset" class="level-2">A different mindset</a>
  <a href="#global-design-system" class="level-3">Global Design System</a>
  <a href="#web-standards-model" class="level-3">Web Standards Model</a>
  ...
</nav>
```

Only second and third level headings (h2,  h3) are included in the navigation. You can enhance a web component with JavaScript by adding an `is` attribute on the component. For example:

```
<toc is="observing-nav"/>
```


### Custom components
You can create custom layout components and custom markdown extensions for content authors with Nue's layout syntax. Here, for example, is a generic author component:

```
<div @name="author" class="author">
  <span><img :src="img" width="36" height="36"></span>

  <aside>
    <b>{ name }</b>
    <a href="//x.com/{ username }">@{ username }</a>
  </aside>
</div>
```

Check out the documentation for [custom components](template-syntax.html#custom-components).



