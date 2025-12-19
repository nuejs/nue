
# Multi-site development
Multi-site development is the architectural shift from isolated projects to connected systems. Instead of scaffolding separate frameworks for each site, you build one foundation that multiple sites inherit from. This changes how you think about code reuse, design consistency, and project relationships.

The shift matters because most frameworks optimize for single projects. React, Next.js, Astro - they all assume each site is independent. You create a new project, install dependencies, scaffold components, and build in isolation. When you need similar functionality on another site, you copy code or maintain separate repositories. Each project becomes its own maintenance burden.

Nue is different. You build the foundation once in a base directory. Every site that extends this base inherits the complete system. Typography, layout patterns, interactive components, motion design - all shared by default. Sites override only what makes them unique.


## The shared foundation

The foundation lives in a directory called `@base`. This is where you build the global design system, define application patterns, and create everything that sites will inherit from.

Think of it as the 90% that stays the same across all your sites. Typography, layout patterns, components, interactions, motion design. Sites inherit this complete foundation and override only what makes them unique.

Sites declare that they extend this base, creating a chain from base to site.

This chain defines how files are discovered. When a browser requests a file, Nue scans backwards through the chain until it finds a match.

A simple example: `@base` → `acme.com`

When a browser requests a file, Nue looks in this order:
1. Check the site directory first
2. Check the base directory second
3. Return the first match found

This applies to everything. CSS files, layout modules, images, application pages. The browser requests typography styles, and Nue checks the site directory first, then the base directory. The first match gets returned.

Chains can extend multiple layers: `@base` → `startup-template` → `beta.org`

Now files are discovered across three layers. The site can override the template. The template can override the base. Each layer adds specificity while inheriting everything below it.

This scanning makes inheritance practical. You don't declare dependencies or configure module resolution. Files in the inheritance chain are automatically available to sites that extend them.


## Applications as inherited patterns

Applications like blogs and documentation are defined once in the base and inherited by all sites. This means you build the blog structure, styling, and layout modules in `@base/blog/`, and every site gets a working blog automatically.

The base defines the pattern. A blog application might include:
- Layout specific for the blogging app
- Styling for article typography
- Collection configuration for post metadata
- Navigation patterns

Sites that extend the base get all of this. They can override any piece by creating matching file paths in their own directory. Want to alter the blog layout? Create `acme.com/blog/blog.css` that tweaks the styling rules of the layout grid.

This lets you define application patterns once and reuse them across every site. Documentation works the same way. Store catalogs work the same way. Any repeating pattern becomes an application in the base that sites inherit and optionally customize.

The key insight: applications are not isolated features. They're inherited patterns that cascade through your system.


## Design inheritance and overrides

The `@base` directory is your global design system. Sites inherit everything from it and override only what makes them unique.

Most sites inherit 80-90% of their code from the base. A new site might override colors and add a few application-specific styles. That's it. The foundation handles the rest.

This creates consistency without rigidity. Every site uses the same layout primitives and interaction patterns, but each one looks distinct through targeted overrides. The Linear-inspired site defines its purple accent and tight spacing. The Apple-inspired site defines its minimalist typography and generous whitespace. Both inherit the complete foundation.

Overrides work through CSS layers and the inheritance chain. If a site defines `colors.css`, it overrides the base `colors.css` for that site. If it defines `blog/blog.css`, those styles apply only to that site's blog pages. The cascade gives you precise control over what stays global and what becomes site-specific.

The mental model: start with maximum sharing, then override where differentiation matters.


## How this differs from other approaches
Most frameworks treat each site as independent. You scaffold a new project, install packages, copy components from previous work, and maintain everything separately. Code reuse happens through copying or package systems, never through direct inheritance.

Component libraries try to solve this by packaging reusable pieces. You install a library, import components, and customize through props or CSS overrides. But this assumes components are the unit of reuse. In practice, you need to share much more: typography systems, layout patterns, data structures, routing conventions. Component libraries don't provide this.

Monorepos let you share code across projects in one repository. You create shared packages that multiple apps depend on. This works for large teams with complex build systems, but it adds significant tooling overhead. You manage package versions, handle build dependencies, and coordinate releases. For most sites, this complexity isn't justified.

Multi-site development in Nue makes sharing the default. You don't package components or manage dependencies. You don't configure module resolution or set up build pipelines. Files in the base directory are automatically available to sites that extend them. The inheritance chain handles discovery. CSS layers handle styling priority. The system stays simple because sharing is built into the architecture.

The difference in scale: an empty Next.js project created with `npx create-next-app@latest` contains 336 packages, 18,666 files, and 427MB. You install this for each site. Nue is under 500KB with no external dependencies and is shared across all your sites. One installation serves unlimited sites. The effort goes into the inheritance model and developer experience - a versatile HMR system that spans all sites and asset types.


## When this approach makes sense
Multi-site development works best when you're building multiple related sites that share design language and functionality. Agencies managing client work. Teams maintaining marketing sites, documentation, and blogs. Anyone with three or more sites that should feel connected.

It also works for experiments and variations. Regional variants of the same site. A/B testing different messaging. Separate domains for SEO. The base provides consistency while sites diverge in specific ways.

Single sites can use Nue without inheritance. Put everything in one directory with no `@base`. The system works the same way, just without the inheritance chain. This makes sense for standalone projects or when you want complete isolation.

The decision comes down to relationships between your sites. If they share design patterns, content types, or functionality, inheritance makes that sharing explicit and automatic. If they're truly independent, keep them separate.


## The compounding effect
Every improvement to the base improves every site that extends it. Fix a bug in the navigation component and it's fixed everywhere. Add a new layout module and it's available everywhere. Refine the typography system and every site gets better.

This compounds over time. Your second site is easier than your first because the foundation exists. Your tenth site takes a few hours because you're mostly writing content and light overrides. The system gets stronger with each addition.

The alternative is maintaining separate projects that drift apart. You fix the same bug multiple times. You implement the same feature in three places. You spend time keeping things synchronized manually.

Inheritance makes improvement automatic. Build the foundation once, let it compound.

