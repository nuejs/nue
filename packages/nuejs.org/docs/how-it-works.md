
# How Nue works

**Nue** is an ambitious software engineering project designed to radically simplify web development through **separation of concerns** and **progressive enhancement**. These principles set it apart from monolithic JavaScript frameworks like **Next.js** and **Astro**.

## Progressive enhancement

Nue is a Static Site Generator (SSG) built from scratch with progressive enhancement at its core. By strictly separating content, layout, and styling, it allows for gradual enhancement using **loosely coupled** assets. This approach fundamentally redefines how websites are developed:


[image]
  small: /img/progressive-enhancement.png
  large: /img/progressive-enhancement-big.png
  width: 700 x 139


## Content first
With Nue, each page is built using an extended Markdown syntax designed specifically for interactive websites. Whether it’s marketing, technical documentation, or blogging content, everything is directly editable:

[image]
  alt: direct editing of marketing, technical, and blogging content

This **content-first approach** offers several advantages:

1. **Easy Content Management**: Clean, isolated content is directly accessible to **marketers, content creators**, and **strategists**—no longer buried and inaccessible within a JavaScript monolith.

2. **Better Design**: A clear understanding of your content and information architecture allows for more thoughtful design planning, ensuring functionality drives the process, with design applied later.

3. **AI-Friendly**: Markdown format enhances collaboration with AI tools, allowing easy copy/paste for grammar, strategy, and storytelling support.



## Clean, crawler-friendly markup
Nue generates clean, semantic HTML optimized for accessibility and SEO. Its Markdown parser and components are designed to produce code that is easy to understand for search engines, AI crawlers, and users with disabilities, ensuring your content is both machine-friendly and user-accessible.


[image]
  caption: Md extensions -> Layout Modules -> Semantic HTML



## Interactive islands
**Islands architecture** encourages small, focused units of interactivity within server-rendered web pages, moving from tightly coupled structures to a more modular, decoupled system. This approach lets you select the best-fit technology for each interactive element: interactive islands, isomorphic islands, or Web Components, depending on the task at hand.


! 3 IMAGES: Web Components | Reactive islands | Isomorphic islands (show server only)
  1. Web Components for simple interactions with little, or no dynamic markup
  2. Dynamic HTML components for rich interactivity
  3. Isomorphic components for combined SEO and client-side reactivity

With Nue, you can build more flexible, performant pages where each component operates independently yet cohesively within the overall design.



## Styling
CSS is the natural choice for creating design systems on the web. With global access to colors and typography, you’ll benefit from an organized design system and consistent styling across your site, all within a familiar, designer-friendly syntax:

[images]
  1. Variables (desing tokens)
  2. Global layout (nesting)
  3. Elements (modularity)

Semantic HTML, minimal use of class names, and selective use of stylesheets eliminate global namespace conflicts and the constant need to name things, resulting in a more maintainable, scalable design system.


## Motion
Motion and animation are optional, yet important, aspects of progressive enhancement. When used subtly, motion can enhance the user experience and strengthen your brand. Nue simplifies the process of adding a global motion layer to your design system.

! CSS: view transitions / @starting styles | IntersectionObserver
  1. Nue has built-in support for CSS customizable view transitions
  2. Modern CSS is a different beast than what it was just a few years ago
  3. JavaScript's event system offers endless ways to trigger animations


## Performance optimization
Progressive enhancement opens new possibilities for performance optimization:

### Single-file Requests
Single-file requests refer to the practice of serving the essential HTML and CSS in the initial HTTP request. This strategy allows for a fast first contentful paint (FCP) by delivering everything needed for immediate rendering.

### View transitions
Nue includes built-in support for turbolinking and view transitions, ensuring that all page switches are fast and smooth. The aim is to enhance user experience (UX), not just performance.

### Page Weight
Carefully crafted CSS keeps file sizes minimal. For instance, the CSS for this entire page is smaller than Tailwind's basic "preflight" CSS.


[Learn more](optimization.html)


## Design engineering

With Nue, you shift from **JavaScript engineering** to **Design Engineering**, fundamentally changing the way you build websites:

[image]
  caption: Compare JavaScript engineering to Design Engineering
  popovertarget: compare-dialog

1. **Better design and UX**: Instead of tackling engineering-specific problems, you’ll focus your efforts on **design, usability, accessibility**, and **SEO**.

2. **Move faster**: Progressive enhancement leads to smaller, cleaner, standards-based code that’s easier to work with. No more debugging algorithms, hooks, or complex state management.

3. **Better use of talent**: Designers can focus on design, content specialists on content, and **design engineers** on UX. This makes happier, more effective teams where everyone focuses on their strengths.

4. **Grow new skills**: With Nue, you’ll develop expertise in both **design** and **engineering**. You’ll master **design systems**, modern **CSS**, and standards-based **JavaScript**—bringing back the joy and creativity of web development.



## Terminology

[define]
  ### Separation of Concerns { #se }
  The principle of keeping content and presentation/enhancement layers distinct to facilitate easier maintenance and scalability.

  [Learn more](https://en.wikipedia.org/wiki/Separation_of_content_and_presentation)

  ### Progressive Enhancement { #pe }
  A web design strategy that prioritizes core content and functionality, gradually enhancing them with advanced features for capable browsers.

  [Learn more](https://en.wikipedia.org/wiki/Progressive_enhancement)

  ### Monolithic Architecture { #ma }
  A monolithic application is a single, tightly coupled codebase that manages all aspects of a system, contrasting with the separation of concerns approach.

  [Learn more](https://en.wikipedia.org/wiki/Monolithic_application)

  ### Loose coupling { #lc }
  Loose coupling minimizes dependencies between components, allowing changes in one component with minimal impact on others. It's the opposite of tight coupling.

  [Learn more](https://en.wikipedia.org/wiki/Coupling_(computer_programming))

  ### Islands Architecture { #islands }
  A modular design approach that introduces isolated interactive components into an otherwise static web page.
  [Learn more](https://www.patterns.dev/vanilla/islands-architecture/)

  ### Isomorphic Components { #isomorphic }
  Components that can be rendered both on the server and the client, combining the best of server-side performance and client-side interactivity.
  [Learn more](https://en.wikipedia.org/wiki/Isomorphic_JavaScript)
