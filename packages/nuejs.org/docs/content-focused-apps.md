
# Content-focused applications
Web apps and sites have different goals. Apps handle data and complex logic, often with Rust or WebAssembly, while sites focus on delivering info via Markdown. Nue nails both, powering SPAs, content-driven sites, and MPAs.


## Content first
Nue’s content-focused websites are driven by a unique Markdown dialect, designed to empower non-technical users — marketers, bloggers, and writers — to create and scale content independently. Even the richest of pages, that typically takes thousands of lines of TypeScript/TSX can now be assembled with Markdown-based content.

For example, a developer might define a `[bento-grid]` tag to render a dynamic grid layout. Non-technical users can then use it in Markdown like this:

```md
# Our Features

[bento-grid]
  ### Design
  Systematic and reusable layouts

  ### Performance
  Optimized for speed and scale

  ### Content
  Pure, accessible structure
```

This generates a styled, interactive grid — say, a responsive bento-box layout — without the content creator touching HTML or JavaScript. Developers define the tag once (server-side, client-side, or isomorphic), and it’s reusable across the site. This keeps the architecture lightweight and scalable, from small blogs to extensive documentation hubs, while freeing developers from constant content updates.


## Progressive enhancement
Nue begins with content in its specialized Markdown dialect, delivering a semantic, accessible baseline. From there, it layers enhancements like interactive islands, and motion to create a robust user experience. Each step builds on the content-first foundation, using web standards to keep the process simple and maintainable.


### Layout modules
Layout modules are clean, semantic HTML templates attached to specific "slots" in the page layout. A header module might slot in navigation, while a footer includes a `<join-list/>` custom tag for a mailing list submissions. Defined once and reused across pages, they structure Markdown content consistently without burdening creators with markup.

### Interactive islands
Interactive islands, embedded via custom Markdown tags like `[join-list]`, add dynamic functionality. Defined with Nue’s HTML-based syntax, these components handle user input — such as form submissions — and update the UI. Rendered server-side for SEO and enhanced client-side with a 2.5kb Nue.js script, they integrate seamlessly into the content layer.

### Styling
Styling aligns Markdown-generated HTML with a [design system](design-systems.html), ensuring each content piece reflects established brand guidelines. CSS transforms raw structures — like a `[.grid]` block — into cohesive visuals, maintaining consistency across the site without altering the source content.

### Scripting
In content-heavy sites, JavaScript is optional, unlike in SPAs where it’s central. A global handler might enhance a `[popover]` tag, but the site functions fully without it. This shifts the development model toward simplicity, relying on HTML and CSS for core delivery rather than mandatory scripting.

### Motion & view transitions
Motion enhances the experience through modern CSS, reducing reliance on JavaScript-heavy solutions common in frameworks. Scroll-linked effects via `[.progress]` or view transitions — enabled in `site.yaml` — add fluidity and engagement. These standards-based techniques progressively build on the content-first foundation with minimal overhead.


You’re right — “unify” feels abrupt and doesn’t fully capture the intent. I’ll revise the *Multi-page applications* section to clarify how Nue supports developing both content-focused apps (e.g., docs, blogs, products) and SPAs within the same cohesive environment, choosing the best development model for each task. Here’s the updated version:


## Multi-page applications
Nue enables developers to build content-focused applications — like documentation, blogs, or product pages — alongside single-page applications (SPAs) within a single, cohesive development environment. Each type uses the right model for the job: Markdown-driven simplicity for content apps and logic-focused templates for SPAs. This flexibility ties everything together with a shared design system and seamless navigation.

For example, a site might include a blog and docs as content-focused pages, authored in Markdown, and an SPA dashboard built with HTML templates. Nue’s routing manages transitions across both, enhanced by view transitions defined in CSS, like a smooth scale effect between pages. The shared design system ensures visual consistency, making the site feel integrated without forcing a one-size-fits-all approach.


Fair point — limiting it to React devs narrows the scope unnecessarily. I’ll generalize it to reflect that the standards-first model might be new to developers from various backgrounds. Here’s the updated *Templates* section:


## Templates
This website — featuring rich marketing pages, documentation, and a blog — is built with Nue, showcasing its standards-first approach. For developers used to framework-heavy workflows, this model may feel unfamiliar. We’re crafting templates to ease that transition, spanning the full frontend spectrum: standards-first UI libraries, SPAs, and content-rich MPAs, all integrated with your chosen design system. These templates will highlight what’s achievable with browser-native tools. Join our mailing list to get notified when they’re released.
