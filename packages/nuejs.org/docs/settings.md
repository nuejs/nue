---
class: apidoc
---

# Settings and metadata

In Nue, there are two main types of configuration: **settings** and **metadata**.

- **Settings** are specific configurations that control the behavior of the framework and its applications. These can be set at three levels: globally, area-level, and page-level, allowing for flexible and efficient management across different scopes.

- **Metadata** provides descriptive information about the content and structure of your site. It can also be defined at the global, area, and page levels, helping with organization, SEO, and enhancing the user experience without directly influencing the framework's behavior.

## System Settings

Here are all framework-specific configuration options found in the `site.yaml` file. These settings impact system behavior and are always global, meaning they cannot be overridden at the app or page level.

### dist

The output directory for the generated files. This is where the framework will place all built files after processing. The default is `.dist/dev` for the development version, where developers can test changes, and `.dist/prod` for the production version, which is used for live deployment.

### globals

An array of [global](project-structure.html#globals) directories. These directories contain scripts, styles, and components that are shared across the entire project. Anything placed in these global directories is automatically included on all pages, ensuring consistency and reducing redundancy in your project.

### hotreload

This setting controls the universal hot-reloading feature, which allows changes made to the code to be reflected in real-time without needing to refresh the browser. Hot-reloading is enabled (`true`) by default, which is beneficial during development to see changes instantly. Set this to `false` to disable hot-reloading if needed.

### libs

An array of directories treated as [libraries](project-structure.html#libraries). These directories contain reusable code components, modules, or third-party libraries that your project can access. The `include` statement is used to import these libraries into your application, promoting modular development and code reuse.

### links

A list of reference links for use in Markdown content, formatted as `[Link Label][link_reference]`. This feature allows you to define external links that can be used throughout your Markdown documents. Links should be supplied in the `name: url  "title"` format:

```yaml
# name: url "optional title"
links:
  gds: //bradfrost.com/blog/post/a-global-design-system/ "Global Design System"
  soc: //en.wikipedia.org/wiki/Separation_of_concerns
```

### minify_css

This setting controls the processing of CSS by Bun or [Lightning CSS](//lightningcss.dev/), which optimize CSS for better performance. By default, this feature is enabled (`true`), which means that CSS will be processed for improvements. Setting this to `false` disables the default processing, and the CSS is served directly as is, which may be useful for debugging or specific use cases where processing is not desired.

### native_css_nesting

Currently only available with Lightning CSS (`--lcss` option).

Determines whether to use native CSS nesting instead of converting them to un-nested style rules that are supported in all browsers. Native CSS nesting allows you to write more intuitive and organized CSS by nesting styles. Setting this to `true` generates a smaller CSS output, which can enhance performance, but it may not be supported by older browsers. Always check the current [Can I Use](//caniuse.com/css-nesting) statistics for details on browser compatibility.

### port

Specifies the port number for the development server. By default, this is set to `8080`. This is the network port that your development environment will use to serve the application, allowing you to access it via a web browser at `http://localhost:8080`.

### syntax_highlight

This setting controls the built-in stylesheet for code blocks within your Markdown content. Syntax highlighting improves readability by visually distinguishing code from regular text. Set this to `false` to disable syntax highlighting if you prefer plain text for your code blocks.

### view_transitions

Setting this to `true` enables [view transitions](reactivity.html#view-transitions) for instant and smooth page switches. This feature enhances user experience by providing fluid transitions between different views or pages, making navigation feel more seamless.

### inline_css

Setting this to `true` inlines all CSS directly into the HTML page, enabling the entire page to render in one request. This setting can also be configured at the area and page levels. For more details, see [performance optimization](optimization.html).

## Global Metadata

This section lists properties that impact your SEO data and other metadata within the document's `<head>` element. These properties are defined in your `site.yaml` file but can be overridden at the area and page levels.

### base

The value of the HTML [`<base>`](//developer.mozilla.org/en-US/docs/Web/HTML/Element/base) element, which sets a base URL for relative URLs in the document.

### charset

The value of the charset meta tag. The default is "utf-8", which supports a wide range of characters.

### direction

The value of the `<html direction="{ direction }">` attribute, which defines the text direction of the document. The default is "ltr" (left to right).

### favicon

The relative path to your favicon, which overrides the default "favicon.ico" displayed in the browser tab.

### generator

The generator meta tag that identifies the software used to create the site. The default is "Nue (nuejs.org)" and is only rendered in production mode.

### heading_ids

When set to `true`, all header levels (h2 and h3) will be generated with an id and an anchor (`<a>`) element, enabling easy linking to those sections. For example:

```html
<h2 id="less-is-more">
  <a href="#less-is-more" title="Less is More"></a>
  Less is More
</h2>
```

### language

The value of the `<html lang="{ language }">` attribute. The default is "en". You might want to change this to specific dialects like "en-us", "en-gb", or "fi" for Finnish, depending on the language of your content.

### origin

Your full domain name, including the protocol (e.g., `"https://emmabennet.co"`). Nue uses this value to prefix the `og` property and for use in RSS files.

### prefetch

An array of assets to prefetch before they are used. These can include images, scripts, or CSS files, improving loading efficiency.

### robots

The value for the "robots" meta property. Use "noindex" to exclude the entire website from search engine indexing.

### theme_color

The value for the [theme color](//developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color) meta property. This color suggestion allows user agents to customize the display of the page, particularly in mobile browsers.

### viewport

The [viewport](//developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) value. The default is: `"width=device-width, initial-scale=1"`, which ensures proper scaling and responsiveness on different devices.

## Area Settings

This section lists typical area-specific settings found in application files such as `blog/blog.yaml` or any other YAML file in a specific application directory.

### include

A list of assets to be included from a [library directory](project-structure.html#libraries) for all pages in the area. For example, a value like `include: [highlight, motion]` would include all files matching the strings "highlight" or "motion" in their filenames.

### sections

An array of CSS class names for the page sections. These class names help define the structure and styling of different sections within the area. [Learn more](styling.html#sections).

## Page Settings

This section lists page-specific settings that are typically defined for individual pages in a page directory or in the front matter section of a Markdown file. Most of these settings can also be set globally or at the area level.

### appdir

The name of the application directory to which the page belongs. For instance, the root-level `index.md` could set this to "home" to grab the layout, data, scripts, styles, and components from that directory. This helps keep the root level clean from front-page-specific assets.

### content_collection

The name of the directory for a [content collection](content-collections.html). This directory organizes related content for easier management and retrieval.

### collection_name

The name of the content collection variable. By default, this is the same as the directory name, which corresponds to the value of the `content_collection` option.

### include

A list of assets to be included from a [library directory](project-structure.html#libraries). These values are concatenated with any area-specific includes, allowing for flexible asset management across pages.

### exclude

A list of assets to be excluded from a [library directory](project-structure.html#libraries). These values are concatenated with any area-specific excludes, providing a way to avoid including certain assets.

### og_image

The URL of the Open Graph image to represent the page on social media platforms. This image is used when the page is shared, helping to improve engagement and visibility.

### og

A shorthand alias for `og_image`, allowing for easier reference in the page settings.

### og_description

A brief description of the page to be used in Open Graph meta tags. This description appears in social media previews, providing context about the content when shared.

### unlisted

A setting that prevents the page from being included in content collections. This is useful for pages that should not be publicly listed or indexed.


## Data Inheritance

Data in Nue is defined at three levels:

1. **Global Level:** Site-wide data is defined in `site.yaml` at the root directory. This data applies universally across the entire site.

2. **Application Level:** Application-specific data is defined in `*.yaml` files located inside the application directory. Each application subdirectory can also have its own data files, allowing for tailored configurations.

3. **Page Level:** Page-specific data is defined in the *frontmatter* section of the Markdown page. This allows individual pages to have unique settings that can override higher-level data.

As you move from the site level to the page level, the data gets extended or overridden, allowing for granular control over content and settings.

[image.gridpaper]:
  small: /img/data-propagation.png
  large: /img/data-propagation-big.png


#### Data Example

Let’s say you have a page called `blog/hello-world.md` with the following global data in the `site.yaml` file:

```yaml
title: Emma Bennet
description: A designer and UX engineer
origin: https://emmabennet.co
favicon: /img/favicon.png
og_image: /img/og_emma.png
```

Next, you have blog-specific metadata in `blog/blog.yaml` that extends or overrides the global data:

```yaml
title: Emma Bennet / Blog
author: Emma Bennet
og_image: /img/og_blog.png
```

Finally, the page-specific data is set in the frontmatter section of the `hello-world.md` file:

```yaml
title: Hello, World
date: 2023-12-05
```

With the above configuration in place, the document's `<head>` section is rendered as follows:

```html
<head>
  <!-- Nue default values -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- Globals from site.yaml -->
  <link rel="shortcut icon" src="/img/favicon.jpg">
  <meta name="description" content="A designer and UX engineer">

  <!-- Directory-specific values from blog.yaml -->
  <meta name="author" content="Emma Bennet">
  <meta property="og:image" content="https://emmabennet.co/img/og_blog.png">

  <!-- Document-specific values from the .md file -->
  <title>Hello, World</title>
  <meta property="article:published_time" content="2023-12-05">
</head>
```
