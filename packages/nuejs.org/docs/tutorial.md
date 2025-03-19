
# Tutorial: Building Websites with Nue
In this tutorial, we'll create a simple Markdown-based blog:

[Source code](//github.com/nuejs/nue/tree/master/packages/examples/simple-blog) • [Live demo](//simple-blog.nuejs.org)

[image]
  small: /img/blog-hero.png
  large: /img/blog-hero-big.png
  url: //simple-blog.nuejs.org
  size: 749 × 484 px


To follow along, [install Nue](installation.html) first, then download and run this demo locally with:

```sh
nue create simple-blog
```

Your browser should open to `http://localhost:8083`.


## Project structure
Nue uses a freeform directory structure that reflects how your site is organized. Each directory and file mirrors towhat you see in the browser. Let's explore the key parts of our blog:

``` sh
/
  ├── @global             # Global styles and layouts
  │   ├── colors.css      # Design system: colors
  │   ├── layout.css      # Core layout styles
  │   ├── layout.html     # Header and footer templates
  │   └── typography.css  # Typography scale
  │
  ├── @library            # Reusable styles
  │   ├── content.css     # Blog content styling
  │   └── motion.css      # Transitions & animations
  │
  ├── blog                # Blog content area
  │   ├── blog.yaml       # Blog settings
  │   ├── index.md        # Blog listing page
  │   └── hero.html       # Blog post header template
  │
  ├── img                 # Images and icons
  ├── index.md            # Front page content
  └── site.yaml           # Global settings
```

The key concerns are cleanly separated:



## Content
In Nue, content is stored separately from layouts and styling, making it easy to maintain and update. Let's look at how our blog's content is organized.

### SEO and metadata
Our blog's metadata is defined in `site.yaml`. This handles SEO, social sharing, and site-wide settings:

```yaml
title_template: "Emma Bennet / %s"
og: /img/og_emma.png
author: Emma Bennet
favicon: /img/favicon.jpg
```

These settings apply across the site, but can be customized for specific areas or pages through their own YAML files.

### Blog entries
All blog posts live in the `blog` directory as Markdown files. Take a look at any `.md` file and you'll see clean, readable content:

[image.bordered]
  small: /img/blog-content-editing.png
  large: /img/blog-content-editing-big.png

Our blog adds metadata to each post through "front matter" – YAML at the start of the file:

```md
\---
title: A standards first framework
description: Taking HTML, CSS and JavaScript to their peak
date: 2024-01-15
\---

Content starts here...
```

### Content collections
The blog listing page automatically shows all posts through a content collection. This is configured in `blog/blog.yaml`:

```yaml
content_collection: posts
```

Then displayed on the page with a simple tag:

```md
[page-list]
```

This creates the list of posts you see on the blog homepage, with the newest posts first.

### Hot reloading
Try editing any Markdown file – you'll see your changes instantly in the browser. Nue's hot reloading is smart enough to:
- Update only what changed
- Keep your scroll position
- Maintain form input values
- Keep open dialogs in place

This makes content editing fast and fluid – perfect for both developers and content teams.

Let's see how layouts shape this content...


## Layout
In Nue, layouts are modular HTML files that shape how content appears on the page. By keeping these layout modules separate from content and styling, you can maintain consistent structure across your site while making updates easy.

### Site-wide layout
The main layout at `@global/layout.html` provides the header and footer that appear on every page:

```html
<header>
  <navi :items="navigation.header"/>
</header>

<footer>
  <navi :items="navigation.footer"/>
</footer>
```

These HTML5 landmark elements (`<header>` and `<footer>`) automatically fill their corresponding slots in the page structure.

The `<navi/>` tag is a [built-in component](core-components.html) that generates navigation elements from your site's data. It's especially useful for headers, footers, and sidebars since it keeps your HTML clean while managing links centrally.

The navigation structure comes from `site.yaml`, keeping it separate from the template:

```yaml
navigation:
  header:
    - Emma Bennet: /
    - Contact: /contact/
  footer:
    - © Emma Bennet: /
    social:
      - image: /img/github.svg
        url: //github.com/nuejs/
        alt: Github Projects
```

### Blog post layout
Each blog post includes a custom header section defined in `blog/hero.html`:

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

This template automatically pulls data from each post's front matter to create the consistent header you see at the top of every blog post.

### Content list layout
Our blog's post listing demonstrates how layouts work with collections. The built-in `[page-list]` tag generates semantic HTML for displaying posts:

```html
<ul>
  <li>
    <time datetime="2024-04-12">April 12, 2024</time>
    <a href="/blog/post-1">
      <h2>Post title</h2>
      <p>Post description</p>
    </a>
  </li>
</ul>
```

You can create your own custom layout for more control:

```html
<div @name="blog-posts">
  <div :for="post in posts">
    <time :datetime="post.date">{ post.date }</time>
    <h3>{ post.title }</h3>
    <p>{ post.description }</p>
    <a :href="post.url">Read more</a>
  </div>
</div>
```

This gives you complete control over the markup while maintaining clean separation between content and presentation.

### Front page layout
The front page (`index.md`) combines content and layout to create the homepage:

```md
# Minimalist, UX developer, designer, urban explorer.
I'm Emma Bennett, a user experience developer from Berlin.
I build websites that are exceptionally well designed — inside, and outside.

[page-list]
```

By keeping layouts separate from content, you can:
- Change how content appears without touching the content itself
- Reuse layouts across different content
- Maintain consistent structure across your site

For a deeper dive into layouts and the slot system, see the [layout documentation](layout.html).

Let's look at how styling brings these layouts to life...



## Styling
The blog uses modern CSS features to create clean, maintainable styles. Global styles define the look and feel, while component styles handle specific UI elements.

### Global styles
Core styling is defined in `@global` and included on every page through `site.yaml`:

```yaml
# auto-included on every page
globals: ["@global"]

# explicitly included libraries
libs: ["@library"]
```

For example, `@global/layout.css` styles the main site structure using modern CSS features like nesting:

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

### Component styles
The blog includes additional styles for specific components in `blog.yaml`:

```yaml
include: [ content, cards, motion ]
```

These styles handle elements like blog content, cards, and animations. All styles maintain clean separation between structure and presentation, making them easy to modify without touching markup.


### Adding motion
You can enable view transitions in `site.yaml`:

```yaml
view_transitions: true
```

This creates smooth page transitions using native CSS features. For example, here's how the blog animates article transitions:

```css
article {
  view-transition-name: article;
}

::view-transition-old(article) {
  transform: scale(1.2) translateY(2em);
  transition: .8s;
}
```

A reusable animation effect is defined in `@library/motion.css`:

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

This demonstrates how modern CSS can handle sophisticated animations without JavaScript libraries.



## Interactive islands
Modern websites need dynamic features, but that doesn't mean everything should be controlled by JavaScript. Nue takes an HTML-first approach: your content and structure stay in clean, semantic HTML, and interactivity is added through small, focused components called "islands".

Islands enhance static HTML with dynamic features exactly where needed – whether it's a contact form, image gallery, or interactive widget. The entire client-side runtime is just 2.5kb, yet it provides the same reactivity and DOM diffing capabilities as React.

### Contact form
Here's the contact form written as an island:

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

  <button>Let's talk!</button>

  <script>
    submit() {
      loadPage('thanks.html')
    }
  </script>
</form>
```

The island ehnances standard HTML with the following:

- `@submit.prevent` stops the default form submission
- `submit()` method handles the form data
- `loadPage()` navigates to a new page with a smooth transition


### Using islands
You can include the form in your Markdown content:

```md
## Contact me
Get in touch to discuss your project.

[contact-me]
```

For more details on creating interactive components, see the [islands documentation](islands.html).


You're right – view transitions belong in the motion section. Let me revise based on the original:


## Optimization
The blog aims for a lightweight footprint by inlining CSS for fast, single-request loading. This is enabled in `site.yaml`:

```yaml
inline_css: true
```

This approach keeps the front page around 3 KB, including both markup and styling. By receiving all critical content in the initial response, the browser can begin rendering immediately without waiting for additional stylesheet requests.

Disabling JavaScript on the browser won't affect the layout or CSS animations, maintaining a consistent design through progressive enhancement. Images and off-screen content load lazily as needed.



## Deployment
Generate the production version with:

```sh
nue build --production
```

This command quickly compiles your site, similar to Rust and Go-based generators like Hugo. The production files will be in the `.dist/prod` folder, ready to deploy on a CDN like Cloudflare, CloudFront, or Fastly.

In the future, the `nue push` command will streamline deployment further, but for now, you'll need to handle this step with your preferred CDN provider.
