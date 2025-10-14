
# Nuemark syntax
Complete reference for Nuemark's content-first markup syntax. See the [Nuemark introduction](/docs/nuemark) for an overview.

## File structure
Nuemark files use `.md` extension and can include optional YAML front matter:

```md
---
title: My Page
date: 2024-01-15
tags: [web, design]
---

# Page content starts here
```

Front matter provides metadata accessible to layouts, components, and the build system. All standard YAML types are supported.

## Standard Markdown
Nuemark fully supports standard Markdown syntax:

```md
# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold** and *italic* text, plus `inline code`.

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

### Code blocks

Fenced code blocks with syntax highlighting:

```md
​```js
function hello() {
  return "Hello world"
}
​```
```

Supported languages include JavaScript, TypeScript, Python, HTML, CSS, and many more through built-in [Nueglow](/docs/nueglow) syntax highlighting.

## Enhanced formatting
Nuemark extends standard Markdown with additional formatting options:

```md
**bold** or __bold__     → <strong>bold</strong>
*italic* or _italic_     → <em>italic</em>  
`code`                   → <code>code</code>
~strikethrough~          → <s>strikethrough</s>
"quoted text"            → <q>quoted text</q>
\|highlighted|            → <mark>highlighted</mark>
```

The bullet character `•` provides non-semantic bold:

```md
•bold text•              → <b>bold text</b>
```


## Headings with attributes
Add IDs and classes to headings for styling and linking:

```md
# Nuemark: Content-first web development { .heroic }

## Nuemark Introduction { #intro }

## How to use Nuemark { #howto.heroic }
```

Generates:

```html
<h1 class="heroic">Nuemark: Content-first web development</h1>
<h2 id="intro">Nuemark Introduction</h2>
<h2 id="howto" class="heroic">How to use Nuemark</h2>
```

## Variables

Embed dynamic values using curly braces:

```md
Current version: { version }
Page title: { title }
Author: { author }
```

Variables can access any data supplied to the context or via front matter.


## Sections
Enable automatic sectioning to wrap content in semantic HTML sections:

```md
---
sections: true
---

# Introduction
First section content...

## Features
Second section content...

## Technical Details
Third section content...
```

Generates:

```html
<article>
  <section>
    <h1>Introduction</h1>
    <p>First section content...</p>
  </section>
  <section>
    <h2>Features</h2>
    <p>Second section content...</p>
  </section>
  <section>
    <h2>Technical Details</h2>
    <p>Third section content...</p>
  </section>
</article>
```

### Section classes

Assign classes to sections:

```md
---
sections: [hero, features, details]
---
```

### Manual sections

Use triple dashes for explicit section breaks:

```md
First section content...

---

Second section content...

---

Third section content...
```


## Section wrapper
Enable automatic sectioning to wrap content in semantic HTML sections:

```md
 ---
 section_wrapper: wrap
 ---
```

Generates:

```html
<section>
  <div class="wrap">
    <!-- content here -->
  </div>
</section>
```

Wrapper allows more fine tuned design control on backgrounds and inner content blocks with max-width setting.


## Blocks

Create structured layouts with block syntax. Any class name from your design system can be used - blocks simply wrap content in a `<div>` with your specified class:

```md
[.note]
  ### Important Note
  This content is wrapped in a div with class "note"
```

Generates:

```html
<div class="note">
  <h3>Important Note</h3>
  <p>This content is wrapped in a div with class "note"</p>
</div>
```

The class name is entirely up to you - use whatever makes sense for your design system:

```md
[.warning]          → <div class="warning">...</div>
[.testimonial]      → <div class="testimonial">...</div>
[.pricing-tier]     → <div class="pricing-tier">...</div>
[.photo-gallery]    → <div class="photo-gallery">...</div>
```

### Nested divs

Blocks automatically create nested divs based on your content structure. The first heading level encountered determines how content is grouped:

```md
[.features]
  ### Feature One
  First feature description

  ### Feature Two
  Second feature description
```

Since the first heading is `h3`, each `h3` creates a new nested div:

```html
<div class="features">
  <div>
    <h3>Feature One</h3>
    <p>First feature description</p>
  </div>
  <div>
    <h3>Feature Two</h3>
    <p>Second feature description</p>
  </div>
</div>
```

You can also use triple dashes (`---`) to explicitly create nested divs:

```md
[.testimonials]
  "Great product!"
  - Sarah Chen

  ---

  "Changed our workflow"
  - Michael Park
```

Generates:

```html
<div class="testimonials">
  <div>
    <p>"Great product!"</p>
    <p>- Sarah Chen</p>
  </div>
  <div>
    <p>"Changed our workflow"</p>
    <p>- Michael Park</p>
  </div>
