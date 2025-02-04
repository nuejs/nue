---
hero_title: "*Nue 1.0 (RC)* — Can it outshine Next.js?"
title: "A better Next.js? • Nue 1.0 (RC) is out"
description: This version brings numerous improvements, bug fixes, clearer documentation, and a new Markdown parser built from scratch to strengthen Nue's vision
date: 2024-11-14
---

Nue is a static site generator (SSG) built from the ground up to offer faster tooling, cleaner codebases, and better results. Today, we’re releasing the first version of Nue that earns the "release candidate" (RC) status.

[image]:
  small: /img/og-dark.png
  large: /img/og-dark-big.png

This major update introduces a range of improvements while simplifying the system. The documentation has been greatly enhanced, and we've built a completely new Markdown parser from the ground up, specifically designed to bring Nue’s content-first vision to life.

### But better than Next.js?!
I know, it might sound a bit over the top... but hear me out. Let’s break it down into three concrete points:


## 1. Cleaner codebases
Nue is an ambitious engineering project designed to simplify web development through **separation of concerns** and **progressive enhancement**. This approach fundamentally redefines how websites are developed:

[image]:
  small: /img/progressive-enhancement.png
  large: /img/progressive-enhancement-big.png
  size: 650 x 174

What once required a **React specialist** and a large amount of **JavaScript** can now be achieved with clean, standards-based code:

[image.bordered]:
  large: /img/clean-code-big.png
  small: /img/clean-code.png
  size: 745 × 403

This means you’re no longer bogged down with debugging complex algorithms and data structures. Instead, you can put all that focus on **content**, **layout**, and **design systems** — making a natural transition from **JavaScript engineering** to **Design engineering**.


## 2. Faster tooling
One of Nue’s standout features is its hot-reloading mechanism, and with this version, the diff/patch system is stronger than ever. By instantly detecting changes in **content**, **data**, **layouts**, **styles**, **components**, and **islands**, Nue applies updates directly to your browser. This creates a smooth, lightning-fast feedback loop that makes the development process more exciting and fluid.

[bunny-video]:
  videoId: abb2cf75-c7f9-43e6-b126-8827d0c8721e
  style: "background-color: #282C30"
  poster: /img/blog-content-editing-big.png

With the new Markdown parser and the absence of unnecessary JavaScript abstractions and dependencies, Nue is **incredibly lean and fast**, consistently outperforming monolithic web frameworks:

[table]
  Framework       | Next.js | Nue
  NPM modules     | 300+    | 10+
  Project weight  | 300M+   | 10M+
  Build speed / 10 pages | 10+ seconds | 0.01+ seconds
  Build speed / 100 pages | 30+ seconds | 0.1+ seconds
  Hot-reload times / complex app | 1-5s | 0.05-0.3s


## 3. Better results
Nue helps developers create **fast** and **user-friendly** websites with features like **turbolinking**, **CSS view transitions**, **interactive islands**, and **CSS inlining**:

[bunny-video]:
  videoId: 383e5c79-6747-4b1a-8d7a-9da9ae721d33
  poster: /img/hero-splash.jpg
  caption: "Nue templates preview. Hit **F** for fullscreen"

Surprisingly, these rich, interactive sites remain exceptionally lightweight, comparable to text-only websites. To give you an idea, here’s how Nue [documentation area](/docs/) compares to Next.js documentation:

[table.with-total]
  Resources     | Next.js | Nue
  HTML document | 51kB    | 10kB
  CSS           | 62kB    | 1kB
  JavaScript    | 531kB   | 7kB
  Total         | 644kB   | 19kB

[button.zoom popovertarget="resources" "See the difference"]

