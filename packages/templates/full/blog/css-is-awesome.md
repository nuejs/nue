---
date: 2025-08-05
---

# Modern CSS is awesome
CSS has transformed dramatically over the past decade, but the JavaScript ecosystem hasn't noticed. While React developers debate CSS-in-JS solutions, the language itself evolved into something unrecognizable from its 2013 limitations.

[placeholder.blue height="400"]


## Stuck in the past
React emerged when CSS was genuinely limited. No variables, no nesting, no real layout system. Global scope created conflicts. Cascade felt unpredictable. The community built tools to work around these limitations: preprocessors, naming conventions, CSS-in-JS.

These solutions became orthodoxy. We normalized the idea that CSS needs fixing, that styling should live inside components, that global scope is dangerous. The JavaScript ecosystem created an entire industry around CSS's perceived brokenness.

But CSS kept evolving. While developers debated utility frameworks and CSS-in-JS libraries, the language gained powerful native features. Variables arrived. Nesting landed in browsers. Container queries, layers, and scope solved real problems. Grid and flexbox revolutionized layout.

The gap between perception and reality widened. Modern CSS can do things that seemed impossible in 2013, but the ecosystem remains stuck in defensive patterns.


## CSS in 2025
Today's CSS bears little resemblance to the language React was designed to fix. Modern CSS has everything needed for sophisticated design systems.

**CSS variables** create design tokens that cascade and inherit naturally:

```css
:root {
  --primary-hue: 210;
  --primary-color: hsl(var(--primary-hue) 60% 50%);
  --primary-light: hsl(var(--primary-hue) 60% 90%);
}

button {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
}

button:hover {
  background: var(--primary-light);
}
```

**Native nesting** eliminates preprocessor complexity:

```css
.card {
  padding: 1rem;
  border-radius: 8px;

  h3 {
    margin-top: 0;
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}
```

**CSS layers** solve specificity wars forever:

```css
@layer base, layout, components, overrides;

@layer base {
  button {  }
}

@layer components {
  .primary {  }
}

@layer overrides {
  .hidden {
    display: none !important;
  }
}
```

**Container queries** create truly responsive components:

```css
.sidebar {
  container-type: inline-size;
}

.card {
  padding: 1rem;
}

@container (min-width: 300px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

**CSS scope** provides encapsulation without JavaScript:

```css
@scope (.component) {
  button {
    /* Only affects buttons inside .component */
  }
}
```

This is a completely different language from what React was built to replace.

## Design system best practices

Modern CSS enables new patterns for building maintainable design systems.

### Trust HTML semantics

HTML already provides most of what a design system needs. Lists have `<ul>`, `<ol>`, `<dl>`. Tables have semantic structure. Forms have fieldsets and labels. Navigation has `<nav>`. Interactive elements have `<button>`, `<details>`, `<dialog>`.

Style these native elements directly:

```css
/* Not this: component classes */
.list-component { }
.nav-component { }
.button-component { }

/* This: semantic elements */
ul { }
nav { }
button { }
```

Use attribute selectors (`[disabled]`, `[aria-expanded]`), pseudo-classes (`:invalid`, `:checked`), and `:has()` for state-based styling. The browser already knows what's interactive and what's not.

### Class names for layout

HTML can't express spatial relationships. These aren't semantic, so class names handle layout:

```css
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-l);
}

.columns {
  column-count: var(--count, 2);
  column-gap: var(--space-m);
}
```

Add minimal modifiers for variations:

```css
.thin { max-width: 40ch; }
.wide { max-width: 80ch; }
.compact { --space-m: 0.5rem; }
```

Modern nested CSS eliminates the need for inner class names. A constrained system enables creative combinations without chaos.

### Layer everything

CSS layers solve specificity wars forever:

```css
@layer base, layout, components, overrides;

@layer base {
  /* Variables, semantic elements */
  :root { --primary: #0066cc; }
  button { padding: 0.5rem 1rem; }
}

@layer layout {
  /* Spatial relationships */
  .stack { display: flex; flex-direction: column; }
  .grid { display: grid; }
}

@layer components {
  /* Component variations */
  .primary { background: var(--primary); color: white; }
}

@layer overrides {
  /* Overrides */
  .hidden { display: none !important; }
}
```

Each layer has clear boundaries and purpose. No more specificity hacks, no more source order gymnastics. The cascade becomes predictable.

### Keep it minimal

Even complex design systems need surprisingly few classes. Maybe 10-30 total. Not 50. Definitely not 500. A design system fails when developers escape to local styling.

The best way to ensure adoption is constraint. Learning 10 classes is manageable. Learning 100 is not. Minimal systems force creative solutions within boundaries—exactly what good design requires.

## The benefits

Modern CSS creates possibilities that CSS-in-JS can't match.

**Performance** - Native CSS parsing and rendering beats JavaScript-generated styles. No runtime overhead, no flash of unstyled content, no hydration delays.

**Debugging** - Browser dev tools understand CSS natively. Inspect elements, edit properties, see computed values. No source maps, no JavaScript debugging for visual issues.

**Maintainability** - Design changes happen in design files. A single variable update cascades everywhere. No hunting through component props or JavaScript configurations.

**Standards compliance** - CSS follows web standards that evolve carefully. Your investment compounds over decades. Framework APIs change every few years.

**Design workflow** - Designers work directly with CSS. No translation layer between design tools and implementation. The feedback loop becomes immediate.

**Future-proof** - Modern CSS features work in all browsers. No polyfills, no build steps, no runtime dependencies. The platform provides everything.

CSS in 2025 is a mature, powerful language for building design systems. The JavaScript ecosystem just hasn't caught up yet.


