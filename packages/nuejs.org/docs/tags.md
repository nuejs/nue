
# Markdown extensions
Markdown extensions or "tags" allow content authors to create rich, interactive web pages. This is a list of all tags and their configuration options.


## Tag usage
Tags are easy to read and write. They always start on a new line, with a square bracket, followed with a tag name and options. Let’s say we want to add a video, we would write something like this:

```md
[video /videos/explainer.mp4]
```



### Supplying options
Tag options can be supplied in several ways:


```md
// named options
[image •src•="hello.png" •caption•="Hello, World" •alt•="Hello image"]

// nested options
[image]
|  caption: Hello, World!
|  large: hello-big.png
|  small: hello.png
|  alt: Hello Image

// plain value without the attribute name
[image •hello.png•]

// handy syntax for id and class attributes
[image•#hero-image.heroic• hero.webp]
```

### Nested content
Most tags like images, buttons, tabs, and grids accept nested content:

```md
[image explainer.png]
| This nested content is the caption for the image.
| You can add Markdown here like *emphasis* and `inline code`
```




## Tag reference

### Image
Renders an image with optional caption. For example:

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

[Art direction](//web.dev/articles/codelab-art-direction) is supported:

```md
[image small="ui-tall.png" large="ui-wide.png" ]
```

[Responsive images](//developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) are supported

```md
[image.heroic]
  srcset: planet.png 450w, planet-big.png 900w
  sizes: (max-width: 600px) 450px, 900px
  alt: This is the alt text
  loading: eager
```

[.options]
  #### [image] options

  `alt` is an alternate text for the image

  `src` image source

  `caption` image caption

  `href` a link URL for the image

  `srcset` defines a set of responsive images for the browser to choose from

  `sizes` defines screen widths to indicate what image size would be best to choose from the srcset.

  `large` the large version of the image. the large image can have a different aspect ratio than the small one, which is the difference between art direction and responsitivity.

  `small` the small version of the image

  `offset` the screen size when small turns to large. The default value is 750 (px).

  `width` the image width




### Button
Renders a button:

```md
// with all options
[button label="Learn more" href="/docs/"]

// label option can be given as a plain value
[button "Learn more" href="/docs/"]

// with class name and a nested body
[button.secondary href="/docs/"]
  Learn more
```

[.options]
  #### [button] options

  `label` the button label. Can also be given as plain value or as body content

  `href` the target link for the button



### Table
Renders an HTML table from the nested data:

```md
[table "Name; Email; Work title"]
  - Alice Johnson   |  alice.johnson@demo.ai   |  Marketing Manager
  - John Smith      |  john.smith@demo.ai      |  Software Engineer
  - Emily Davis     |  emily.davis@demo.ai     |  Human Resources Lead
  - Michael Chen    |  michael.chen@demo.ai    |  Sales Representative
  - Sarah Thompson  |  sarah.thompson@demo.ai  |  Graphic Designer
  - David Rodriguez |  david.rodriguez@demo.ai |  Financial Analyst
  - Jessica Lee     |  jessica.lee@demo.ai     |  Project Manager
```

Another example with explicitly defined `head` and `items` attributes

```md
[table]
  head:
    - Name
    - Email
    - Work title

  items:
    - Alice Johnson   |  alice.johnson@demo.ai   |  Marketing Manager
    - John Smith      |  john.smith@demo.ai      |  Software Engineer
    - Jessica Lee     |  jessica.lee@demo.ai     |  Project Manager
```


[.options]
  #### [table] options

  `head` table header items given as a YAML array or as a semicolon (";") or pipe ("|") separated string

  `items` table body items where rows start with "-" (a YAML list item) and columns are separated with a semicolon (";") or pipe ("|") character. The items can also be given directly on the body like in the first example above

  `wrapper` wraps the table inside a parent element with a class name specified on this property



### Video
Renders a video:

```md
[video hello.mp4]
```

Shortcut alias (!) is supported:

```md
[! world.mp4 ]
```

All standard HTML5 video attributes are supported

```md
[image intro.mp4 autoplay controls muted loop ]
```

Options given as YAML:

```md
[video.heroic]
  sources: [ hello.webm, hello.mp4 ]
  poster: hello.png
  width: 1000
```


[.options]
  #### [video] options

  `autoplay` starts the video when the page is loaded. Must be used together with

  `muted` or the autoplay does not work on all browsers.

  `controls` displays the browser's built-in video controls

  `loop` seeks back to the start after reaching the end of the video

  `muted` plays the video without sound

  `poster` a URL for an image to be shown before the playback starts

  `preload` <span>a [hint to the browser][preload] on what to load prior playback</span>

  `sources` a list of video files. The browser plays the first one it understands

  `src` a URL to the video file

  `width` the video width

  [preload]: //developer.mozilla.org/en-US/docs/Web/HTML/Element/video#preload


### Grid
Renders a grid of items separated by a triple-dash

```md
[grid]
  # First item
  [image first.png]

  ---
  # Second item
  [image second.png]

  ---
  # Third item
  [image third.png]
```

[.options]
  #### [grid] options

  `item_class` class name for the grid items. Typically, set externally by the UX developer.

  `item_component` web component name for the grid items. Typically, set externally by the UX developer.


### Tabs
Render a [tabbed layout](//saadiam.medium.com/tabs-design-best-practices-8fafe936606f) for organizing the content into multiple panes where users can see one pane at a time:


```md
[tabs "First tab | Second tab | Third tab"]

  ## First pane
  Pane contents

  ---
  ## Second pane
  [image hello.png]

  ---
  ## Third pane
  [image world.mp4]
```

[.options]
  #### [tabs] options

  `tabs` tab labels are separated with a semicolon (";") or pipe ("|") character. Can also be given as a plain value like in the above example.

  `wrapper` wraps the tabs inside a parent element with a class name specified on this property.

  `key` <span>optional key for "aria-controls" and "aria-labeled" attributes as specified on the [MDN documentation](//developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls#example).</span>



### Code
Displays a syntax highlighted code block with support for line numbers, captions, and wrapper elements:


```md
[code.heroic numbered caption="Some JavaScript"]

  function something() {
    // do the thing
  }
```

[.options]
  #### [code] options

  `caption` a caption for the code. Supports Markdown formatting

  `language` the language of the nested code

  `numbered` draws line numbers when enabled


### Special characters
You can use a set of special characters in the code to highlight content:

[code numbered="true"]
  // This is a styled code block

  >Highlight lines by prefixing them with ">", "+", or "-"

  Here's a •highlighted region•

  export default { ••bring out errors•• }

  // enable line numbers with `numbered` property
  const html = glow(code, { •numbered: true• })


[.options]
  `>` highlights the line. The default background color is blue.

  `-` marks the line as removed with a red background (default)

  `+` marks the line as inserted with green background (default)

  `|` highlights the line. Similar to ">" but for markdown syntax only

  `\` escapes the first character


Use bullet character (`•`) to highlight text regions within a line. The following sentence

`These •two words• are highlighted and ••these words•• are erroneous`

Is rendered as:

```md
These •two words• are highlighted and ••these words•• are erroneous
```



### Codeblocks
Renders a single multi-code element where the blocks are separated with a triple-dash:

```md
[codeblocks]

  <!-- first code block -->
  <p>Hello</p>

  ---

  <!-- second code block -->
  <p>World</p>
```

[.options]
  #### [codeblocks] options

  `numbered` draws line numbers when enabled

  `captions` list of captions for the individual blocks separated with ";" or "|"

  `languages` list of languages for the individual blocks separated with ";" or "|"

  `classes` list of languages for the individual blocks separated with ";" or "|"



### Codetabs
Render a [tabbed layout](//saadiam.medium.com/tabs-design-best-practices-8fafe936606f) for organizing the code into multiple blocks where users can see one block at a time:


```md
[codetabs "First | Second | Third" languages="js | html | css"]

  // First pane
  const foo = 'bar'
  ---

  <!-- Second pane -->
  <p>Hello, World</p>

  ---
  /* Third pane */
  p {
    background-color: yellow
  }
```

[.options]
  #### [codetabs] options

  `numbered` draws line numbers when enabled

  `captions` list of captions for the blocks separated with ";" or "|"

  `languages` list of languages for the blocks separated with ";" or "|"

  `wrapper` creates a new parent element with a class name specified on this property

