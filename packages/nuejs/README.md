
# Dynamic HTML templating
Nue JS is a tiny (2.3kb minzipped) JavaScript library for building web interfaces. It is the layout engine for [Nue web framework](https://nuejs.org) providing both server-side templating and the ability to create interactive islands for the browser.


## Like React, but for the semantic web
Nue template syntax is designed for [design engineers](https://nuejs.org/docs/) who prefer to write user interfaces with clean, semantic HTML instead of JavaScript. Think Nue as standard HTML, that you can extend with custom HTML-based components. These components help you build modern web applications in a simple, declarative way. For example:


```html
<div class="{ type }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p :if="desc">{ desc }</p>
    <slot/>
  </aside>
</div>
```

### Links

* [Template syntax](https://nuejs.org/docs/template-syntax.html)
* [Creating components](https://nuejs.org/docs/custom-components.html)
* [Islands in Nue](https://nuejs.org/docs/islands.html)


### Contributing

Please see [CONTRIBUTING.md](/CONTRIBUTING.md)


### Community

Please see [GitHub discussions](https://github.com/nuejs/nue/discussions)
