
# How Nue works

**Nue** is an ambitious software engineering project designed to radically simplify web development and make it more enjoyable. By fully embracing [separation of concerns][^se] and [progressive enhancement][^pe], Nue delivers a cleaner, content-first solution. This approach minimizes JavaScript dependency and maximizes maintainability, setting it apart from JavaScript frameworks like **Next.js** and **Astro**, which rely on monolithic architectures.


## Progressive enhancement
Nue is a Static Site Generator (SSG) built from scratch with a focus on progressive enhancement. In this model, content, layout, and styling are strictly separated, allowing gradual enhancement with **loosely coupled**[^lc] assets. Minimizing JavaScript ensures projects remain fast, lightweight, and adaptable, while still supporting interactivity where needed. This approach fundamentally changes how websites are developed:

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


## Content first

With Nue, every page is assembled using a rich Markdown-based syntax tailored for interactive websites. This **content-first approach** focuses on two key benefits:

1. **Content over design and aesthetics**: Prioritize your messaging and structure first, ensuring that functionality leads the way, with design applied later.

2. **Content for content people**: Content is decoupled from design, allowing **marketers, content creators**, and **strategists** to update and develop new content without it being buried behind a JavaScript monolith. This flexibility enhances narrative planning, while AI tools can further refine storytelling and content strategy.



## Clean, semantic markup
Nue generates clean, semantic HTML optimized for accessibility and SEO. Its Markdown parser and components are designed to produce code that’s easy to understand for search engines, AI crawlers, and users with disabilities, ensuring your content is both machine-friendly and user-accessible.

! 3 IMAGES: Content + components -> Custom layout modules -> Accessible, Machine-friendly HTML
  1. Content with mixed components forms the basis for the semantic markup
  2. The page is adjusted with custom layout modules to fit the purpose of the content
  3. The resulting HTML is optimized for accessibility and machine learning


## Islands of interactivity
[Islands architecture][^islands] promotes small, focused units of interactivity within server-rendered web pages. This approach moves away from monolithic JavaScript patterns towards more modular and decoupled systems. Depending on your needs, Nue allows you to select the most suitable technology for the situation: Web Components, dynamic HTML components, or isomorphic components[^isomorphic].

! 3 IMAGES: Web Components | Reactive islands | Isomorphic islands (show server only)
  1. Web Components for simple interactions with little, or no dynamic markup
  2. Dynamic HTML components for rich interactivity
  3. Isomorphic components for combined SEO and client-side reactivity


## Design systems and styling
Modern CSS, with a global access to colors and typography, is a natural choice for creating design systems for the Web. You can start with semantic HTML and progressively enhance it using the stylesheets of your choice. This approach eliminates issues such as global namespace conflicts and class naming challenges. Instead, you’ll benefit from an organized design system, consistent styling across your site, and improved performance—all while using a familiar, designer-friendly syntax.


! 3 IMAGES: Design System (Globals) -> Button/components (nesting & selectors) -> Docs (cascade)
  1. CSS is the natural language for building design systems for the Web
  2. CSS nesting improves legibility and reduces the need to name things
  3. CSS cascade makes it a perfect fit for progressive enhancement


## Animation and motion
Motion and animation are the final, yet crucial, aspects of progressive enhancement. When used subtly, motion can enhance the user experience and strengthen your brand. Nue simplifies the process of adding a global motion layer to your design system.

! CSS: view transitions / @starting styles | IntersectionObserver
  1. Nue has built-in support for CSS customizable view transitions
  2. Modern CSS is a different beast than what it was just a few years ago
  3. JavaScript's event system offers endless ways to trigger animations

## Performance optimization
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


2. **Move faster**: No more debugging algorithms or managing complex state. With Nue, you avoid React-specific complexities like hooks, routers, and state entirely. By working closer to **web standards**, you not only **move faster** but also build products that are leaner and easier to maintain. **Separation of concerns** ensures cleaner collaboration, while **progressive enhancement** means fewer dependencies and more flexibility.

1. **Better design and UX**: Instead of constantly solving engineering problems, you’ll direct your energy toward **design, usability, accessibility**, and **SEO**. It’s not about wrestling with JavaScript abstractions, but about creating user-centered, aesthetically pleasing, and accessible sites.

3. **Easier updates**: Global design changes become simple central updates to CSS, not massive overhauls of JavaScript code. By isolating content, layout, and design, you can iterate quickly and scale your project without fear of breaking things.

4. **Better use of talent**: Designers focus on design, content professionals handle content, and **design engineers** ensure a seamless UX. This clear separation of roles leads to more professional workflows and easier recruitment, as teams can focus on their strengths.

5. **Grow new skills**: With Nue, you don’t just improve your coding skills—you gain proficiency in both **design** and **engineering**. You'll master **design systems**, modern **CSS**, and standards-based **JavaScript**, making you a more versatile developer capable of building products that excel in both performance and user experience.

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
