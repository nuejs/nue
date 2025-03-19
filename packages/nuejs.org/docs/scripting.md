
# Scripting
Scripting in Nue adds lightweight interactivity to static, content-first websites, leveraging vanilla JavaScript and web standards. While islands handle isolated components, global scripts enhance the broader experience—optional, progressive, and built on HTML’s foundation.

## Global scripts
Global scripts enrich static HTML across the site. Take a popover menu:

```html
<dialog id="menu" popover>
  <button class="action" popovertarget="menu">×</button>
  <nav>
    <a href="/">Home</a>
    <a href="/docs/">Docs</a>
    <a href="/blog/">Blog</a>
  </nav>
</dialog>

<button popovertarget="menu">Open menu</button>
```

This script closes it when a link is clicked:

```js
addEventListener('click', event => {
  const el = event.target
  const link = el.getAttribute('href')
  const dialog = el.closest('[popover]')
  if (dialog && link) dialog.hidePopover()
})
```

The menu works without JavaScript—clicking links navigates normally—but the script improves usability by auto-closing, showcasing progressive enhancement with minimal code.

## View transitions
Enable [view transitions](view-transitions.html) in `site.yaml`, and pages load once, with JavaScript updating content like turbolinking. Re-run scripts on virtual page loads:

```js
addEventListener('route', function() {
  const article = document.querySelector('article')
  article.classList.add('active')
})
```

Target specific apps:

```js
addEventListener('route:blog', function() {
  const posts = document.querySelectorAll('.post')
  posts.forEach(post => post.classList.add('fade-in'))
})
```

The `/@nue/view-transitions.js` script provides helpers:

```js
import { $, loadPage } from '/@nue/view-transitions.js'

// Select and act
const main = $('main')
main.style.display = 'block'

// Navigate with transition
loadPage('thanks.html')
```

This keeps scripting lean, enhancing multi-page apps without bloat.

## Hot reloading
Hot Module Replacement (HMR) updates content live. Global scripts persist, but DOM-dependent logic needs reattachment:

```js
addEventListener('reload', function() {
  const menu = document.querySelector('#menu')
  menu.classList.add('updated')
})
```

This ensures scripts stay in sync during development, balancing simplicity and functionality.
