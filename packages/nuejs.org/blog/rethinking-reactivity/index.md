---
title: Rethinking reactivity
desc: How Nue JS works? How is it different from Svelte? Here's how
og: /img/meme-big.jpg
date: 2023-10-02
---


[Nue JS][nuejs] is a tiny, 2.1kb min-brotlied library for building user interfaces. It's an alternative to frameworks like *Vue*, *React*, and *Svelte* — and it's the central piece of the [Nue ecosystem](/), which is a ridiculously easier alternative to *Next.js* and *Astro*

[image]
  large: /img/meme-big.jpg
  small: /img/meme.jpg
  caption: Less is more


Nue was linked to [Hacker News][hn], [Lobsters][lobsters], and [Reddit][reddit] on September 2023 and it was really a dream start for the project. I received a super warm welcome from developers, over 120k people came to see the website, and the project rapidly got thousands of stars on GitHub. My time lately has gone on fixing bugs, merging pull requests, giving support, answering questions, and [providing examples](/docs/nuejs/examples).

Common questions are: "How does reactivity work"? and "How is this different from React or Svelte"? Here I do my best to answer those exact questions.

[hn]: //news.ycombinator.com/item?id=37507419
[reddit]: //www.reddit.com/r/vuejs/comments/16ifij7/nue_powerful_reactvueviteastro_alternative/
[lobsters]: //lobste.rs/s/goxx8g/nue_react_vue_vite_astro_alternative

## HTML-based
If React is "just JavaScript", then Nue is "just HTML". Here's how the difference between React and Nue using an identical counter component:


### React

