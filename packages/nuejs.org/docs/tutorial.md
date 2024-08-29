
# Tutorial: Building websites with Nue

In this tutorial, you’ll learn the key features of Nue by studying the structure and implementation of the official demo application "simple-blog":

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

## Project goals { #goals }

We had three goals when developing the site:

1. **Clean codebase**: what used to take a React specialist and an absurd amount of JavaScript should be just a handful of CSS files that can be reused on the next project.
2. **Great user experience**: through design, view transitions, motion, and interactivity.
3. **New levels of performance**: similar to text-only websites like [motherfuckingwebsite.com](//motherfuckingwebsite.com/) but without compromises on design and the user experience.

Ultimately, the goal is to change your perspective on web development and make you wonder why you have ever built websites any other way.

## Project structure

Nue has a free-form project structure. Apart from `site.yaml`, you can name your files and folders however you like. The structure follows closely what the user sees, directly on the project root.

Here's how our blog is structured:

[.folders]
  - `index.md` the front page
  - `welcome` front page styling
  - `blog` blogging area
  - `contact` contact app
  - `img` images and icons
  - `@global` global styles (colors, layout, and typography)
  - `@library` reusable styles
  - `site.yaml` site-wide settings
  - `blog/blog.yaml` blog-specific settings

Let's look at these assets, starting from the most important: the content.

## Content

With Nue, all your content is cleanly separated from the rest of the site. This includes the pages, information hierarchy, SEO- and metadata. This makes the project easy to maintain even for non-technical people.

### SEO and metadata

SEO and metadata are configured in the `site.yaml` file. On the blog, we have:

``` yaml
title_template: "Emma Bennet / %s"
og: /img/og_emma.png
author: Emma Bennet
favicon: /img/favicon.jpg
```

These are applied to all your pages but can be overwritten by page and area basis. Here is a [full list](settings.html) of all properties.

### Information architecture

Next, we define the information architecture and how the user navigates the site:

```yaml
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

Nue offers a simple, [YAML-based syntax](page-layout.html#navigation) for defining your header, footer, burger menu, dropdown menus, and any other navigation or sidebar you may have. This simple syntax can generate complex navigation hierarchies suitable for big, enterprise sites.

### Blog posts

The same human-friendly approach applies to all your pages too, that are written with an [extended Markdown flavor](content.html) suitable for authoring rich, interactive web content. Here we edit the content in VS code and watch Nue's [hot-reloading](hot-reloading.html) take action in split-screen mode:

[image.bordered]
  small: /img/blog-content-editing.png
  large: /img/blog-content-editing-big.png

No matter how complex your landing page is, it can be defined with the extended Markdown syntax.

### Frontpage

Our front page is a simple list of blog entries rendered with a [content collection](content-collections.html) and a [gallery](content-collections.html#gallery) tag:

``` md
\---
content_collection: blog
\---

# Minimalist, UX developer, designer, urban explorer.
I’m Emma Bennett, a user experience developer from Berlin.
I build websites that are exceptionally well designed — inside, and outside.

[gallery]
```

There is no need for a React specialist to get your videos, responsive images, grids, and stacked layouts in place. The content can be developed by anyone, not just JavaScript engineers.

## Markup

Here is the HTML code of the front page taken directly from the Chrome development console:

[image.bordered]
  small: /img/semantic-markup.png
  large: /img/semantic-markup-big.png
  size: 598 × 575 px

Nue automatically generates a clean, class-free markup from your content. Your pages and components always have the same HTML markup, which you can style differently based on the context. That is: you can implement wildly different designs with nothing but CSS.

This is the idea of a [global design system](global-design-system.html), which frees you from implementing page layouts and basic UI elements over and over again for every new page or project.

## Layout

You can customize the layout by filling various "slots" in the global design system. For example, our blog posts have a custom header or "hero area" at the top of the article. It is defined as follows:

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

These [layout modules](custom-layouts.html) are written with a simple [template language](template-syntax.html), which is essentially standard HTML extended with expressions, conditionals, and loops. People with basic HTML skills can quickly master it.

## Styling

Nue offers the shortest path from Figma to code without a confusing designer-developer handoff process along the way:

[image]
  small: /img/blog-css-hierarchy.png
  large: /img/blog-css-hierarchy-big.png

With Nue, your code is organized by design, not engineering needs. Take the [colors.css](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/%40global/colors.css) for example, which is essentially a direct mapping between Figma color swatches and CSS variables:

[image]
  small: /img/blog-colors.png
  large: /img/blog-colors-big.png

Same thing with [layout.css](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/%40global/layout.css), which uses simple CSS selectors and nesting to declare the global layout. It reads like a book:

```css.blue
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

Global design system helps you write clean and minimalistic CSS that can be reused across projects. And you need significantly less code to achieve the same thing. For example, there is less CSS on the front page than what goes into a single Tailwind button 🤷‍♂️. This brings us to Nue's [CSS best practices](css-best-practices.html):

> 10 lines of code is easier to maintain than 100 lines of code

### Libraries

Blog assets are split between two: Globals and libraries

```yaml
# auto-included on all pages
globals: ["@global"]

# libraries of reusable code
libs: ["@library"]
```

Globals are automatically included on every page and the library assets must be explicitly included. In the blogging area, we set up the following in `blog.yaml`:

``` yaml
include: [ content, cards, motion ]
```

Libraries keep your pages lean because you only include what's needed.

### Motion

You can enable [view transitions](//developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) with one simple setting in `site.yaml`:

```yaml.pink
view_transitions: true
```

After this, you can use modern CSS to create smooth page-switching animations for any element on the page. On this blog, we have the following:

```css
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

```css
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

View transitions and the starting style property are some of the unexplored possibilities in CSS, and Nue brings these modern utilities to the hands of a UX developer.

## Interactivity

Our blogging app has a [contact form](//github.com/nuejs/nue/blob/dev/packages/examples/simple-blog/contact/contact.htm), which is implemented as follows:

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

You can use the same [HTML-based syntax](template-syntax.html) to create reactive, client-side components, as you use with the server-side templating. You can build anything from it ranging from simple interactive "islands" to rich [single-page applications](single-page-applications.html) without bringing up the absurd amount of layers and complexity from the React/TypeScript ecosystem.

## Performance optimization

One of our [goals](#goals) was to reach performance levels of a text-only website, but without compromising design. The most effective way to reach that goal is to serve your content and styling together as one, compact request — similar to how a text-only website works. On our blog, we do this _globally_ for every page in `site.yaml` as follows:

```yaml
inline_css: true
```

This inlines the contents of all CSS into the head section of an HTML page, which is exactly what we want. But this is not enough for us: we want to wank and impress the nerdiest of nerds by making the already small CSS even smaller with the following setting:

```yaml
native_css_nesting: true
```

This tells the underlying `Lightning CSS` to _not_ transform the CSS nesting to be compatible with older browsers, instead the nesting rules should be rendered as is. This reduces the size of the CSS by ~15% and it still works on all major browsers.

Together with CSS minification, our front page is less than 3kb, including the HTML markup and styling. Even if you disable JavaScript from your browser, everything looks the same including the CSS motion effects. This is as performant as you can get with content-heavy websites.

The current JavaScript frameworks like **Vite** and **Next.js** place their optimization efforts on the wrong thing. You can never beat a single, compact HTTP request that has everything to render the page — no matter how small your JavaScript bundle is.

## Deployement

The production-optimized version is generated with the `nue build --production` command. The console output looks like this:

[image]
  small: /img/blog-generate.png
  large: /img/blog-generate-big.png
  width: 500

This step is extremely fast. No matter how large your website, the generation times are in the ballpark than what you see with **Rust** and **Go** -based generators like **Hugo**.

The production files are generated under the `.dist/prod` folder, which you can transfer to your CDN such as **Cloudflare**, **CloudFront**, or **Fastly**. Later, there will be a handy `nue push` command to dramatically simplify deployment, but currently, you have to figure out this step yourself.
