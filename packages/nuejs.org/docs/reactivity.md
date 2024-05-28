
# Reactivity layer
View transitions, scroll animations, popover menus, tooltips, tabbed navigations, feedback forms, and so on. Nue turns your website into a pleasant, reactive experience.

[image.gridpaper]
  small: /img/reactivity.png
  large: /img/reactivity-big.png


## Shift in focus
Not all reactivity happens on a component level. Nue lets you choose the best technology based on the type of reactivity and it's scope.

[table "Example | Scope | Technology"]
  * - View transitions
    - Site-level
    - [::view-transition](//developer.mozilla.org/en-US/docs/Web/CSS/::view-transition)

  * - Popover menu
    - Site-level
    - [Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API)

  * - Scroll transitions
    - Page-level
    - [Intersection Observer API](//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

  * - Tabbed navigation
    - Web Component
    - [Web Components API](//developer.mozilla.org/en-US/docs/Web/API/Web_components)

  * - Feedback form
    - Reactive Component
    - [Nue JS](reactive-component)


Sometimes reactivity is best implemented with a small snippet of vanilla CSS and/or JavaScript. Sometimes Web Component is the right choice. Only the more complex components are best implemented with a reactive framework. Few examples:


### Work close to standards
Loading a heavy library like React is not always desired. It's a big system with massive amount of 3rd party idioms and abstractions. Many times it's better to go straight with the low-level web API's. They are not only simpler and smaller, but you'll get to learn how the web works.


### Echoes from the jQuery era
The simplest way to add reactivity to your page is to grab an element with `document.querySelector` and work directly with the DOM element. That's progressive enhancement to it's finest. And if you do that often, it's a nice trick to assign the call to a dollar character. The all-mighty `$` is back! Massive credits to *John Resig* and his API design mastery.


## Types of reactivity

### Page transitions
Using CSS view transitions for smoother page switching

### In-page effects
Adding page-level effects with modern CSS and JavaScript

### Reactive islands
Choose between web components, reactive components, and isomorphic components





