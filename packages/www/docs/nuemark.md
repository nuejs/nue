
# Nuemark: Content first web development
Nuemark is a Markdown-based authoring format for rich, interactive content. It places content at the heart of web development, delivering a true content-first approach where writing comes before coding, and structure drives presentation.

[video: editing rich content with Nuekit and see HMR put it live]


## The problem
Modern web development has a content problem. We've built complex toolchains that turn simple text into engineering projects.

**JavaScript frameworks trap content in code**. A blog post becomes a React component. A landing page requires TypeScript knowledge. Marketing teams wait for developers to update copy. Content lives inside JavaScript bundles, invisible to search engines without complex hydration strategies.

**Plain Markdown is too limited**. Originally designed for converting text to HTML emails, standard Markdown lacks the structures modern websites need. No layouts. No responsive images. No interactive elements. You quickly hit the ceiling and resort to raw HTML.

**MDX mixes concerns**. It promises rich content but delivers mixed JavaScript. Import statements, JSX components, and business logic tangled with prose. Non-technical team members can't safely edit content without breaking the build.


## Why Nuemark
Nuemark extends Markdown with purpose-built syntax for modern web development while keeping content pure and accessible to everyone.

**Rich document structures** - Automatic sections, grids, stacks, and columns through clean, indentation-based syntax. No div/span soup, nor CSS classes mixed in your content.

**Built-in components** - Responsive images, videos, tables, and expandable content work out of the box.

**Full Markdown compatibility** - Everything from standard Markdown works, plus commonly needed extensions like tables, footnotes, and syntax highlighting.

**Extensible architecture** - Developers create custom tags that content authors use naturally. Define once, use everywhere. Components receive arguments, data, and nested content without exposing implementation details.

**Structured data access** - Parse and query document structure, headings, and front matter metadata programmatically. [Nuekit](nuekit) uses this internally for table of contents generation and content collections.


## How it looks
Content authors write naturally, focusing on structure and meaning:

```md
[.hero]
  # Content is king
  Web design is 95% typography

  [button "Learn more" href="/docs/"]
  [button.primary "Get started" href="/get-started/"]

  ---
  [image typography.png]
```

This generates semantic HTML your design system can style:

```html
<section class="hero">
  <div>
    <h1>Content is king</h1>
    <p>Web design is 95% typography</p>
    <div>
      <a class="button" href="/docs/">Learn more</a>
      <a class="button primary" href="/get-started/">Get started</a>
    </div>
  </div>
  <div>
    <figure>
      <img src="typography.png" loading="lazy">
    </figure>
  </div>
</section>
```

Clean input, clean output. No framework markup, no hydration markers, no client-side JavaScript.


## Content first
Nuemark transforms how content-focused applications are built. With Nuemark and a solid design system, content teams work independently on marketing pages, documentation, and blogs without touching code.

Writers focus on content, not implementation. They use familiar Markdown with prepared components like `[.columns]`, `[.stack]` or `[testimonial]`. The design system ensures everything looks right automatically — consistent typography, spacing, colors, and responsive behavior.

This separation lets everyone work in their expertise. Content teams write. Design systems handle presentation. Developers build capabilities. Nobody blocks anyone else.

Nuemark generates predictable, semantic HTML that design systems can rely on. A heading becomes `<h1>`. An image becomes `<figure>`. A quote becomes `<blockquote>`. Your design system styles semantic elements, not arbitrary class names.

This is why Nuemark exists: to separate content from presentation completely. When done right, both can evolve independently. Update your design system, and thousands of pages update instantly. Scale from ten pages to ten thousand without architectural changes.

See how this works with [design systems](/docs/design-systems).


## Custom extensions
Developers extend Nuemark with custom tags that feel native to content authors:

```html
<!doctype html lib>

<!-- custom button tag -->
<a :is="button" class="button { class }" href="{ href }">{ label || _ }</a>

<!-- testimonial tag -->
<blockquote :is="testimonial">
  <p>{quote}</p>
  <footer>
    <cite>{author}</cite>
    <span>{role} at {company}</span>
  </footer>
</blockquote>
```

Content authors use it naturally:

```md
[testimonial]
  quote: This changed how our entire team works
  author: Sarah Chen
  role: VP of Marketing
  company: Example Corp
```


## Installation
Get started with Nuemark through Nuekit for the full development experience:

```bash
bun install nuekit
```

Or use Nuemark outside the Nue ecosystem on your own site generators

```bash
bun install nuemark
```

See the [Nuemark syntax reference](/docs/nuemark-syntax) for complete documentation of all features and extensions.

