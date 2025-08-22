# Design systems
When design lives in JavaScript, you don't have a design system. You have a scattered utility framework. Nue puts design back in CSS where it belongs, enabling you to build and maintain a real system.

## The problem we created
For 15 years we've been writing CSS to survive in chaos. We use BEM because we gave up on the cascade. We use CSS-in-JS because we're scared of namespace collisions. We write utility classes because we stopped trusting our ability to name things. We compile, process, and transform CSS because we think native CSS isn't enough.

These practices assume CSS is broken and needs fixing. They're defensive strategies. They're about working around the language rather than harnessing its potential.


## CSS design system defined
A design system isn't a component library or a utility framework. It's a visual language expressed through CSS. Modern CSS gives us everything we need: variables, nesting, container queries, layers, and scope. Here's what makes a real design system:

### Central
A design system lives in one place. Not scattered across components, not mixed with JavaScript, not generated at build time. When you can see the whole system at once, you understand it. When it's fragmented across a thousand files, you have no system—just a collection of accidents waiting to happen.

### Semantic
HTML already contains a rich design vocabulary. Lists, tables, forms, buttons, navigation—they all have meaning. A design system extends this vocabulary rather than replacing it. A `<button>` is already interactive. A `<nav>` already means navigation. The system styles what exists instead of recreating it with divs and classes.

### Minimal
Constraints create consistency. A design system with 20 well-chosen classes beats one with 2000 utilities. HTML can't express spatial relationships, so classes handle layout: `.stack`, `.grid`, `.columns`. A few modifiers capture variations: `.primary`, `.compact`, `.inverted`. Everything else? Already in HTML.


## Why these principles matter

These three principles create a system that's invisible to those using it—the ultimate user-friendliness.

**For designers**, a central system means direct control. Change a variable, see it everywhere. No asking developers to update components. No waiting for builds. No translation layer between design intent and implementation. The feedback loop becomes immediate. CSS speaks their language—visual properties, not programming abstractions.

**For developers**, semantic HTML and minimal classes mean assembly without thinking about presentation. Grab a `<nav>`, it's already styled. Add a `<button>`, it already works. Wrap content in `.stack`, spacing is handled. No memorizing utilities, no fighting specificity, no debugging why styles don't apply. The design system becomes invisible infrastructure that just works.

When design is truly decoupled from structure, both disciplines work at full speed. Designers iterate on visual language without breaking functionality. Developers build features without breaking design. Neither blocks the other. Neither compromises for the other.

This is what real collaboration looks like—not everyone learning React, but each discipline having the right tools for their domain. The system serves both mindsets equally, making the right way the obvious way.


## Design engineering
Web development split into two camps: those who design and those who code. This division is artificial. The web is a design medium that happens to be programmable.


### Two mindsets, one medium
Design mindset sees patterns, rhythm, and hierarchy. It asks: How does this feel? What draws the eye? Where does attention flow?

Engineering mindset sees data structures, state management, and abstractions. It asks: How does this scale? What are the edge cases? How do we test this?

Both are essential. Neither is sufficient alone. The web demands both mindsets because interfaces are both visual and functional. The mistake is believing one matters more than the other.


### The artificial divide
Modern frameworks optimize for engineering mindset. Everything becomes a programming problem. CSS becomes CSS-in-JS. Design becomes component props. Layout becomes flexbox utilities. We've turned visual decisions into code decisions.

Designers must learn React to do their job. They write JavaScript to change a color. They debug webpack to update spacing. The tool shapes the thinking, and the thinking becomes programmatic.


### Reuniting the disciplines
True design engineering happens when both mindsets have equal tools and equal power. CSS for design decisions. HTML for structure. JavaScript for business logic. Each layer owns its domain completely.

This isn't about roles or job titles. One person can embody both mindsets. Teams can specialize. The key is that the technology supports both ways of thinking equally. Design decisions happen in design tools. Programming decisions happen in programming tools. Neither compromises for the other.


## The compound effect
A real design system compounds its value over time. Each project strengthens the system. Each use case refines the patterns. Each team member contributes to a shared language.

**When design is scattered in components, every project starts from scratch.** You rebuild the same button in every framework migration. You rewrite the same styles for every new component library. Nothing compounds. Everything churns.

When design is central and semantic, it goes beyond frameworks. Your CSS design system works with any HTML. It worked with jQuery. It works with React. It will work with whatever comes next. The investment compounds across technologies and time.

This is why CSS matters. Not because it's powerful—though it is. Not because it's fast—though it is. But because CSS is the only layer that survives every paradigm shift. Your React components from 2016 are obsolete. Your CSS from 2016 still works.

Design systems aren't built in JavaScript. They're built in CSS.