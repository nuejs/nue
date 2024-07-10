
---
class: apidoc
---

# Custom layout
You can alter the generated HTML by defining custom components to the various slots in the global design system:

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


For example, if we want to add a custom banner above the header and a custom sidebar beside the `main` element we'll add a file named `layout.html` to the project root with the following content:

```
<!-- custom banner (named component) -->
<div @name="banner">
  <strong>Major update available!</strong>
  <a href="/blog/release-2.0/">Check out v2.0</a>
</div>

<!-- custom sidebar (unnamed component) -->
<aside>
  <h3>{ hello }</h3>
</aside>
```

The elements can be named or unnamed. The named elements start with @- character and are explicitly given a name on the layout. The unnamed components use the tag name as the component name.


You can use a HTML-based [template language](template-syntax.html) inside the components and you have access to the [project data](project-structure.html#data) when rendering the HTML.



### Application layouts
Yuu can customize the layout for all the different page types you may have like landing pages, blog entries, and technical documentation.

You can override the root-level layout and and/or provie new layout components in the application directory. For example, you could define a different banner and add a custom sidebar under the documentation area.

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

  <div class="zen-switch">
    <h5>Zen Mode</h5>
    <label class="switch">
      <input type="checkbox" is="zen-switch">
    </label>
  </div>
</aside>

<!-- the back button below the global header -->
<nav @name="subheader">
  <button popovertarget="sidebar"/>
  <strong>{ lang.menu } &rsaquo; { title }</strong>
</nav>
```



### Leaving out layouts
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

This is 100% custom layout, but break you out from the global design system and makes it harder to reuse CSS accross projects.


### Root layout
You can go extreme and override the entire `html` element:

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
The built-in layout components are rendered on the server-side and help you build [custom layouts](page-layout.html) for the global design system. On this website, for example, all the blog entries use the following "hero" component under the blogging area. It utilizes several layout components:

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

Here are all the built-in layout components:


### navi
Renders a ARIA compatible navigational element based on the data given in the `items` attribute. The data must be formatted in a specific [YAML format](page-layout.html#yaml) which suppports multiple types of navigation types: flat, hierarchical, and more complex dropdown navigation menus.

This website, for example, has the following layout component defined under the documentation area, which uses the `<navi/>` component:

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

Only second- and third level headings (h2,  h3) are included in the navigation.

You can turn this to a WebComponent is="observing-nav"





## Custom Markdown extensions { #custom-md }
. For example a [video]
...




### Custom layout components
Layout components, For example this site uses [author]
...


```
<div @name="author" class="author">
  <span><img :src="img" width="36" height="36"></span>

  <aside>
    <b>{ name }</b>
    <a href="//x.com/{ x }">@{ x }</a>
  </aside>
</div>
```