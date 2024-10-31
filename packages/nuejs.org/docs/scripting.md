
# Scripting
Not all interactivity happens in isolated "islands." Vanilla JavaScript offers several powerful ways to enrich the user experience:

1. **Dynamic HTML**: JavaScript can make static, server-rendered HTML more interactive and responsive. This approach is at the heart of progressive enhancement, adding dynamic behavior to otherwise static content.

2. **Non-UI functionality**: JavaScript has access to APIs for features beyond the visible interface, such as tracking user behavior or managing local storage through tools like `localStorage`, `sessionStorage`, or `IndexedDB`.

3. **Global scripts**: Unlike component-based scripts, global scripts can control the entire site, working across pages and sections. This makes them ideal for seamless, site-wide functionality.


## Modern JavaScript
JavaScript and browser APIs have evolved significantly since the jQuery era, opening up a broad range of possibilities directly within the browser. However, frameworks like React operate several layers above this standard model, often isolating developers from the powerful features built into the web itself. Many of these APIs go overlooked when working deeply within a framework. Here are just a few of the hundreds of APIs available:

- Clipboard API
- CSS Typed Object Model API
- Fullscreen API
- Houdini API
- IndexedDB API
- Intersection Observer API
- Local and Session Storage APIs
- Page Visibility API
- Screen Capture API
- Screen Orientation API
- Screen Wake Lock API
- Selection API
- Web Share API

By focusing on JavaScript and web standards, you’ll gain a deeper understanding of how the web works. This lets you move beyond frameworks and libraries, refining them into something more streamlined and efficient.

The **Nue.js** template engine is a great example of this. It’s like React, but optimized for the semantic web, and packaged into just 2.5kb of vanilla JavaScript by working directly with the DOM and web standards.

Learning ES6 modules, modern APIs, and DOM manipulation will provide you with long-lasting, powerful skills.

## Scripting example

