
<a href="https://nuejs.org/blog/introducing-glow/">
  <img src="https://nuejs.org/img/glow-og.png">
</a>

# Glow
Glow is a syntax highligher for markdown.

[Read the introduction](https://nuejs.org/blog/introducing-glow/)



## Usage
Glow is the default highlighter for [Nue web framework](https://nuejs.org) so and works "out of the box" in there. Here's how Glow works as a standalone library:


### Installation
First install glow


```sh
npm i nue-glow
```

### Usage
Here's how it works:

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

2. `language` tells glow the language of the code. This is optional. When not provided, glow attempts to guess the language. If you are formatting markdown, the language parameter "md" must be given so that Glow can deal with all the special cases like "-" starts a new list item, instead of a deleted line.


### Return value

```
<code language="html">...</code>
```

Note that the `<pre>` code is not returned. It is reserved for the potential Markdown processor who can assign any attributes and class names to it.


## Marked integration
Here's how you integrate Glow into [Marked](https://github.com/markedjs/marked) markdown processor:

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

// read markdown with a Glow-formatted code block
const content = '...'

const html = marked.parse(content)
```

