---
title: Introducing Nuemark
hero_title: "*Introducing Nuemark:* A Markdown dialect for rich, interactive content"
desc: Nuemark is a Markdown dialect for rich, interactive content.
date: 2024-01-12
og: /img/nuemark-splash.jpg
---

Today, I'm excited to release Nuemark — a Markdown-based text editing format for rich internet content. It places content at the heart of everything, and brings (back) a content-first approach to web development:

[image]
  small: /img/nuemark-content.png
  large: /img/nuemark-content-big.jpg
  caption: A content-first approach to web development
  width: 700


### Content hot-reloading
Nuemark is a standalone library that works under Bun, Node, and Deno. However, it is best served together with Nuekit and its [universal hot-reloading](/docs/hot-reloading.html) capability. Just edit your content freely and see the page shaping up in your browser in real time.

[bunny-video.larger]
  videoId: 3bf8f658-185a-449c-93b9-9bd5e1ad0d05
  poster: /img/nuemark-splash.jpg


## Manage content like a hacker { #hacker }
Nuemark lets you manage content [like a hacker](//tom.preston-werner.com/2008/11/17/blogging-like-a-hacker) without the complexity of large systems like *WordPress* or *Contentful*. Instead, you'll approach content from a software development perspective: The content is stored in Git and you manage it with your preferred editor like *VS Code* or *Sublime Text*.

Nuemark is designed for content creation. It's a simple, concise syntax that is easy to learn. It is pure content, with no HTML, CSS, or JavaScript, so it's hard to break things.

```md
[.stack]
  # Content is king
  Web design is 100% content and 95% typography

  [button "Learn more" href="/docs"]
  ---
  [! typography.png ]
```


[image]
  small: /img/content-hero.png
  large: /img/content-hero-big.png
  caption: The content after applying some context-specific styling


With Nuemark, you start with pure content: Text, images, and videos and only then move into layout and design. By starting with a content-first mindset, you will ensure that the page design evolves to support what's inside it. Not the other way around.


## Built-in set of headless UI components { #components }
Nuemark comes with a set of built-in components, which aim to tackle the most common content management use cases. There are buttons, icons, responsive images, videos, tables, tabs, and layout grids. And you can mix components to form more complex layouts.

[image]
  small: /img/rich-content.png
  large: /img/rich-content-big.png
  caption: Nuemark content from the installable demo


### Decoupled design
All these components or "tags" are *headless* — meaning that there are no inline styling, CSS modules, or utility classes to impact their appearance. There is only one, semantic class name on the root element of the component, which *names* the component. Otherwise, the components are *classless* and consist purely of semantic HTML elements.

The semantic approach means that you can customize the look and feel of your components so that they look just right in the given context. For example, a tabbed layout may look completely different on your front page compared to what it looks like on the documentation area:

[image]
  small: /img/tab-designs.jpg
  large: /img/tab-designs-big.jpg
  caption: Same component, different CSS module
  width: 500

This sort of content-first approach brings the legendary [CSS Zen Garden](//www.csszengarden.com/) back to the game. When your components always have the same structure you can reuse your CSS across your pages, apps, websites, and projects.

## Driven by Web Components
Some components are *isomorphic* meaning that the content is rendered on the server side for search engines and the behavior of the component is spiced up with client-side JavaScript.

Nuemark uses the standard [`is` attribute](//developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) to tell the browser that a particular HTML structure should be spiced up with a Web Component. For example, the `[tabs]` component is implemented as follows:

```js
// implementation
class Tabs extends HTMLElement {
  constructor() {
    // Do the thing when the component is mounted
  }
}

// registtration
customElements.define('nuemark-tabs', Tabs, { extends: 'section' })
```

This is a modern/standard way to implement [progressive enhancement](//developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement), historically done with libraries like jQuery.


### Build your own tags
You can extend Nuemark with custom tags. Any JavaScript object with a `name` property and `render()` method is a legit Nuemark component. Here's a dummy TSX example:

```tsx
export function MyAlert(props: { color: string, message: string }) {
  return (
    <p style={{ color: color || 'red' }}>{ props.message }</p>
  );
}
```

And here's the same with [Nue template syntax](/docs/template-syntax.html)

```html
<p @name="my-alert" style="color:{ color || 'red' };">{ message }</p>
```


## Develop sites for content creators
The primary purpose of a website is to present content. You want to raise awareness of your idea, generate sales, or just share information. The bottom line is that your website should be optimized for creating and managing content.

Nuemark is a perfect choice for this purpose. After you have a proper design system in place, editors can create content that looks consistently great and fits your overall design. They can author new pages without ever leaving the content.

Nuemark is an ideal choice for static site generators and flat-file systems.


### Try now
[Bun](//bun.sh) is the recommended engine for Nuemark:

```sh
# Install Bun (if not done yet)
curl -fsSL https://bun.sh/install | bash

# Install website generator (Nuemark playground)
bun install nuekit --global

# Install Nuemark demo (as seen on this page)
bun create nue@latest
```

Choose "nuemark-demo" on the last step and off you go.

ps: Check out [Getting started docs](/docs/#node) if you prefer Node.

### Learn Nuemark

- [User guide](/docs/content-authoring.html)
- [Tag reference](/docs/tags.html)
- [HTML output](/docs/page-layout.html#md)


- - -

## Frequently asked questions { #faq }


### How is this different from MDX?
Nuemark differs from prior alternatives like *MDX* and *Markdoc* in the following ways:

1. Nuemark is targeted at content creators. There are no "scary" JavaScript expressions or import statements that can break the page from rendering. Familiarity with Markdown and YAML front matters is enough for crafting rich, interactive content.

2. Nuemark comes with a rich set of built-in components that can be used inside standard Markdown or mixed together to form more complex layouts. Any modern web page can be expressed with Nuemark so that your content is neatly separated for editors.

3. When you edit Nuemark within the Nue framework you see your page update on the browser in real-time offering a true WYSIWYG experience for content creators.


### Where does the syntax come from?
Nuemark takes inspiration from WordPress shortcodes, TOML configuration language, YAML front matter, and other Markdown elements like links and images. The goal make it approachable for people already familiar with Markdown and introduce as few new idioms as possible.
