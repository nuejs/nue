
// //www.patterns.dev/vanilla/islands-architecture/
# Interactive islands
Islands are interactive UI components embedded within the static HTML layout. These components bring application-like features to an otherwise static site. Typical features include account menus, login pages, feedback and registration forms, image galleries, and lightboxes.

## Advantages of islands
Islands offer several key advantages:

1. **Interactivity**: Islands enable dynamic widgets and interactive components, such as forms that send data to your backend. This functionality allows users to engage with your site in meaningful ways, enhancing their overall experience.

2. **Isomorphism**: Islands provide server-side markup for SEO while maintaining dynamic interactivity. This combination allows search engines to index your content effectively, ensuring that users enjoy a responsive and engaging experience.

3. **Loose coupling**: Islands can be constructed using simple Web Components or vanilla JavaScript for straightforward interactions, while more advanced islands can leverage an HTML-based reactive language. This flexibility enables developers to select the best implementation strategy based on project needs. Moreover, the architecture of Nue establishes an ideal foundation for adding React support in the future, allowing developers to utilize React's capabilities without the complexities associated with monolithic architectures.

[.note]
### Islands: Nue vs. Astro
Astro Islands are a valuable and welcomed addition to the current JavaScript ecosystem, showcasing the effectiveness of separation of concerns and progressive enhancement. In contrast, Nue fully embodies these principles, establishing loose coupling and progressive enhancement as foundational elements of the framework. This design choice safeguards developers from the complexities and challenges of JavaScript monoliths, leading to a simpler overall experience—not just for islands, but for the entire application.

## Creating an island
Islands are created using the same intuitive HTML-based [template syntax](template-syntax.html) employed for creating layout modules on the server side.

### Defining the island
Islands are defined as dynamic HTML components, which can be given the `.dhtml` extension. This enables the server to recognize them as interactive elements. The name of the island is specified using the `@name` attribute:

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
Nue automatically includes a lightweight script (just 2.5 KB, located at path `/@nue/nue.js`) to your page, enabling reactive features on the HTML layout. This script supports functionalities such as loops, conditionals, and re-rendering to new states. Essentially, it allows you to achieve a similar level of interactivity as frameworks like React, but using an HTML-based syntax that emphasizes semantic structure, accessibility, and simplicity.

### Global, area, and page contexts
Islands are defined as dynamic HTML components located in various contexts within the Nue framework. Global islands, stored in the global directory (e.g., `@globals/join-list.dhtml`), are accessible throughout the entire application, providing reusable components for any page. Area-specific islands, organized in a designated directory such as `blog/islands.dhtml`, are tailored for use within a specific application area, ensuring relevant functionality without affecting other sections of the site. Page-specific islands can also be defined within individual page directories, such as `blog/announcing-v2.0/islands.dhtml`, allowing for custom interactive elements unique to that page.

### Multiple islands in a single file
Each `.dhtml` file can contain multiple islands, enabling developers to group related components together. For example, the `blog/islands.dhtml` file might define several islands, such as a comment form, a sharing widget, and a related posts section, all of which can be reused throughout various blog entries. This organization promotes modularity and flexibility, allowing the server to recognize all defined islands as interactive elements based on their defined scope.

## Embedding the island
Islands can be embedded as custom HTML elements within your Markdown content or inside your [layout modules](layout.html):

### In Markdown content
You can easily integrate an island directly into your Markdown files. For instance, to create a simple join list, you would include the following:

```md
### Join our mailing list
Be the first to know about our new releases

[join-list]
```

### In layout modules
Here’s how you can embed the same island within a layout module, providing context and enhancing the layout's functionality:

```html
<footer @name="pagefoot">
  <h3>Join our mailing list</h3>
  <p>Be the first to know about our new releases</p>
  <join-list/>
</footer>
```

By embedding islands in this way, you create interactive components that enhance user engagement while maintaining the simplicity and performance of a static site. This modular approach ensures that your layout remains clean and organized, making it easier to manage and update as needed.

### Isomorphic islands
Isomorphic islands are components that are rendered on both the server and client sides, providing the benefits of SEO and accessibility while also delivering interactive features for users on the client side. This dual rendering approach ensures that search engines and AI crawlers can index your content effectively, improving discoverability, while also allowing users to interact with the components seamlessly.

Here’s an example of a video component that demonstrates these benefits. This component is defined in a file named `video.html`, which handles the server-side rendering:

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

In this example, the `<noscript>` tag provides a fallback for users whose browsers do not support JavaScript, ensuring that the video is still accessible. The actual video player is defined in the `video.dhtml` file, allowing for a rich client-side experience.

The client-side implementation of the video player might look like this:

```html
<div @name="video-player" @click="togglePlay">

  <video ref="video" :poster="splash" width="{width}" muted>
    Your browser does not support the video tag.
  </video>

  <a class="play"></a>

  <script>
    // Implement dynamic functionality here
    mounted({ poster = '', videoId }) {
      this.$refs.video.src = `https://video.nuejs.org/${videoId}/play_720p.mp4`;
    }

    // Instance method to toggle play/pause
    togglePlay() {
      const { video } = this
      video.paused ? video.play() : video.pause()
    }
  </script>
</div>
```

In this client-side implementation, the `mounted` lifecycle hook initializes the video source and poster image based on the provided `videoId` and `poster` properties. The `togglePlay` method allows users to play or pause the video by clicking on the player, providing an interactive experience.

By leveraging isomorphic islands, you can create robust, SEO-friendly components that enhance user engagement while ensuring your content remains accessible and indexed by search engines. This approach exemplifies the benefits of combining server-side rendering with client-side interactivity in modern web applications.

## Web components
Web Components serve as a standards-based alternative to interactive islands, suitable for simple interactivity where component-specific HTML does not re-render based on internal state. Instead, they utilize static HTML that is enhanced with JavaScript.

Web Components are the most lightweight option available and do not require loading the nue.js library. Despite their minimal footprint, they adhere to web standards, making them a preferred choice for developers who prioritize efficiency and a "no framework" approach, aiming for the smallest possible code footprint.

### Example: Zen mode
On this website, there is a Zen Mode toggle located at the bottom right corner of the page, implemented as a Web Component. Here’s the HTML markup for the component, expressed in `docs/layout.html`:

```html
<div class="zen-toggle">
  <h5>{ lang.zen_mode }</h5>
  <label class="toggle">
    <input type="checkbox" is="zen-toggle">
  </label>
</div>
```

The implementation of the Web Component is as follows:

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

In this example, the `ZenToggle` component enhances user interaction by allowing users to toggle Zen Mode on and off. When the checkbox is checked, it dynamically updates the HTML element's class to apply a Zen-themed style, demonstrating how Web Components can effectively add interactivity while maintaining a lightweight approach.

### React support?!
Islands provide an ideal framework for incorporating React into the Nue ecosystem. While this may seem counterintuitive due to the significant philosophical differences between the two, there are compelling reasons why this integration makes sense:

1. The islands architecture allows for the introduction of React concepts and its established patterns, such as hooks, into Nue without compromising its foundational principles of progressive enhancement. This means developers can leverage React’s capabilities while maintaining the integrity of the Nue framework.

2. This approach facilitates the gradual implementation of React, enabling developers to simplify their applications and transition from traditional JavaScript monoliths to a more semantic and design-engineering-friendly paradigm. This shift can lead to cleaner, more maintainable codebases that prioritize usability and accessibility.

The potential for this integration is immense, and we’re eager to understand if React support is a feature you would find valuable. Please share your thoughts or vote below, so we can respond accordingly:

[join-list]
