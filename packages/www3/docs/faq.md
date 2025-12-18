
# FAQ

## How is Nue different from other frameworks?

**Multi-site** - Nue lets you build unlimited sites from one codebase. The architecture is optimized for multi-site development/HMR and mass builds.

**Global design system** - Design, layout, and interactivity are inherited from a shared foundation. New sites can be created through minimal coding because 80% is already done.

**Content-first** - AI generates content, your design system handles presentation. Development boils down to Markdown. The focus is on content, strategy and story. The actual business value.

**Web standards** - Nue builds on HTML, CSS, and JavaScript with minimal abstractions. Your skills compound and they last forever.

**Minimalism** - Nue is extremely slim and fast. Under 500KB with zero dependencies. One installation serves unlimited sites instead of 300MB+ per one site. Less complexity, less debugging, fewer problems.


## Can Nue work with databases and headless CMS?

Yes, it's possible ([see configuration](#)), but file-based content is Nue's natural workflow.

**Content accessibility** - When all content lives in markdown and YAML files, you can see everything at once. This makes it easier to strategize, plan information architecture, and let AI help generate and organize content at scale. Headless CMS hides content behind APIs and admin interfaces.

**Design workflow** - Building world-class design requires working directly with real content. File-based content means designers and developers work with actual text, images, and structure - not placeholder Lorem ipsum or API mocks. The design system responds to real content from day one.

Headless CMS makes sense for user-generated content or complex apps. But for marketing sites, documentation, blogs, and content networks, direct file access is simpler, faster, and produces better design outcomes.



## How do I migrate from another framework?

Start with content, add design later.

**Content first** - Convert your pages to markdown and your data to YAML. These are simple formats that AI can help generate. Your content works immediately with Nue's inheritance system.

**Design second** - Build your global design system after content is working. Start with typography and color, then add layout patterns and components. Or wait for Nue's template library and design systems to launch, which will give you production-ready foundations to extend.

The key difference: you're not converting components one by one. You're organizing content into layers that inherit from a shared design foundation.



## What about CSS-in-JS and Tailwind?

**Multi-site** - Inline/scoped styles can't be shared. Multi-site development is impossible.

**Global design system** - Tailwind is the polar opposite: a local design system.

**Content-first** - The React ecosystem is component-first, not content-first.

**Web standards** - Proprietary abstractions, not CSS.

**Minimalism** - 300-400MB stack vs 500KB.

If you're building one site, they're good and you can move fast. If you're building more sites, they slow you down.



## What about single-page apps?

SPAs are possible. Here's a complex app built with Nuestate and a design system:

[IMAGE + LINK]

What's remarkable is that this app is smaller than a single React/ShadCN button.

There's more. Here's a Rust/WASM version handling 150k rows in memory:

[RUST VERSION]

What you see here is a glimpse of what's coming after we perfect websites. The goal is to make SPA development mimic the website development flow and optimize it for AI generators - which would operate purely with YAML while the design system takes care of the rest.