</div>
```

### Common patterns

While you can use any class name, here are some commonly used patterns:

**Grid layouts** - For responsive multi-column layouts:

```md
[.grid]
  ### Feature One
  First feature description

  ### Feature Two
  Second feature description

  ### Feature Three
  Third feature description
```

**Stack layouts** - For vertical arrangements with consistent spacing:

```md
[.stack]
  ### Design
  Focus on systematic design

  ### Engineering
  Built for performance

  ### Content
  Pure content structure
```

These work because your CSS defines how `.grid` and `.stack` behave. Nuemark just provides the structure - your design system controls the presentation.

### Nested blocks

Blocks can be nested:

```md
[.feature]
  ## Main Feature
  Feature description

  [.grid]
    ### Sub-feature A
    Description A

    ### Sub-feature B
    Description B
```

## Tag syntax

Tags extend Nuemark with rich components using square bracket syntax:

```md
[tagname options]
```

### Option formats

**Named attributes:**
```md
[image src="photo.jpg" alt="Description" loading="eager"]
```

**Plain values:**
```md
[image photo.jpg]
```

**Nested YAML:**
```md
[image]
  src: photo.jpg
  alt: Description
  caption: Photo caption
```

**ID and classes:**
```md
[image#hero.responsive photo.jpg]
```

### Nested content

Tags can include nested content:

```md
[note]
  This is nested content that becomes
  part of the component. Markdown **works** here.
```

## Built-in tags

### Images

Basic image:
```md
[image photo.jpg]
```

Image with caption:
```md
[image photo.jpg]
  This is the image caption with **markdown** support
```

Responsive images:
```md
[image]
  small: mobile.jpg
  large: desktop.jpg
  alt: Responsive image
```

Image link:
```md
[image photo.jpg]
  href: /gallery/
  caption: Click to view gallery
```

### Videos

Basic video:
```md
[video intro.mp4]
```

Video with options:
```md
[video]
  src: intro.mp4
  poster: thumbnail.jpg
  autoplay: true
  muted: true
  loop: true
```

### Tables

Enhanced table syntax:
```md
[table]
  Name     | Email              | Role
  Alice    | alice@example.com  | Developer
  Bob      | bob@example.com    | Designer
```

Table with caption:
```md
[table caption="Team Members"]
  Name     | Email              | Role
  ------
  Alice    | alice@example.com  | Developer
  Bob      | bob@example.com    | Designer
  ------
  Total: 2 team members
```

### Inline SVG

Embed SVG icons:
```md
Continue reading [svg /icons/arrow-right.svg]
```

## Accordions

Create collapsible content sections with the accordion tag, perfect for FAQs or any content that benefits from progressive disclosure:

```md
[accordion]
  ## First Question
  Answer to the first question

  ## Second Question
  Answer to the second question

  ## Third Question
  Answer to the third question
```

Generates semantic HTML using native `<details>` and `<summary>` elements:

```html
<div>
  <details>
    <summary>First Question</summary>
    <p>Answer to the first question</p>
  </details>
  <details>
    <summary>Second Question</summary>
    <p>Answer to the second question</p>
  </details>
  <details>
    <summary>Third Question</summary>
    <p>Answer to the third question</p>
  </details>
</div>
```

Like blocks, accordions create sections based on the first heading level encountered or section separator (`---`).


### Accordion options

**name** - Groups accordions so only one can be open at a time:
```md
[accordion name="faq"]
```

When accordions share the same name, opening one automatically closes others in the group.

**open** - Sets initial state:
```md
[accordion open]        # First item open by default
[accordion open="2"]    # Second item open by default
```

## Footnotes

Standard footnote syntax:
```md
This needs clarification[^1].

[^1]: This is the footnote content.
```

Named footnotes:
```md
[Separation of Concerns][^soc] is fundamental.

[^soc]: Keeping HTML, CSS, and JavaScript separate.
```

Define footnotes with description lists:
```md
[define]
  ## Term One { #term1 }
  Definition of term one
  
  ## Term Two { #term2 }
  Definition of term two
```

## Custom components
Developers can create custom tags that content authors use naturally. Components are defined in HTML files:

```html
<!doctype html lib>

<!-- Button component -->
<a :is="button" class="button { class }" href="{ href }">
  { label || _ }
</a>

<!-- Card component -->
<div :is="card" class="card { type }">
  <h3>{ title }</h3>
  <slot/>
  <footer :if="footer">{ footer }</footer>
</div>
```

Use in Markdown:
```md
[button "Get Started" href="/docs/"]

[card type="feature"]
  title: Key Feature
  footer: Learn more
  
  This is the card content with full
  **Markdown** support.
```

### Component properties

Components receive:
- **Named attributes** from the tag
- **Unnamed attribute** via `_`
- **Nested markdown as HTML** via `<slot/>` tag
- **Page metadata** from front matter
- **Site data** via .yaml files



