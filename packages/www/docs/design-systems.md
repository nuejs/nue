
# Design systems
Web design used to be its own discipline. Designers controlled visual language through CSS, creating cohesive experiences across entire sites. Today, design has been absorbed into the JavaScript ecosystem - scattered across components, utility classes, and framework abstractions. Nue enables you to build and maintain a real system with modern CSS.


## The problem we created
For 15 years we've been writing CSS to survive in chaos. We use BEM because we gave up on the cascade. We use CSS-in-JS because we're scared of namespace collisions. We write utility classes because we stopped trusting our ability to name things. We compile, process, and transform CSS because we think native CSS isn't enough.

These practices assume CSS is broken and needs fixing. They're defensive strategies. They're about working around the language rather than harnessing its potential.

## A modern CSS design system
A design system isn't a component library or a utility framework. It's a visual language expressed through CSS. Modern CSS gives us everything we need: variables, nesting, container queries, layers, and scope. Here's what makes a real design system:

### Cascading
A design system is built in layers that inherit and can be swapped. Start with the raw basis - typography, colors, spacing. Add a design philosophy layer - Miesian minimalism focusing on content first, or Ramsian principles putting human needs first. Then add expression - brand-specific styling and personality.

Visual CSS, layout CSS, and components should be separate concerns. This separation enables inheritance and swapping. Change the philosophy layer and watch it cascade through every component. Swap the expression layer for a complete rebrand without touching structure.

### Semantic
HTML already contains a rich design vocabulary. Lists, tables, forms, buttons, navigation - they all have meaning. A design system extends this vocabulary rather than replacing it. A `<button>` is already interactive. A `<nav>` already means navigation. The system styles what exists instead of recreating it with divs and classes.

### Minimal
Constraints create consistency. A design system with 20 well-chosen classes beats one with 2000 utilities. HTML can't express spatial relationships, so classes handle layout: `.stack`, `.grid`, `.columns`. A few modifiers capture variations: `.primary`, `.compact`, `.inverted`. Everything else? Already in HTML.


## Why these principles matter
These three principles create a system that's invisible to those using it - the ultimate user-friendliness.

### For designers
A cascading system means direct control. Change a variable, see it everywhere. No asking developers to update components. No waiting for builds. No translation layer between design intent and implementation. The feedback loop becomes immediate. CSS speaks their language - visual properties, not programming abstractions.

### For developers
Semantic HTML and minimal classes mean assembly without thinking about presentation. Grab a `<nav>`, it's already styled. Add a `<button>`, it already works. Wrap content in `.stack`, spacing is handled. No memorizing utilities, no fighting specificity, no debugging why styles don't apply. The design system becomes invisible infrastructure that just works.

When design is truly decoupled from structure, both disciplines work at full speed. Designers iterate on visual language without breaking functionality. Developers build features without breaking design. Neither blocks the other. Neither compromises for the other.


## The compound effect
A real design system compounds its value over time. Each project strengthens the system. Each use case refines the patterns. Each team member contributes to a shared language.

When design is scattered in components, every project starts from scratch. You rebuild the same button in every framework migration. You rewrite the same styles for every new component library. Nothing compounds. Everything churns.

When design is cascading and semantic, it goes beyond frameworks. Your CSS design system works with any HTML. It worked with jQuery. It works with React. It will work with whatever comes next. The investment compounds across technologies and time.

This approach becomes even more powerful with [multi-site development](/docs/roadmap). Imagine managing design systems across multiple brands, products, and domains. The cascading inheritance suddenly scales from one site to an entire ecosystem. Base philosophy shared, expression customized, everything inheriting cleanly.

This is why CSS matters. It's the only layer that survives every paradigm shift. Your React components from 2016 are obsolete. Your CSS from 2016 still works.

Design systems aren't built in JavaScript. They're built in CSS.

