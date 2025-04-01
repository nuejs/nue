
# CSS Best practises
These practises turn CSS into a powerful tool for design systems, emphasizing web standards and Nue’s streamlined approach. They ensure styles stay consistent, flexible, and easy to manage, building on cascade layers and clean structure.

## Core practises
These foundational rules shape how you write HTML and CSS to keep your design system lean and effective.

### Use semantic HTML
Start with clean, meaningful HTML to reduce reliance on complex CSS. Semantic elements like `<details>` or `<h3>` carry built-in behavior and accessibility, cutting down on custom components. Aim for under 30 components total — more suggests you’re over-complicating things.

```html
<!-- Good: Simple, semantic -->
<details class="accordion">
  <summary>Section Title</summary>
  <p>Content here</p>
</details>

<!-- Bad: Overbuilt -->
<div class="accordion">
  <button class="accordion-trigger">Section Title</button>
  <div class="accordion-content">Content here</div>
</div>
```

This keeps markup minimal, boosts SEO, and aligns styles with structure naturally.


### Separate style from structure
Keep styling out of markup to maintain flexibility. Avoid inline `style` attributes or utility classes that tie design to HTML — they make updates a chore and clash with design system goals.

```html
<!-- Bad: tightly coupled styling -->
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
  <h3 class="text-xl">ChitChat</h3>
  <p class="text-slate-500">New message</p>
</div>

<!-- Good: Decoupled -->
<div class="notification card">
  <h3>ChitChat</h3>
  <p>New message</p>
</div>
```
External classes like `notification` and `card` let the design system evolve without touching HTML, enabling tweaks or full re-themes via CSS alone.


### Scope modifiers to components
Tie modifiers to their components, not the utilities layer, for clarity and control. Nest them with CSS to keep states contextual.

```css
@layer components {
  button {
    padding: 0.5em 1em;
    border-radius: 0.25em;

    /* a modifier class */
    .primary {
      background-color: var(--main-500);
      color: white;
    }

    &[aria-pressed="true"] {
      background: #2563eb;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

  }
}
```
This scopes tweaks where they belong, avoiding global clutter and making components self-contained.


### Enhance with ARIA
Use ARIA attributes for state-driven styles instead of custom classes. It syncs accessibility with visuals, cutting redundancy.

```css
.accordion[aria-expanded="true"] {
  max-height: 100%;
}

.accordion[aria-expanded="false"] {
  max-height: 0;
}
```

This leverages built-in semantics, keeping your system lean and screen-reader-friendly.



## Design system foundations
These rules establish a consistent, reusable base for your styles, keeping the system practical and scalable.

### Build reusable components
Extract common patterns into reusable classes to cut duplication and enforce consistency. Define them in the components layer for clarity.
```css
@layer components {
  .card {
    box-shadow: 0 0 2em #0001;
    border: var(--border);
    border-radius: 0.5em;
    padding: 1.5em;
    font-size: 95%;

    &.notification {
      background: url(/img/chat.svg) 10% center no-repeat;
      background-size: 3rem;
      padding-left: 6rem;
    }
  }
}
```

Use them like this:
```html
<div class="notification card">
  <h3>ChitChat</h3>
  <p>New message</p>
</div>
```

The `card` class handles generic UI blocks, while `.notification` adds context-specific flair. Updates to `card` ripple site-wide, keeping maintenance simple.

### Respect constraints
Limit fonts, weights, colors, and variables to maintain cohesion. A lean palette forces deliberate design and eases adoption.
```css
@layer settings {
  :root {
    --main-500: #3b82f6;  /* Core blue */
    --main-600: #2563eb;  /* Darker shade */
    --gray-100: #f3f4f6;  /* Light bg */
    --gray-500: #6b7280;  /* Mid text */
    --gray-900: #111827;  /* Dark text */
  }
}
```
Stick to a few key values — adding every shade bloats the system and invites inconsistency. Fewer options sharpen focus and streamline updates.

### Avoid complex resets
Skip heavy reset libraries that zero out defaults only to rebuild them. A minimal reset plus your system’s rules works better.
```css
@layer settings {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  form {
    button, input, select, textarea {
      font: inherit;  /* Match body text */
    }
  }
}
```
Let headings, paragraphs, and forms keep useful defaults (e.g., margins), then tweak them in higher layers. This avoids redundant code and keeps styling intentional.




You’re right — “Leverage nesting” alone feels thin for a section. Reframing it as a broader look at CSS’s evolution, its undervalued power, and how it’s outgrown preprocessors (with nesting as an example) gives it more weight. I’ll rewrite "Modern CSS techniques" to reflect that, keeping it concise and punchy, with h2/h3 structure and nesting within `@layer` where applicable. Here’s the updated section:


Fair point — CSS Tricks and Josh Comeau do lean React-heavy, which doesn’t fully align with Nue’s vanilla CSS focus. I’ll swap them for MDN (a gold standard for web docs) and something broader like Every Layout (practical, standards-driven CSS). Here’s the updated section:


## Modern CSS techniques
CSS has come a long way in recent years, adding power that rivals preprocessors — yet it’s still undervalued. Features like variables, calc() function, nesting, and cascade layers make it a first-class design tool, no extras needed. Misinformation — like [this post on Tailwind](/blog/tailwind-misinformation-engine/) — pushes devs toward inline hacks or frameworks, but vanilla CSS now handles complex systems with less effort.

### Native nesting
Native nesting, supported in all modern browsers, eliminates the need for SASS or LESS. It mirrors HTML structure, cutting verbose class names and keeping styles intuitive.

```css
@layer components {
  body > header {
    padding: 1em;

    > :first-child {
      width: 10rem;
    }

    > nav {
      display: flex;
      gap: 1em;

      a {
        color: var(--main-500);
      }
    }

    + nav {
      font-size: 0.9em;
    }
  }
}
```

This trims bloat, boosts readability, and sticks to standards — preprocessors just add unnecessary overhead now.

#### Master what’s possible
Grasp CSS’s full potential — constraints, layers, and web standards — to build lean, lasting systems. Explore [MDN’s CSS docs](//developer.mozilla.org/en-US/docs/Web/CSS) for authoritative specs or [Every Layout](//every-layout.dev/) for practical, standards-based design patterns.
