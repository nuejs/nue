
# FAQ

## How is Nue different from other frameworks?

**Multi-site development** - Nue is optimized for multi-site HMR and mass builds. You work on twenty sites as easily as you work on one site.

**Design engineering at scale** - One global design system serves all sites. New sites are 90% done before you write a line of code.

**AI-native content workflow** - AI generates content, your design system handles presentation. The focus shifts to content, strategy, story. The actual business value.


## How do I benefit as a designer/engineer?

**Minimal stack** - You install once (under 500KB, zero dependencies) and it serves unlimited sites. Builds are fast, deploys are fast, pages load fast. When there's less code, less breaks. When there's less complexity, you spend less time debugging.

**Separation of concerns** - Content lives in Markdown files. Design lives in CSS files. Interactions live in JavaScript files. Each concern scales independently without stepping on the others. No coordination overhead, no merge conflicts.

**Web standards** - HTML for structure, CSS for design, JavaScript for interaction. The skills you build today will still be valuable in ten years. They won't become obsolete when the next framework arrives.



## What about CSS-in-JS and Tailwind?
CSS-in-JS solved the global namespace problem. Tailwind solved co-location and organization. Both achieved this by scoping styles locally to components.

Nue solves a completely different problem. It's a global design system, not a local one. It's a shift from JavaScript component development to CSS/design engineering. You're building a system that serves unlimited sites instead of styling individual components.

The problems shift from engineering to design. Instead of worrying about component namespace collisions, you think about design system terminology. Instead of co-locating styles with individual components, you organize your entire visual language: typography scales, color systems, spacing rhythms, layout patterns. Instead of styling one button at a time, you define how all buttons work across all sites.

When you work at the system level instead of the component level, entire categories of problems disappear. Instead, you begin to understand the benefits of multi-site development and AI-driven content workflows.




## How do I migrate from another framework?

Start with content, add design later.

**Content first** - Convert your pages to markdown and your data to YAML. These are simple formats that AI can help generate. Your content works immediately with Nue's inheritance system.

**Design second** - Build your global design system after content is working. Start with typography and color, then add layout patterns and components. Or wait for Nue's template library and design systems to launch, which will give you production-ready foundations to extend.

The key difference: you're not converting components one by one. You're organizing content into layers that inherit from a shared design foundation.




## Can Nue work with databases and headless CMS?

Yes, it's possible ([see configuration](#)), but file-based content is Nue's natural workflow.

**Content accessibility** - When all content lives in markdown and YAML files, you can see everything at once. This makes it easier to strategize, plan information architecture, and let AI help generate and organize content at scale. Headless CMS hides content behind APIs and admin interfaces.

**Design workflow** - Building world-class design requires working directly with real content. File-based content means designers and developers work with actual text, images, and structure - not placeholder Lorem ipsum or API mocks. The design system responds to real content from day one.

Headless CMS makes sense for user-generated content or complex apps. But for marketing sites, documentation, blogs, and content networks, direct file access is simpler, faster, and produces better design outcomes.










## What about single-page apps?

SPAs are possible. Here's a complex app built with Nuestate and a design system:

[IMAGE + LINK]

What's remarkable is that this app is smaller than a single React/ShadCN button.

There's more. Here's a Rust/WASM version handling 150k rows in memory:

[RUST VERSION]

What you see here is a glimpse of what's coming after we perfect websites. The goal is to make SPA development mimic the website development flow and optimize it for AI generators - which would operate purely with YAML while the design system takes care of the rest.

