
# Content-first development
Content-first development is the shift from building components to authoring structured content. The design system handles presentation automatically, so you focus on what actually matters: the content, the message, the strategy.

Most frameworks force you to think about UI first. Nue does the reverse: content structure dictates the UI.


## The component-first problem
React and component frameworks bury content inside code. A marketing page becomes a tree of JSX components with content scattered across props, children, and conditional renders. Want to update a headline? You're editing JavaScript. Want to reorder sections? You're refactoring component structure. Content maintenance becomes an engineering problem.

The complexity scales with page complexity. Simple pages might manage content reasonably, but rich marketing pages with multiple sections, feature grids, testimonials, and CTAs become tangled webs where content and presentation logic intertwine. Every content change risks breaking something. Content that should be easily editable gets locked inside component hierarchies.

This creates a bottleneck. Marketing teams can't update content without developers. A/B testing requires code changes. Trying different messaging means deploying new builds. The architecture optimizes for developers building UI, not for teams creating and iterating on content.


## The content-first approach
With Nue, content is the input. Even rich, visually complex pages are authored as structured content files. The design system responds to this structure automatically through CSS.

Authors control hierarchy, meaning, and organization. The presentation layer adapts. Content stays accessible in editable files, not buried in code.

This inversion changes the development flow. You start with content. Structure it semantically. The design system knows how to present every content structure. There's no component tree to maintain, no props to thread through layers, no presentation logic mixed with content.



## Content inheritance
In Nue content flows through the inheritance chain like design does. Entire documentation sites can be inherited from `@base`. Placeholder content for template previews. Complete blog structures with example posts. Sites that extend the base get full content areas automatically, displayed through their own design system.

Localization becomes trivial. A French site inherits the complete English content structure from `@base`, then overrides specific markdown files with French translations. The information architecture, navigation, and design stay consistent. Only the content language changes.

The practical impact: your tenth site takes hours to launch because the content foundation already exists. Documentation hierarchies, example blog posts, about pages, placeholder galleries. Sites inherit what makes sense and override what makes them unique. Content reuse becomes architectural rather than manual copying.



## Information architecture as data
When site structure and navigation are defined in YAML files, you can transform `@base` into a startup site, blog, documentation, or personal profile. Same foundation, different information architectures.

Navigation menus, content collections, application structure all live in editable data files. Change the information architecture and the site restructures. The content and design stay consistent while the organization adapts.

This separation matters because information architecture changes more frequently than content or design. You reorganize documentation sections. You adjust navigation hierarchies. You restructure product catalogs. When IA lives in data files, these changes don't touch content files or design systems. Edit YAML, rebuild, done.



## The AI workflow
This architecture is ideal for AI-assisted development. AI can mass-generate professional content because the structure is explicit and presentation is handled separately. You focus on messaging, strategy, variations. Testing different angles. The system ensures consistent quality.

AI works directly with your content files. It can edit YAML data, rewrite Markdown sections, restructure pages. The content isn't locked inside components. It's in structured formats AI can read and modify naturally. Point AI at your content directory and it understands the structure immediately.

This enables workflows that component frameworks can't support. Generate twenty landing page variations to test messaging. Create localized versions of your documentation. Produce entire content sections from outlines. The AI operates purely with content files while your design system handles consistent presentation.



