
# Nue JS

Nue JS is an exceptionally small (2.3kb minzipped) JavaScript library for building web interfaces. It is the core of the upcoming [Nue toolset](//nuejs.org/tools/). It’s like **Vue.js, React.js**, or **Svelte** but there are no hooks, effects, props, portals, watchers, provides, injects, suspension, or other unusual abstractions on your way. Learn the basics of HTML, CSS, and JavaScript and you are good to go.


1. [Server components](//nuejs.org/docs/nuejs/server-components.html) are rendered on the server. They help you build content-focused websites that load faster without JavaScript and are crawled by search engines.

2. [Reactive components](//nuejs.org/docs/nuejs/reactive-components.html) are rendered on the client. They help you build dynamic islands or single-page applications.



[Rethinking reactivity](//nuejs.org/blog/rethinking-reactivity/)

[Template syntax](//nuejs.org/docs/nuejs/) •

[Examples](//nuejs.org/docs/nuejs/examples/) •



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

With Nue your UI code is cleaner and usually smaller:

![The difference in coding style](https://nuejs.org/docs/img/react-listbox.jpg?1)

It's not unusual to see [2x-10x differences](//nuejs.org/compare/component.html) in the amount of code you need to write.

[divide]: https://css-tricks.com/the-great-divide/

[back]: https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/


