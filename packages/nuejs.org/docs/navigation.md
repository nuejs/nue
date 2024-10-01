
# Navigation
Nue offers a simple, [YAML-based syntax](#nav-syntax) for defining all the site-wide navigation elements: Global header and footer, the burger menu, dropdown menus and any other complementary menus you may have. This declarative syntax is beneficial for several reasons:

1. It always produces the same markup across projects that you can rely on when styling your website. This adapts to the idea of the global design system.

2. You can define your information architecture and start the CSS development immediately without going deep with the content.

3. It's easy to define new localized versions of your site by providing a different YAML file to override and extend the default locale. Note: This kind of localization is not supported yet, but will be in the future.



## Layout settings
Settings to define the global navigational elements on your page with a common [YAML-based syntax](page-layout.html#nav-syntax).

### header
HTML layout for the global header.

### footer
HTML layout for the global footer.

### burger_menu
HTML layout for the burger menu.

### Disabling layouts {.no_api}
You can [disable individual layouts](custom-layouts.html#disabling) for areas or individual pages with settings such as `banner: false` or `footer: false`.





### Site header
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
    </hav>
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



### Site footer
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
</hav>
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
    </nav>
  </span>
```

The standard [aria-haspopup](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup) and [aria-expanded](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded) roles can be used on your CSS to implement the dropdown behavior.


[.note]
  ### Note
  In the future, there will be a demonstration of a full, animated Stripe-like dropdown menu.






