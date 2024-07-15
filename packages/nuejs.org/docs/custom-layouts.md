
---
class: apidoc
---

# Custom layout
You can alter the generated HTML by defining custom layout modules to the various slots in the global design system:

! slots

// @banner
// header
// @subheader

// aside
// @complementary

// @pagehead
// @pagefoot

// footer
// @bottom
// @menu


For example, if we want to add a custom banner above the global header you'd create a layout module called "banner" as follows:

```
<div •@name="banner"•>
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>
```

For more generic elements, that HTML tag name itself defines the slot. For example, a custom `aside` tag is always placed prior the `main` element:

```
<aside>
  <h3>{ hello }</h3>
</aside>
```

The modules can be stored in any file with a `.html` suffix such as `layout.html`. The layout file can contain multiple layout components.

You can use a HTML-based [template language](template-syntax.html) when defining layouts and the template variables have have access to the [project data](project-structure.html#data).



### Application layouts
Yuu can customize the layout for all the different ares on your site like the documentation- or blogging area. You can, for example, define a custom sidebar under the documentation area or a blog hero component for the indiviual blog entries.

This documentation area, for example has the following directory- specific layout components in [docs/layout.html](//github.com/nuejs/nue/blob/dev/packages/nuejs.org/docs/layout.html):


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
Sometimes you want to leave out some layouts. For example the blog index page might want to disable the layout components that are available on the actual blog entries. This happens by setting the desired layout componets to `false`. For example:

``` yaml
aside: false
pagehead: false
pagefoot: false
```



### Main layout
You can override the `main` element by re-defining that in a layout file. For example:

```
<main>
  <h1>Hello, World!</h1>

  <!-- slot for the Markdown content -->
  <slot for="content"/>
</main>
```

[.warning]
  ### Warning
  Overriding the main element breaks you out from the global design system.


### Root layout
You can go extreme and override the entire `html` element in which case you can customize everything inside the html element including the document head:

```
<html>
  <head>
    <!-- system meta elements (auto generated) -->
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


## Built-in layout components
You can use several helper component when building your layouts. For example, the blogging area on this website utilizes several built-in components in the blog entry "hero" area:

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


### navi
Renders a ARIA compatible navigational element based on the data given in the `items` attribute. The data must be formatted in a specific [YAML format](page-layout.html#yaml) which suppports multiple types of navigation types: flat, hierarchical, and more complex dropdown navigation menus.

This website, for example, uses the `<navi/>` component in the sidebar of the  documentation area:

```
<aside id="sidebar" popover>
  <button popovertarget="sidebar">&times;</button>
  <navi :items="sidenav"/>
</aside>
```
You can use an optional `label` attribute as the value for the `aria-label` HTML attribute for the generated `<nav/>` element.


### markdown
Renders a Markdown formatted string given in the `content` attribute.

### pretty-date
Pretty-prints a date value given in the `date` attribute.


### toc
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

Only second- and third level headings (h2,  h3) are included in the navigation. You can enhance the component with JavaScript by assigning a web component with `is` attribute. For example:

```
<toc is="observing-nav"/>
```


### Custom components
You can create custom layout components and custom markown extensions for content authors with Nue's layout syntax. Here, for example, is an generic author component:

```
<div @name="author" class="author">
  <span><img :src="img" width="36" height="36"></span>

  <aside>
    <b>{ name }</b>
    <a href="//x.com/{ x }">@{ x }</a>
  </aside>
</div>
```

Check out documentation for [custom components](template-syntax.html#custom-components).



