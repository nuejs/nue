

# Motion and Reactivity
Today you can build modern, reactive websites with nothing but CSS. However, sometimes a little bit of JavaScript can significanty enhance the user experience. Depending on what to build, Nue lets you choose the most suitable technology for the job: CSS, Web Components, reactive islands, isomorphic components, or vanilla JavaScript.


## Modern CSS
CSS have come a long way from its early days. Things like tooltips, dialogs, sliders, and popups no longer require JavaScript and are best implemented with CSS. Even the more advanced functionality from libraries like *Framer Motion* can mostly be [implemented with modern CSS](//motion.dev/blog/do-you-still-need-framer-motion).

CSS offers better hardware acceleration than JavaScript and a simpler, more standards based programming model.


### View transitions
One of the most significant features of Nue is the built-in support for view transitions. That is: the loading of the page and it's assets are internally controlled with JavaScript and the view transition can be customized with CSS [::view-transition](//developer.mozilla.org/en-US/docs/Web/CSS/::view-transition) property. This website, for example, has this simple CSS rule for the page switch transition effect:


``` css
/* scale down the previous page */
::view-transition-old(root) {
  transform: scale(.8);
  transition: .4s;
}
```

View transitions are enabled in the `site.yaml` file as follows:

```
view_transitions: true
```

[.note]
  ### Note
  In the future version of Nue, the transitions are also supported in [single-page applications](single-page-applications.html), after which you can seamlessly transition between the content-focused pages and the views of the single-page application.



### Menus and dialogs
Today popovers, dialogs, and [burger menus](page-layout.html#burger) can be natively implemented with a [Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API) and the page transisions can be styled with CSS [@starting-style](//developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) property:


```
[popover] {

  /* styles when the popover is about to be displayed */
  @starting-style {
    transform: scaleX(0);
    opacity: 0;

    &::backdrop {
      background-color: #0001;
      backdrop-filter: blur(0);
    }
  }

  /* final style when the transition is over */
  transform: scaleX(1);
  opacity: 1;

  &::backdrop {
    background-color: #0005;
    backdrop-filter: blur(4px);
    transition: .5s;
  }
}
```

That's all. No JavaScript needed, the code looks clean, and all the necessary popover features and animations are in place, including keyboard support for the esc- key.



### Scroll linked transitions
Parallax effects, prorgress bars, image movements and skews, and other scroll-linked animations no longer require JavaScript, and can be implemented with native CSS keyframes and [animation-timeline](//developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) property. The front page of this website, for example, has the following animation defined for the hero image:


``` css
@keyframes progress {
  from { transform: scaleX(0) }
  to { transform: scaleX(1) }
}
```

This animation is then bind to the progress of scroll as follows:

``` css
.progress {
> animation-timeline: scroll();
  animation: progress;
}
```

Again, a super simple and clean syntax for defining a scoll-linked animation that would be a somewhat large programming effort with JavaScript.



## Web Components
Loading a heavy frontend library is not always the best choice for simple reactivity. It's often better to go with native [Web Components](//developer.mozilla.org/en-US/docs/Web/API/Web_components), because they work natively on the browser and are are super simple to use.


### Simple enhancements
Web Components are perfect for simple things that [progressively enhance](//developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the HTML markup that is already present on the document. For example, the "Zen Mode"- toggle on this documentation area is a simple checkbox whose behavioiur is implemented as a Web Component using the standard [is](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) attribute:


```
<input type="checkbox" is="zen-toggle">
```

Here is the web component implementation:

``` js
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

One major benefit of using a Web Component is that the browser automatically takes care of component mounting and you have hooks for cleaning up resources when the component is removed from the DOM.

For this reason, they work nicely together with [view transitions](#view-transitions).



### Dynamic sections { #sections }
You can assign a web component for all the [page sections](page-layout.html#sections) on your pages front matter or globally in the application data. The front page on this website, for example, is using a section component to implement all the scroll-triggered transitions:

```
section_component: scroll-transition
```

Then we write the following Web Component that uses an [Intersection Observer API](//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for assigning a "in-viewport" class to the section element whenever the user scrolls into it.


``` js
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

After this you can develop whatever CSS transitions you wish using the "in-viewport" class name. For example:


```
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

/* styling when user enters the viewport */
.in-viewport > * {
  transform: translate(0);
  opacity: 1;
}
```





### Dynamic grid items { #grid-items }
HTML already exists
  ...



## Reactive components
If your component is more complex and has a lot of dynamically changing HTML markup, it's better to go with a Nue client-side component. These components support the same [template syntax][], as the server-side components but the component's layout can change depending on the state.



### Islands of Interactivity
Forms are best implemented with a reactive component

```
<div @name="join-list">

  <h4 :if="sessionStorage.joined">
    You have succesfully joined the mailing list. Thank you for your interest!
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

Reactive components are defined in `.htm ` files as opposed to layout components, which are defined in `.html` files.


``` md
## Join our mailing list
We'll let you know when there is a major update

[join-list cta="Submit form"]
```

You can also use these on the layout files, ... for example:

```
<join-list cta="Submit form"/>
```

Automatically mounted, when page switches

They support hot-reloading, and form state keeps intact ...


! hot-reloading island..



### Isomorphic components
Hybrid client-side and server-side componets for reactive, yet search-engine friendly components.

For example, this website uses a video component that .. it's quite versatile having support for m3u8 and quality switching depending on the screen resolution

```
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


The `<bunny-player>` is a reactive component defined in [video.htm] file ...




## Plain JavaScript
Not all reactivity happens on a component level. Sometimes reactivity is best implemented with a small snippet of vanilla JavaScript.


### Global event handlers
Keypresses, clicks,


```
addEventListener('click', e => {
  const el = e.target

  // hide popover menus
  const menu = el.closest('[popover]')
  if (menu && el.matches('a')) menu.hidePopover()
})
```

### External scripts
Often need exteranl scripts like analytics, ..

```
<head>

  <script  type="text/javascript">
    console.info('koo')
  </script>

</head>
```




