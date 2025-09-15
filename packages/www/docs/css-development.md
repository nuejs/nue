
# CSS development
Nue represents a shift from component-scoped styling to [design systems](/docs/design-systems). CSS becomes a centralized visual language that works across your entire site.


## Small projects
Start with global styles plus area-specific CSS. This follows the classic web development pattern that pre-dated the component revolution - global stylesheets with area-specific additions. It's perfect for personal projects, prototypes, or small teams where you need the flexibility to add styles ad-hoc without teaching a formal system to others:


```
├── global.css       # Site-wide design system
├── index.md
└── blog/
    ├── blog.css     # Blog-specific styles
    ├── css-is-awesome.md
    ├── design-systems.md
    └── ...
```

Files are loaded automatically based on location. The `global.css` applies everywhere. The `blog.css` only applies to pages in the blog directory. No imports, no bundling - just files where you need them.


## Larger projects
Scale up with a centralized design system for larger teams, client work, or any project where consistency and maintainability matter more than development speed. This approach enforces constraints that prevent the CSS sprawl that kills long-term projects:


```bash
nue create full
```

This creates a complete design system in `@shared/design/`:

```
@shared/design/
├── base.css         # Typography, colors, spacing
├── button.css       # All button variants
├── content.css      # Blog posts, documentation
├── dialog.css       # Modals, popovers
├── document.css     # Page structure
├── form.css         # All form elements
├── layout.css       # Grid, stack, columns
├── syntax.css       # Code highlighting
├── table.css        # Data tables
└── apps.css         # SPA-specific components
```

All files load automatically across your entire site. Marketing pages, documentation, blogs, login screens, and single-page apps all use the same visual language. Change a variable in `base.css` and see it everywhere.


### Configuration
Control the design system through `site.yaml`:

```yaml
design:
  central: true        # Enforce central system only
  base: base.css       # Load first for layer ordering

  # Limit class names per element to prevent utility abuse
  max_class_names: 3

  # inline all css to pages in production build (performance optimization)
  inline_css: true
```

### App-specific styling
Override globally through app configuration. In `app/app.yaml`:

```yaml
exclude: [content.css]   # Skip content-specific styles
include: [apps.css]      # Add SPA-specific styles
```

Exclusions use fuzzy matching. "apps/" would exclude both "apps/canvas.css" and "apps/ui.css". This lets you fine-tune which parts of the design system apply to different areas.


## CSS best practices
The full template follows these principles for maintainable design systems:


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
.stack { }      /* Vertical spacing */
.grid { }       /* Responsive grid */
.columns { }    /* Text columns */
```

Add minimal modifiers for variations:

```css
.thin { }       /* Narrower block */
.wide { }       /* Wider block */
.compact { }    /* Tighter spacing */
```

Modern nested CSS eliminates the need for inner class names. A constrained system enables creative combinations without chaos.

### Layer everything

CSS layers solve specificity wars forever:

```css
@layer base, layout, components, utilities;

@layer base {
  /* variables, semantic elements */
}

@layer component {
  /* component class names (.stack) */
}

@layer modifier {
  /* modifier classes (.thin) */
}
```

Each layer has clear boundaries and purpose. No more specificity hacks, no more source order gymnastics. The cascade becomes predictable.


### Keep it minimal
Even complex design systems need surprisingly few classes. Maybe 10-30 total. Not 50. Definitely not 500. A design system fails when developers escape to local styling.

The best way to ensure adoption is constraint. Learning 10 classes is manageable. Learning 100 is not. Minimal systems force creative solutions within boundaries - exactly what good design requires.


## Brutalist foundation
The full template uses raw, "brutalist" design principles. It's the thinnest possible layer on top of browser defaults for meaningful graphics. This foundation works for two reasons:

**It's a starting point, not an endpoint** - Build your brand on top of solid fundamentals rather than fighting against opinionated defaults.

**It demonstrates the principles** - Shows how semantic HTML plus minimal CSS creates functional, accessible interfaces without complexity.

This foundation will expand into more expressive templates. See the [roadmap](/docs/roadmap) for the upcoming design systems for more sophisiticated Miesian or Ramsian feel.

