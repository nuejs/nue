
# Scripting
Not all interactivity happens in isolated "islands." Vanilla JavaScript offers several powerful ways to enrich the user experience:

1. **Dynamic HTML**: JavaScript can grab the static HTML and make it interactive. This approach is at the heart of progressive enhancement, adding dynamic behavior to otherwise static content.

1. **Global scripts**: Unlike islands, global scripts can control the entire site, working across pages and sections. This makes them ideal for seamless, site-wide functionality.

1. **Non-UI functionality**: JavaScript has access to APIs for features beyond the visible interface, such as tracking user behavior or managing local storage through  `localStorage`, `sessionStorage`, or `IndexedDB`.



## Modern JavaScript
JavaScript and browser APIs have evolved significantly since the jQuery era, opening up a broad range of possibilities directly within the browser. However, frameworks like React operate several layers above this standard model, often isolating developers from the powerful features built into the web itself. Many of these APIs go overlooked when working deeply within a framework. Here are just a few of the [hundreds of APIs](//developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API) available:

[.small.columns]
  * Clipboard API
  * CSS Typed Object Model API
  * Fullscreen API
  * Houdini API
  * IndexedDB API
  * Intersection Observer API
  * Local and Session Storage APIs
  * Page Visibility API
  * Screen Capture API
  * Screen Orientation API
  * Screen Wake Lock API
  * Selection API
  * Web Share API

By focusing on JavaScript and web standards, you’ll gain a deeper understanding of how the web works. This lets you move beyond frameworks and libraries, and build something more general.

The **Nue.js** template engine is a great example of this. It’s like React, but optimized for the semantic web, and packaged into just 2.5kb of vanilla JavaScript by working directly with the DOM and web standards.

Learning ES6 modules, modern APIs, and DOM manipulation will provide you with long-lasting, powerful skills.



## Scripting example

Let’s explore a common use case for scripting: [popovers](//developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover). These elements have a `popover` global attribute, which allows them to function as modals. Here's an example on this website:

```html
<dialog id="menu" popover>
  <!-- close button -->
  <button class="action" popovertarget="menu">×</button>

  <!-- navigation -->
  <nav>
    <a href="/">Home</a>
    <a href="/docs/">Docs</a>
    <a href="/blog/">Blog</a>
    <a href="//github.com/nuejs/nue">GitHub</a>
  </nav>
</dialog>
```

The popover is triggered by a `<button>` with the `popovertarget` attribute:

```html
<button popovertarget="menu">Open menu</button>
```

Click on this button to see it in action:

[button popovertarget="menu" "Open menu"]

While no JavaScript is required to make the popover work, we want to ensure that the menu closes when any link is clicked. Here’s a global script to handle that:

```js
// hide popover menus
addEventListener('click', event => {
  const el = event.target
  const link = el.getAttribute('href')
  const dialog = el.closest('[popover]')

  // close dialog if a link was clicked
  if (dialog && link) dialog.hidePopover()
})
```

### What this demonstrates:

1. **Progressive enhancement**: We enhance the user experience with JavaScript while ensuring core functionality remains intact for users with JavaScript disabled.

2. **Static HTML enrichment**: By adding JavaScript, we make static HTML more interactive without relying on client-side rendering (CSR) or complex JavaScript islands.

3. **Global scripting**: A single click handler efficiently manages all clickable elements across the site, making the JavaScript reusable and efficient.



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

You can also target specific apps with route-specific event listeners. For example:

```js
addEventListener('route:blog', function() {
  // Runs after any page in the 'blog' app is rendered
  // Note: using `window.` before addEventListener is optional
})
```

This approach keeps your scripts in the correct context when navigating between virtual pages. The front page has a special route name, `"home"`. To listen for events on the front page, use:

```js
addEventListener('route:home', function() {
  // Runs when navigating to the front page
})
```


## View transition API

The view transition script, located at `/@nue/view-transitions.js`, provides a set of helpful methods to make scripting smoother and more efficient. These methods simplify common DOM tasks, streamline page transitions, and bring a familiar scripting style to Nue.

To use the API, start by importing the methods you need:

```js
import { $, $$, loadPage } from '/@nue/view-transitions.js'
```

#### `$(selector)`

A jQuery-style wrapper for `document.querySelector`, providing a shorthand way to select a single element by its CSS selector. This is especially useful for quickly grabbing elements without typing out the full `document.querySelector` syntax.

```js
// select the first article element on the page
const article = $('article')
```

#### `$$(selector)`

Similar to `$()`, but works with `document.querySelectorAll` to select multiple elements and return them as a real array. This simplifies iterating over elements without needing to convert the NodeList.

```js
// select all anchor elements on the page and return an array
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
// client-side import
import { user } from './user.js';

// server-side import from node_modules
import { crm } from 'crm';
```

NPM imports are handled by either Bun.build or ESBuild, depending on whether Nue is running under Bun or Node. Both environments support tree-shaking, reducing bundle size by eliminating unused code.


## Bundling

You can specify which files to bundle with the `bundle` configuration option:

```yaml
bundle: [index]
```

This signals that all the imports in files named `index` will be bundled.

[.note]
  ### On performance
  Note that bundling has no impact on performance in Nue, as scripts are optional and loaded after HTML and CSS. For performance tips, see the [optimization](optimization.html) section.



## TypeScript
Nue supports TypeScript out of the box. Simply add `.ts` files, and they will automatically be transpiled to JavaScript using either Bun.build or ESBuild, depending on whether Nue is running under Bun or Node.js.

TypeScript is a great choice for larger projects, especially when dealing with complex APIs or collaborating with multiple team members. However, for simpler projects—especially content-heavy websites—TypeScript might be unnecessary for two reasons:

1. **Small role of scripting**:
  In content-heavy sites, the focus is on delivering static or server-rendered content with minimal interactivity. Simple tasks like toggling elements or form validation can be handled efficiently with plain JavaScript.

2. **HTML, DOM, and CSS are untyped**:
  Much of frontend development involves untyped elements like the DOM and CSS. While TypeScript excels in managing complex logic, its benefits are limited when working heavily with these untyped constructs.

For most content-heavy sites, JavaScript is simpler and more efficient. However, if your project becomes more complex, such as a single-page application with multiple engineers, TypeScript is a good option.

