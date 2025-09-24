
# Syntax highlighting
Reference for Nueglow's syntax highlighting. See the [Nueglow introduction](/docs/nueglow) for an overview.

## How it works
Nueglow generates semantic HTML without class names. Your design system controls the appearance through CSS element selectors.

### Basic example
This Markdown code block:

````md
 ```javascript
 // Calculate total
 const total = items.reduce((sum, item) => {
   return sum + item.price
 }, 0)
 ```
````

Generates this HTML:

```html
<pre>
  <code language="javascript">
    <sup>// Calculate total</sup>
    <b>const</b> total <i>=</i> items<i>.</i>reduce<i>((</i>sum<i>,</i> item<i>)</i> <i>=></i> <i>{</i>
      <b>return</b> sum <i>+</i> item<i>.</i>price
    <i>},</i> <em>0</em><i>)</i>
  </code>
</pre>
```

No classes, just semantic HTML elements. Your CSS defines how keywords, comments, and punctuation look.

## HTML elements
Nueglow maps code tokens to semantic HTML elements:

| Element | Purpose | Common use |
|---------|---------|------------|
| `<b>`   | Keywords | `const`, `function`, `class`, `if`, `return` |
| `<em>` | Values | Strings, numbers, booleans |
| `<strong>` | Special emphasis | Important identifiers, class names |
| `<i>` | Punctuation | Brackets, commas, operators |
| `<sup>` | Comments | Single and multi-line comments |
| `<del>` | Deleted lines | Diff removals |
| `<ins>` | Inserted lines | Diff additions |
| `<dfn>` | Highlighted lines | Focus lines |
| `<u>` | Errors | Syntax errors, problems |
| `<mark>` | Marked regions | Selected code |
| `<label>` | Special tokens | Standout words, annotations |


## Language support
Specify the language after the opening fence:

```md
  ```python
  def hello():
      return "Hello world"
  ```

  ```html
  <!doctype html>
  <body>
    <h1>Title</h1>
  </body>
  ```

  ```css
  .container {
    display: grid;
    gap: 2rem;
  }
  ```
```

Nue supports virtually all programming, markup, and markdown syntaxes including `javascript`, `typescript`, `python`, `html`, `css`, `yaml`, `json`, `markdown`, `bash`, `sql`. The trick is to study features (strings, comments, keywords) regardless of the language. This way there is no need for specialized grammar file for each language.


## Selected regions
Use bullet markers to highlight specific parts:

````md
 ```javascript
 const config = {
   •name: "My App"•,
   version: "1.0.0"
 }
 ```
````

Generates `<mark>` tags around the selected content:

```html
<mark>name: "My App"</mark>
```

Double bullets mark errors:

````md
 ```javascript
 const data = ••undefned•• // typo
 ```
````

Generates `<u>` tags for error highlighting:

```html
const data = <u>undefned</u>
```

## Line highlighting
Use line prefixes to highlight, add, or remove entire lines:

````md
 ```javascript
   function process(data) {
 >   // This line is highlighted
 -   const old = data.value
 +   const updated = data.newValue
     return updated
   }
 ```
````

Generates:

```html
<pre>
  <code language="javascript">
    <b>function</b> process<i>(</i>data<i>)</i> <i>{</i>
>   <dfn><sup>// This line is highlighted</sup></dfn>
>   <del><b>const</b> old <i>=</i> data<i>.</i>value</del>
>   <ins><b>const</b> updated <i>=</i> data<i>.</i>newValue</ins>
    <b>return</b> updated
    <i>}</i>
  </code>
</pre>
```

Line prefixes:
- `>` highlights the line with `<dfn>`
- `+` marks as inserted with `<ins>`
- `-` marks as deleted with `<del>`


## Line numbers
Add the `numbered` attribute to enable line numbering:

````md
 ```css numbered
 body {
   margin: 0;
   padding: 0;
 }
 ```
````

Each line gets wrapped in a `<span>` for CSS counter styling:

```html
<pre>
  <code language="css" numbered>
    <span>body {</span>
    <span>  margin: 0;</span>
    <span>  padding: 0;</span>
    <span>}</span>
  </code>
</pre>
```

## Custom classes
Add a class for specific styling needs:

````md
 ```javascript.twilight
 const theme = "twilight"
 ```
````

Generates:

```html
<pre class="twilight">
  <code language="javascript">
    ...
  </code>
</pre>
```

## Styling with CSS
### Essential selectors
Target syntax elements with nesting:

```css
pre {
  /* Keywords: const, function, return */
  b { }

  /* Values: strings, numbers */
  em { }

  /* Comments */
  sup { }

  /* Punctuation: brackets, operators */
  i { }
}
```

### Language-specific styling
Use attribute selectors for different languages:

```css
pre[language="html"] { }
pre[language="python"] b { }
```

### Line numbers
Style numbered code blocks with CSS counters:

```css
pre[numbered] {
  counter-reset: line 0;

  span {
    counter-increment: line;

    &:before {
      content: counter(line);
    }
  }
}
```

### Highlighting patterns
Common selector patterns:

```css
/* Diff lines */
pre ins { }  /* added */
pre del { }  /* deleted */

/* Highlighted lines */
pre dfn { }

/* Error lines using :has() */
pre span:has(u) { }

/* Selected regions */
pre mark { }
```

## Sample CSS
Find CSS theming files in the [Nueglow repository](https://github.com/nuejs/nue/tree/master/packages/glow/css):

- **syntax.css** basic features. uses CSS variables for theming. defaults to dark
- **light.css** converts syntax.css to light theme
- **markers.css** adds region and line highlighting

