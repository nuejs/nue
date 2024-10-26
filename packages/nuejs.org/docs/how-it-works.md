
# How Nue Works

**Nue** is an ambitious software engineering project designed to not only radically simplify web development but also make it more enjoyable. By embracing [separation of concerns][^se], [progressive enhancement][^pe], Nue offers a cleaner, content-first solution that sets it apart from JavaScript frameworks like **Next.js** and **Astro**.


## Progressive Enhancement

Nue is a Static Site Generator (SSG) built from scratch with a focus on progressive enhancement. In this development model, your content, layout, and styling are strictly separated, allowing you to enhance your content file gradually with other [loosely coupled][^lc] assets. This fundamentally changes how websites are developed:

> IMAGE: 1. Content > 2. Layout > 3. Design > 4. Motion > 5. Optimization
  1. MD: Content hierarchy, Data, Tables, Lists, Code blocks,
  2. HTML: Headers, Footers, Sidebars, Interactive islands
  3. CSS: Colors, Grid, Typography, Cards, Buttons, Forms, ...
  4. CSS & JS: View transitions, @starting-style, Scroll listeners,

  Arrows / Pointers in the image
  - Server-side rendering (SSR)
  - Client-side rendering (CSR)
  - Progressive enhancement (content -> UX)
  - Design system (styling -> motion)


## Content Comes First
With Nue, every page is assembled using a rich Markdown-based syntax specifically tailored for creating interactive websites. This **content-first approach** emphasizes that form follows function, prioritizing content over design and aesthetics to deliver user-friendly products. It enables you to plan your content and information hierarchy upfront, with the confidence that the design can be applied later.

! 3 IMAGES: Technical content | Blog entries | Landing pages
  1. Code blocks, tables, definition lists,
  2. Complex grids, card layouts, bolder typography and imagery. Rich on interactions.
  3. Sits between documentation and marketing. Appealing hero area and ends to CTA.


## Clean, Semantic Markup
Nue generates clean, semantic HTML optimized for accessibility and SEO. Its Markdown parser and components are designed to produce code that’s easy to understand for search engines, AI crawlers, and users with disabilities, ensuring your content is both machine-friendly and user-accessible.

! 3 IMAGES: Content + components -> Custom layout modules -> Accessible, Machine-friendly HTML
  1. Content with mixed components forms the basis for the semantic markup
  2. The page is adjusted with custom layout modules to fit the purpose of the content
  3. The resulting HTML is optimized for accessibility and machine learning


## Islands of Interactivity
[Islands architecture][^islands] promotes small, focused units of interactivity within server-rendered web pages. This approach moves away from monolithic JavaScript patterns towards more modular and decoupled systems. Depending on your needs, Nue allows you to select the most suitable technology for the situation: Web Components, dynamic HTML components, or isomorphic components[^isomorphic].

! 3 IMAGES: Web Components | Reactive islands | Isomorphic islands (show server only)
  1. Web Components for simple interactions with little, or no dynamic markup
  2. Dynamic HTML components for rich interactivity
  3. Isomorphic components for combined SEO and client-side reactivity


## Design Systems and Styling
Modern CSS, with global access to colors and typography, is a natural choice for creating design systems for the Web. You can start with semantic HTML and progressively enhance it using the stylesheets of your choice. This approach eliminates issues such as global namespace conflicts and class naming challenges. Instead, you’ll benefit from an organized design system, consistent styling across your site, and improved performance—all while using a familiar, designer-friendly syntax.

! 3 IMAGES: Design System (Globals) -> Button/components (nesting & selectors) -> Docs (cascade)
  1. CSS is the natural language for building design systems for the Web
  2. CSS nesting improves legibility and reduces the need to name things
  3. CSS cascade makes it a perfect fit for progressive enhancement


## Animation and Motion
Motion and animation are the final, yet crucial, aspects of progressive enhancement. When used subtly, motion can enhance the user experience and strengthen your brand. Nue simplifies the process of adding a global motion layer to your design system.

