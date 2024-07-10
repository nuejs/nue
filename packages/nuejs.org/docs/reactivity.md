

# Motion and Reactivity
Today, you can build modern, reactive websites with nothing but CSS. However, sometimes a little bit of JavaScript can enhance the user experience and bring more dynamics into play. Nue lets you choose the most suitable technology for the job: CSS, Web Components, reactive islands, isomorphic components, or vanilla JavaScript.


## Modern CSS
CSS have come a long way from its early days. Things like tooltips, dialogs, sliders, and popups no longer require JavaScript and are best implemented with CSSl. Even the more advanced stuff, previously done with libraries like *Framer Motion* can now be [implemented with pure CSS](//motion.dev/blog/do-you-still-need-framer-motion). You can take advantage of hardware acceleration and use an easier-to-grasp, standards based programming model.


### View transitions
One of the most significant features of Nue is the built-in support for view transitions. That is: the loading of the page and it's assets are controlled with JavaScript and the view transition can be controlled with CSS [::view-transition](//developer.mozilla.org/en-US/docs/Web/CSS/::view-transition). For example:

``` css
::view-transition {
  background-color: rgb(0 0 0 / 25%)
}
```

Enable view transitions in the `site.yaml` file:

```
view_transitions: true
```

[.note]
  ### Note
  In the future version of Nue, the transitions are also supported in [single-page applications](single-page-applications.html), after which you can seamlessly transition between the content-focused pages and the views of the single-page application.



### Menus and dialogs
Today popovers, dialogs, and [burger menus]() can be natively implemented with a [Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API) and the related transisions can be styled with CSS [@starting-style](//developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) property:


...
@starting-style {

}

Cleaner code: no JS needed, use HTML popover elements, esc button, animations..




### Scroll linked transitions
Parallax effects, scroll based image transitions, and other scroll-linked animations no longer require JavaScript, and can be implemented with pure CSS only.

Another pure CSS without JS.

``` css
@keyframes scaleProgress {
  from { transform: scaleX(0) }
  to { transform: scaleX(1) }
}
```

To associate our progress bar element's animation with the progress of scroll, we've used the animation-timeline property and set the scroll() function as its value.

``` css
.progress {
  animation-timeline: scroll()
}
```



## Web Components
Loading a heavy library like React is the best choice for simple interactivity. It's better to go with native [Web Components](//developer.mozilla.org/en-US/docs/Web/API/Web_components). They are simpler and smaller, and you'll stick to web standards.


### Progressive ehhancement
Simple things that [progressively enhance](//developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the HTML markup that is _already present_ on the document.


```
<input type="checkbox" is="zen-switch">
```

This

``` js
class ZenSwitch extends HTMLInputElement {
  constructor() {
    super()
    this.onchange = function() {
      document.body.classList.toggle('zen', this.checked)
    }
  }
}

customElements.define('zen-switch', ZenSwitch, { extends: 'input' })
```

The true benefit of using a Web Component is that the browser automatically takes care of "mounting" and you have hooks for cleaning up resources when the component is removed from the DOM.

For example, they work nicely together with [view transitions](motion.html#view-transitions).



### Dynamic sections
transitions
Scroll- tirggered animations

With a little help from JavaScript by writing a web component to ..

[Intersection Observer API](//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)


### Dynamic grid items
HTML already exists
  ...



## Reactive Islands
If your component is more complex and has a lot of dynamically changing HTML markup, it's better to go with a Nue client-side component. These components support the same [template syntax][], as the server-side components but the component's layout can change depending on the state.



### Rich interactivity
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




### Isomorphic reactivity
Search engine optimization
Hybrid client-side and server-side componets for reactive, yet search-engine friendly components.


```
<figure class="video" @name="bunny-video">
  <noscript>
    <video type="video/mp4" controls
      src="https://video.nuejs.org/{videoId}/play_720p.mp4">
  </noscript>

  <!-- reactive part -->
  <bunny-player :videoId="videoId" :poster="poster" :width="width"/>

  <!-- caption (SEO) -->
  <figcaption :if="caption">{ caption }</figcaption>
</figure>
```


The `<bunny-player>` is a reactive component defined in [video.htm] file ...
It takes care of m3u8 and quality switching depending on the screen resolution




## Plain JavaScript
Not all reactivity happens on a component level. Sometimes reactivity is best implemented with a small snippet of vanilla JavaScript.


### External scripts
Like analytics scripts or global event handlers.

For example,


### Decoupled scripts



### Setup and teardown
You need to take care of view transitions

```
addEventListener('route', () => {
  for (const popover of document.querySelector('[popover]')) {
    popover.onclick = function(e) {
      if (e.target.matches('a')) popover.hidePopover()
    }
  }
})
```

The route event is fired when DOMContentLoaded and after every client-side page