[#resources.simple-compare popover]

  ## Nue documentation
  27kB of HTML/CSS/JS

  [! /tour/img/assets-nue.png ]


  ## Next.js documentation
  645kB of HTML/CSS/JS

  [! /tour/img/assets-next.png ]

  [button.action popovertarget="resources"]
    [image /icon/close.svg]


[.note]
  ### Understanding Nue
  To better grasp the benefits and unique development model of Nue, be sure to explore the newly updated documents for [Why Nue?](/docs/) and [How it works](/docs/how-it-works.html). This section focuses specifically on the new release.


## New Markdown parser
In earlier versions of Nue, we used the **Marked** library to handle basic formatting for our extended Markdown syntax — known as **Nuemark**. While Marked is a solid, general-purpose Markdown parser with excellent performance, it became clear that it couldn't fully support the direction we wanted for Nue, particularly with our content-first development model.

The main issue with Marked was its lack of a mutable **abstract syntax tree** (AST). The AST is a structured representation of the Markdown content, allowing it to be easily analyzed, manipulated, and extended before rendering to HTML. With Marked, the structure was essentially immutable — meaning it wasn't possible to add new nodes, elements, or link references before rendering the document.

Moreover, the API for creating custom extensions was overly complex, particularly for advanced features that needed to understand the document’s structure and modify parts of the syntax tree. This made implementing the more advanced components of Nue impossible.

To overcome these limitations, we built an **entirely new parser** from scratch. This new parser implements a **mutable AST**, offering greater flexibility, performance, and control over the content structure. With this foundation, we were able to add all the required features, enabling the creation of rich, interactive content and making it easier to integrate custom elements into the rendering process.


```md.blue.info "Clutter-free syntax for accordions, tabs, and grids"
|[accordion]

  ## New features
  1. New Markdown parser
  2. New formatting options
  3. New components

  ## Improvements
  1. Web component fallbacks
  2. Markdown <slot/> support
  3. Improved HMR error reporting
```


### New parser features
The new parser introduces several powerful features to enhance your Markdown experience:

- **New formatting options**: You can now use custom syntaxes like `|highlighted|` to highlight text, `•bolded•` for bold text, and `/italics/` for italics, in addition to the standard Markdown `**strong**` and `_emphasized_`.

- **Variables and expressions**: You can now use variables and expressions within your documents, such as `{ package.name }` to display dynamic content or `{ foo.bar[0].name }` to access specific elements from complex data structures.

- **Common Markdown extensions**: The parser now supports popular extensions like **footnotes** and **tables**, allowing you to create more interactive and well-structured documents without custom solutions.

- **Explicit heading IDs and class names**: You can now define custom IDs and class names for headings using the syntax `## Hello { #world.epic }`, making it easier to add specific styles or create anchor links for better navigation.

- **Automatic section splitting**: Documents will now automatically split into sections by analyzing the document’s structure. When an `h2` or `---` is encountered, a new section is created, making it easier to organize and navigate large documents.

- **Inline components**: Custom tags can now be inlined directly within the content, like `A inlined [custom-tag] is here`. This allows you to add dynamic or reusable components within the text flow, offering more flexibility in structuring your content.


### New tags

- **New `[accordion]` tag**: The [accordion] tag allows you to create collapsible panels without the need for complex syntaxes or additional JavaScript. Using the AST, the parser automatically treats `h2` or `h3` headers as new accordion panels. This makes it easy to create interactive content sections simply by structuring your Markdown with headers.

- **New `[define]` tag**: The [define] tag is designed for creating description lists, such as glossaries or key-value pairs. Similar to the [accordion] tag, it leverages the AST to automatically structure and render the content, offering a clean and consistent way to display terms and descriptions without requiring extra HTML markup.

- **Updated `[tabs]`**: The `[tabs]` tag has been improved to now be based on the accordion tag and HTML `<summary>`/`<details>` elements. This means that tabs can be created with no JavaScript required, using the same simple, semantic structure, offering a native HTML solution for tabbed content.

- **Generic blocks**: New generic blocks like `[.features]` allow you to easily define content blocks with nested sections. This takes advantage of the AST to create flexible layouts using native CSS features like flexbox and grid. Essentially, this provides a content-first approach to complex layouts, making it easier to organize and structure your content visually.

- **Popovers**: You can now add popovers, overlays, and popover trigger buttons directly into your Markdown content using the `[button popovertarget]` and `[#my-overlay popover]` syntax. This allows for simple integration of interactive elements, such as tooltips or modal dialogs, without needing extra JavaScript or external libraries.

- **`[table]` tag improvements**: The `[table]` tag has received several enhancements, including the ability to render external data and a more convenient syntax to handle tables with long columns, where traditional Markdown table syntax can be unwieldy. These updates make it easier to work with data-heavy tables and present them cleanly in your content.


### Performance
Marked is well-known for its performance, especially in handling basic Markdown parsing. However, Nue significantly outperforms Marked, offering around 20-50% faster processing for basic operations. As you introduce more complex features like tables, footnotes, and curly "smart" brackets, the performance gap becomes even more pronounced — with Nue being roughly 2-5 times faster in these scenarios.

These performance improvements stem from Nue's more efficient internal architecture, designed to handle both simple and advanced Markdown features with minimal overhead. While these results come from basic, informal tests conducted on my laptop, I encourage you to test them for yourself. It would be great to see real-world benchmarks and eventually share them on this website to provide a more accurate comparison for the community.


## Other improvements and changes
Full list of improvements and breaking changes on this release:

[accordion]

  ## Improvements

  - **Web component fallbacks**: Interactive islands (client-side components) are now rendered as HTML custom elements, like `<contact-me custom="contact-me">`. This allows Nue to first attempt to mount a custom component. If the custom component is not defined, it falls back to a standard Web Component, providing flexibility to choose the right technology for the task.

  - **New `.dhtml` suffix**: A new `.dhtml` file extension is introduced for interactive islands, complementing the existing `.htm` files. The deprecated `.nue` extension no longer works. This distinction clarifies the separation between interactive components and regular (server-rendered) HTML files.

  - **Markdown <slot/> support**: Markdown extensions and custom components can now capture nested Markdown content using the `<slot/>` element. This makes it easier to build reusable wrapper components that can enrich nested content and other components.

  - **Improved HMR error reporting**: YAML parsing errors are now displayed directly in the browser via the updated Hot Module Replacement (HMR) feature. With this improvement, developers can see parse errors related to YAML, JavaScript, CSS, and components right away, making the development process faster and more efficient.


  ## Breaking changes

  - **No more `[grid]` tag**: The `[grid]` tag has been removed. You can now achieve similar functionality using generic blocks like `[.features]`, and split inner blocks with `h2`, `h3`, or `---`.

  - **No more `[code]` tag**: The `[code]` tag has been removed. Extra configurations, such as line numbering, can now be specified directly after the fenced code operator. This simplifies the syntax and aligns more closely with standard Markdown.

  - **No more `[codeblocks]` tag**: The `[codeblocks]` tag has been removed as well. This functionality can now be mimicked using generic blocks, providing a cleaner and more modular approach to handling code blocks in your content.

  - **No more `[tabs]` tag**: The `[tabs]` tag is now replaced by the `[accordion]` tag. You can now use CSS to style the accordion elements and make them act as tabs, offering greater flexibility and control over the layout.

  - **Header and footer auto-generation removed**: The auto-generation of headers and footers (via the `header` and `footer` variables in `site.yaml`) has been removed due to the complexity it introduced. Instead, use regular layout modules with the `<navi/>` tag to manually define these areas, giving you more control over their content and structure.

  - **`section_component` property dropped**: The `section_component` property has been dropped because it felt too "magical" and non-standard. It was inconsistent with the more straightforward, semantic approach that Nue embraces.

  - **`section_classes` property renamed**: The `section_classes` property has been renamed to `sections`. This change brings clarity and aligns with the overall goal of using clear, intuitive names for properties.

  - **"Complementary" layout module renamed to "beside"**: The "complementary" layout module has been renamed to "beside." This new name better reflects its purpose of providing additional content beside the main content area, enhancing readability and organization.

  - **`===` no longer works as a section separator**: The `===` syntax for section separation is no longer supported. Instead, use `---` for section separators, and `***` or `___` for thematic breaks (which correspond to the `<hr>` tag in HTML). This change ensures consistency and follows standard Markdown conventions.

  - **`[image]` "srcset" removed**: The `srcset` and `sizes` parameters for the `[image]` tag have been removed due to their complexity. A simpler and more powerful system for responsive images is planned for future releases.

  - **`[video]` tag simplified**: The `[video]` tag has been simplified to only accept the `src` parameter, removing support for multiple video sources. A more robust video player and driver support system is coming in a future update, allowing for better video handling and greater flexibility.
