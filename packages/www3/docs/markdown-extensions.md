
# Markdown extensions
Markdown extensions let you embed rich components in your content using tag syntax. Images with captions, videos with controls, accordions, tables, or custom components. Both static and reactive. All through simple square bracket notation.

These extensions work alongside standard Markdown. You write paragraphs and headings as usual, then add rich components where needed.

## Tag syntax

Tags use square brackets with a name and optional attributes:

```md
[image photo.jpg]

[video src="intro.mp4" autoplay]

[accordion]
  ## First Question
  Answer content here
```

### Attribute formats

**Plain values:**
```md
[image photo.jpg]
```

**Named attributes:**
```md
[image src="photo.jpg" alt="Description" loading="eager"]
```

**ID and classes:**
```md
[image#hero.responsive photo.jpg]
```

**Nested YAML:**
```md
[image]
  src: photo.jpg
  alt: Description
  caption: Photo caption
```

### Nested content

Tags can include nested Markdown content:

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


### Buttons
Create a semantic, clickable button:

```md
[button "Get Started" href="/docs/"]
```

Generates:

```html
<a href="/docs/"><button>Get Started</button></a>
```

The button label supports inline Markdown formatting:

```md
[button "Hey, *world*" href="/"]
```

Generates:

```html
<a href="/"><button>Hey, <em>world</em></button></a>
```

Nested content also works:

```md
[button href="/"]
  ![](/icon.png)
```

Generates:

```html
<a href="/"><button><img src="/icon.png"></button></a>
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

Table with caption, thead and tfoot


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

Embed SVG icons inline:
```md
Continue reading [svg /icons/arrow-right.svg]
```

### Accordions

Create collapsible content sections:

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

#### Accordion options

**name** - Groups accordions so only one can be open at a time:
```md
[accordion name="faq"]
```

**open** - Sets initial state:
```md
[accordion open]        # First item open by default
[accordion open="2"]    # Second item open by default
```

## Custom components
Developers create custom tags that content authors use naturally. Components are defined in HTML files. Here's a custom "card" component:

```html
<div :is="card" class="card { class }">
  <h3>{ title }</h3>

  <!-- slots are replaced with HTML generated from the nested content -->
  <slot/>
  <footer :if="footer">{ footer }</footer>
</div>
```

Use in Markdown:
```md
[card.feature"]
  title: Key Feature
  footer: Learn more
  
  This is the card content with full
  **Markdown** support.
```


### Component properties
Components have access to multiple data sources when rendering:

**Named attributes** - Explicitly passed values from the tag:
```md
[card type="feature" title="Key Feature"]
```
The component receives `type` and `title` as properties.

**Unnamed attribute** - The first plain value without a name, accessible via `_`:
```md
[button "Click me" href="/"]
```
The component receives `"Click me"` as the `_` property.

**Nested content** - Markdown content inside the tag, rendered as HTML and inserted via `<slot/>`:
```md
[card]
  This **markdown** content becomes HTML
  and fills the slot in the component.
```

**Page metadata** - All front matter from the current page is available:
```md
---
author: Sarah Chen
date: 2024-01-15
---
```
Components can access `{ author }` and `{ date }`.

**Site data** - Configuration from `site.yaml` and YAML data files in `@shared/data/`:
```yaml
# site.yaml
site_name: Acme Inc
```
Components can access `{ site_name }`.

See [Context data](context-data) for complete details on what data is available to components.


### Component location

Custom components typically live in these locations:

- `@shared/lib/components.html` - Reusable components shared across all sites
- `blog/components.html` - Application-specific components
- `@shared/layout.html` - Components alongside layout modules in smaller sites

These are recommended patterns, not requirements. Component files can have any name and live anywhere in your directory structure or inheritance chain. Nue finds and includes them automatically.

See [Page dependencies](page-dependencies) for how component files are discovered in single-site and multi-site setups.

