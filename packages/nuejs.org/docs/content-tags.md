---
include: [tabs]
---


### Tags
Nue comes with a set of build-in Markdown extensions or "tags" that significantly increases your capability to build rich, interactive websites. These tags are defined between square brackets. For example:

```md
[image /img/cat.png]
```

The tag name (i.e. "image") is followed by options, which can be supplied in several ways:


```md
// named options
[image •src•="hello.png" •caption•="Hello, World" •alt•="Hello image"]

// nested YAML
[image]
|  caption: Hello, World!
|  large: hello-big.png
|  small: hello.png
|  alt: Hello Image

// plain value without the attribute name
[image •hello.png•]

// special syntax for id and class attributes
[image•#hero-image.heroic• hero.webp]

// nested content
[image explainer.png]
| This nested content is the caption for the image.
| You can add Markdown here like *emphasis* and `inline code`


// tags can be inlined too
This is an inline [svg "/icon/meow.svg"] image
```


### Images
Images are marked as follows:

```md
[image hello.webp]
| This content here is the caption. Markdown *formatting* is supported
```

Shortcut alias (!) is supported:

```md
[! hello.webp]
```

Images can link to URL's with `href` attribute:

```md
[image book.svg href="/docs/" caption="View documentation"]
```

[Art direction](//web.dev/articles/codelab-art-direction) support:

```md
[image]
  large: ui-wide.png
  small: ui-tall.png
  caption: This is the image caption
  alt: This is the alt text
  loading: eager
```


[.options]
  #### [image] options

  `alt` is an alternate text for the image.

  `src` image source.

  `caption` image caption.

  `href` adds a link on the image.

  `large` the large version of the image. The large image can have a different aspect ratio than the small one, which is the difference between art direction and responsitivity.

  `loading` this is either "lazy" for [lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) (default value) or "eager" for non-lazy loading.

  `small` the small version of the image.

  `offset` the screen size when small turns to large. The default value is 750 (px).

  `size` a shortcut property to provide the width and height simultaneously separated with "x" or "&times;". For example: "30 x 30"

  `width` the image width.


#### HTML output
Images are rendered as a `<figure>` element:

```html
<figure>
  <img src="hello.webp" loading="lazy">
  <figcaption>View documentation</figcaption>
</figure>
```

Here is a more complex example with `href`, `small` and `large` attributes:

```html
<figure class="heroic">
  <picture>
    <source src="ui-tall.png" media="(max-width: 750px)" type="image/png">
    <source src="ui-wide.png" media="(min-width: 750px)" type="image/png">
    <a href="/docs/"><img src="ui-wide.png" loading="lazy"></a>
  </picture>
</figure>
```

### SVG
Inline SVG images are marked as follows:

```md
[svg /icon/continue.svg]
```

Which would render the contents of the SVG file. This tag is particularly useful together with the button tag:

```md
[button href="/docs/"]
  *Learn more* [svg /icon/chevron-right.svg]
```

The above would render the follwing HTML for you to style with CSS:

```
<a href="/docs/" role="button">
  <em>Learn more</em>
  <svg viewBox="0 0 24 24">...</svg>
</a>
```




### Videos
Videos are marked as follows:

```md
[video /videos/hello.mp4]
```

Shortcut alias (!) is supported:

```md
[! /videos/hello.mp4]
```

All standard HTML5 video attributes are supported:

```md
[image intro.mp4 autoplay controls muted loop ]
```

Options given as YAML:

```md
[video.heroic]
  poster: hello.png
  src: hello.mp4
  width: 1000
```


[.options]
  #### Video options

  `autoplay` starts the video when the page is loaded. It must be used together with

  `muted` or the autoplay does not work on all browsers.

  `controls` displays the browser's built-in video controls.

  `loop` seeks back to the start after reaching the end of the video.

  `muted` plays the video without sound.

  `poster` a URL for an image to be shown before the playback starts.

  `preload` a [hint to the browser][preload] on what to load prior playback.

  // `sources` a list of video files. The browser plays the first one it understands.

  `src` a URL to the video file.

  `width` the video width.

  [preload]: //developer.mozilla.org/en-US/docs/Web/HTML/Element/video#preload



#### HTML output
Videos are rendered as a native HTML5 video element:

```html
<video class="heroic" width="1000" poster="hello.png">
  <source src="hello.mp4" type="video/mp4">
</video>
```


### Buttons
Buttons are marked as follows:

```md
// with all options
[button label="Learn more" href="/docs/"]

// label option can be given as a plain value
[button "Learn more" href="/docs/"]

// with class name and a nested body
[button.secondary href="/docs/"]
  Learn more

// with inline SVG
[button href="/docs/"]
  *Learn more* [svg /icon/chevron-right.svg]
```

[.options]
  #### Button options

  `label` the button label. Can also be given as plain value or as body content

  `href` the target link for the button


#### HTML output
Buttons are rendered as follows:

```html
<a role="button" href="/docs/">Learn more</a>
```

Buttons are essentially links with a `role="button"` attribute because links don't require JavaScript to work.




### Tables
Tables are marked as follows:


```md
 | Name            | Email                    | Work title         |
 | --------------- | ------------------------ | ------------------ |
 | Sarah Thompson  | sarah.thompson@demo.ai   | Graphic Designer   |
 | David Rodriguez | david.rodriguez@demo.ai  | Financial Analyst  |
 | Jessica Lee     | jessica.lee@demo.ai      | Project Manager    |
```

There is also a specialized `[table]` tag for defining tables with fewer pipes and dashes:

```md
[table]
  Name            | Email                   | Work title
  Alice Johnson   | alice.johnson@demo.ai   | Marketing Manager
  John Smith      | john.smith@demo.ai      | Software Engineer
  Emily Davis     | emily.davis@demo.ai     | Human Resources Lead
  Michael Chen    | michael.chen@demo.ai    | Sales Representative
```

You can also supply the data in YAML format:

```
[table]
  - [Name, Email, Work title]
  - [Alice Johnson, alice.johnson@demo.ai, Marketing Manager]
  - [John Smith, john.smith@demo.ai, Software Engineer]
```

And you can refer to table data specified in external [data files](data.html):

```
[table :items="products"]
```

The YAML ata can also be specified directly on the body:


[.options]
  #### Table options

  `head` whether the first row should be rendered as a table head (with `<th>` elements). The default is true.

  `:items` property name for the externally defined table data

  `wrapper` wraps the table inside a parent element with a class name specified on this property.



#### HTML output
Tables are rendered as standard HTML5 tables:

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Work title</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>Alice Johnson</td>
      <td>alice.johnson@demo.ai</td>
      <td>Copywriter</td>
    </tr>

    <tr>
      <td>John Smith</td>
      <td>john.smith@demo.ai</td>
      <td>UX developer</td>
    </tr>

    ...

  </tbody>
</table>
```


### Accordions
Accordion elements are marked as follows:

```md
[accordion]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the second element
```

The above markup looks like this:

[accordion.card]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the second element


Nue looks for the first heading element (h2 or above) within the tag and uses that level as the separator for new accordion entries.


[.options]
  #### Accordion options

  `name` use this to name the individual entries. When supplied only one entry can be opened at once.

  `open` enable this to set the first tab initially open or provide a numeric value to open a specific item


#### HTML output
Accordion is rendered as a list of [`<details>`](//developer.mozilla.org/en-US/docs/Web/HTML/Element/details) disclosure element.

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
  ...
</div>
```





### Tabs
Tabbed panes are `[accordion]` elements with a `name` and `open` attribute, but styled as tabs:


```md
[accordion.card.tabs name="tabs" open]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the second element
```

The above markup looks like this:

[accordion.card.tabs name="tabs" open]
  ## First element
  The contents of the first element

  ## Second element
  The contents of the second element

  ## Third element
  The contents of the second element





### Custom tags
Look for the documentation on how to create [custom Markdown extensions](components.html#markdown), which can run both server-side and client-side. You can also create hybrid or "isomorhpic" tags rendering on both ends.
