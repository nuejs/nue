

# Project Structure
Nue projects consist of one or more _applications_. Each directory in the root of your project folder is a separate application with its own configuration, layout, styling and scripting.

[image.gridpaper]
  small: /img/application-dirs.png
  large: /img/application-dirs-big.png
  caption: Two new areas were added as the project grew up
  size: 747 × 519 px


Nue does not force you to adopt any fixed directory structure: there are no system folders and you can freely name your root-level application folders.


## Applications
Nue is designed for building two kinds of applications:

1. **Multi-page applications**. These are content-focused applications consisting of Markdown files. Good examples are documentation, blogging area or a feature tour. These apps are rendered server-side so that they can be easily consumed by search engines. The use of client-side JavaScript is optional.

2. [Single-page applications](single-page-applications.html) consist of an `index.html` file that serves all the HTML requests within the app. Good examples are admin dashboards, onboarding flows, surveys or login pages. The application is rendered on the client side with reactive components. These apps are usually hidden from search engines.


[image.gridpaper]
  small: /img/mpa-vs-spa.png
  large: /img/mpa-vs-spa-big.png
  size: 747 x 512



## Pages
Pages are the building blocks of multi-page applications. These pages are written with an [extended Markdown syntax](content.html), which is designed for non-technical people like marketers and copywriters.


### Page data { #data }
Each page is backed with different kinds of data:

1. **Metadata** like title, description, theme color, favicon and hero image. This data is made accessible for search engines and [content colllections](content-collections)

1. **Settings** to fine-tune rendering details like whether CSS should be inlined on the page or what styles can be excluded from the page.

1. **Dependencies** — information about scripts, styles, components and other assets that the page functionality depends on.

1. **Components** for rendering headers, footers, sidebars and other components inside or outside the page.



### Data propagation
The data is defined in three levels:

1. The global, site-wide data is defined in `site.yaml` at the root directory.

2. Application data is defined in `*.yaml` files inside the application directory. Each application subdirectory can also have its own data files.

3. Page-specific data is defined in the *frontmatter* section of the Markdown page.

The data gets extended as you move from the site level to the page level.

[image.gridpaper]
  small: /img/data-propagation.png
  large: /img/data-propagation-big.png
  size: 746 x 406


### Data example
Let's say you have a page called `blog/hello-world.md` and the following global data in the `site.yaml` file:


```
title: Emma Bennet
description: A designer and UX engineer
origin: https://emmabennet.co
favicon: /img/favicon.png
og_image: /img/og_emma.png
```

Then you have blog-specific metadata in `blog/blog.yaml` extending/overriding the global data:

```
title: Emma Bennet / Blog
author: Emma Bennet
og_image: /img/og_blog.png
```

Finally, the page-specific data is set on the front of the "hello-world.md" file:

```
 ---
 title: Hello, World
 date: 2023-12-05
 ---
```

With the above configuration in place, the document's `<head>` section is rendered as follows:


```
<head>
  <!-- Nue default values -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- globals from site.yaml -->
  <link rel="shortcut icon" src="/img/favicon.jpg">
  <meta name="description" content="A designer and UX engineer">

  <!-- directory specific values from app.yaml -->
  <meta name="author" content="Emma Bennet">
  <meta property="og:image" content="https://emmabennet.co/img/og_blog.png">

  <!-- document specific values from the .md file -->
  <title>Hello, World</title>
  <meta property="article:published_time" content="2023-12-05">
</head>
```

[.note]
  ### Why YAML?
  Nue uses YAML as the main configuration language. As a content-focused format, it is by far the easiest one to grasp by non-technical people. It is the default choice in most Markdown-powered website generators.



## Page dependencies
All your pages have different kinds of dependencies to enhance their look and feel:

[table.api "Extension | Type"]
  - .js   | JavaScript files for [motion and reactivity](reactivity.html)
  - .ts   | TypeScript files for [motion and reactivity](reactivity.html)
  - .css  | CSS files for [styling](css-best-practices.html)
  - .html | [Custom layouts](custom-layouts.html) and server-side components
  - .htm  | [Reactive components](reactive-components.html)
  - .nue  | [Reactive components](reactive-components.html)


The scripts, styles and components are automatically included in the page dependency tree similar to how data is propagated. The assets on the application root are included in all pages in the app and subdirectory assets are included on the pages in that subdirectory. For example:


[image.gridpaper]
  small: /img/dependencies.png
  large: /img/dependencies-big.png
  size:   747 × 378 px

### Global directories { #globals }
You can define directories that are global in `site.yaml`. For example:

```
globals: [ "@globals", "scripts", "styles" ]
```

If a global directory resides on the root level, then all assets inside that directory are automatically included on every page, regardless of which app they belong to or how deeply they are nested in the file system.

When a global directory resides inside an application directory, then all assets in the directory are included on all pages of the app. Here, for example, we have defined `@globals` and `css` as global dirs:


[image.gridpaper]
  small: /img/global-dirs.png
  large: /img/global-dirs-big.png
  size: 747 × 417 px


### Libraries
Library folders contain assets that can be explicitly included on a page with an `include` statement. You can define certain folders to be libraries in the `site.yaml` file. For example:

```
libs: ["@lib", lib]
```

These libraries can reside both on the root level, and inside a specific application. Once the libraries have been defined, you include library assets in `site.yaml`, application data (like `docs/app.yaml`), or in the page's frontmatter with an `include` statement as follows:

``` yaml
include: [syntax-highlight, video]
```

If you include assets in several levels, the values of include statements are _concatenated_ into one single array. The matches are partial so that a value such as "syntax" will match both "syntax-highlight" and "syntax-extras".


### Excluding assets { #exclude }
You can exclude assets from the pages with an `exclude` property, which works the same way as the include statement:

```
exclude: [syntax-highlight, video]
```

This allows you to strip unneeded assets from the request and reduce the payload.

#### Example
Here's a more complex example that gives you an idea how dependencies are calculated:

[image.gridpaper]
  small: /img/libraries.png
  large: /img/libraries-big.png
  size:  747 × 591 px


### Frontpage
All scripts, styles, and components in the root level are dependencies for the front page and all other root level pages so they are not propagated upwards to the application directories.

You may want to clean up the root directory from front page assets by placing them into a folder named "home", for example, and declaring it in the frontmatter area of the front page:

```
appdir: home
```

With the above setting all assets inside the "home" directory become dependencies of your root level `index.md`.



### Static files
Static files like `.png`, `.jpg`, `.txt`, `.csv`, or `.json` are copied directly from the source directory to the distribution directory without processing. They work outside the page dependency management system.



### 404 file
A file named `404.md` in the root level, acts as a target for non-existent files. You can use the `include` statement to customize its styling and behaviour.



