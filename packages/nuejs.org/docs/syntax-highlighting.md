---
include: [syntax-table]
---


# Syntax highlighting for Markdown code blocks

Nue uses the built-in syntax highlighter, [Glow](/blog/introducing-glow/), to style your fenced code blocks with minimal setup. It offers the following features:

- **Design focused**: Code blocks for languages like Markdown, YAML, TypeScript, Perl, SQL, and more, automatically match your design system’s colors.

- **Easy to use**: Code blocks are styled by default. To align with your design system, just set 3-10 CSS variables.

- **Small footprint**: The CSS for highlighting all languages is under 1 KB, including support for highlighted lines and regions.

For details on adding code blocks to your Markdown documents, refer to the [code syntax](content-syntax.html#code-blocks) guide. This article also explains how to adjust the look and feel of the generated HTML.


## The HTML output
Syntax blocks are rendered as standard HTML tags, without additional class names. For example, the following Markdown block:

````md
 ```javascript
 // a comment
 "A string value"
 ```
````

Produces the HTML:

```html
<pre>
  <code language="javascript">
    <sup>// a comment</sup>
    <em>"A string value"</em>
    ...
  </code>
</pre>
```

### Built-in stylesheet
Whenever you add a syntax block, Nue includes a [stylesheet](//github.com/nuejs/nue/blob/dev/packages/glow/css/syntax.css) for syntax highlighting. This stylesheet is configurable through CSS variables, and a few adjustments are usually all that’s needed to make code blocks match your design system:

```css
/* Key Glow variables */
pre {
  --glow-base-color: #eee;
  --glow-primary-color: #823;
  --glow-padding: 2em;
}
```

To disable the built-in stylesheet for full control over your styles, set this in `site.yaml`:

```yaml
syntax_highlight: false
```

Then, add your own stylesheet with the variables and elements described below.


### CSS variables and HTML elements
Below is a list of all CSS variables with the associated HTML elements for styling syntax blocks:


[table.syntax-table]
  CSS variable     | Default value    | HTML tag | Description
  accent-color     | `#419fff`        | strong   | special emphasis
  base-color       | `#555`           |          | foreground color
  char-color       | `#64748b`        | i        | brackets, commas...
  comment-color    | `#4e5d61`        | sup      | comments
  counter-color    | `#475569`        |          | line numbers
  del-color        | `250, 110, 130`  | del      | deleted lines
  error-color      | `#ff0`           | u        | errors
  ins-color        | `50, 210, 190`   | ins      | inserted lines
  line-color       | `50, 180, 250`   | dfn      | highlighted lines
  line-opacity     | `0.15`           |          | highlighted line opacity
  padding          | `1em`            |          | container padding
  primary-color    | `#7dd3fc`        | b        | primary accent color
  secondary-color  | `#f472b6`        | em       | secondary accent color
  selected-color   | `#2dd4bf26`      | mark     | marked code
  special-color    | `#fff`           | label    | special standout words


#### Notes

- Variables with no specific HTML element are applied to the root `<pre>` element.
- If line numbers are enabled, each line is wrapped in a `span`, and the `--glow-line-number` variable applies to the `span:before` pseudo-element.
- Highlighted row colors are specified in RGB format for compatibility with CSS functions.

### Language-specific styling
To apply language-specific tweaks, use the `language` attribute, as in:

```css
[language="html"] {
  --glow-accent-color: green;
}
```

### Adjusting formatting
Glow uses bolding with `--glow-special-color`, and other elements get styled by color alone. You can add formatting to any elements to fine-tune the syntax blocks. For example:

```css
/* Bold all secondary syntax elements */
pre em {
  font-weight: bold;
}
```
