
import { marked } from 'marked'
import { markedSmartypants } from "marked-smartypants";
import hljs from 'highlight.js';


import { nuemark, nuedoc } from '..'

// Not working
// import { markedHighlight } from "marked-highlight";
// import customHeadingId from "marked-custom-heading-id";

const renderer = {
  code(code, language) {
    return hljs.highlight(code, { language }).value;
  },
}

const UNIT = `
---
title: kamis
sections: true
---

[.stack]
  # Contact me
  I'm currently available for hire

  [contact-me]

  ---
  [! /img/profile.jpg size="460 x 460"]

`


const SIMPLE = `
# Hello, World
This is a "paragraph"

- first
- second

> First
> Second
> [Third][bar]

Paragraph here
And another

Stop.

[bar]: /something "subject"
`

const COMPLEX = `
# Hello, World { #hello }
This is a paragraph *with* __formatting__

- here is a __[link](//github.io/demo/)__
- list of the [foo][bar]
- future

___

> "Blockquote"
> Coming here

| this  | is    | table |
| ----  | ----  | ----  |
| foor  | baar  | bazz  |

\`\`\`javascript
export function parseAttr(str) {
  const attr = {}

  // id
  str.replace(/#([\w\-]+)/, (_, el) => attr.id = el)

  return attr
}

\`\`\`

[bar]: /something "subject"

`


function perftest(name, fn) {
  console.time(name)
  // for (let i = 0; i < 1000; i++) fn(SIMPLE)
  for (let i = 0; i < 1000; i++) fn(COMPLEX)
  console.timeEnd(name)
}

// marked.use(extendedTables())
// marked.use(markedSmartypants())
marked.use({ renderer })


// marked.use(customHeadingId());

if (false) {
  // perftest('marked', marked.parse)
  perftest('marked', marked.parse)
  perftest('nue', nuemark)
  // perftest('nue', nuemark)

} else {
  // console.info(marked.parse(UNIT))
  // console.info('------------------')
  const doc = nuedoc(UNIT)
  console.info(doc.render())
}




