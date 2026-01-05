
# Markdown syntax
Nue uses an extended Markdown syntax dubbed "Nuemark" for authoring rich, interactive web pages. You write content in Markdown files with a `.md` extension, and Nue transforms them into semantic HTML.

This guide covers basic content authoring: headings, paragraphs, formatting, links, images, and code blocks. The syntax you use for writing text.

### Related content
[Page layout](page-layout) for structuring content on the page with sections, grids, and blocks.

[Markdown extensions](markdown-extensions) for embedding components like videos, accordions, and custom tags.


## Front matter
Pages can include YAML front matter at the top:

```md
 ---
 title: My Page
 date: 2024-01-15
 tags: [web, design]
 author: Sarah Chen
 ---

 # Page content starts here
```

Front matter provides metadata. Page titles, publication dates, author information, custom data. Your layout modules and components can access this data. All standard YAML types work: strings, numbers, booleans, arrays, objects.

See [Context data](context-data) for how this metadata flows through the system and becomes available to the page, templates and components.


## Standard Markdown

Nuemark supports everything from standard Markdown:

```md
# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold** and *italic* text, 
plus `inline code`.

- Unordered list item
- Another item
  - Nested item

1. Ordered list
2. Second item

> Blockquote with multiple lines
> continues here

[Link text](https://example.com)

![Alt text](image.jpg)
```

Nothing surprising here. If you know Markdown, you know this part.


## Inline HTML
Nue does not allow HTML within Markdown files. This restriction enforces separation of concerns: `.md` files contain content only, while structural elements belong to the global design system.

So instead of embedding HTML directly:

```md
<!-- this doesn't work -->
<div class="note">
  <strong>Note:</strong> Important information here
</div>
```

Create a [markdown extension](markdown-extensions)

```html
<div :is="note" class="note">
  <strong>{ label || 'Note'}</strong> <slot/>
</div>
```

Then use it in Markdown:

```md
[note]
  Important information here
```



## Enhanced formatting

Nuemark adds a few formatting shortcuts:

```md
 **bold** or __bold__     → <strong>bold</strong>
 *italic* or _italic_     → <em>italic</em>
 `code`                   → <code>code</code>
 ~strikethrough~          → <s>strikethrough</s>
 "quoted text"            → <q>quoted text</q>
 |highlighted|            → <mark>highlighted</mark>
```


## Code blocks

Fenced code blocks with syntax highlighting:

````md
 ```js
 function hello() {
   return "Hello world"
 }
 ```
````

Supported languages include JavaScript, TypeScript, Python, HTML, CSS, and many more through [Nueglow](nueglow) syntax highlighting. The highlighting happens at build time, so there's no client-side JavaScript overhead.


## Headings with attributes

Add IDs and classes to headings:

```md
# Nuemark: content-first web development { .hero }

## Introduction { #intro }

## How to use Nuemark { #howto.hero }
```

Generates:

```html
<h1 class="hero">Nuemark: content-first web development</h1>
<h2 id="intro">Introduction</h2>
<h2 id="howto" class="hero">How to use Nuemark</h2>
```

The ID lets you link directly to sections. The class lets your design system style specific headings differently.


## Variables

Embed dynamic values using curly braces:

```md
Current version: { version }
Page title: { title }
Author: { author }
```

Variables pull from front matter, site configuration, or context data. If a variable isn't defined, Nue renders it as an empty string. No errors, no broken pages.

## Images

Basic image syntax works as expected:

```md
![Alt text](photo.jpg)
```

For more control, use the image tag covered in [Markdown extensions](markdown-extensions).

## Footnotes

Standard footnote syntax:

```md
This needs clarification[^1].

[^1]: This is the footnote content.
```

Named footnotes work too:

```md
[Separation of Concerns][^soc] is fundamental.

[^soc]: Keeping HTML, CSS, and JavaScript separate.
```

Nue automatically numbers and links footnotes at the bottom of your content.


