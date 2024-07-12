

# Content authoring
Nue comes with a simple content assembly language for marketers, copywrites, and technical writers. You can rapidly build complex web pages without ever touching a single line of code. You no longer need complex cloud-based content management systems. Just simple versionable text-files, directly accessible on your file system, and editable with your favourite editor.



## Markdown for rich, interactive content
Nue offers an expressive *Markdown* flavor with additional support for sections, content blocks, grids, stacked layouts, responsive images, videos, tabs, and more. All your content, from simple blog entries to rich landing pages are editable by non-technical people. Just edit the content and see your website shaping up in real time.

! video: editing front page

Think Nue like *WordPress*, *Notion*, but the content is editable with your favorite text editor and is compatible with your design system. The versatile syntax allows you to build complex landing pages comparable to what you can build with tools like *Framer* or *WebFlow*.



## Syntax
Nue offers a full [Markdown support](https://daringfireball.net/projects/markdown/). You can manage your website content using an easy-to-read, easy-to-write plain text format. All the familiar things like headings, quotes, lists, and fenced code blocks are there:


``` md
# First level heading
A paragraph with **bold** and _italics_ and `inline code`

## Second level heading

> Quoted text with a [Link to docs](/docs/)

1. This here
2. is an ordered
3. list of items

Followed with

* An unordered
* list of
* items

\```
// here is a javascript code block
function hello() {
  return "world"
}
\```

![An image](/path/to/image.webp)
```


### Front matter
You can pass optional [settings and metadata](settings.html) in the "front matter" section of the page. This is the first thing in your file between triple-dashed (`---`) lines taking a valid YAML format:


``` yaml
---
title: Page title
desc: Page description for search engines
og: /img/hero-image.png
---
```


### Sections
Just like books can be divided into chapters; your long-form articles and landing pages are often divided into sections. These sections are separated with a triple-dash:


``` yaml
---
title: Page with sections
---

# The hero section
With an epic subtitle

---

## A second section
With another great subtitle
```


### Tags
Nue comes with a set of [built-in tags](tags.html) for responsive images, videos, tables, code blocks, and more. The syntax takes the form of `[tagname]`. For example:

```
[video explainer.mp4]
```

Tags are like WordPress shortcodes, but the syntax is simpler and less verbose.


### Blocks
Blocks are chunks of content with an alternate styling. Think highlighted content like tips, notes, and alerts. The syntax takes the form of `[.classname]`. For example:

``` md
[.note]
  ### Content is king
  Web design is 100% content and 95% typography
```

The "note" must be specified on your design system and the design should be implemented in the website CSS.


### Stacks
Block content can be dividied into multi-block layouts where each item is separated with a triple-dash. For example:

``` md
[.stack]
  ## First item
  With content

  ---
  ## Second item
  With content
```

Again, the name "stack" must be implemented in your website CSS by the UX developer.


### Grids
[Grid](tags.html#grids) is a built-in tag used like the stack but is meant for more complex layouts. They have more configuration options and their visual appearacnce and behaviour can be enhanced with JavaScript.


``` md
[grid]
  ## First item
  With content

  ---
  ## Second item
  With content

  ---
  ## Third item
  With content
```


### Nesting
Blocks, stacks, and grids can be nested to form more complex layouts on your richer marketing/landing pages:


``` md
[.feature]
  ## Hello, World!
  Lets put a nested stack here

  [.stack]
    ### First item
    With description
    ---
    ### Second item
    With description
```



### Custom tags
Your UX developer can easily [extend](custom-layouts.html#custom-md) the Markdown vocabularity with new tags that operate on the server-side, client-side, or both. Ask the UX developer for the list of available extensions.









