---
date: 2025-08-15
---

# What is design engineering?
Web development split into two camps: those who design and those who code. This division is artificial. The web is a design medium that happens to be programmable.

[placeholder.yellow height="400"]

## The artificial divide
Modern frameworks optimize for engineering mindset. Everything becomes a programming problem. CSS becomes CSS-in-JS. Design becomes component props. Layout becomes flexbox utilities. We've turned visual decisions into code decisions.

Designers must learn React to do their job. They write JavaScript to change a color. They debug webpack to update spacing. The tool shapes the thinking, and the thinking becomes programmatic.

Meanwhile, engineers build without design sense. They memorize utility classes instead of understanding visual hierarchy. They copy-paste components without grasping the underlying system. They optimize for code patterns while users struggle with confusing interfaces.

The result is neither good design nor good engineering. It's compromise in both directions.


## Two mindsets, one medium
Design mindset sees patterns, rhythm, and hierarchy. It asks: How does this feel? What draws the eye? Where does attention flow?

Engineering mindset sees data structures, state management, and abstractions. It asks: How does this scale? What are the edge cases? How do we test this?

Both are essential. Neither is sufficient alone. The web demands both mindsets because interfaces are both visual and functional. The mistake is believing one matters more than the other.


[placeholder.blue height="300"]


## Reuniting the disciplines

True design engineering happens when both mindsets have equal tools and equal power. CSS for design decisions. HTML for structure. JavaScript for business logic. Each layer owns its domain completely.

This isn't about roles or job titles. One person can embody both mindsets. Teams can specialize. The key is that the technology supports both ways of thinking equally. Design decisions happen in design tools. Programming decisions happen in programming tools. Neither compromises for the other.

When a designer changes a color, it changes everywhere instantly. When an engineer refactors business logic, no visual elements break. When both work on the same feature, they're enhancing different layers of the same system.

## What design engineering looks like

**Direct manipulation** - Designers control visual properties through CSS variables, not component props. Change `--primary-color` and see it across the entire product. No pull requests, no developer bottlenecks.

**Semantic structure** - Engineers build with meaningful HTML elements that designers can style predictably. A `<button>` behaves like a button. A `<nav>` means navigation. The structure describes intent, not appearance.

**Clear boundaries** - Design system lives in CSS files. Business logic lives in JavaScript modules. Content lives in Markdown files. Each discipline owns its layer completely.

**Shared vocabulary** - Both mindsets understand the same concepts: semantic elements, design tokens, component APIs. Communication becomes precise because the tools create common ground.


[placeholder.red height="150"]


## The benefits

**Parallel development** - Design and engineering work streams never block each other. Visual iterations happen independently of feature development. Code refactoring doesn't break designs.

**Compound expertise** - Skills in each discipline deepen without interference. Designers become better at systematic thinking. Engineers develop stronger aesthetic judgment. Neither has to compromise their core competency.

**Faster iteration** - Design changes deploy instantly through CSS. Feature changes don't require design system updates. The feedback loop becomes immediate for both disciplines.

**Maintainable systems** - Clear separation of concerns makes debugging predictable. Visual bugs live in CSS. Logic bugs live in JavaScript. Structure bugs live in HTML. No hunting through component hierarchies.

**Future-proof architecture** - Web standards evolve slowly and deliberately. CSS knowledge stays relevant for decades. HTML semantics remain stable. JavaScript fundamentals persist across framework changes.

Design engineering isn't about making everyone learn everything. It's about giving each discipline the right tools for their domain. When design and engineering have equal power in their respective layers, both can work at full potential.