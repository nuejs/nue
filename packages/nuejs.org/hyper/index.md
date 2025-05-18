---
include: [technical-content]
---

# Hyper documentation
Hyper is a simple markup language for building user interfaces. Currently in **development preview**, it enables developers (and AI models) to generate complex UIs with a clean syntax.

[Read the launch post](/blog/standards-first-react-alternative/) for the backstory an FAQ

[image.bordered]
  large: /blog/standards-first-react-alternative/img/hyper-banner-big.png
  small: /blog/standards-first-react-alternative/img/hyper-banner.png
  size: 598 × 237


## Getting started
Install with Bun:

``` sh
bun install nue-hyper
```

[Hyper source code](//github.com/nuejs/nue/tree/master/packages/hyper/)

[Report an issue](//github.com/nuejs/nue/issues)


### Examples

Examples are under [demo folder](//github.com/nuejs/nue/tree/master/packages/hyper/demo/). To run the examples locally go to nue-hyper folder and execute a local web server in there. For example:

```
cd nue-hyper

python3 -m http.server
```

And you'll have the examples running at: http://localhost:8000/demo/


## Changes from Nue JS

Hyper is a rewrite of the current [Nue JS](https://github.com/nuejs/nue/tree/master/packages/nuejs) library with the following improvements:

1. Cleaner, more standards-compatible syntax with fewer special characters and idioms
2. Components can be rendered on both server and client side, using identical code in both environments, which simplifies implementation and reduces edge cases
3. Internal diffing algorithm uses virtual DOM, similar to React's approach
4. Extensive test suite for both static rendering and interactive features
5. Cleaner, more accessible internal architecture that new developers can easily make sense


### Enforced Separation of Concerns
The most significant change is the strict separation between components and CSS-based design systems:

1. `<style>` blocks are ignored
2. `style` attributes are ignored
3. Inline styling via `class` attribute is not permitted (expressions like `size-[max(100%,2.75rem)]` are ignored)
4. You can set a limit on class names per element to prevent inline styling via utility classes (default is 3)

For 3 and 4 Hyper currently issues a warning, but on the official releases there will be a configurable strict mode for production environments that throws an error.

Read the [launch post](/blog/standards-first-react-alternative/) for the complete rationale.



## API

### Compiling
Takes a template string and converts it to client-executable JavaScript

``` js
// usage example
import { compile } from 'nue-hyper'

const js = compile('<h1>Hello, ${ name }!</h1>')
```

TypeScript function signature:

```
function compile(template: string): string
```

The compiled JavaScript can be written into a file and then used on client-side rendering. For example in Bun:

```
await Bun.write('dist/hello.js', js)
```


### Server-side rendering
Takes a template string and converts it to HTML

``` js
// usage example
import { render } from 'nue-hyper'

const html = render('<h1>Hello, ${ name }!</h1>', { name: 'World' })

console.info(html) /* --> <h1>Hello, World!</h1> */
```


### Client-side rendering
Render a compiled JavaScript on the browser

```
<!-- container for the app -->
<main></main>

<script type="module">
  import { createApp } from '/dist/hyper.js'

  // the compiled file (see above: Compiling)
  import { lib } from '/builds/hello.js'

  // create a new app
  const app = createApp(lib[0], { name: 'Hyper' })

  // mount it to our container
  app.mount(document.querySelector('main'))
</script>
```

### Just-in-time (JIT) rendering
Compiles the template directly on the browser befor rendering. Check `demo/table/simple-table.html` for a demo:

```
<script type="text/hyper">
  <table>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Age</th>
    </tr>
    <tr :for="user of users">
      <td>${ user.name }</td>
      <td>${ user.email }</td>
      <td>${ user.age }</td>
    </tr>
  </table>
</script>


<script type="module">
  // use the "jit" version of hyper
  import { createApp } from '/dist/hyper-jit.js'

  // load some sample data
  import { users } from './users.js'

  // grab the template from the page
  const hypertext = document.querySelector('[type="text/hyper"]').textContent

  // create the app. provide data on the second argument
  const app = createApp(hypertext, { users })

  // mount the app
  app.mount(document.querySelector('main'))
</script>
```


## Syntax
Hyper extends standard HTML with expressions, loops, conditionals, and custom components.


### Expressions

```
<span>${ text }</span>

<p>${ text.toUpperCase() }</p>

<!-- HTML output (non-escaped) -->
<p>#{ value }</p>
```

### Attributes

```
<time datetime="${ date.toISOString() }">

<!-- boolean attributes (falsy properties omitted) -->
<button disabled="${ is_disabled }">

<!-- interpolation -->
<div class="gallery ${ class }">

<!-- class helper syntax. An object constructor (no $ prefix) -->
<label class="{ is-active: isActive, has-error: hasError }">

<!-- all together-->
<div class="gallery ${ type } { is-active: isActive() }">
```


### Loops

```
<li :for="el in items">${ el.text }</li>

<!-- loop index -->
<li :for="(el, i) in items">
  Text: ${ el.text }
  Index: ${ i }
</li>

<!-- destructuring -->
<li :for="{ lang, text } in items">
  ${ lang } = ${ text }
</li>

<!-- with index -->
<li :for="{ lang, text }, i in items"> ... </li>

<!-- nested element loops with parent access -->
<li :for="item in items">
  <p :for="child in item.children">
    ${ item.text } ${ child.text }
  </p>
</li>

<!-- object entries -->
<li :for="[lang, text] in Object.entries(items)">
  ${ lang } = ${ text }
</li>

<!-- template loops -->
<dl>
  <template :for="el in meta">
    <dt>${ el.title }</dt>
    <dd>${ el.data }</dd>
  </template>
</dl>
```

### Conditionals

```
<p :if="foo > 100">${ foo }</p>
<p :else-if="bar == 10">${ foo }</p>
<p :else>Baz</p>

<!-- conditional loop (condition takes precedence) -->
<li :if="todos.length < 10" :for="todo in todos"> ... </li>
```


### Components

```
<!-- component definition -->
<counter>
  <button :click="count++">${ count }</button>

  <!-- initialization script -->
  <script>
    this.count = 1
  </script>
</counter>

<!-- component usage -->
<div>
  <h1>Counter</h1>
  •<counter/>•
</div>

<!-- passing data  -->
<counter :count="10"/>

<!-- instance methods -->
<counter>
  <button :click="incr">${ count }</button>

  <script>
>   this.incr() = function() {
>     this.count++
>   }
  </script>
</counter>

<!-- object-style method definition -->
<counter>
  <button :click="incr">${ count }</button>

  <script>
>   incr() {
>     this.count++
>   }
  </script>
</counter>

<!-- event argument -->
<button :click="log('Hey', $event)">Hey</button>


<!-- define a component with a specific root element (default: div) -->
<figure •:is="image"•>
  ...
</figure>
```


### Slots

```
<!-- define component with a slot -->
<hello>
  <h3>Hello</h3>

  <!-- slot placement  -->
  <slot/>
</hello>


<!-- slot usage -->
<hello>

  <!-- <slot/> is replaced by this nested content (h4 + p) -->
  <h4>World!</h4>
  <p>Lets go</p>

</hello>


<!-- slot with loops -->
<hello :for="item in items">
  <h4>${ item.text }</h4>
</hello>


<!-- attribute binding -->
<hello :for="item in items" :bind="item">

  <!-- item properties are directly accessible -->
  <h4>${ text }</h4>

</hello>
```


### Lifecycle events

```
<counter>
  <button :click="incr">${ count }</button>

  <script>
    incr() {
      this.count++
    }

    // prior to being mounted
    onmount() {}

    // after being mounted
    mounted() {}

    // prior being updated
    onupdate() {}

    // after being updated
    updated() {}
  </script>

</counter>
```


### JavaScript imports

```
<!-- import utility functions -->
<script>
  import { prettyDate } from './utils.js'
</script>


<!-- use them -->
<time :is="pretty-date" datetime="${ date..toISOString() }">
  ${ pretty }

  <script>
    this.pretty = prettyDate(this.date)
  </script>
</time>
```

[.note]
  Import statements are not working on server side in developer preview.


### Passtrough JavaScript
Scripts with `type` or `src` attributes are passed direclty to the client

```
<footer>
  <!-- this script block is rendered directly -->
  <script type="module">
     console.info({ hello: 'World' })
  </script>
</footer>
```


### CSS variables
Pass arguments to CSS components without inline styling:

```
<!-- renders as style="--gap: 3px" -->
<div --gap="3px">...</div>
```
