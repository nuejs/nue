
# Tutorial: Building Websites with Nue
In this tutorial, we’ll explore the essential features of Nue by building a simple blogging website step-by-step.

[image]
  small: /img/blog-hero.png
  large: /img/blog-hero-big.png
  url: //simple-blog.nuejs.org
  size: 749 × 484 px

To follow along, [install Nue](installation.html) first, then download and run this demo locally with the following command:

```sh
nue create simple-blog
```

Once the command completes, your blog should be running at `http://localhost:8083`, and the welcome page will open automatically in a browser tab.

You can also explore the [source code](//github.com/nuejs/nue/tree/master/packages/examples/simple-blog) and view the [live demo](//simple-blog.nuejs.org).


## Project Structure
Nue allows flexible organization through a **freeform directory structure**: you can name your files and folders as you like. The layout of your files reflects the structure seen on the website. Here’s the blog’s structure:

[.folders]
  - `@global`: global styles (colors, layout, typography)
  - `@library`: reusable styles
  - `blog`: blogging area
  - `blog/blog.yaml`: blog-specific settings
  - `contact`: contact app
  - `img`: images and icons
  - `index.md`: front page content
  - `site.yaml`: global settings

Let’s explore these assets, starting with the content.


## Content
In Nue, content is stored separately from other site elements, like layouts and stylinng. This organization keeps content easily accessible and well-structured.

### SEO and Metadata

SEO and metadata settings are defined in the `site.yaml` file. Here’s a sample configuration for our blog:

```yaml
title_template: "Emma Bennet / %s"
og: /img/og_emma.png
author: Emma Bennet
favicon: /img/favicon.jpg
```

These settings apply site-wide but can be customized for specific pages or areas. For more details, see the full [settings documentation](settings.html).

### Page Content

All blog entries in the `blog` folder are written in [extended Markdown](content-syntax.html), which supports rich content elements like images, videos, tables, accordions, and tabbed content. This provides a flexible and expressive way to manage content.

[image.bordered]
  small: /img/blog-content-editing.png
  large: /img/blog-content-editing-big.png

Nue’s hot-reloading feature detects content edits and only updates the changed blocks, making editing fast and efficient.


## Layout
Markdown-generated HTML is complemented by [layout modules](layout.html). Our simple layout for the blog, located at `@global/layout.html`, looks like this:

```html
<header>
  <navi :items="navigation.header"/>
</header>

<footer>
  <navi :items="navigation.footer"/>
</footer>
```

#### The `<navi>` Tag

The `<navi>` tag, a built-in component, automatically renders navigational links from data in `site.yaml`:

```yaml
navigation:
  header:
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

Separating navigation data from templates gives centralized control over your site’s structure, keeping HTML clean and manageable.


## Blog Entry Layout
Each blog post includes a custom header, or "hero area," at the top of the article, defined in `blog/hero.html`:

```html
<header @name="pagehead">
  <h1>{ title }</h1>
  <p>
    <pretty-date :date="pubDate"/> • Content by AI
    Photo credits: <a href="//dribbble.com/{ credits }">{ credits }</a>
  </p>
  <img :src="og" width="1000" height="800" alt="Hero image for { title }">
</header>
```

These layout modules use a straightforward [template language](template-syntax.html) and [core components](core-components.html), making it easy to build complex layouts without deep JavaScript knowledge.


## The Index Page
The front page (`index.md`) displays a list of blog entries:

```md
---
content_collection: blog
---

# Minimalist, UX developer, designer, urban explorer.
I’m Emma Bennett, a user experience developer from Berlin.
I build websites that are exceptionally well designed — inside, and outside.

[page-list]
```

Here, the `[page-list]` tag leverages [content collection](content-collections.html) data to automatically list blog entries on the page.


## Styling
The HTML of the front page is styled with external CSS files, organized in `site.yaml`:

```yaml
# auto-included on all pages
globals: ["@global"]

# explicitly included libraries
libs: ["@library"]
```

The global styles are automatically applied to every page, while library assets are included as needed. For the blog, the following styles are specified in `blog.yaml`:

```yaml
include: [ content, cards, motion ]
```

The CSS is kept clean and readable using CSS nesting. Here’s an example from `@global/layout.css`:

```css
body {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2% 5%;

  > header nav {
    justify-content: space-between;
    margin-bottom: 4rem;
    display: flex;
  }

  > article {
    > header { margin-bottom: 2rem }

    > section {
      max-width: 650px;
      margin: 0 auto;
    }
  }

  > footer {
    border-top: 1px solid var(--gray-200);
    justify-content: space-between;
    margin-top: 6rem;
    display: flex;
  }
}
```


### Motion

You can enable [view transitions](//developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) in `site.yaml`:

```yaml
view_transitions: true
```

This allows smooth page transitions with CSS animations, as in our blog:

```css
article {
  view-transition-name: article;
}

::view-transition-old(article) {
  transform: scale(1.2) translateY(2em);
  transition: .8s;
}
```

The `@starting-style` property is used for a sleek, reusable effect in [motion.css](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/%40library/motion.css):

```css
header, h1, h1 + p, h1 + p + * {
  transition: opacity .5s, filter .7s;
  filter: none;
  opacity: 1;

  @starting-style {
    filter: blur(10px);
    opacity: 0;
  }
}
```

Nue makes it simple to add animations, helping you create engaging experiences without heavy JavaScript.


## Islands

The blog includes an interactive contact form, written as follows:

```html
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
    <textarea name="feedback" placeholder="Type here..."></textarea>
  </label>

  <button>Let’s talk!</button>

  <script>
    submit() {
      loadPage('thanks.html')
    }
  </script>
</form>
```

With this setup, you can add [interactive islands](islands.html) without bundlers or complex JavaScript, making client-side interaction straightforward.


## Optimization
This blog aims for a lightweight footprint, similar to a text-only website, by inlining CSS for fast, single-request loading. Set this globally in `site.yaml`:

```yaml
inline_css: true
```

Inlined CSS keeps the front page around 3 KB, including both markup and styling. Disabling JavaScript won’t affect the layout or CSS animations, maintaining a consistent design.


## Deployment
Generate the production version with:

```sh
nue build --production
```

This command quickly compiles your site, similar to **Rust** and **Go**-based generators like **Hugo**. The production files will be in the `.dist/prod` folder, ready to deploy on a CDN like **Cloudflare**, **CloudFront**, or **Fastly**.

In the future, the `nue push` command will streamline deployment further, but for now, you’ll need to handle this step with your preferred CDN provider.
