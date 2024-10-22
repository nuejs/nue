
# Tutorial: Building websites with Nue
In this tutorial, you’ll learn the key features of Nue by studying the structure and implementation of a simple blogging website:

[image]
  small: /img/blog-hero.png
  large: /img/blog-hero-big.png
  url: //simple-blog.nuejs.org
  size: 749 × 484 px


After [installing Nue](installation.html), you can install this demo application with the following command:

``` sh
nue create simple-blog
```

Here is the [source code](//github.com/nuejs/nue/tree/master/packages/examples/simple-blog) and a [live demo](//simple-blog.nuejs.org).


## Project structure
Nue has a freeform folder structure: you can name your files and folders however you like. The structure follows closely to what the user seeson the website:

Here's how our blog is structured:

[.folders]
  - `@global` global styles: colors, layout, and typography
  - `@library` reusable styles
  - `blog` blogging area
  - `blog/blog.yaml` blog-specific settings
  - `contact` contact app
  - `img` images and icons
  - `index.md` the front page
  - `site.yaml` global settings


Let's look at these assets, starting from the content.


## Content
With Nue, all your content is cleanly separated from the rest of the site. This includes navigation, SEO- and metadata, and the actual content of the pages:


### SEO and metadata
SEO and metadata are configured in the `site.yaml` file. On the blog, we have:

``` yaml
title_template: "Emma Bennet / %s"
og: /img/og_emma.png
author: Emma Bennet
favicon: /img/favicon.jpg
```

These are applied to all your pages but can be overwritten by page and area basis. Here is a [full list](settings.html) of all properties.


### Navigation
The site header and footer are defined in the `site.yaml` as follows:

```
header:
  navigation:
    - Emma Bennet: /
    - Contact: /contact/

footer:
  copyright:
    - © Emma Bennet: /

  social:
    - image: /img/github.svg
      url: //github.com/nuejs/
      alt: Github Projects
      size: 22 x 22

    - image: /img/linkedin.svg
      url: //linkedin.com/in/tipiirai
      alt: LinkedIn profile
      size: 22 x 22
```

Nue uses [YAML data](navigation.html) for defining your header, footer, burger menu, dropdown menus, and any other navigation or sidebar you may have. This simple syntax helps you define navigations without resorting to raw HTML, which is [also possible](layout.html).


### Blog post content
The same human-friendly approach applies to all your pages too, that are written with an [extended Markdown flavor](content.html) suitable for creating rich, interactive web content. There is no need for a React specialist to get your videos, responsive images, grids, and stacked layouts in place.

Here we edit the content in VS Code and watch Nue's [hot-reloading](hot-reloading.html) take action in split-screen mode:

[image.bordered]
  small: /img/blog-content-editing.png
  large: /img/blog-content-editing-big.png


No matter how complex your landing page is, it can be defined with the extended Markdown syntax.


### Frontpage
Our front page is a simple list of blog entries rendered with a [content collection](content-collections.html) and a [page-list](content-collections.html#page-list) tag:

``` md
\---
content_collection: blog
\---

# Minimalist, UX developer, designer, urban explorer.
I’m Emma Bennett, a user experience developer from Berlin.
I build websites that are exceptionally well designed — inside, and outside.

[gallery]
```



## Layout
Here is the generated HTML of the front page taken directly from the Chrome development console:

[image.bordered]
  small: /img/semantic-markup.png
  large: /img/semantic-markup-big.png
  size: 598 × 575 px


You can customize the markup by filling the different "slots" in the [page layout](layout.html). For example, our blog posts have a custom header or "hero area" at the top of the article. It is defined as follows:

```
<header @name="pagehead">
  <h1>{ title }</h1>
  <p>
    <pretty-date :date="pubDate"/> • Content by AI
    Photo credits: <a href="//dribbble.com/{ credits }">{ credits }</a>
  </p>

  <img :src="og" width="1000" height="800" alt="Hero image for { title }">
</header>
```

These layout modules are written with a simple [template language](template-syntax.html), which is essentially standard HTML extended with expressions, conditionals, and loops. People with basic HTML skills can quickly master it.



## Styling
Thes HTML layout is styled with external CSS.

! CSS files

The global CSS is split in two: globals and libraries:

```
# auto-included on all pages
globals: ["@global"]

# explicitly included
libs: ["@library"]
```

Globals are automatically included on every page and the library assets must be explicitly included. In the blogging area, we setup the following in `blog.yaml`:

``` yaml
include: [ content, cards, motion ]
```


The CSS itself is written in using the [CSS best practices](css-best-practices.html), which aims for easy readability and maintainability. For example, the [layout.css](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/%40global/layout.css), which uses simple CSS selectors and nesting to declare the global layout. It should "read like a book":


``` css .blue
body {

  /* page layout */
  max-width: 1000px;
  margin: 0 auto;
  padding: 2% 5%;

  /* master navigation */
  > header nav {
    justify-content: space-between;
    margin-bottom: 4rem;
    display: flex;
  }

  /* content area: hero and its sections */
  > article {
    > header { margin-bottom: 2rem }

    > section {
      max-width: 650px;
      margin: 0 auto;
    }
  }

  /* global footer */
  > footer {
    border-top: 1px solid var(--gray-200);
    justify-content: space-between;
    margin-top: 6rem;
    display: flex;
  }
}
```


### Motion
You can enable [view transitions](//developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) with one simple setting in `site.yaml`:

``` yaml.pink
view_transitions: true
```

After this, you can use modern CSS to create smooth page-switching animations for any element on the page. On this blog, we have the following:


```
/* apply animation for the content area only */
article {
  view-transition-name: article;
}

/* scale down the old page before the new page appears */
::view-transition-old(article) {
  transform: scale(1.2) translateY(2em);
  transition: .8s;
}
```

Once the view transitions are finished the elements are transitioned with a [@starting-style](//developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) CSS property. Here's what we have in our reusable [motion.css](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/%40library/motion.css) file:

```
/* select the first three elements to be transitioned */
header, h1, h1 + p, h1 + p + * {
  transition: opacity .5s, filter .7s;
  filter: none;
  opacity: 1;

  /* define the starting style */
  @starting-style {
    filter: blur(10px);
    opacity: 0;
  }
}
```

View transitions and the starting style property are some of the unexplored possibilities in CSS, and Nue attempts to make them easy for a UX developer.



## Interactivity
Our blogging app has a [contact form](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/contact/contact.htm), which is implemented as follows:

```
<script>
  import { loadPage } from '/@nue/view-transitions.js'
</script>

<form @name="contact-me" @submit.prevent="submit" autocomplete="on">
  <label>
    <span>Your name</span>
    <input type="text" name="name" placeholder="Example: John Doe" required>
  </label>

  <label>
    <span>Your email</span>
    <input type="email" name="email" placeholder="your@email.com" required>
  </label>

  <label>
    <span>Requirements</span>
    <textarea name="feedback" placeholder="Type here..."/>
  </label>

  <button>Lets talk!</button>

  <script>
    submit() {
      loadPage('thanks.html')
    }
  </script>
</form>
```

You can use the same [HTML-based syntax](template-syntax.html) to create reactive, client-side components, as you use with the server-side templating. You can easily build interactive "islands" without diving deep into JavaScript.



## Performance optimization
The blogging website attempts to reach performance levels of a text-only website, but without compromising design. The most effective way to reach that goal is to serve your content and styling together as one, compact request — similar to how a text-only website works. On our blog, we set this globally for every page in `site.yaml` as follows:

```
inline_css: true
```

This inlines the contents of all CSS into the head section of an HTML page. Together with CSS minification, our front page weigts less than 3kb, including the HTML markup and styling. Even if you disable JavaScript from your browser, everything looks the same including the CSS motion effects.


## Deployment
The production-optimized version is generated with the `nue build --production` command. The console output looks like this:

[image]
  small: /img/blog-generate.png
  large: /img/blog-generate-big.png
  width: 500

This step is extremely fast. No matter how large your website, the generation times are in the ballpark of what you see with **Rust** and **Go**-based generators like **Hugo**.

The production files are generated under the `.dist/prod` folder, which you can transfer to your CDN such as **Cloudflare**, **CloudFront**, or **Fastly**. Later, there will be a handy `nue push` command to dramatically simplify deployment, but currently, you have to figure out this step yourself.
