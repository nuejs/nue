


### Grid
Renders a grid of items separated by a triple-dash.

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

  `caption` a caption for the code. Supports Markdown formatting.

  `language` the language of the nested code.

  `numbered` draws line numbers when enabled.


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
  `>` highlights the line. The default background color is blue

  `-` marks the line as removed with a red background (default)

  `+` marks the line as inserted with green background (default)

  `|` highlights the line. Similar to ">" but for Markdown syntax only

  `\` escapes the first character


Use bullet character (`•`) to highlight text regions within a line. The following sentence:

`These •two words• are highlighted and ••these words•• are erroneous`

is rendered as:

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

  `numbered` draws line numbers when enabled.

  `captions` list of captions for the individual blocks separated with ";" or "|".

  `languages` list of languages for the individual blocks separated with ";" or "|".

  `classes` list of languages for the individual blocks separated with ";" or "|".



### Codetabs
Render a [tabbed layout](//saadiam.medium.com/tabs-design-best-practices-8fafe936606f) to organize the code into multiple blocks where users can see one block at a time:


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

  `numbered` draws line numbers when enabled.

  `captions` list of captions for the blocks separated with ";" or "|".

  `languages` list of languages for the blocks separated with ";" or "|".

  `wrapper` creates a new parent element with a class name specified on this property.

