
# CSS cascade Layers
Cascade layers (`@layer`) bring a new level of control to CSS, allowing developers to define clear boundaries between different style types. This is a major step forward for organizing styles, especially in larger design systems. For the first time, CSS natively supports a way to separate concerns vertically, making it easier to manage how styles interact and override each other.

## The @layer rule
The `@layer` rule lets you define your system’s layers and set their order of precedence. A well-thought-out layer structure can make all the difference. Here’s an example that works effectively:

```css
@layer {
  settings,      /* Colors, typography, resets */
  structure,     /* Body, header, main, footer */
  components,    /* UI building blocks */
  adjustments,   /* Area-specific tweaks */
  screens,       /* Media query handling */
  overrides      /* Final overrides */
}
```

This setup has clear benefits:
1. **Encapsulation**: Components stay protected, only overridden by higher layers like adjustments or overrides.
2. **Override control**: Adjustments and overrides always win when needed.
3. **Documentation**: The layer names themselves explain the system’s intent.

This structure ensures styles flow logically—base settings come first, followed by structural framing, then components, with adjustments and overrides refining as needed. It’s a system that scales well, keeping things predictable and easy to debug. Developers can quickly see where new styles belong without wrestling with nested rules.


## Layer examples
Cascade layers are flexible by design, encouraging creativity and experimentation. The examples below showcase practical ways to structure layers, reflecting good development practices. They’re not strict rules—feel free to adapt them to your project’s needs. Let’s explore each layer with real-world scenarios.


### Settings layer
This layer sets the foundation with design tokens, variables, and resets.

```css
@layer settings {
  :root {
    --font-family-base: 'Helvetica Neue', sans-serif;
    --spacing-unit: 1rem;
    --color-accent: #e63946;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
```
**Use-case**: A news site uses this layer to define a consistent typography scale and spacing system across articles, ensuring all elements start from a clean slate with a shared accent color for links and highlights.


### Structure layer
This layer frames the page’s overall structure like global headers and footers.

```css
@layer structure {
  body {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
  }
  header {
    padding: var(--spacing-unit);
    background: #f1f1f1;
  }
  footer {
    text-align: center;
    padding: var(--spacing-unit);
  }
}
```
**Use-case**: An e-commerce site applies this to enforce a sticky header and footer across all pages, keeping the main content flexible while maintaining a consistent site skeleton.


### Components layer
Here, UI building blocks like buttons and cards take shape. This layer covers both semantic HTML elements and custom elements with a class name.

```css
@layer components {
  button {
    padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
    background: var(--color-accent);
    color: white;
    border: 0;
    border-radius: 0.25rem;
  }
  .card {
    padding: var(--spacing-unit);
    border: 1px solid #ddd;
    border-radius: 0.5rem;
  }
}
```
**Use-case**: A dashboard app uses this for reusable buttons and data cards, ensuring consistent styling for actions and displays across multiple views.


### Adjustments layer
This refines components for specific areas like a blog or product page.
```css
@layer adjustments {
  button {
    background: #457b9d;
    font-size: 1.1rem;
  }
  .product .card {
    border-color: var(--color-accent);
  }
}
```
**Use-case**: A multi-section site adjusts button colors for the blog to match its theme and tweaks card borders on product pages to highlight featured items.


### Screens layer
This handles responsive design with media queries

```css
@layer screens {
  @media (min-width: 768px) {
    .card {
      padding: calc(var(--spacing-unit) * 2);
    }
  }
  @media (max-width: 480px) {
    button {
      width: 100%;
    }
  }
}
```
**Use-case**: A portfolio site uses this to widen card padding on tablets and make buttons full-width on mobile, improving readability and touch targets.


### Overrides layer
This is for rare, forceful overrides—use sparingly.
```css
@layer overrides {
  .is-hidden {
    display: none;
  }
  .force-center {
    text-align: center !important;
  }
}
```

**Use-case**: A CMS-driven site uses `.is-hidden` to hide elements dynamically and `.force-center` to fix misaligned text in third-party widgets, keeping overrides minimal.


