
<a href="https://nuejs.org">
  <img src="https://nuejs.org/img/nuejs-banner-big.png">
</a>

# Nue JS

Nue JS is a tiny (2.3kb minzipped) JavaScript library for building web interfaces. It is the core layout engine in [Nue](https://nuejs.org) providing both server-side templating and client-side reactive islands.


## "It's just HTML"
Nue uses a simple HTML-based template syntax that you can use for both server-side layouts and reactive, client-side components. For example:

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

If React is __"just JavaScript"__, then Nue is __"just HTML"__ because any valid HTML is also valid Nue. You can extend the standard HTML with [template expressions](https://nuejs.org/docs/reference/template-syntax.html) that help you build modern websites and web- applications in a simple, declarative way.

Nue is best suited for *UX developers* dealing with the [front of the frontend](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/) and with topics like interaction design, accessibility, and user experience.


## Class- based
Nue uses ES6 classes to make web development feel more natural and standards-based. Here is an example Nue- component with a `submit()` _instance method_:


``` html
<form @submit.prevent="submit">
  <input type="email" name="email" placeholder="your@address.com" required>
  <button>Submit</button>

  <script>
    // input validation is natively taken care of by the browser
    async submit({ target }) {
      await fetch(`/api/leads?email=${target.email.value}`)
      location.href = '/thank-you'
    }
  </script>

</form>
```

The most notable thing is the `<script>` tag, which is now nested _inside_ the component. This is the place for your ES6 class variables and methods.

ES6 classes make your code look amazingly compact and clean. You can add variables, methods, [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set), and `async` methods with the cute and short syntax. There are no hooks, effects, props, portals, watchers, provides, injects, suspension, or other unusual abstractions on your way. Learn the basics of HTML, CSS, and JavaScript and you are good to go.

Learn the reasoning behind HTML- and class based syntax from our Blog article: [rethinking reactivity](https://nuejs.org/blog/rethinking-reactivity/)


### Getting Started

Please see https://nuejs.org/docs/


### The big picture
The ultimate goal of Nue is to build a content first alternative to **Vercel** and **Netlify**, which is extremely fast and ridiculously easy to use.

![Nue Roadmap](https://nuejs.org/img/roadmap4-big.png)


#### Why Nue?

- [Content first](https://nuejs.org/docs/why-nue/content-first.html)
- [Extreme performance](https://nuejs.org/docs/why-nue/extreme-performance.html)
- [Closer to standards](https://nuejs.org/docs/why-nue/closer-to-standards.html)


### Contributing

Please see [contributing.md](/CONTRIBUTING.md)


### Community

Please see [GitHub discussions](https://github.com/nuejs/nue/discussions)



