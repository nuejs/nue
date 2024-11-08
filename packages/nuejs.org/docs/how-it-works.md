
# Understanding Nue
**Nue** is an ambitious engineering project designed to simplify web development through **separation of concerns** and **progressive enhancement**. These principles set it apart from monolithic JavaScript frameworks like **Next.js** and **Astro**.

## Progressive enhancement
Nue is a carefully crafted Static Site Generator (SSG) built from the ground up to support progressive enhancement. By separating content, layout, and styling, it enables gradual enhancement using loosely coupled assets. This approach fundamentally redefines how websites are developed:

[image]
  small: /img/progressive-enhancement.png
  large: /img/progressive-enhancement-big.png
  width: 700 x 187


## Content first
With Nue, each page is built using an extended Markdown syntax designed for interactive websites. Whether it’s marketing, technical documentation, or blogging content, everything is directly editable:

[image.bordered]
  caption: Nue's extended Markdown syntax handles all varieties of content
  small: /img/content-files.png
  large: /img/content-files-big.png
  size: 745 × 383

This **content-first approach** offers several advantages:

1. **Easy Content Management**: Clean, isolated content is directly accessible to **marketers, content creators**, and **strategists**—no longer buried within a JavaScript monolith.

2. **Better Design**: A clear understanding of your content and information architecture allows for more thoughtful design planning, ensuring functionality drives the process, with design applied later.

3. **AI-Friendly**: Markdown format enhances collaboration with AI tools, allowing easy copy/paste for grammar, strategy, and storytelling support.


## Clean markup
Nue generates clean, semantic HTML optimized for accessibility and SEO. Its Markdown parser and components are designed to produce code that is easy to understand for search engines, AI crawlers, and users with disabilities, ensuring your content is both machine-friendly and user-accessible.

[image.bordered]
  caption: "The markup of this documentation area"
  large: /img/clean-markup-big.png
  small: /img/clean-markup.png
  size: 648 × 512



## Interactive islands
**Islands architecture** promotes small, focused units of interactivity within server-rendered web pages, further distancing you from tightly coupled architectures. Nue allows you to choose the best-fit technology for each interactive element: an interactive island, an isomorphic island, or a vanilla web component.


[image.bordered]
  caption: Reactive contact form and an isomorphic video component.
  large: /img/island-files-big.png
  small: /img/island-files.png
  size: 745 × 380



## Styling
Nue separates styling from your JavaScript files, allowing you to leverage the full power of modern CSS and its global nature. This lets you build a centralized system that maintains consistent styling across your site without namespace conflicts.

[image.bordered]
  caption: Decoupled CSS forms a centralized design system
  large: /img/styling-files-big.png
  small: /img/styling-files.png
  size: 745 × 403

[.note]
  ### Note
  In addition to its clean, designer-friendly syntax, a major benefit of vanilla CSS is that, as a web standard, it helps you create timeless products and build skills that remain relevant in the ever-changing world of web development.



## Motion
Motion is the final optional step in progressive enhancement. Subtle microinteractions, like enter animations, view transitions, and scroll-triggered transitions, can improve user experience and strengthen your brand identity. Nue’s built-in support for view transitions, combined with the strengths of modern CSS, gives you new creative options to work with:

```css
/* setup hero image to morph between page switches */
.hero-image {
  view-transition-name: active-image;
}

/* adjust morph duration */
::view-transition-group(active-image) {
  animation-duration: .4s;
}
```


## Performance optimization

Progressive enhancement opens new opportunities for performance improvement:

- **CSS Inlining**: Achieve immediate first contentful paint (FCP) with a single request that includes everything needed to render the page.

- **View Transitions**: Enjoy fast and smooth page switches with built-in support for turbolinking and view transitions.

- **Page Weight**: Achieve significantly smaller footprints with a carefully crafted design system. For example, the CSS for this entire page is smaller than Tailwind's basic "preflight" CSS.



## Design engineering
With Nue, you shift from **JavaScript engineering** to **Design Engineering**, fundamentally changing the way you build websites:

[image.bordered]
  caption: Compare JavaScript engineering to Design Engineering
  popovertarget: compare-dialog
  large: /img/js-vs-design-big.png
  small: /img/js-vs-design.png
  size: 745 × 403


1. **Better design and UX**: Instead of tackling engineering-specific problems, you’ll focus your efforts on **design, usability, accessibility**, and **SEO**.

2. **Move faster**: Progressive enhancement leads to smaller, cleaner, standards-based code that’s easier to work with. No more debugging algorithms, hooks, or complex state management.

3. **Better use of talent**: Designers can focus on design, content specialists on content, and **design engineers** on UX. This makes happier, more effective teams where everyone focuses on their strengths.

4. **Grow new skills**: Learn **design systems**, **modern CSS**, **motion design**, and standards-based **JavaScript** to make web development fun and creative (again).

5. **Stay competitive** It's wise to stick with web standards, as this benefits your skills and career. Plus, the products you create will be more durable over time.

- - -

### Terminology
Key terms mentioned in this article:

[define]
  ### Separation of Concerns
  The principle of keeping content and presentation/enhancement layers distinct to facilitate easier maintenance and scalability.
  [Wikipedia](//en.wikipedia.org/wiki/Separation_of_content_and_presentation)

  ### Progressive Enhancement
  A web design strategy that prioritizes core content and functionality, gradually enhancing them with advanced features for capable browsers.
  [Wikipedia](//en.wikipedia.org/wiki/Progressive_enhancement)

  ### JavaScript monolith
  JavaScript bundles that pack numerous features into a single file, often leading to complexity, reduced clarity, and maintenance challenges.
  [Wikipedia](//en.wikipedia.org/wiki/Monolithic_application)

  ### Loose coupling
  Loose coupling minimizes dependencies between components, allowing changes in one component with minimal impact on others. It's the opposite of tight coupling.
  [Wikipedia](//en.wikipedia.org/wiki/Coupling_(computer_programming))

  ### Islands Architecture
  A modular design approach that introduces isolated interactive components into an otherwise static web page.
  [Patterns.dev](//www.patterns.dev/vanilla/islands-architecture/)

  ### Isomorphic Components
  Components that can be rendered both on the server and the client, combining the best of server-side performance and client-side interactivity.
  [Wikipedia](//en.wikipedia.org/wiki/Isomorphic_JavaScript)

