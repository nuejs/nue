
# Motion and Reactivity
Nue lets you build dynamic, motion-enriched websites with nothing but CSS. However, sometimes a bit of JavaScript can significantly enhance the user experience. Depending on what you want to build, Nue lets you choose the most suitable technology for the job: CSS, Web Component, reactive island, isomorphic component, or vanilla JavaScript.


## CSS
Over the years CSS has evolved from static styling utility to an immensely powerful UX development language. Things like tooltips, dialogs, sliders, and popups no longer require JavaScript and are best implemented with CSS.

CSS offers better hardware acceleration than JavaScript and a simpler, more standards-based programming model. There are no extra layers or third-party idioms in the way. Even the more advanced stuff from libraries like **Framer Motion** can be [implemented with modern CSS](//motion.dev/blog/do-you-still-need-framer-motion).


### View transitions
One of the most significant features of Nue is the built-in support for view transitions. That is: The loading of the page and its assets are internally controlled with JavaScript and the view transition can be customized with CSS [::view-transition](//developer.mozilla.org/en-US/docs/Web/CSS/::view-transition) property. This website, for example, has this simple CSS rule for the page switch transition effect:


```css
/* scale down the previous page */
::view-transition-old(root) {
  transform: scale(.8);
  transition: .4s;
}
```

View transitions are enabled in the `site.yaml` file as follows:

```yaml
view_transitions: true
```

[.note]
  ### Note
  Future versions of Nue will also support view transitions in [single-page applications](single-page-apps.html). The user can seamlessly switch between the content-focused pages and the views of the single-page application and experience the transition effect defined on your design system.


### Menus and dialogs
Today popovers, dialogs, and [burger menus](page-layout.html#burger) can be natively implemented with the [Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API) and page-transitions can be styled with the CSS [@starting-style](//developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) at-rule:


```css
[popover] {
  /* final style when the transition is over */
  transform: scaleX(1);
  opacity: 1;

  &::backdrop {
    background-color: #0005;
    backdrop-filter: blur(4px);
    transition: .5s;
  }

  /* styles when the popover is about to be displayed */
  @starting-style {
    transform: scaleX(0);
    opacity: 0;

    &::backdrop {
      background-color: #0001;
      backdrop-filter: blur(0);
    }
  }
}
```

That's all. No JavaScript is needed, the code looks clean, and all the necessary popover features and animations are in place, including keyboard support for the ESC-key.


### Scroll linked transitions
Parallax effects, progress bars, image movements and skews, and other scroll-linked animations no longer require JavaScript, and can be implemented with native CSS keyframes and [animation-timeline](//developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) property. The front page of this website, for example, has the following animation defined for the hero image:


```css
@keyframes progress {
  from { transform: scaleX(0) }
  to { transform: scaleX(1) }
}
```

This animation is then bound to the progress of the scroll as follows:

```css
.progress {
> animation-timeline: scroll();
  animation: progress;
}
```

Again, this was a super simple and clean syntax for defining a scroll-linked animation that would be a rather large development effort with JavaScript.


## Web Components
Loading a heavy front-end library is not always the best choice for simple reactivity. It's often better to go with [Web Components](//developer.mozilla.org/en-US/docs/Web/API/Web_components) because they are mounted natively by the browser and are easy to write for simple things.


### Simple enhancements
Web Components are great for simple things that [progressively enhance](//developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the HTML markup that is already present on the document. For example, the "Zen Mode"-toggle on this documentation area is a simple checkbox whose behavior is implemented as a Web Component by binding the behavior to the element with the [`is` attribute](//developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is):


```html
<input type="checkbox" is="zen-toggle">
```


The input behavior is implemented in a JavaScript file (with a .js extension) as follows:


```js
class ZenToggle extends HTMLInputElement {
  constructor() {
    super()
    this.onchange = function() {
      document.body.classList.toggle('zen', this.checked)
    }
  }
}

customElements.define('zen-toggle', ZenToggle, { extends: 'input' })
```

One major benefit of using a Web Component is that the browser automatically takes care of component mounting and you have hooks for cleaning up resources when the component is removed from the DOM. They work nicely together with [view transitions](#view-transitions) without extra coding for setting things up.


### Dynamic sections { #sections }
You can turn all the [page sections](page-layout.html#sections) into web components with a `section_component` configuration option. This can be assigned in the front matter or globally in the application data. On the front page of this website, for example, we have a "scroll-transition" component to help implement all the scroll-triggered CSS transitions:

```yaml
section_component: scroll-transition
```

The Web component uses an [Intersection Observer API](//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for assigning an "in-viewport" class to the section element whenever the user scrolls into it.


```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(el =>
    el.target.classList.toggle('in-viewport', el.isIntersecting)
  )
}, { rootMargin: '-100px' })


class ScrollTransition extends HTMLElement {
  constructor() {
    super()
    observer.observe(this)
  }
  disconnectedCallback() {
    observer.unobserve(this)
  }
}

customElements.define(
  'scroll-transition', ScrollTransition, { extends: 'section' }
)
```

After this, you can develop whatever CSS transitions you wish using the "in-viewport" class name. For example:


```css
/* initial state for all section descendants */
section > * {
  transition: .5s;
  transform: translateY(2em);
  opacity: 0;

  &:nth-child(2) { transition-delay: .2s }
  &:nth-child(3) { transition-delay: .5s }
  &:nth-child(4) { transition-delay: .7s }
  &:nth-child(5) { transition-delay: .8s }
}

/* styling when a user enters the viewport */
.in-viewport > * {
  transform: translate(0);
  opacity: 1;
}
```


### Dynamic grid items { #grid-items }
Similar to [section dynamics](#sections), you can also turn your grid items into web components. This happens with a `grid_item_component` configuration option, which can be assigned in the front matter, globally in `site.yaml`, or for a specific area. Here, for example, we turn the grid items into dynamic gallery items.


```yaml
grid_item_component: gallery-item
```


### Custom Markdown extensions
You can implement custom Markdown extensions with web components. Here's a simple counter component:


```js
class Counter extends HTMLDivElement {
  constructor() {
    super()
    this.innerHTML = ++sessionStorage.counter || (sessionStorage.counter = 0)
  }
}

customElements.define('view-counter', Counter, { extends: 'div' })
```

After this, we can use this component in a Markdown file:


```md
### Your view counter

[view-counter]
```


## Reactive components
More complex components with dynamically generated HTML are better implemented with a [reactive component](islands.html). These components support the same [template syntax](template-syntax.html) as the server-side components, but the components can respond to user input.


### Islands of Interactivity
Reactive islands are interactive components within the server-rendered, static HTML. This progressively rendering pattern is called the [islands architecture](//www.patterns.dev/vanilla/islands-architecture/). On this website, we have "join mailing list" islands, that are implemented as follows:

```html
<div @name="join-list">

  <h4 :if="sessionStorage.joined">
    You have successfully joined the mailing list. Thank you for your interest!
  </h4>

  <form :else @submit.prevent="submit">
    <p :if="desc">{ desc }</p>
    <input type="email" name="email" placeholder="Your email" required>
    <textarea name="comment" placeholder="Feedback (optional)"></textarea>
    <button class="secondary">{ cta || 'Join mailing list' }</button>
  </form>

  <script>
    submit({ target }) {
      const data = Object.fromEntries(new FormData(target).entries())

      fetch('/public/members', {
        'Content-Type': 'application/json',
        body: JSON.stringify(data),
        method: 'POST',
      })

      // change the state
      sessionStorage.joined = true
    }
  </script>
</div>
```


After saving the component to a file with `.htm` or `.nue` extension, you can use it in your Markdown content as follows:


```md
## Join our mailing list

> [join-list cta="Submit form"]
```

The component can also be used on your [layout files](custom-layouts.html):

```html
<join-list cta="Submit form"/>
```

Nue mounts reactive components automatically and hot-reloads them if you make changes. The dynamics are powered by a tiny, 2.5kb Nue.js script.


### Isomorphic components
Isomorphic components are hybrid client-side and server-side components that are crawlable by search engines. For example, this website uses a video component with the following layout on the server side:

```html
<!-- isomorphic video component utilizing Bunny CDN -->
<figure class="video" @name="bunny-video">

  <!-- client-side video player -->
  <bunny-player :videoId="videoId" :poster="poster" :width="width"/>

  <!-- caption (SEO) -->
  <figcaption :if="caption">{ caption }</figcaption>

  <!-- when JavaScript is disabled -->
  <noscript>
    <video type="video/mp4" controls
      src="https://video.nuejs.org/{videoId}/play_720p.mp4">
  </noscript>
</figure>
```

The `<bunny-player>` is a reactive component defined in [@lib/video.htm](//github.com/nuejs/nue/blob/dev/packages/nuejs.org/%40lib/video.htm) file, which implements simple quality detection and [adaptive bitrate streaming](//en.wikipedia.org/wiki/Adaptive_bitrate_streaming) for browsers supporting the technology.


## Plain JavaScript
Not all reactivity requires a component and is better implemented with a simple JavaScript function.


### Global event handlers
Sometimes you want to run JavaScript when a certain user clicks, scrolls, or keyboard event happens. This website, for example, has a global click handler that monitors user clicks and when the click target is a link nested inside a popover, the popover is closed:

```js
addEventListener('click', e => {
  const el = e.target

  // hide popover menus
  const menu = el.closest('[popover]')
  if (menu && el.matches('a')) menu.hidePopover()
})
```


### Google Analytics
Google Analytics and other scripts that must be imported externally should go to the head section of your website. This happens by adding a custom `head` element to a root level [layout file](custom-layouts.html):


```html
<head>
  <script async src="//www.googletagmanager.com/gtag/js?id=•G-xxxxxxx•"></script>

  <script client>
    window.dataLayer = window.dataLayer || []
    function gtag(){ dataLayer.push(arguments) }
    gtag('js', new Date())
    gtag('config', '•G-xxxxxxx•')
  </script>
</head>
```

Please replace the `G-xxxxxxx` with your tracking ID.
