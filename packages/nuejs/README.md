
# Nue JS

Nue JS is a tiny (2.3kb minzipped) JavaScript library for building web interfaces. It is the layout engine for [Nue web framework](https://nuejs.org) providing both server-side templating and client-side reactive islands.

## HTML microlibrary for UX developers

Nue template syntax is designed for [UX developers](https://nuejs.org/docs/) who prefer to write user interfaces with clean, semantic HTML instead of JavaScript. Think Nue as standard HTML, that you can extend with custom HTML-based components. These components help you build modern web applications in a simple, declarative way. For example:

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

If React is "Just JavaScript", then Nue is "Just HTML" because any valid HTML is also valid Nue.

### Links

- [Template syntax](https://nuejs.org/docs/template-syntax.html)
- [Reactive components](https://nuejs.org/docs/reactive-components.html)

### Contributing

Please see [CONTRIBUTING.md](/CONTRIBUTING.md)

### Community

Please see [GitHub discussions](https://github.com/nuejs/nue/discussions)
