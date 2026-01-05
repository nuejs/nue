
# FAQ

## How is Nue different?
Nue is a web framework built around a site-wide inheritance model. It gives you:

**Multi-site development** - Nue is optimized for multi-site HMR and mass builds. You work on twenty sites as easily as you work on one site.

**Global design systems** - One design system to serve all your sites. New sites are 90% done before you write a line of code.

**AI-native content workflow** - AI generates content, your design system handles presentation. The focus shifts to content, strategy, and story.


## How do I benefit as a developer?

**Minimal stack** - You install once (under 500KB, zero dependencies) and it serves unlimited sites. Builds are fast, deploys are fast, pages load fast. Less code means less issues, less complexity, less debugging.

**Web standards** - HTML for structure, CSS for design, JavaScript for interaction. The skills you build today will still be valuable in ten years. They won't become obsolete when the next framework arrives.

**Content first** - When a design system handles presentation you can focus on storytelling. Less time debugging JavaScript, more time on business value.



## What about CSS-in-JS and Tailwind?
CSS-in-JS solved the global namespace problem. Tailwind solved co-location and organization. Both achieved this by scoping styles locally to components.

Nue solves a completely different problem.

The problem shifts from engineering to design: you're building a **global design system** that serves unlimited sites, not styling individual components. It's a shift from a component mindset to systematic CSS/design engineering.

You're no longer worrying about namespace collisions; you're strategizing layers and components in your design system. You're not styling one button at a time; you're defining how all buttons work across all sites.

When you work at the system level, not the component level, entire categories of problems disappear. You start optimizing for multi-site development and AI-driven content workflows. You can move faster because for every new site 90% is already done.


## How about React?
React's component model couples structure, logic and styling together. This works well for individual components but makes multi-site development impossible. Every site must start from scratch.

Nue's inheritance model does the opposite: sites inherit from `@base` and override only what makes them unique. The result:

- Smaller codebases (most code lives in the shared system)
- Smaller output (no runtime, less abstraction overhead)
- Faster builds (sub-second per site)

The tradeoff: React has a massive ecosystem. Nue requires comfort with vanilla CSS and HTML-first thinking.

