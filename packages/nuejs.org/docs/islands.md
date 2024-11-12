
# Interactive islands

Islands are interactive UI components integrated into the static HTML layout. Common examples include account menus, login pages, forms, and image galleries.

## Nue islands

Nue islands have the following characteristics:

1. **Interactivity**: Islands enable dynamic widgets and interactive components, such as forms that send data to your backend, allowing users to engage with your site and enhancing their experience.

2. **Isomorphism**: Nue islands can be isomorphic, meaning parts are rendered on the server and parts on the client. This ensures proper content indexing by search engines while providing a responsive, engaging experience for users.

3. **Loose coupling**: Islands can be created using **Web Components** for simple interactions or an HTML-based [template syntax](template-syntax.html) for more advanced functionality.

[.note]
  ### Islands: Nue vs. Astro
  Astro Islands are a valuable addition to the JavaScript ecosystem, showcasing separation of concerns and progressive enhancement. However, Nue fully embodies these principles, integrating loose coupling and progressive enhancement as core features. This design choice protects developers from the complexities of JavaScript monoliths, offering a simpler, more efficient experience for the entire application.

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

### The nue.js file
Nue automatically includes a lightweight script (just 2.5 KB, located at `/@nue/nue.js`) to your page, enabling reactive features on the HTML layout. This script supports loops, conditionals, and re-rendering, allowing for React-like interactivity using a semantic, HTML-based syntax that prioritizes simplicity and accessibility.

### Global, area, and page contexts
Islands are defined as dynamic HTML components located in different contexts within the Nue framework:

- **Global islands**: Stored in the global directory (e.g., `@globals/join-list.dhtml`), accessible across the entire app.
- **Area-specific islands**: Located within a specific application directory, such as `blog/islands.dhtml`, ensuring relevant functionality.
- **Page-specific islands**: Defined within individual page directories, like `blog/announcing-v2.0/islands.dhtml`, for custom interactive elements.

### Multiple islands in a single file
Each `.dhtml` file can contain multiple islands, enabling related components to be grouped together. For example, `blog/islands.dhtml` could define a comment form, sharing widget, and related posts section, all reusable across blog entries. This promotes modularity, allowing the server to treat all defined islands as interactive components.

## Mounting

Islands can be embedded as custom HTML elements within Markdown content or inside [layout modules](layout.html):

### In Markdown content
To integrate an island in Markdown, simply include the following:

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

Embedding islands in this way creates interactive components, enhancing user engagement while maintaining the simplicity and performance of a static site.

### Isomorphic islands
Isomorphic islands are components rendered on both the server and client, benefiting SEO and accessibility while delivering interactivity on the client side. This approach allows search engines to index your content and ensures seamless user interaction.

Here’s an example of a video component defined in `video.html`:

```html
<div @name="video-player">

  <!-- For SEO and JS-disabled users/browsers -->
  <noscript>
    <video src="https://video.nuejs.org/{videoId}/play_720p.mp4" type="video/mp4" controls>
      Your browser does not support the video tag.
    </video>
  </noscript>

  <!-- The client-side part defined in video.dhtml -->
  <video-player :videoId="videoId" :poster="poster" :width="width"/>

  <!-- Caption and metadata for search engines and AI crawlers -->
  <figcaption :if="caption">{ caption }</figcaption>

</div>
```

The `<noscript>` tag provides a fallback for browsers that do not support JavaScript, ensuring the video remains accessible, while the client-side component handles interactivity.

## Web components
Web Components are a lightweight, standards-based alternative to interactive islands, ideal for simple interactivity. They enhance static HTML with JavaScript but do not re-render based on internal state, keeping the implementation minimal.

Web Components do not require the `nue.js` library, offering a "no framework" approach with minimal code. This is ideal for developers who prioritize efficiency and small code footprints.

### Example: Zen mode
The Zen Mode toggle on this website is implemented as a Web Component. Here's the HTML markup:

```html
<div class="zen-toggle">
  <h5>{ lang.zen_mode }</h5>
  <label class="toggle">
    <input type="checkbox" is="zen-toggle">
  </label>
</div>
```

The Web Component is implemented as follows:

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

This `ZenToggle` component allows users to toggle Zen Mode on and off by checking a box, dynamically applying a Zen-themed style.

## React support?!

Islands provide an ideal framework for integrating React into Nue. While React and Nue may seem philosophically different, the architecture of islands allows for a seamless integration of React's concepts, such as hooks, without compromising Nue’s principles of progressive enhancement. This flexibility lets developers use React while keeping the benefits of Nue's lightweight, semantic approach.

This integration enables the gradual transition from traditional JavaScript monoliths to a more semantic, maintainable approach, leading to cleaner, more accessible code. If you’re interested in React support, please [join our mailing list](/index.html#roadmap) and share your thoughts.
