---
include: [tabs]
---

# Built-in Markdown extensions
Nue extends Markdown with a set of built-in extensions that enhance content creation.

These extensions or "tags" use a simple bracket syntax - `[image]` for images, `[button]` for buttons, `[video]` for videos - to add functionality while maintaining readable content. These tags allow you to:

1. Add dialogs, accordions, and tabs while staying in Markdown
2. Create sophisticated layouts that preserve content structure
3. Handle responsive images and art direction through clean syntax
4. Extend functionality when native capabilities need enhancement


## Tag syntax
Tags are defined within square brackets. For example, to include an image, you would write:

```md
[image /img/cat.png]
```

The tag name (in this case, "image") can be followed by various options, which can be supplied in several ways:

### Named options

You can specify options using named attributes. For example:

```md
[image src="hello.png" caption="Hello, World" alt="Hello image"]
```

### Nested YAML

Alternatively, you can use nested YAML to define the attributes:

```md
[image]
|  caption: Hello, World!
|  large: hello-big.png
|  small: hello.png
|  alt: Hello Image
```

### Plain values

You can also use plain values without specifying attribute names:

```md
[image hello.png]
```

### ID and class name

To set ID and class attributes, you can use the following syntax:

```md
[image#hero.massive /home/hero.webp]
```

### Nested content

Tags can also include nested content. Here’s how you can add a caption for an image:

```md
[image explainer.png]
| This nested content is the caption for the image.
| You can add Markdown here like *emphasis* and `inline code`.
```

### Inline tags

Finally, tags can be used inline as well. For instance, to add an inline SVG image, you can write:

```md
This is an inline [svg "/icon/meow.svg"] image.
```

- - -


## Images
To include a basic image, use:

```md
[image hello.webp]
| This content here is the caption. Markdown *formatting* is supported.
```

You can also use a shortcut alias (`!`):

```md
[! hello.webp]
```

### Image links

Nue allows you to link images to specific URLs using the `href` attribute, making them interactive:

```md
[image book.svg]
  caption: View documentation
  href: /docs/
```

This functionality enables you to guide users to additional resources or pages while providing visual context.

### Responsive images

Nue supports art direction for images, allowing you to specify different sizes based on screen dimensions. This feature ensures that users receive the best possible image for their device:

```md
[image]
  large: ui-wide.png
  small: ui-tall.png
  caption: This is the image caption
  alt: This is the alt text
  loading: eager
```

The `large` and `small` attributes can define images with varying aspect ratios, optimizing the visual experience on different devices.

