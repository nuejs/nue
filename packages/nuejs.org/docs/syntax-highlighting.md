
# Syntax highlighting
Nue uses automatically highlights syntax blocks with an internal [Glow](/blog/introducing-glow/)  syntax highlighter.


## Styling


### HTML markup
Syntax blocks generate fully classless HTML where as the language tokens are marked up with standard HTML tags. For example:

```
<pre>
  <code language="typescript">
    <sup>// a comment</sup>
    <em>"A string value"</em>
    ...
  </code>
</pre>
```


### Color theme
Glow uses a dark theme by default

[dark]: //github.com/nuejs/nue/blob/dev/packages/glow/css/dark.css
[light]: //github.com/nuejs/nue/blob/dev/packages/glow/css/light.css



### Disabling
You can skip the inclusion of glow.css by setting `glow_css: false` in the [configuration](/docs/reference/configuration-options.html).


### CSS variables
The styling of the syntax blocks are based on CSS variables. For example:

```
/* setting glow variables */
pre {
  --glow-base-color: #eee;
  --glow-primary-color: #823;
  --glow-padding: 2em;
}
```

List of all CSS variable names and the associative HTML elements

[table.glow-colors "CSS variable | Default value | HTML tag | Description"]
  - accent-color    | \#419fff       | strong   | special emphasis
  - base-color      | \#555          |          | foreground color
  - char-color      | \#64748b       | i        | brackets, commas...
  - comment-color   | \#4e5d61       | sup      | comments
  - counter-color   | \#475569       |          | line numbers
  - del-color       | 250, 110, 130  | del      | deleted lines
  - error-color     | \#ff0          | u        | erroreous words
  - ins-color       | 50, 210, 190   | ins      | inserted lines
  - line-color      | 50, 180, 250   | dfn      | highlighted lines
  - line-opacity    | 0.15           |          | highligted line opacity
  - padding         | 1em            |          | container padding
  - primary-color   | \#7dd3fc       | b        | primary accent color
  - secondary-color | \#f472b6       | em       | secondary accent color
  - selected-color  | \#2dd4bf26     | mark     | marked code
  - special-color   | \#fff          | label    | special words to stand out


#### Exceptions

* Some of the variables are attached to a root `pre`- element and others for HTML elements inside the root when the element name is explicitly given on the list.

* Each line is a `span` element and the `--glow-line-number` variable is attached to `span:before` pseudo- element.

* highlighted rows are colored with a comma comma-separated list of RGB values so that they can be manipulated with CSS color functions. These colors represent the bright border color on the left edge of the highlighted line, and the line background color is calculated with the RGB values and the `--glow-line-opacity` variable. Setting a value such as `rgb(1, 2, 3)` won't work.


### Language-specific styling
Use the `language` attribute for language-specific CSS tweaks:

```
[language="html"] {
  --glow-accent-color: green;
}
```

### Bolding, italics, and other formatting
By default glow uses bolding only together with `--glow-special-color`. Other than that all elements have no formatting. Use the HTML element selectors to fine-tune:

```
[glow] {
  em { font-weight: bold }
}
```






