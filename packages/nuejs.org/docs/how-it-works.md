
# How Nue works
**Nue** is an ambitious software engineering project aimed at radically simplifying web development through the use of the [separation of concerns][^se] and [progressive enhancement][^pe] design patterns. Here’s how Nue functions and how it differentiates itself from JavaScript frameworks like **Next.js** and **Astro**.


## Progressive Enhancement
Nue is a Static Site Generator (SSG) built from scratch with a focus on progressive enhancement. In this development model, your content, layout, and styling are strictly separated, allowing you to enhance your content file gradually with other [loosely coupled][^lc] assets. This fundamentally changes how websites are developed:

> ! Content > Layout > Islands > Styling > View transitions > Motion > Optimizations > Website
  Server-side rendering (SSR).
  Client-side rendering (CSR )
  Progressive enhancement (content -> UX)
  Design system (styling --> motion)
  Decoupled assets: .md / .html / .dhtml / .css / .js


## Content Comes First
With Nue, every page is assembled using a rich Markdown-based syntax specifically tailored for creating interactive websites. This **content-first approach** emphasizes that form follows function, prioritizing content over design and aesthetics to deliver user-friendly products. It enables you to plan your content and information hierarchy upfront, with the confidence that the design can be applied later.

! Technical content | Blog entries | Landing pages
  1. Code blocks, tables, definition lists,
  2. Complex grids, card layouts, bolder typography and imaginery. Rich on interactions.
  3. Sits between documentation and marketing. Appealing hero area and ends to CTA.


## Clean, Semantic Markup
Nue generates clean, semantic HTML optimized for accessibility and SEO. Its Markdown parser and components are designed to produce code that’s easy to understand for search engines, AI crawlers, and users with disabilities, ensuring your content is both machine-friendly and user-accessible.

! Content + components -> Custom layout modules -> Accessible, Machine-friendly HTML
  1. Content with mixed components forms the basis for the semantic markup
  2. Tha page is adjusted with custom layout modules to fit the purpose of the content
  3. The resulting HTML is optimized for accessibility and machine learning


## Islands of Interactivity
[Islands architecture][^islands] promotes small, focused units of interactivity within server-rendered web pages. This approach moves away from monolithic JavaScript patterns towards more modular and decoupled systems. Depending on your needs, Nue allows you to select the most suitable technology for the situation: Web Components, dynamic HTML components, or isomorphic components.

! Web Components | Reactive islands | Isomorphitc islands (show server only)
  1. Web Components for simple interactions with little, or no dynamic markup
  2. Dynamic HTML components for rich interactivity
  3. Isomorphic components for combined SEO and client-side reactivity

## Design Systems and Styling
Modern CSS, with a global access to colors and typography, is a natural choice for creating design systems for the Web. You can start with semantic HTML and progressively enhance it using the stylesheets of your choice. This approach eliminates issues such as  global namespace conflicts and class naming challenges. Instead, you’ll benefit from an organized design system, consistent styling across your site, and improved performance—all while using a familiar, designer-friendly syntax.

! Design System (Globals) -> Button/components (nesting & selectors) -> Docs (cascade)
  1. CSS is the natural language for building design systems for the Web
  2. CSS nesting improves legibility and reduces the need to name things
  3. CSS cascade makes is a perfect fit for progressive enhancement


## Animation and Motion
Motion and animation are the final, yet crucial, aspects of progressive enhancement. When used subtly, motion can enhance the user experience and strengthen your brand. Nue simplifies the process of adding a global motion layer to your design system.

! CSS: view transitions / @starting styles | IntersectionObserver
  1. Nue has a built-in support for CSS customizable view transitions
  2. Modern CSS is a different beast than what it was just few years ago
  3. JavaScript's event system offer endless ways to trigger animations


## Performance Optimization
Progressive enhancement opens new possibilities to performance optimization:

1. **Single-file requests.** Nue enables you to serve your pages as a single, compact package that includes everything needed to render the page. This approach is unmatched in speeding up page load times.

2. **Page weight optimization.** Semantic CSS is highly compact, and the decoupled stylesheets allow you to include only the styles that are actually used. As a result, you get smaller page sizes than with other frameworks. For example, the combined size of this page's markup and styling is smaller than Tailwind's minimal "preflight" CSS.

3. **Turbolinking.**: Nue includes built-in support for client-side navigation and view transitions, ensuring that all page switches are fast and smooth. The aim is to enhance user experience (UX), not just performance.


## UX Development
Nue stands in stark contrast to monolithic JavaScript frameworks like Next.js and Astro, where all assets are [tightly coupled][^coupling]. This difference significantly impacts how you develop websites.

! JS monolith engineering --> UX development
  JS+JS+JS+JS vs Content / Layout (Semantic HTML) / Design (CSS)

With Nue, you shift from JavaScript engineering to design engineering. Instead of relying solely on JavaScript for all web development tasks, your focus shifts to content, design, and user experience. You spend less time debugging algorithms, data structures, and type systems, and more time addressing topics like design systems, accessibility, and SEO.

This shift allows you to concentrate on the problems, needs, and desires of users, ultimately transforming you into a UX developer.




## Terminology
Summary of terms used in this document

[define]
  ### Separation of Concerns:**
  The principle of keeping content and presentation/enhancement layers distinct to facilitate easier maintenance and scalability.
  [Learn more](https://en.wikipedia.org/wiki/Separation_of_content_and_presentation)

  ### Progressive Enhancement:**
  A web design strategy that prioritizes core content and functionality, gradually enhancing them with advanced features for capable browsers.
  [Learn more](https://en.wikipedia.org/wiki/Progressive_enhancement)

  ### Monolithic Application:**
  A monolithic application is a single, tightly coupled codebase that manages all aspects of a system. It lacks scalability, elasticity, and fault tolerance, which contrasts with the separation of concerns approach.
  [Learn more](https://en.wikipedia.org/wiki/Monolithic_application)

  ### Coupling:**
  Tight coupling means components are closely linked, so changes in one component directly affect another. Loose coupling minimizes this impact, allowing changes in one component with minimal effect on others.
  [Learn more](https://en.wikipedia.org/wiki/Coupling_(computer_programming))

  ### Islands Architecture:**
  A modular design approach that introduces isolated interactive components into an otherwise static web page.
  [Learn more](https://www.patterns.dev/vanilla/islands-architecture/)






