
# Motion, and interaction design
View transitions, scroll animations, popover menus, tooltips, tabbed navigations, feedback forms, and more. Nue turns your website into a rich, reactive experience.

[image.gridpaper]
  small: /img/reactivity.png
  large: /img/reactivity-big.png


## Shift in focus




Not all reactivity happens on a component level. Sometimes reactivity is best implemented with a small snippet of vanilla CSS and/or JavaScript. Sometimes Web Component is the right choice. Only the more complex components are best implemented with a reactive framework. Nue lets you choose the right technology based on the type of reactivity and it's scope:


[table "Type of reactivity | Matching technology"]
  - - View transitions
    - "[::view-transition](//developer.mozilla.org/en-US/docs/Web/CSS/::view-transition)"

  - - Popover menu
    - "[Popover API](//developer.mozilla.org/en-US/docs/Web/API/Popover_API)"

  - - Scroll effects
    - "[Intersection Observer API](//developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)"

  - - Tabbed navigation
    - "[Web Components API](//developer.mozilla.org/en-US/docs/Web/API/Web_components)"

  - - Feedback form
    - "[Reactive Component](reactive-component)"


Loading a heavy library like React for simple reactivity is not ideal. It's way too complex for simple things. It's better to go straight with the low-level web API's. They are not only simpler and smaller, but you'll get to learn how the web works.


### View transitions
A significant Nue feature
Turns your MPA into SPA
Allows the use of
Changes the model, there is no loading of pages, but "virtual" page loads. The domcontentready is manually fired...


### Progressive enhancement
Global Design System makes CSS the primary language for building websites and JavaScript becomes _optional_; it's role is to progressively enhance the user experience.

....
Optional
Hydration...



By far rhe simplest way to add reactivity to your page is to grab an element with `document.querySelector` and work directly with the DOM element. That's progressive enhancement to it's finest. And if you do that often, it's a nice trick to assign the call to a dollar character. Voila: jQuery is back!

[code numbered]
  // The all-mighty `$` is back
  export function $(query, root=document) {
  >  return root.querySelector(query)
  }

  // $$ to return multiple DOM nodes
  export function $$(query, root=document) {
    return [ ...root.querySelectorAll(query)]
  }


## Types of reactivity

[.grid]
  ### Page transitions
  Using CSS view transitions for smoother page switching
  ---

  ### In-page effects
  Adding page-level effects with modern CSS and JavaScript
  ---

  ### Reactive islands
  Choose between web-, reactive-, or isomorphic components





