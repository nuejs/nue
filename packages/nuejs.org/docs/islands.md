# Interactive islands

Islands are interactive UI components integrated into the static HTML layout. Common examples include account menus, login pages, forms, and image galleries.

## Nue islands

Nue islands have the following characteristics:

1. **Interactivity**: Islands enable dynamic widgets and interactive components, such as forms that send data to your backend, allowing users to engage with your site.

2. **Isomorphism**: Parts can render on the server, parts on the client. This ensures proper content indexing while providing responsive interactivity.

3. **Loose coupling**: Islands can use Web Components for simple interactions or an HTML-based template syntax for more advanced functionality.

## Creating an island

Islands are created using the same simple HTML-based [template syntax](template-syntax.html) used for layout modules on the server side. They are dynamic HTML components with a `.dhtml` extension, and their name is set using the `@name` attribute.

```html
<form @name="join-list" @submit.prevent="submit" autocomplete="on">
  <label>
    <span>Your name</span>
    <input type="text" name="name" placeholder="Example: John Doe" required>
  </label>

  <label>
    <span>Your email</span>
    <input type="email" name="email" placeholder="your@email.com" required>
  </label>

  <button>Submit</button>

  <script>
    function submit() {
      // Send the form data with fetch()
    }
  </script>
</form>
```

### Organization

Islands can be defined at different levels in your project:

- **Global islands**: In the global directory (e.g., `@globals/join-list.dhtml`), accessible across the entire app
- **Area-specific islands**: Within a specific application directory, like `blog/islands.dhtml`
- **Page-specific islands**: In individual page directories, like `blog/announcing-v2.0/islands.dhtml`

Each `.dhtml` file can contain multiple islands, enabling related components to be grouped together. For example, `blog/islands.dhtml` could define a comment form, sharing widget, and related posts section.

## Using islands

### In Markdown content

To include an island in Markdown:

```md
### Join our mailing list
Be the first to know about our new releases

[join-list]
```

### In layout modules

To embed an island within a layout module:

```html
<footer @name="pagefoot">
  <h3>Join our mailing list</h3>
  <p>Be the first to know about our new releases</p>
  <join-list/>
</footer>
```

### Isomorphic islands

Islands can render on both server and client, ensuring proper SEO while providing interactivity. Here's an example video component:

```html
<div @name="video-player">
  <!-- For SEO and JS-disabled users/browsers -->
  <noscript>
    <video src="https://video.nuejs.org/{videoId}/play_720p.mp4" controls>
      Your browser does not support the video tag.
    </video>
  </noscript>

  <!-- The client-side part -->
  <video-player :videoId="videoId" :poster="poster" :width="width"/>

  <!-- Caption for search engines -->
  <figcaption :if="caption">{ caption }</figcaption>
</div>
```

## Web Components

Web Components offer a lightweight, standards-based alternative to islands for simple interactivity. They enhance static HTML with JavaScript but do not re-render based on internal state.

Here's a real example - the Zen Mode toggle:

```html
<div class="zen-toggle">
  <h5>{ lang.zen_mode }</h5>
  <label class="toggle">
    <input type="checkbox" is="zen-toggle">
  </label>
</div>
```

With its implementation:

```javascript
class ZenToggle extends HTMLInputElement {
  constructor() {
    super();
    this.onchange = function() {
      document.documentElement.classList.toggle('zen', this.checked);
    };
  }
}

customElements.define('zen-toggle', ZenToggle, { extends: 'input' });
```

## Technical details

### The runtime

Nue includes a lightweight script (`/@nue/nue.js`, 2.5kb) that enables reactive features. This handles loops, conditionals, and re-rendering, allowing for React-like interactivity using semantic HTML-based syntax.

### Context and scope

Islands have access to:
- Global data from your site configuration
- Area-specific data from application YAML files
- Page-specific data from front matter
- Dynamic state managed through the template syntax

This layered approach maintains clean separation between content, presentation, and interactive functionality while enabling sophisticated features when needed.