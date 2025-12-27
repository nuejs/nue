
# Nue 3.0: The multi-site web framework
Today we're releasing Nue 3.0, a web framework that lets you spin world-class sites quickly without a design/engineering team:

[gallery]

The above sites are working examples, each in a separate domain, generated with the new multi-site architecture. At the core is a **global design system** that every site inherits from. Here's how it works.


## Multi-site development
Nue 3.0 lets you develop multiple sites simultaneously. When you edit a shared file, all inheriting sites update. When you edit a site-specific file, only that site updates:

[img: ls -l // nue serve]
  caption: Your multi-site project directory in development mode.

[video: one browser]
  caption: Edit multiple sites. The browser follows.

[video: multiple browsers]
  caption: Edit multiple sites. Only the matching browser updates.


## Global design system
Each site inherits from a global design system. You build this foundation once and every new site gets it automatically:

[video: edit @base content -> split screen + one mobile]
  caption: Work on multiple designs with the same content

[video: editing CSS with grid-lanes and animation]
  caption: Perfect your grid system in varying contexts

The design system contains everything: typography scales, color systems, spacing rhythms, layout patterns, and components. Sites inherit 90% of the work from this foundation. The remaining 10% is branding and personality.


## AI-assisted content development
When presentation lives in the design system, content becomes the variable. This makes Nue ideal for AI-assisted content generation:

[video: Claude Code editing -> Browser windows updating]
  caption: AI generates content, the design system handles presentation

This shifts how sites get built. What used to require design reviews and engineering handoffs becomes: generate content, inherit polish, ship sites. The focus moves from styling components to content strategy and storytelling.


## Website mass generation
Nue 3.0 builds and deploys sites with speed that changes how you think about publishing:

[console video: nue build showing multiple sites]
  caption: One command builds everything. Only changed files rebuild.

[console video: nue push - teaser]
  caption: One command deploys everything. Push only what changed.

The build system is optimized for multi-site development. Change a shared component and it rebuilds across all inheriting sites. Change site-specific content and only that site rebuilds. Builds stay fast even as your site count grows.


## Why this matters
Think about the sites you admire. Apple. Linear. Stripe. Behind each one sits a team of designers and engineers working full-time to maintain that level of polish. Years of iteration. Millions in payroll.

A global design system gives this polish to everyone.

It's a complete visual system expressed in code, directly accessible to designers, engineers, and AI. No designer-developer handoff. No Figma-to-React complexity. No translation issues.

You build this system once and every new project inherits it automatically. For every new site, 90% of the work is already done. Be it SaaS, agencies, e-commerce, documentation, or blogging.


## Get involved
The framework is production-ready. Create your first multi-site setup now:

```sh
npm install nuekit
nue create multi-site
```

**For CSS professionals:** Use the multi-site starter to build your own global design system.

**Everyone else:** Production-ready templates with Apple/Linear-level polish are coming next. Join the mailing list and we'll notify you when they're available:

[mailing-list]
