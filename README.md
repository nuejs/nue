

<a href="https://nuejs.org">
  <img src="https://nuejs.org/global/logo/logo.png" width="275" alt="Nue logo">
</a>

[Documentation](//nuejs.org/docs/nuejs/) •
[Examples](//nuejs.org/docs/nuejs/examples/) •
[Getting started](//nuejs.org/docs/nuejs/getting-started.html)
[Rethinking reactivity](//nuejs.org/blog/blog/rethinking-reactivity/) •


# What is Nue JS?

Nue JS is an exceptionally small (2.3kb minzipped) JavaScript library for building web interfaces. It is the core of the upcoming [Nue toolset](//nuejs.org/tools/). It’s like **Vue.js, React.js**, or **Svelte** but there are no hooks, effects, props, portals, watchers, provides, injects, suspension, or other unusual abstractions on your way. Learn the basics of HTML, CSS, and JavaScript and you are good to go.


## Build user interfaces with cleaner code
With Nue your UI code is cleaner and usually smaller:

![The difference in coding style](https://nuejs.org/docs/img/react-listbox.jpg?1)

It's not unusual to see [2x-10x differences](//nuejs.org/compare/component.html) in the amount of code you need to write.


## "It's just HTML"
Nue uses an HTML-based template syntax:

``` html
<div class="{ type }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p :if="desc">{ desc }</p>
    <slot/>
  </aside>
</div>
```

While React and JSX claim to be "Just JavaScript", Nue can be thought of as "Just HTML". Nue is perfect for [UX developers][divide] focusing on interaction design, accessibility, and user experience.


## Built to scale
Three reasons why Nue scales extremely well:

1. [Minimalism](//nuejs.org/why/#minimalism), a hundred lines of code is easier to scale than a thousand lines of code

1. [Separation of concerns](//nuejs.org//why/#soc), easy-to-understand code is easier to scale than "spaghetti code"

1. **Separation of talent**, when UX developers focus on the [front of the frontend][back] and JS/TS developers focus on the back of the frontend your team skills are optimally aligned:

![The best results are gained when UX developers and JavaScript developers work together without overlaps](https://nuejs.org/docs/img/ux-developer-big.png)



## Reactive, hybrid, and isomorphic
Nue has a rich component model and it allows you to create all kinds of applications using different kinds of components:

1. [Server components](//nuejs.org/docs/nuejs/server-components.html) are rendered on the server. They help you build content-focused websites that load faster without JavaScript and are crawled by search engines.

2. [Reactive components](//nuejs.org/docs/nuejs/reactive-components.html) are rendered on the client. They help you build dynamic islands or single-page applications.

3. [Hybrid components](//nuejs.org/docs/nuejs/isomorphic-components.html#hybrid) are partly rendered on the server side, and partly on the client side. These components help you build reactive, SEO-friendly components like video tags or image galleries.

3. [Universal components](//nuejs.org/docs/nuejs/isomorphic-components.html) are used identically on both server- and client side.



## UI library files
Nue allows you to define multiple components on a single file. This is a great way to group related components together and simplify dependency management.


``` html
<!-- shared variables and methods -->
<script>
  import { someMethod } from './util.js'
</script>

<!-- first component -->
<article @name="todo">
  ...
</article>

<!-- second component -->
<div @name="todo-item">
  ...
</div>

<!-- third component -->
<time @name="cute-date">
  ...
</time>
```

With library files, your filesystem hierarchy looks cleaner and you need less boilerplate code to tie connected pieces together. They help in packaging libraries for others.


## Simpler tooling
Nue JS comes with a simple `render` function for server-side rendering and a `compile` function to generate components for the browser. There is no need for toolchains like Webpack or Vite to hijack your natural workflow. Just import Nue to your project and you are good to go.

You can of course use a bundler on the business model if your application becomes more complex with tons of dependencies. [Bun](//bun.sh) and [esbuild](//esbuild.github.io/) are great options.


## Use cases
Nue JS is a versatile tool that supports both server- and client-side rendering and helps you build both content-focused websites and reactive single-page applications.

1. **UI library development** Create reusable components for reactive frontends or server-generated content.

2. **Progressive enhancement** Nue JS is a perfect micro library to enhance your content-focused website with dynamic components or "islands"

3. **Static website generators** Just import it into your project and you are ready to render. No bundlers are needed.

4. **Single-page applications** Build simpler and more scalable apps together with an upcoming *Nue MVC*- project.

5. **Templating** Nue is a generic tool to generate your websites and HTML emails.


[fourteen]: https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work#tcp_slow_start_14kb_rule

[divide]: https://css-tricks.com/the-great-divide/

[back]: https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/