Let’s enhance static HTML with JavaScript by creating two clickable cards. Each card will have a button that opens a popover overlay. First, we render the cards using a Markdown [block extension](content.html#blocks):

```md render
[.cards.stack]
  ### Progressive enhancement

  [button popovertarget="pe-explainer" "Learn how it works"]

  ### Separation of concerns

  [button popovertarget="soc-explainer" "Learn how it works"]
```

Now, we define the popover overlays:

```md render
[#pe-explainer popover]
  ### Progressive enhancement

  ![Progressive enhancement](/img/pe.svg)

[#soc-explainer popover]
  ### Separation of concerns

  ![Separation of concerns](/img/soc.svg)
```

Clicking the buttons opens popovers with an image explaining each topic.

### Making the cards clickable

Next, we’ll make the entire card clickable by adding the `.clickable` class to the cards:

```md render
[.cards.stack.clickable]
  ### Progressive enhancement

  [button popovertarget="pe-explainer" "Learn how it works"]

  ### Separation of concerns

  [button popovertarget="soc-explainer" "Learn how it works"]
```

### Adding the click handler

We’ll add a global click handler in the `@global/global.js` file to make the `.clickable` elements function across the site:

```js
addEventListener('click', event => {
  const { target } = event;

  const card = target.closest('.card')
  if (card) {
    const button = card.querySelector('button')
    if (button) {
      const popover = window[button.getAttribute('popovertarget')];
      popover?.showPopover()
    }
  }
})
```

This script listens for any click on the page, identifies the card, finds its button, and opens the corresponding popover.

### Hiding the buttons with CSS

We’ll hide the buttons for users with JavaScript enabled:

```css
.clickable {
  @media (scripting: enabled) {
    button { display: none }
  }
}
```

When JavaScript is enabled, the buttons will be hidden, and clicking anywhere on the card will trigger the popover.

### Testing the behavior

You can enable or disable JavaScript in the Chrome developer console to see how the button toggles between visible and hidden states based on whether scripting is enabled.

### Summary

This example demonstrates the following key concepts:

1. **Progressive enhancement**: We improved the user experience with JavaScript while ensuring that core functionality remains intact for users who have disabled JavaScript.

2. **Static HTML enrichment**: By adding JavaScript, we made static HTML more interactive without relying on client-side rendering (CSR) or complex JavaScript islands.

3. **Global scripting**: A single click handler can manage all `.clickable` elements across the entire site, making your JavaScript more efficient and reusable.


## Scripting with view transitions

By default, scripts in Nue are loaded as ES6 modules and executed after the `DOMContentLoaded` event, so you have access to the DOM once the page loads.

When [view transitions](motion.html#view-transitions) are enabled, your site is only loaded once, and subsequent page loads are handled by JavaScript. This is similar to "turbolinking," where full-page reloads are replaced with dynamic content updates. Instead of reloading the entire page, JavaScript fetches and injects new content, making your site behave like a single-page application (SPA), with faster navigation and smoother transitions.

Nue extends this concept with built-in view transition support, making page transitions visually smoother and more engaging, further improving user experience.

With view transitions, you need to reinitialize your scripts each time a **virtual** page loads to ensure they work with the new content. Here’s how:

```js
// Runs after a virtual page is rendered
window.addEventListener('route', function() {
  const article = document.querySelector('article')
})
```

You can also target specific apps:

```js
addEventListener('route:blog', function() {
  // Runs after any page under the blog app is rendered
  // Note: the window. prior addEventListener is optional
})
```

This ensures your scripts continue functioning on the right context when navigating between virtual pages.


### View transition API

The view transition script, located at `/@nue/view-transitions.js`, provides a set of helpful methods to make scripting smoother and more efficient. These methods simplify common DOM tasks, streamline page transitions, and bring a familiar scripting style to Nue.

To use the API, start by importing the methods you need:

```js
import { $, $$, loadPage } from '/@nue/view-transitions.js'
```

#### `$()`

A jQuery-style wrapper for `document.querySelector`, providing a shorthand way to select a single element by its CSS selector. This is especially useful for quickly grabbing elements without typing out the full `document.querySelector` syntax.

```js
// select the first <article> element on the page
const article = $('article')
```

#### `$$()`

Similar to `$()`, but works with `document.querySelectorAll` to select multiple elements and return them as a real array. This simplifies iterating over elements without needing to convert the NodeList.

```js
// select all <a> elements on the page and return an array
const links = $$('a')
links.forEach(link => {
  // add event listeners or other logic to each link
  link.addEventListener('click', () => {
    console.log('Link clicked:', link.href)
  })
})
```

#### `loadPage()`

Triggers a view transition to load a new page programmatically. Instead of a full page reload, this method loads the content via JavaScript, allowing for a smoother transition that feels like a single-page application. It’s useful for creating custom navigation without full reloads or for handling redirects after form submissions, popups, or interactive components.

```js
// transition smoothly to the "thanks.html" page
loadPage('thanks.html')
```

Using these methods can simplify your scripts, making the code more readable and maintainable while keeping transitions smooth and responsive.




## Hot-reloading

When the page content updates through Hot Module Replacement (HMR), you can re-attach your selectors or run other tasks:

```js
addEventListener('reload', function() {
  // your code here
})
```

Listening to the `reload` event is necessary if your script relies on DOM elements that might be replaced during HMR. In contrast, scripts using global event handlers (like our earlier example) are unaffected by HMR since they stay active.

## Importing modules

In Nue, all scripting is done using ES6 modules. You can import other scripts with the standard `import` statement. Scripts within your site are imported client-side, while NPM modules from `node_modules` are imported server-side. For example:

```js
// Client-side import
import { user } from './user.js';

// Server-side import from node_modules
import { crm } from 'crm';
```

NPM imports are handled by either Bun.build or ESBuild, depending on whether Nue is running under Bun or Node. Both environments support tree-shaking, reducing bundle size by eliminating unused code.

### Bundling

You can specify which files to bundle with the `bundle` configuration option:

```yaml
bundle: [index]
```

This signals that all the imports in files named `index` will be bundled. However, bundling has no impact on performance in Nue, as scripts are optional and loaded after HTML and CSS. Nue’s view transition system ensures that the number of scripts has little effect on speed.

For performance tips, see the [optimization](optimization.html) section.

## Scripting with TypeScript

Nue supports TypeScript out of the box. Simply add `.ts` files, and they will automatically be transpiled to JavaScript using either Bun.build or ESBuild, depending on whether Nue is running under Bun or Node.js.

TypeScript is a great choice for larger projects, especially when dealing with complex APIs or collaborating with multiple team members. However, for simpler projects—especially content-heavy websites—TypeScript might be unnecessary for two reasons:

1. **Small role of scripting**:
   In content-heavy sites, the focus is on delivering static or server-rendered content with minimal interactivity. Simple tasks like toggling elements or form validation can be handled efficiently with plain JavaScript.

2. **HTML, DOM, and CSS are untyped**:
   Much of frontend development involves untyped elements like the DOM and CSS. While TypeScript excels in managing complex logic, its benefits are limited when working heavily with these untyped constructs. For content-heavy projects, plain JavaScript is often simpler and more fitting.

For most content-heavy sites, JavaScript is a simpler, more efficient choice. But if your project becomes more complex, TypeScript is a powerful option.