```jsx
/**
 * React counter: "It's Just JavaScript"
 */
import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>You clicked {count} times!</h2>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```
[Source](//codesandbox.io/s/react-hooks-counter-demo-kqm9s?file=/src/index.js:0-427)


### Nue

```html
<!--
  Nue counter: "It's just HTML"
-->
<div>
  <h2>You clicked {count} times!</h2>
  <button @click="count--">Decrement</button>
  <button @click="count++">Increment</button>
  <script>count = 0</script>
</div>
```

[counter]

[Source](//github.com/nuejs/nue/blob/master/packages/nuejs.org/blog/rethinking-reactivity/examples.dhtml)

To understand this choice we must go back in time. The world used to be slightly different before React and the kids entered the picture. There were two kinds of frontend skills: *UX development* and *JS development*:

[.stack]
  ### UX development
  - HTML + CSS
  - Lightweight JavaScript
  - Look and feel
  - Responsive design
  - Accessibility
  - UI libraries

  ---
  ### JS development
  - Advanced TypeScript/JS
  - Business logic
  - Backend integration
  - End-to-end testing
  - Keeping up the JS infra
  - Performance optimization


People who cared about UX could focus on the *front of the frontend*, and JS developers could focus on the *back of the frontend*. The talent was naturally spread and people did what they loved. It was great. *Brad Frost* wrote a [great article][brad] on the topic.


Today frontend development is dictated by the JS developer and everything is assembled with TypeScript or JavaScript: Logic, layout, styling, images, and content.

Nue wants to change this and bring UX developers back to the forefront. For them, it's more natural to start with HTML (content first!), then add styling, and finally JavaScript if needed. JavaScript is *optional* in content-heavy websites. Yes, we're talking about "old school" things like progressive enhancement, separation of concerns, and semantic web design.

Therefore: Nue is HTML first.


## Class-based


In 1998 *O'Reilly* published [Dynamic HTML: The Definitive Reference][dhtml] by *Danny Goodman*. This book changed the way I build websites. Before reading the book I had only played with HTML and CSS, but suddenly web was programmable? With Java? No -- JavaScript. WTH!

[! /img/dhtml.jpg width="200"]

[dhtml]: //www.amazon.com/Dynamic-HTML-Definitive-Danny-Goodman/dp/1565924940

Suddenly I could do things like this:


```html
<FORM ACTION="/cgi-bin/form.cgi"
  •ONSUBMIT="return isValidEmail(this.email.value)"•>
  <INPUT TYPE="text" NAME="email">
  <INPUT TYPE="submit" VALUE="Submit">
</FORM>

<!-- don't forget the type attribute! -->
<SCRIPT TYPE="text/javascript">
  function isValidEmail(email) {
    return /^\S+@\S+$/.test(email)
  }
</SCRIPT>
```


Yes, HTML was in all caps back then. And there were no `type="email"` fields, no `<button>` tag, nor the ability to post data with JavaScript. AJAX was invented seven years later. But I could make HTML dynamic and could move some of the dynamics from backend to the frontend.

Today HTML, CSS, and JavaScript have incredibly more power. Especially JavaScript. One notable thing is [classes][classes], introduced in ECMAScript 2015 (aka "ES6") and now supported by all major browsers.

Nue uses classes to bring the DHTML vibes back to modern component-based web development. Let's rewrite the above example with Nue:

```html
<form @submit.prevent="submit">
  <input type="email" name="email" placeholder="your@address.com" required>
  <button>Submit</button>

  •<script>•
    // input validation is natively taken care of by the browser
    async submit({ target }) {
      await fetch(`/api/leads?email=${target.email.value}`)
      location.href = '/thank-you'
    }
  •</script>•

</form>
```

The most notable thing is the `<script>` tag, which is now nested *inside* the component. This is the place for your ES6 class variables and methods.

ES6 classes make your code look amazingly compact and clean. You can add variables, methods, [getters][getters], [setters][setters], and `async` methods with the cute and short syntax. Here is a snippet from a [Todo MVC](/todomvc/) app written with Nue:


```html
<script>
  clearCompleted() {
    this.items.forEach(item => delete item.done)
    this.save()
  }

  get numActive() {
    return this.items.filter(item => !item.done).length
  }

  get hasCompleted() {
    return this.items.find(item => item.done)
  }

  set filter(name) {
    history.replaceState('', '', '#' + name)
    this.filter = name
  }

  // ... clipped ...

</script>
```

[classes]: //developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[getters]: //developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
[setters]: //developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set


## Reactivity model
Reactivity means that when the component state changes, the component automatically re-renders itself to the new state. Nue is no different from the other frameworks here:

```html
<button •@click="count++"•>
  Clicked { count } { count == 1 ? 'time' : 'times' }
  <script>count = 0</script>
</button>
```

[simple-counter]

Nue automatically updates the view when an event handler is clicked. Nue also re-renders automatically when working with arrays. For example:

```html
<div>
  <p>
    <button @click="addFruit">Add</button>
    <button @click="images.pop()" :disabled="!images[4]">Remove</button>
  </p>

  <img :for="img in images" :src="/demo/img/{img}.jpg">

  <script>
    images = ['popcorn', 'peas', 'lemons', 'tomatoes']

    addFruit() {
      const img = this.images[Math.floor(Math.random() * 4)]
      this.images•.push(img)•
    }
  </script>
</div>
```

[reactive-loop]


Both `push()` and `pop()` methods update the view automatically. Same with all the other Array methods like `sort()`, `unshift()`, `sort()`, `reverse()`, and `splice()`.

Sometimes only you know when an update must happen in which case you must call an instance method `this.update()` manually. For example, after some data has been fetched from the server:

```html
<div class="user">
  <img :src="user.avatar">
  <h3>{ user.name }</h3>
  <p>{ user.email }</p>

  <button @click="loadJane" :disabled="is_loaded">Load Jane</button>

  <script>
    user = {
      avatar: 'avatars/john.jpg',
      email: 'john@acme.org',
      name: 'John Doe',
    }

    async loadJane() {
      const req = await fetch('jane.json')
      this.user = await req.json()
      this.is_loaded = true
      •this.update()•
    }
  </script>
</div>
```

[user-update]

As a user of Nue JS, the `update()` method is really the only special thing you need to know about reactivity. Overall you need less thinking and framework-specific abstractions when working with Nue. For example, here's how you initialize a single reactive variable in various frameworks:

### React

```js
import { useState } from "react"
const [count, setCount] = useState(0)
```

### Vue

```js
import { ref } from 'vue'
const count = ref(0)
```

### Svelte / "Runes"

```js
let count = $state(0);
```

### Nue

```js
count = 0
```


## Reactivity under the hood
Here's how Nue JS works.

First, a Nue component is compiled or "transpiled" to plain JavaScript so that browsers can run it. Let's look at our counter component again:

```html
<button @name="counter" @click="count++">
  Clicked { count } { count == 1 ? 'time' : 'times' }
  <script>count = 0</script>
</button>
```

Here's what the counter looks like after the compilation:

```js
{
  name: 'counter',
  tmpl: '<button @click="0">:1:</button>',
  Impl: class { count = 0 },
  fns: [
    (_,e) => { _.count++ },
    _ => ['Clicked ',_.count,' ',_.count == 1 ? 'time' : 'times']
  ]
}
```

The compiled component has four properties:

1. `name` — the component name
2. `tmpl` — component's HTML/template code
3. `Impl` — the ES6 class to create the component instance from
4. `fns` — the template expressions turned to [CSP][csp]-compliant JavaScript

All the expressions on the template are replaced with an index number to match the function on the `fns` array. For example the click handler `@click="0"` is the first function on the array, that is `fns[0]`. The underscore is the component instance where all the variables and methods can be found.

When the component is mounted on the page, Nue creates a DOM tree from the template and makes the expression/function mapping. Each Nue component holds an array of expressions that are executed every time the component state changes. Nue also keeps track of all the child components, and they also get re-rendered when the parent state changes.

`:if`, and `:for` expressions are also put on the execution array, but their logic is more complex, so they are executed with a dedicated [handler][if] [function][for].

Re-rendering *mutates* the attributes, elements, and text nodes in place. No DOM diffing is needed.

That's Nue reactivity in short.

[csp]: //developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[for]: //github.com/nuejs/nue/blob/master/packages/nuejs/src/browser/for.js
[if]:  //github.com/nuejs/nue/blob/master/packages/nuejs/src/browser/if.js


## Keeping things small
The compiled Nue code is very small: Only like ~1.2x larger than the HTML-based source code. This makes Nue applications the smallest on the market.

*Evan You*'s (creator of Vue) [compared][evan] the generated code size of Vue and Svelte components. He used TodoMVC as the measure for an individual component. By adding [Nue TodoMVC](/todomvc/) to the mix we get the following data:

[evan]: //github.com/yyx990803/vue-svelte-size-analysis

[table head]
  - Framework              | Vue     | Svelte  | Nue
  - Framework size         | 16.89kb | 1.85kb  | 2.13 kb
  - Todo MVC size          | 1.10kb  | 1.88kb  | 0.96 kb
  - Framework + 1 Todo     | 17.99kb | 3.73kb  | 3.09 kb
  - Framework + 10 Todos   | 27.89kb | 20.65kb | 11.73 kb

#### Nue has the smallest footprint

[image]
  large: /img/file-sizes-big.png
  small: /img/file-sizes.png
  width: 550


## Predicting the future
I see that frontend development is trending into the following directions:

*Multi-page applications (MPA)* are on the rise. With the emergence of server components and tools like Astro and Nue, people will eventually realize that the SPA (single page application) model is not ideal for "normal", content-heavy websites.

*UX development* becomes a thing again. Not everything should be controlled by JavaScript and by JS engineers. User experience optimization requires a different set of goals, skills, and interests. And the MPA trend increases this need because JS developers are less needed in developing content-heavy websites.

*More standards-based coding*. As developers move to multi-page applications JavaScript is rendered on the server side, and client-side JavaScript becomes optional. This forces the pre-SPA best practices to come back: Separation of concerns, progressive enhancement, and semantic web design.

Nue is designed from the ground up to be on par with the above trends.
