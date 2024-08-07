---
include: [syntax-table]
---

# Syntax highlighting
Nue uses automatically highlights syntax blocks with [Glow](/blog/introducing-glow/). It's a classless and fully semantic library that is specifically designed to work well with the global design system.


## Styling syntax blocks


### HTML markup
Syntax blocks consist of standard HTML tags only and there are no class names. For example:

```html
<pre>
  <code language="typescript">
    <sup>// a comment</sup>
    <em>"A string value"</em>
    ...
  </code>
</pre>
```


### Built-in stylesheet
Whenever you add a syntax blog or a [code tag](tags.html#code) on your page, Nue automatically includes a [stylesheet](//github.com/nuejs/nue/blob/dev/packages/glow/css/dark.css) for syntax highlighting. It is a highly configurable system based on CSS variables. For example:

```css
/* setting glow variables */
pre {
  --glow-base-color: #eee;
  --glow-primary-color: #823;
  --glow-padding: 2em;
}
```


If you want full control of your styling, you can disable the build-in stylesheet in `site.yaml`

```yaml
syntax_highlight: false
```


### CSS variables and HTML elements
Here's a list of all CSS variables and the associative HTML elements on a syntax block:

[table.syntax-table "CSS variable | Default value | HTML tag | Description"]
  - accent-color    | \#419fff       | strong   | special emphasis
  - base-color      | \#555          |          | foreground color
  - char-color      | \#64748b       | i        | brackets, commas...
  - comment-color   | \#4e5d61       | sup      | comments
  - counter-color   | \#475569       |          | line numbers
  - del-color       | 250, 110, 130  | del      | deleted lines
  - error-color     | \#ff0          | u        | erroneous words
  - ins-color       | 50, 210, 190   | ins      | inserted lines
  - line-color      | 50, 180, 250   | dfn      | highlighted lines
  - line-opacity    | 0.15           |          | highlighted line opacity
  - padding         | 1em            |          | container padding
  - primary-color   | \#7dd3fc       | b        | primary accent color
  - secondary-color | \#f472b6       | em       | secondary accent color
  - selected-color  | \#2dd4bf26     | mark     | marked code
  - special-color   | \#fff          | label    | special words to stand out


#### Notes

- CSS variables with no associated HTML element are attached to a root `pre`-element.

- When line numbers are enabled, each line is wrapped inside a `span` element, and the `--glow-line-number` variable is attached to the `span:before` pseudo-element.

- Highlighted rows are colored with a comma-comma-separated list of RGB values so that they can be manipulated with CSS color functions. These colors represent the bright border color on the left edge of the highlighted line, and the line background color is calculated with the RGB values and the `--glow-line-opacity` variable. Setting a value such as `rgb(1, 2, 3)` won't work.


### Language-specific styling
Use the `language` attribute for language-specific CSS tweaks:

```css
[language="html"] {
  --glow-accent-color: green;
}
```

### Bolding, italics, and other formatting
By default, glow uses bolding only together with `--glow-special-color`. Other than that all elements have no formatting, just color assignments. You can, of course, make any softs of CSS tweaks to fine-tune syntax blocks. For example:

```css
/* bold all secondary syntax elements */
pre {
  em { font-weight: bold }
}
```