[.options]
  #### Image options
  | `alt` | Alternate text for accessibility, describing the image's content. |
  | `src` | Source URL of the image file. |
  | `caption` | Provides context for the image, enhancing user understanding. |
  | `href` | Adds a clickable link to the image, guiding users to related content. |
  | `large` | Specifies the large version of the image, which can differ in aspect ratio from the small version, allowing for creative art direction. |
  | `loading` | Determines the loading behavior: "lazy" enables [lazy loading](//developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) (default value) or "eager" for immediate loading. |
  | `small` | Defines the small version of the image for mobile displays, optimizing visual presentation. |
  | `offset` | Sets the screen size (in pixels) at which the small image switches to the large one, with a default of 750 pixels. |
  | `size` | A shortcut property to provide both width and height simultaneously, formatted as "width x height". |
  | `width` | Specifies the width of the image for precise layout control. |

### HTML output

When rendered, images appear as `<figure>` elements, enhancing the semantic structure of your content. For example, a simple image with a caption is rendered as:

```html
<figure>
  <img src="hello.webp" loading="lazy">
  <figcaption>This content here is the caption.</figcaption>
</figure>
```

A more complex example with `href`, `small`, and `large` attributes looks like this:

```html
<figure class="heroic">
  <picture>
    <source src="ui-tall.png" media="(max-width: 750px)" type="image/png">
    <source src="ui-wide.png" media="(min-width: 750px)" type="image/png">
    <a href="/docs/"><img src="ui-wide.png" loading="lazy"></a>
  </picture>
</figure>
```

### Inline SVG

Inline SVG images can be added using the following syntax, which renders rich vector graphics directly within your content:

```md
[svg /icon/continue.svg]
```

This feature allows you to incorporate sharp, scalable images into your design easily. It’s especially useful when paired with other tags, such as buttons:

```md
[button href="/docs/"]
  *Learn more* [svg /icon/chevron-right.svg]
```

This renders as follows, enabling smooth integration with CSS styling:

```html
<a href="/docs/" role="button">
  <em>Learn more</em>
  <svg viewBox="0 0 24 24">...</svg>
</a>
```


## Videos
The video tag in Nue serves as a content-focused interface for the standard HTML5 video tag, allowing you to easily incorporate video content into your pages. It is used as follows:

```md
[video /videos/hello.mp4]
```

You can also use a shortcut alias (`!`):

```md
[! /videos/hello.mp4]
```

All standard HTML5 video attributes are supported, providing flexibility and control over video playback:

```md
[video intro.mp4 autoplay controls muted loop]
```

Options can also be specified using YAML for enhanced organization:

```md
[video.heroic]
  poster: hello.png
  src: hello.mp4
  width: 1000
```

[.options]
  #### Video options

  | `autoplay` | Starts the video when the page loads, providing an engaging experience right away. Must be used together with `muted` for autoplay to work across all browsers. |
  | `controls` | Displays the built-in video controls provided by the browser, allowing users to play, pause, and adjust the volume. |
  | `loop` | Makes the video restart automatically after it reaches the end, which is useful for continuous playback in presentations or promotional content. |
  | `muted` | Plays the video without sound, enabling autoplay in browsers that restrict sound playback. |
  | `poster` | A URL for an image that will be displayed before the video begins playing, giving users a preview of the content. |
  | `preload` | Provides a [hint to the browser](//developer.mozilla.org/en-US/docs/Web/HTML/Element/video#preload) about whether to load the video data before the user plays it. |
  | `src` | Specifies the URL to the video file, directing the browser to where it can retrieve the video content. |
  | `width` | Determines the width of the video player, allowing for precise control over the layout. |

### HTML output

When rendered, videos appear as a native HTML5 video element, enabling smooth integration into your web pages. For example, the following code:

```html
<video class="heroic" width="1000" poster="hello.png">
  <source src="hello.mp4" type="video/mp4">
</video>
```

## Buttons

Buttons in Nue are marked with a specific tag syntax to create interactive and accessible button elements directly from Markdown. This tag makes it easy to create buttons without requiring HTML or JavaScript, allowing for clean and maintainable content.

### Basic button

Buttons are marked as follows:

```md
[button label="Learn more" href="/docs/"]
```

The `button` tag allows you to specify various options to control the appearance and behavior of the button. In this example, the `label` and `href` attributes are used to define the button text and target link respectively.

### Concise syntax

Instead of using the `label` attribute, you can provide the button text directly as a plain value. This is a more concise way to define a button label:

```md
[button "Learn more" href="/docs/"]
```

### Styled button

You can include a class name to style the button differently, using a nested body to define the button label. In this example, `.secondary` indicates a secondary button style, and the button label is provided as nested content:

```md
[button.secondary href="/docs/"]
  Explore the docs
```

### Button with inline SVG

Buttons can include inline SVG elements to provide additional visual cues, such as icons. In this example, the button includes a right-pointing arrow icon to indicate navigation:

```md
[button href="/docs/"]
  *Learn more* [svg /icon/chevron-right.svg]
```

### Button triggering a popover

Buttons in Nue can also be used to trigger popovers, allowing for additional content or explanations without cluttering the main page:

```md
[#info-popover popover]
  ### More information
  This popover provides extra details about the feature without leaving the current page.

[button popovertarget="info-popover" "Learn more"]
```

This example creates a button labeled "Learn more" that opens a popover with extra information.

[.options]
  #### Button options

  | `label` | The text label for the button. This can also be provided as a plain value or defined within the body content. |
  | `href` | The target link for the button. This is the URL the button will navigate to when clicked. |
  | `popovertarget` | The ID of the popover to trigger when the button is clicked. This allows buttons to open additional content in popovers. |


### HTML output

Buttons are rendered as follows:

```html
<a role="button" href="/docs/">Learn more</a>
```

Buttons are essentially links (`<a>` elements) with a `role="button"` attribute. This ensures accessibility and allows the button to be styled and function like a traditional button while keeping the implementation simple and lightweight. When used with popovers, the button is rendered as a `<button>` element to properly integrate with the popover functionality.

### Popover triggers

When the button is used to trigger a popover, it is rendered with the `popovertarget` attribute as follows:

```html
<button popovertarget="info-popover">Learn more</button>
```


## Tables
Nue supports standard Markdown syntax for tables, providing a straightforward way to create structured data presentations.

### Standard tables

Tables are created using the standard Markdown table syntax, which is simple but sometimes cumbersome when dealing with larger tables. Here is an example:

```md
\| Name            | Email                    | Work title         |
\| --------------- | ------------------------ | ------------------ |
\| Sarah Thompson  | sarah.thompson@demo.ai   | Graphic Designer   |
\| David Rodriguez | david.rodriguez@demo.ai  | Financial Analyst  |
\| Jessica Lee     | jessica.lee@demo.ai      | Project Manager    |
```

### Table tag

Nue offers a specialized `[table]` tag for defining tables with less syntax noise compared to the traditional pipes and dashes. This approach improves readability and makes table creation faster and more intuitive:

```md
[table]
  Name            | Email                   | Work title
  Alice Johnson   | alice.johnson@demo.ai   | Marketing Manager
  John Smith      | john.smith@demo.ai      | Software Engineer
  Emily Davis     | emily.davis@demo.ai     | Human Resources Lead
  Michael Chen    | michael.chen@demo.ai    | Sales Representative
```

### Advanced table features

With Nue's `[table]` tag, you can add extra features such as captions, header rows, and footer rows. You can also place longer cell content on separate lines, which greatly enhances readability, especially for complex tables:

```md
[table caption="Design Principles"]

  Principle               | Acronym  | Description
  -----
  Separation of Concerns  | SoC
  Dividing a system into distinct sections with specific roles.

  Progressive Enhancement | PE
  Building core functionality first, then adding enhanced features.

  Semantic Web Design     | SWD
  Emphasizing meaning and accessibility through proper HTML semantics.

  Content First           | CF
  Prioritizing content in the design and development process.
  -----

  These principles help create better and more maintainable web projects.
```

By placing longer descriptions on separate lines, the table becomes much easier to read and manage, especially when handling content that spans multiple lines.

### Rendering YAML data

You can also refer to table data available on the page by using the `:items` attribute:

```md
[table :items="products"]
```

This allows you to render tables dynamically based on the structured data available in global, area, or page scopes. Here the "products" property is used to access the data.

[.options]
  #### Table options

  | `caption` | Defines a caption for the table, which appears above the table in HTML. |
  | `head` | Determines whether the first row should be rendered as a table head (`<th>` elements). The default is `true`. |
  | `:items` | Specifies the property name for externally defined table data that should be rendered. |
  | `wrapper` | Wraps the table inside a parent element with a class name specified on this property, typically used for adding colored backgrounds or other design elements from your design system. |


### HTML output
Tables are rendered as standard HTML5 tables, ensuring compatibility and accessibility across all browsers. Here is an example output:

```html
<table>
  <caption>Design Principles</caption>
  <thead>
    <tr>
      <th>Principle</th>
      <th>Acronym</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Separation of Concerns</td>
      <td>SoC</td>
      <td>Dividing a system into distinct sections with specific roles.</td>
    </tr>
    ...
  </tbody>

  <tfoot>
    <tr>
      <td colspan="3">
        These principles help create better and more maintainable web projects.
      </td>
    </tr>
  </tfoot>
</table>
```

This structure includes a `<caption>` for the table title, a `<thead>` for the headers, a `<tbody>` for the main content, and a `<tfoot>` for any footer notes or summaries, ensuring that your tables are fully semantic and accessible.


## Accordions
Accordions in Nue make it easy to create collapsible content sections, perfect for FAQs or structured information that benefits from an expandable layout.

The basic structure for creating an accordion is as follows:

```md
[accordion]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the third element
```

This Markdown generates an accordion with three entries, each with a heading and corresponding content, allowing for a clean presentation.

### Example with styling

You can apply a specific class for styling. Here’s an example using `.card` to create a card-like appearance:

```md
[accordion.card]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the third element
```

### Defining separators

Nue uses the first heading element (`h2` or `h3`) to create new accordion entries automatically. Alternatively, use the triple-dash (`---`) separator to define new entries explicitly:

```md
[accordion]
  ## First element
  The contents of the first element.

  ---

  ## Second element
  The contents of the second element.
```

### Accordion options

Accordions can be customized with various options to control their behavior and appearance:

[.options]
  #### Accordion options

  | `name` | Use this to name individual entries. When supplied, only one entry can be open at a time, ensuring a true accordion effect. |
  | `open` | Set the initial state of the accordion. Use this to open the first tab by default or provide a numeric value for a specific item to be initially opened. |


### HTML output

Accordions in Nue are rendered using the native HTML5 `<details>` and `<summary>` elements:

```html
<div>
  <details>
    <summary>First element</summary>
    <p>The contents of the first element</p>
  </details>
  <details>
    <summary>Second element</summary>
    <p>The contents of the second element</p>
  </details>
  <details>
    <summary>Third element</summary>
    <p>The contents of the third element</p>
  </details>
</div>
```

The `<details>` and `<summary>` elements ensure compatibility and accessibility across modern browsers while keeping your content performant and easy to use, without additional JavaScript.


## Tabs

Tabbed panes in Nue are created using `[accordion]` elements with `name` and `open` attributes but styled to look and function like tabs:

```md
[accordion.card.tabs name="tabs" open]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the third element
```


### Example rendering
The above markup generates a series of tabbed sections, with each heading acting as a tab that can be selected to reveal the associated content pane.

[accordion.card.tabs name="tabs" open]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the third element


### CSS for tabs

The CSS below is used to style the above example, transforming the accordion into tabbed navigation:

```css
.tabs {
  position: relative;
  display: flex;
  height: 150px;
  gap: 1.5em;

  /* tabs */
  summary {
    cursor: pointer;
    font-weight: 550;
    &::marker { font-size: 0 }
    &:hover { color: var(--main-600) }
  }

  /* tab panes */
  div {
    inset: 5em 0 0 1.5em;
    position: absolute;
  }

  /* active tab */
  [open] summary {
    pointer-events: none;
    text-decoration: 3px underline var(--main-500);
    text-underline-offset: 10px;
  }
}
```
The use of `pointer-events: none;` ensures that only the active tab can be interacted with, creating a smooth user experience without extra JavaScript logic. Additionally, pseudo-elements like `&::marker` help to refine the visual style without modifying the HTML.

### Why this is good

- **Works Without JavaScript**: All the tab functionality is implemented purely using CSS. The tabs continue to work seamlessly even if JavaScript is disabled or not available in the browser.

- **No Extra HTML/JS Coding**: You don't need to write new JavaScript functions or HTML structures — everything is done by simply adding styles to the existing markup.

By creatively using CSS, Nue makes it easy to craft responsive, interactive tabbed interfaces while keeping the underlying codebase clean and maintainable — proving that CSS alone can create sophisticated UI elements.


## Description lists

Description lists are standard [HTML constructs](//developer.mozilla.org/en-US/docs/Web/HTML/Element/dl) that group terms and their descriptions. They are commonly used for glossaries or key-value pair lists.

The basic structure for creating a description list in Markdown is as follows:

```md
[define]
  ## First item
  Description of the first item

  ## Second item
  Description of the second item

  ## Third item
  Description of the third item
```

### HTML output

Description lists are rendered using the native HTML5 `<dl>`, `<dt>`, and `<dd>` elements:

```html
<dl>
  <dt>First item</dt>
  <dd>Description of the first item</dd>

  <dt>Second item</dt>
  <dd>Description of the second item</dd>

  <dt>Third item</dt>
  <dd>Description of the third item</dd>
</dl>
```

### Defining footnotes

You can also use the `define` tag to create footnotes, which provides a cleaner and more readable alternative to the standard `[^label]:` syntax. For example:

```md
[define]
  ## Separation of concerns { #soc }
  A strategy for clean and maintainable code

  ## Progressive Enhancement { #pe }
  Setup core functionality first and enhance it later

  ## Form follows function { #fff }
  Make styling follow your content
```

Once defined, you can refer to these descriptions like this:

```md
Separation of concerns [^soc] is an important strategy.

[Progressive Enhancement][^pe] is good for UX.
```