! CSS: view transitions / @starting styles | IntersectionObserver
  1. Nue has built-in support for CSS customizable view transitions
  2. Modern CSS is a different beast than what it was just a few years ago
  3. JavaScript's event system offers endless ways to trigger animations

## Performance Optimization
Progressive enhancement opens new possibilities for performance optimization:

### Single-file Requests
Single-file requests refer to the practice of serving the essential HTML and CSS in the initial HTTP request. This strategy allows for a fast first contentful paint (FCP) by delivering everything needed for immediate rendering. Subsequent requests for optional JavaScript and other non-critical resources can occur afterward. This approach enhances performance and ensures a smoother user experience, particularly on initial page load.

### Page Weight Optimization
Semantic CSS is highly compact, and the decoupled stylesheets allow you to include only the styles that are actually used. As a result, you get smaller page sizes than with other frameworks. For example, the combined size of this page's markup and styling is smaller than Tailwind's minimal "preflight" CSS.

### Turbolinking
Nue includes built-in support for client-side navigation and view transitions, ensuring that all page switches are fast and smooth. The aim is to enhance user experience (UX), not just performance.

> LINK: See full optimization guide


## Design Engineering

With Nue, you shift from traditional **JavaScript engineering** to **Design Engineering**. This makes a fundamental difference in how you build websites:

1. **Better design and UX**: Instead of constantly solving engineering problems, you’ll direct your energy toward design, usability, accessibility, and SEO. It’s not about wrestling with JavaScript abstractions, but about creating user-centered, aesthetically pleasing, and accessible sites.

2. **Move faster**: No more debugging algorithms, managing data structures, or dealing with type systems. With Nue, you avoid React-specific complexities like hooks, routers, and state entirely. By working closer to web standards, you not only **move faster** but also build products that are easier to maintain and free from the technical debt of sprawling frameworks.

3. **Grow new skills**: With Nue, you don’t just improve your coding skills—you gain proficiency in both **design** and **engineering**. You'll master **design systems**, and modern, standards-based **CSS** and **JavaScript**. This transformation makes you a more versatile developer, capable of building products that excel in both performance and user experience.

By becoming a **design engineer**, you’ll unlock new, creative ways to bring stunning design and seamless motion to the web, surprising your users and peers alike. Nue fosters innovation, bringing the joy and creativity of web development back to the forefront.


> IMAGE: JS monolith engineering --> Design Engineering
  - JS+JS+JS+JS vs Content / Layout (Semantic HTML) / Design (CSS)



## Terminology

[define]
  ### Separation of Concerns
  The principle of keeping content and presentation/enhancement layers distinct to facilitate easier maintenance and scalability.
  [Learn more](https://en.wikipedia.org/wiki/Separation_of_content_and_presentation)

  ### Progressive Enhancement
  A web design strategy that prioritizes core content and functionality, gradually enhancing them with advanced features for capable browsers.
  [Learn more](https://en.wikipedia.org/wiki/Progressive_enhancement)

  ### Monolithic Application
  A monolithic application is a single, tightly coupled codebase that manages all aspects of a system, contrasting with the separation of concerns approach.
  [Learn more](https://en.wikipedia.org/wiki/Monolithic_application)

  ### Coupling
  Tight coupling means components are closely linked, so changes in one component directly affect another. Loose coupling minimizes this impact, allowing changes in one component with minimal effect on others.
  [Learn more](https://en.wikipedia.org/wiki/Coupling_(computer_programming))

  ### Islands Architecture
  A modular design approach that introduces isolated interactive components into an otherwise static web page.
  [Learn more](https://www.patterns.dev/vanilla/islands-architecture/)

  ### Isomorphic Components
  Components that can be rendered both on the server and the client, combining the best of server-side performance and client-side interactivity.
  [Learn more](https://en.wikipedia.org/wiki/Isomorphic_JavaScript)
