# Design systems

When design lives in JavaScript, you don't have a design system. You have a scattered utility framework. Nue puts design back in CSS so you can build and maintain a real system.

## The problem we created

For 15 years we've been writing CSS to survive in chaos. We use BEM because we gave up on the cascade. We use CSS-in-JS because we're scared of namespace collisions. We write utility classes because we stopped trusting our ability to name things. We compile, process, and transform CSS because we think native CSS isn't enough.

These practices assume CSS is broken and needs fixing. They're defensive strategies. They're about working around the language rather than harnessing its potential.


## CSS design system defined
Modern CSS has variables, nesting, container queries, layers, and scope. These are the cornerstones of a design system. Here's how to use them:

### 1. Central, not scattered

A design system is a single source of truth. When it lives in one place, you can see the whole system at once. You can understand relationships between components. You can spot inconsistencies. When CSS is scattered across component files, you have no system. Just a collection of accidents waiting to happen.

### 2. Semantics first

HTML already has a design system built in. A `<button>` knows it's interactive. A `<nav>` knows it contains navigation. A `<section>` creates hierarchy. When you use `<div class="button">`, you're rebuilding what already exists. Use HTML's vocabulary and extend it, don't replace it.

### 3. Class names for spatial concerns

HTML can't express layout or spacing. These aren't semantic. So class names become purely about spatial relationships: `.container`, `.stack`, `.cluster`, `.with-sidebar`. Modifiers express variations: `.inverted`, `.compact`, `.emphasized`. Practically nothing else needs a class.

### 4. Layer everything

Layers solve the specificity wars forever. Base styles in one layer, components in another, utilities in a third. Each layer has clear boundaries and clear purpose. No more specificity hacks, no more source order gymnastics. The cascade becomes predictable.

### 5. Keep things obvious

If a developer needs to read documentation to change a button color, the system has failed. The path from intention to implementation should be straight. Want to change primary color? Change `--primary`. Want more spacing? Adjust `--space`. The system guides you toward good decisions by making them the easy decisions.

Constraints create clarity. When you can only do things one way, that way becomes obvious.


## The benefits
Design system gives you three things:

**Design consistency** Your marketing site, application, email templates, and even generated SVG graphics all speak the same visual language. Change a color variable in one place, it updates everywhere. No more drift between your product and your landing pages.

**Rapid UI development.** When design is solved at the system level, developers focus only on structure and user flows. They're not making design decisions or fighting specificity. They're assembling interfaces trusting that form follows function.

**Maintainable at scale.** One system, one language, predictable outcomes. New team members understand it in a snap. Design updates happen in one file, not across hundreds of components. The system grows with you instead of becoming technical debt.


## Design engineering
Nue changes the way you think about web development. You start with the user experience, not technical details. UI first, implementation second.


### Two mindsets, both valuable
Design mindset thinks in patterns, rhythms, and relationships. How does this flow? What's the visual hierarchy? Where does the eye go first?

JS mindset thinks in data flow, state management, and abstractions. How do components communicate? What's the testing strategy? How do we handle edge cases?

One person can do both. Teams can specialize. The key is knowing which mindset fits which problem. Design problems need design thinking. Technical problems need technical thinking. The mistake is using technical thinking for everything.

### Why separation of concerns matters
HTML, CSS, and JavaScript aren't just different languages. They're different ways of thinking. When you force everything into JavaScript, you force everyone into engineering mindset. But most UI problems are design problems.

This separation lets people focus on their strengths. Someone passionate about typography and motion doesn't need to care about state management. Someone who loves data flow doesn't need to stress about color theory. They collaborate without stepping on each other's expertise.


### True scalability
Most frameworks are built for JS engineers who occasionally style things. Nue is built for design engineers who occasionally script things. The interface IS the application. The logic supports it, not the other way around.

With solid separation of concerns the burden of the JS engineer can be shared. Design engineers work on CSS. JS engineers work on logic. Each layer has its own mindset, its own experts, its own craft.

CSS isn't the problem. Our approach was.


