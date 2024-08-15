
# Content development
Nue has a powerful content authoring syntax for marketers, copywriters, and technical writers. You can rapidly assemble complex web pages without ever touching a single line of code or the need to set up complex cloud-based content database systems—just simple versionable text files, directly accessible on your file system, and editable with your favorite editor.

[bunny-video]
  videoId: 3bf8f658-185a-449c-93b9-9bd5e1ad0d05
  poster: /img/nuemark-splash.jpg


## Extended Markdown
The content authoring syntax is based on **Markdown**, but extends its capabilities to make it suitable for creating rich web pages. It supports sections, content blocks, grids, stacked layouts, responsive images, videos, tabs, and more. All your content, from simple blog entries to rich landing pages is editable by non-technical people.

Thanks to universal hot-reloading, the content authors can see the results in real time as they edit the content.

Think Nue like **WordPress**, **Notion**, but the content is editable with your favorite text editor and the results are compatible with your design system. The versatile syntax allows you to build complex landing pages comparable to what you can create with online authoring tools like **Framer** or **WebFlow**.



## Syntax
Nue offers a full [Markdown support](//daringfireball.net/projects/markdown/). That is: All the familiar things like headings, quotes, lists, and fenced code blocks are supported:


```md
# First level heading
A paragraph with **bold** and *italics* and `inline code`

![An image](/path/to/image.webp)

## Second level heading

> Quoted text with a [Link to docs](/docs/)

1. This here
2. is an ordered
3. list of items

Followed with

- An unordered
- list of items

\```js
// here is a javascript code block
function hello() {
  return "world"
}
\```
```


### Front matter
You can pass optional [settings and metadata](settings.html) in the "front matter" section of the page. This is the first thing in your file between triple-dashed (`---`) lines taking a valid YAML format:


```yaml
\---
title: Page title
desc: Page description for search engines
og: /img/hero-image.png
\---
```


### Sections
Just like books can be divided into chapters, your long-form articles and landing pages are often divided into sections. These sections are separated with three or more dash (`---`) or equals (`===`) characters:


```yaml
\---
title: Page with sections
\---

# The hero section
With an epic subtitle

\=====

## A second section
With another great subtitle
```


### Tags
Nue comes with a set of [built-in tags](tags.html) for responsive images, videos, tables, code blocks, and more. The syntax takes the form of `[tagname]`. For example:

```md
[video explainer.mp4]
```

Tags are like WordPress short-codes, but the syntax is simpler and less verbose.


### Blocks
Blocks are chunks of content with an alternate styling. Think of highlighted content like tips, notes, and alerts. The syntax takes the form of `[.classname]`. For example:

```md
[.note]
  ### Content is king
  Web design is 100% content and 95% typography
```

The "note" class must be specified on your design system and the design should be implemented in the website's CSS.


### Stacks
Block content can be divided into multi-block layouts where each item is separated with a triple-dash. For example:

```md
[.stack]
  ## First item
  With content

  ---
  ## Second item
  With content
```

Again, the name "stack" must be implemented in your website CSS by the UX developer.


### Grids
[Grid](tags.html#grids) is a built-in tag used like the stack but is meant for more complex layouts. They have more configuration options and their visual appearance and behavior can be enhanced with JavaScript.


```md
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


```md
[.feature]
  ## Hello, World!
  Let's put a nested stack here

  [.stack]
    ### First item
    With description
    ---
    ### Second item
    With description
```



### Custom tags
Your UX developer can easily [extend](custom-layouts.html#custom-md) the Markdown vocabulary with new tags that operate on the server-side, client side, or both. Ask the UX developer for the list of available extensions.









