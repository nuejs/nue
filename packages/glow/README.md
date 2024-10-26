
# Glow
Glow is a small, but powerful syntax highligher for web:

<a href="https://nuejs.org/blog/introducing-glow/">
  <img src="https://nuejs.org/img/glow-og-big.png"></a>

[Read the introduction](https://nuejs.org/blog/introducing-glow/)


## Usage
Glow is the default highlighter for [Nue web framework](https://nuejs.org) and works there "out of the box". Here's how to use Glow as a standalone library:


### Installation

```sh
bun i nue-glow
```

### JavaScript API

```js
// import highlighter
import { glow } from 'nue-glow'

const code = '<h1>Hello, World</h1>'

// render code
const html = glow(code, { language: 'html', numbered: true })

console.info(html) // <code language="html">...</code>
```


### Options
1. `numbered` is a boolean flag indicating whether line numbers should be rendered.

2. `language` tells Glow the language of the code. This is optional. When not provided, Glow attempts to guess the language. If you are formatting Markdown, the language parameter "md" must be given so that Glow can deal with all the special cases like "-" starts a new list item, instead of a deleted line.


### Return value

```
<code language="html">...</code>
```


### Marked integration
Here's how you integrate Glow to [Marked](https://github.com/markedjs/marked):

```js
import { marked } from 'marked'
import { glow } from 'nue-glow'

// setup a custom renderer for code blocks
const renderer = {
  code(input, language) {
    const html = glow(input, { language, numbered: true })
    return `<pre>${ html }</pre>`
  }
}
marked.use({ renderer })

// read Markdown with a Glow-formatted code block
const content = '...'

const html = marked.parse(content)
```
