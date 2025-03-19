

## Basic syntax
Nue fully supports standard [Markdown](//daringfireball.net/projects/markdown/), allowing you to work with familiar formatting options like headings, quotes, lists, and fenced code blocks. Here's an example of the basic syntax:

```md
# First level heading
A paragraph with **bold** and *italics* and `inline code`

![An image](/path/to/image.webp)

## Second level heading

> Quoted text with a [Link to docs](/docs/)

1. This here
2. is an ordered
3. list of items

Followed with:

- An unordered
- list of items


And a horizontal line:

***

```

## Standard Markdown extensions
Nue supports common **Markdown extensions** such as **tables** and **footnotes**, allowing for more structured and informative content.

### Tables
Tables are useful for presenting structured information. Here’s an example:

```md
\| Principle                | Description                                                       |
\|--------------------------|-------------------------------------------------------------------|
\| Separation of Concerns   | Dividing a system into distinct sections with specific roles.     |
\| Progressive Enhancement  | Building core functionality first, then adding enhanced features. |
\| Information Architecture | Structuring content for usability and navigation clarity.         |
```

This table provides a simple breakdown of key principles.

### Footnotes
**Footnotes** allow you to reference additional information or explanations without disrupting the main content flow. Here’s an example:

```md
Design principles like Separation of Concerns [^1], Progressive Enhancement [^2], and Information Architecture [^3] are fundamental.

[^1]: Separation of Concerns (SoC) is crucial for maintaining clean and maintainable code.
[^2]: Progressive Enhancement (PE) ensures that core functionality is available to all users, with enhanced features layered on.
[^3]: Information Architecture (IA) involves organizing content in a way that is intuitive and accessible for users.
```

Footnotes provide a way to include more detail without cluttering the main text.


## Nue-specific things
Nue extends standard Markdown with additional formatting options and powerful features to make content richer and more dynamic, without needing complex HTML.


### No HTML allowed
In Nue, the focus is on **pure content** — free from HTML markup. This ensures that your content remains clean, semantic, and focused on structure, while design and styling are handled by CSS and layout modules. By separating content from presentation, Nue enforces the **Separation of Concerns (SoC)** principle, leading to better maintainability and a more consistent design system.

Instead of embedding HTML, Nue provides powerful Markdown extensions like **blocks**, which let you create rich, styled content while keeping the content layer pure.


### Extra formatting optionms
Nue provides a variety of formatting options beyond standard Markdown, giving you more control over how text appears on the page. Here’s a comparison between the Markdown syntax and the corresponding HTML output:


[table]
  Markdown  | HTML | Example
  ------
  `I'm **bold**`   | `<strong>bold</strong>`    | I'm **bold**
  `I'm __bold__`   | `<strong>bold</strong>`    | I'm __bold__
  `I'm •bold•`     | `<b>bold</b>`              | I'm •bold•
  `I'm *italic*`   | `<em>italic</em>`          | I'm *italic*
  `I'm _italic_`   | `<em>italic</em>`          | I'm _italic_
  `I'm /italic/`   | `<i>italic</i>`            | I'm /italic/
  `I'm \`code\``   | `<code>code</code>`        | I'm `code`
  `I'm ~striked~`  | `<s>striked</s>`           | I'm ~striked~
  `I'm "quoted"`   | `<q>quoted</q>`            | I'm "quoted"
  `I'm |marked|`   | `<mark>marked</mark>`      | I'm |marked|


This extended set of formatting options helps you achieve more **precise styling** without needing to write raw HTML.


### Variables
Nue allows the use of **variables** within Markdown files, enabling dynamic content based on your application data. Variables are wrapped in curly braces (`{}`) and will be replaced with their corresponding values when the page is rendered:

```md
Package name:    **{ package.name }**
Package version: **{ package.version }**
Complex value:   **{ foo.bar[0].name }**
```

The values between curly braces are taken from the **application data** or **metadata** available on the page. This feature ensures that content can stay dynamic and up-to-date with the latest values from your site’s data and settings.


### Heading IDs
Enabling the `heading_ids: true` option in your configuration automatically generates anchor links for each heading. For example, a heading like:

```md
## Less is More
```

is rendered as:

```html
<h2 id="less-is-more">
  <a href="#less-is-more" title="Less is More"></a>
  Less is More
</h2>
```

This creates a clickable link for each heading, making it easy to navigate through your content.

#### Explicit IDs and Class Names

You can also define IDs and class names directly within the heading. For example:

```md
## Less is More { #less.more }
```

This is rendered as:

```html
<h2 id="less" class="more">
  <a href="#less" title="Less is More"></a>
  Less is More
</h2>
```

Here, the ID is set to `less`, and the class is set to `more`, providing more control over your heading's styling and link structure.


### Expanded footnotes
Nue enhances the standard Markdown footnote functionality by allowing you to mark entire phrases as part of the footnote. This makes it easier to create footnotes that are more descriptive and visually clear.

For example, instead of just marking a single digit, you can mark an entire phrase:

```md
Design principles like [Separation of Concerns][^1], [Progressive Enhancement][^2], and [Semantic markup][^3] are fundamental.
```

This expanded capability allows you to reference full concepts or phrases, improving clarity in both technical and non-technical content, while maintaining the footnote's ease of use.


### Sections
You can split your content into sections with a triple dash `---` making your content render like this:

```
<article>
  <section/>
  <section/>
  <section/>
  ...
</article>
```

You can also generate the sections by setting `sections: true` in your configuration. This will generate a new section based on `<h2>` headings so that each `<h2>` tag starts a new section.

[.note]
  ### Horizontal rules
  Please use `***`, `___`, or `- - -` to generate a horizontal rule (`<hr>` tag).

Sections are discussed in more detail in the [styling](styling.html#sections) document.

### Blocks
**Blocks** in Nue are reusable chunks of content wrapped inside a class name, allowing you to build structured and styled sections while keeping the focus on pure content. No HTML is needed, making the content easy to manage and maintain.

For example, here’s how to create a **"note" block**:

```md stash
[block.note]
  ### Note
  Web design is 100% content and 95% typography
```

This generates a fully styled block while keeping the content clean and semantic.

#### Why blocks are great
Nue’s block system promotes the **pure content** philosophy by:

- **Keeping HTML out of Markdown**: Blocks allow you to maintain clean, readable content without the need for HTML markup, ensuring a pure content layer.
- **Promoting clean, reusable structure**: By focusing on content, blocks make it easy to reuse consistent structures across your site, supporting both scalability and a unified design.
- **Enforcing separation of concerns**: Blocks ensure that content remains focused on structure, while design and styling are applied externally via CSS, keeping the codebase clean and maintainable.

#### HTML output
When rendered, blocks are transformed into simple `<div>` elements with an associated CSS class name. For example, the "note" block generates the following HTML:

```html
<div class="note">
  <h3>Note</h3>
  <p>Web design is 100% content and 95% typography</p>
</div>
```

This keeps the structure clean and semantic, while design is handled separately through CSS.

#### Simplified syntax
You can further simplify the syntax by omitting the `block` component name and just using the class name prefixed with a dot:

```md
[.alert]
  ### Note
  You should avoid inline styling like black death
```

### Popovers
Nue's block syntax makes it simple to create **popovers** that can be easily triggered using a [button](markdown-extensions.html.html#button) tag. Popovers are a great way to present additional information without cluttering the main content flow.

Here’s how you define a popover:

```md
[#soc-explainer popover]
  ### Separation of concerns
  **Separation of Concerns (SoC)** is a core principle in software and web development that promotes dividing functionality into distinct, independent sections. In web design, this means keeping content, structure, and styling isolated. By doing this, content creators can focus purely on the message and information, while designers and engineers handle the layout and styling. This approach leads to cleaner, more maintainable codebases and a better user experience.
```

This generates a `dialog` element with the standard `popover` attribute, which can be opened with a button:

```md
[button popovertarget="soc-explainer" "Learn how it works"]
```

This button is linked to the popover and opens it when clicked.

#### Why this setup is great:
1. **A new creative tool for content authors**: Popovers offer a fun, engaging way to display additional information without overwhelming the reader. Imagine creating Apple-like, sleek front-page dialogs that feel immersive, but with full SEO compatibility and a clean, content-first file. Popovers let content authors introduce rich interactive elements while maintaining complete control over the content flow.

2. **No JavaScript needed**: You can wire up app-like dialog and popover functionality directly within your content using standard HTML attributes, without writing any JavaScript. This makes your content more accessible, reliable, and easy to manage.

3. **Standards-based approach**: Nue uses the standard [Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using), allowing the browser to handle the heavy lifting for opening, closing, and accessibility. This ensures that the popovers work even if JavaScript is disabled or fails to load,

 making your content resilient and SEO-friendly.

### Complex layouts
Nue's Markdown parser automatically identifies when multiple blocks of content are placed within a single block tag and separates them using `<div>` tags. This makes it easy to create complex layouts directly in your content. For example, the following block:

```md
[.stack]
  ### Design
  Design starts with content, ensuring a natural flow and seamless navigation.

  ### Engineering
  Engineering focuses on performance, accessibility, and progressive enhancement.
```

Is rendered as:

```html
<div class="stack">
  <div>
    <h3>Design</h3>
    <p>Design starts with content, ensuring a natural flow and seamless navigation.</p>
  </div>
  <div>
    <h3>Engineering</h3>
    <p>Engineering focuses on performance, accessibility, and progressive enhancement.</p>
  </div>
</div>
```

And when styled with CSS, it takes on a visually structured layout:

[render]

#### Separator
Nue automatically uses the first `h2` or `h3` tag within a block as the **separator** for the content blocks. If needed, you can use a **triple-dash** (`---`) as an explicit separator to customize content divisions.

For example:

```md
[.grid]
  ### Design
  Design blends form and function.

  ---

  ### Engineering
  Code enhances the user experience while staying performant.
```

This allows flexible layout creation, giving you control over content structure and flow.

#### Why this is great

1. **Create complex layouts with pure content**: There's literally zero bloat or extra markup needed to achieve advanced layouts such as **flex** or **grid**. Your design system’s CSS components handle the layout, keeping your Markdown clean and focused on content.

2. **Supports rich, flexible designs**: You can easily render complex, visually engaging layouts like **bento-style cards** that mix videos, images, and text — **optionally enhanced** with scripting and motion. This flexibility allows you to create stunning, content-rich sections that work seamlessly across devices, without touching a line of HTML.

### Nesting
Blocks can be nested to form more complex layouts on your richer marketing and landing pages, giving you the flexibility to create structured, multi-layered content without ever touching HTML. For example:

```md
[.feature]
  ## Hello, World!
  Let's put a nested stack here

  [.stack]
    ### First item
    With description

    ### Second item
    With description
```

This creates a flexible layout where a main **feature** block contains a nested **stack**, allowing for clean organization and structure in your content.

The possibilities are endless. You can combine blocks in creative ways, stacking sections within sections to build rich, interactive landing pages. Imagine a **hero section** that introduces key features, followed by a **grid of cards**, each with its own stacked content blocks highlighting product details, testimonials, or case studies. With the power of **nesting**, you can craft visually complex layouts while keeping your Markdown easy to read and maintain. Whether you're building product showcases, multi-section promotional pages, or detailed service breakdowns, nesting unlocks a new level of creative control over your content structure — letting design systems handle the visual complexity.

### Code blocks
Code blocks in Nue are enclosed between triple backticks and can include an optional language hint for syntax highlighting using the [Glow syntax highlighter](/blog/introducing-glow/). For example, a CSS code block would look like this:

```md
\```css
// here is a CSS code block
:root {
  --base-100: #f3f4f6;
  --base-200: #e5e7eb;
  --base-300: #d1d5db;
  --base-400: #6b7280;
}
\```
```

The language hint (`css`) enables syntax highlighting for the specified language.

#### Line numbering
You can also apply custom class names and enable **line numbering** for your code blocks. Here's how to set it up:

```md
\``` •.purple numbered•
function hello() {
  // world
}
\```
```

The above example will be rendered with **purple text** and line numbers enabled:

``` .purple numbered
function hello() {
  // world
}
```

### Line/region highlighting
Nue allows you to highlight specific lines or regions within your code blocks using special characters. This feature helps emphasize key parts of your code, making it easier for readers to focus on important areas.

Here’s an example using JavaScript code with line numbering and highlights:

```js numbered
/* Code highlighting examples */

>Highlight lines by prefixing them with ">"

Here's a •highlighted region• within a single line

// bring out errors
export ••defaultt•• interpolate() {
  return "something"
}

// prefix removed lines with -
-const html = glow(code)

// and added lines with +
+const html = glow(code, { •numbered: true• })
```

#### Highlighting options
Use the following characters to customize how code lines and regions are highlighted:

- `>` highlights an entire line with a default blue background.
- `-` marks the line as **removed** with a red background.
- `+` marks the line as **inserted** with a green background.
- `|` highlights lines in Markdown syntax (similar to `>`).
- `\` escapes the first character to prevent special treatment.

To highlight specific text regions within a line, use the bullet character (`•`). For example:

```md
These •two words• are highlighted and ••these words•• are erroneous
```

This would be rendered as:

These **two words** are highlighted and **these words** are erroneous.

#### Mixing content blocks and code blocks
Here's an example combining content blocks and code blocks. Notice how clean the syntax is, avoiding excessive coding and ugly markup that often comes with complex layouts:

````md
[.stack]

  ### CSS animation setup

  ``` .pink
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate {
    animation: fadeIn 2s ease-in;
  }
  ```

  ### CSS transition setup

  ``` .blue
  .button {
    transition: background-color 0.3s ease;
  }

  .button:hover {
    background-color: #ff4081;
  }
  ```
````

This simple example demonstrates how you can create a **stacked layout** with content and code blocks, all within a clean, readable format. Mixing content and code blocks in this way allows you to present complex technical concepts, tutorials, or style guides without sacrificing readability or maintainability.

### Content tags
Nue offers a large amount of [tags](markdown-extensions.html.html) that significantly enhance your ability to create rich and interactive websites. You can add responsive images, videos, buttons, accordions, tabs, and more.

You can also extend the syntax with [custom components](custom-components.html).
