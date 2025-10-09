
# Nuemark: Content first web development
Nuemark is a Markdown-based authoring format for rich, interactive content. It places content at the heart of web development, delivering a true content-first approach where writing comes before coding, and structure drives presentation.

<a href="https://nuejs.org/">
  <img src="https://nuejs.org/img/nuemark-content-big.png" width="650" height="1321">
</a>


## The problem with content
Modern tooling poses challenges to content development:

**JavaScript frameworks trap content in code**. A blog post becomes a React component. A landing page requires TypeScript knowledge. Marketing teams wait for developers to update copy. Content lives inside JavaScript bundles, invisible to search engines without complex hydration strategies.

**Plain Markdown is too limited**. Originally designed for converting text to HTML emails, standard Markdown lacks the structures modern websites need. No layouts. No responsive images. No interactive elements. You quickly hit the ceiling and resort to raw HTML.

**MDX mixes concerns**. It promises rich content but delivers mixed JavaScript. Import statements, JSX components, and business logic tangled with prose. Non-technical team members can't safely edit content without breaking the build.


## Why Nuemark
Nuemark extends Markdown with purpose-built syntax for modern web development while keeping content pure and accessible to everyone.

**Rich document structures** - Automatic sections, grids, stacks, and columns through clean, indentation-based syntax. No div/span soup, nor CSS classes mixed in your content.

**Built-in components** - Responsive images, videos, tables, and expandable content work out of the box.

**Full Markdown compatibility** - Everything from standard Markdown works, plus commonly needed extensions like tables, footnotes, and syntax highlighting.

**Extensible architecture** - Developers create custom tags that content authors use naturally. Define once, use everywhere. Components receive arguments, data, and nested content without exposing implementation details.

**Structured data access** - Parse and query document structure, headings, and front matter metadata programmatically.


See the [Nuemark syntax reference](https://nuejs.org/docs/nuemark-syntax) for complete documentation of all features and extensions.

