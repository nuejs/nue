
---
date: 2025-08-05
---

# Why CSS beats CSS-in-JS
CSS-in-JS promised to solve CSS problems by moving styles into JavaScript. Instead, it created new problems while ignoring the solutions that already exist. Real CSS has evolved past the limitations that drove developers to JavaScript in the first place.

[placeholder.yellow height="400"]

## The promise that didn't deliver

CSS-in-JS emerged from real frustrations. Global namespaces caused conflicts. Unused styles bloated bundles. Dynamic styling felt clunky. The solution seemed obvious: move everything to JavaScript where we have modules, variables, and logic.

But CSS-in-JS didn't solve these problems. It relocated them. Global conflicts became runtime overhead. Unused styles became larger JavaScript bundles. Dynamic styling became complex prop drilling and theme providers.

Meanwhile, CSS kept evolving. Custom properties gave us real variables. Cascade layers eliminated specificity wars. Container queries made components truly responsive. The language that CSS-in-JS tried to replace became the solution.

## Real problems, wrong solutions

Every CSS-in-JS library tries to solve legitimate CSS challenges. But they solve yesterday's problems with today's complexity instead of using today's CSS features.

### Scoping and conflicts

**The CSS-in-JS approach:** Generate unique class names at runtime. Add vendor prefixes. Include only used styles.

```jsx
const Button = styled.button`
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
`
```

**Modern CSS approach:** Use cascade layers and logical organization. Scope with custom properties.

```css
@layer components {
  button {
    background: var(--button-bg, var(--neutral-600));
    color: var(--button-text, white);
    border: none;
    padding: var(--space-2) var(--space-4);
  }

  button[data-variant="primary"] {
    background: var(--primary-600);
  }
}
```

Layers solve specificity problems permanently. Custom properties provide clean theming. No runtime overhead, no build complexity, no vendor lock-in.

### Dynamic styling

**The CSS-in-JS approach:** Props, theme providers, and runtime style injection.

```jsx
const Card = styled.div`
  padding: ${props => props.compact ? '0.5rem' : '1rem'};
  background: ${props => props.theme.surface};
  border-radius: ${props => props.theme.radius};
`

<ThemeProvider theme={darkTheme}>
  <Card compact primary>Content</Card>
</ThemeProvider>
```

**Modern CSS approach:** Custom properties and data attributes.

```css
.card {
  padding: var(--card-padding, var(--space-4));
  background: var(--surface-color);
  border-radius: var(--radius);
}

.card[data-compact] {
  --card-padding: var(--space-2);
}
```

```html
<div class="card" data-compact style="--surface-color: var(--dark-surface)">
  Content
</div>
```

No theme providers needed. No prop drilling. No runtime style computation. Just CSS doing what it was designed to do.

## Performance that matters

CSS-in-JS adds overhead at every level. Parse JavaScript. Execute functions. Generate styles. Inject into DOM. Compare that to CSS which browsers optimize at the engine level.

[.columns]
  **Runtime overhead** happens with every render. CSS-in-JS libraries must parse template literals, execute functions, and inject styles during the component lifecycle. This work repeats for every component instance.

  [placeholder height="200"]

  **Bundle bloat** means larger downloads. Styled-components adds 42KB. Emotion adds 35KB. Both require React as a peer dependency. Meanwhile, your entire CSS design system weighs 4KB and works with any HTML.

  [placeholder.blue height="200"]

The performance difference becomes dramatic at scale. CSS loads once and browsers cache it forever. CSS-in-JS processes styles on every page load, every route change, every component update.

## The maintenance trap

CSS-in-JS creates vendor lock-in disguised as developer experience. Your styles become JavaScript code that only works with specific libraries and build tools.

```jsx
// This only works with styled-components
const Button = styled.button.attrs(props => ({
  type: props.type || 'button'
}))`
  background: ${props => props.theme.colors.primary};
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => darken(0.1, props.theme.colors.primary)};
  }
`
```

When you need to migrate frameworks or update dependencies, you rewrite everything. The CSS knowledge doesn't transfer. The components don't work elsewhere.

Compare this to semantic CSS:

```css
button {
  background: var(--primary-600);
  transition: var(--transition-fast);
}

button:hover {
  background: var(--primary-700);
}
```

This CSS works with React, Vue, Svelte, or vanilla HTML. It works today and will work in 10 years. No migration needed when you change frameworks. No rewriting when libraries update.

## Design system anti-patterns

CSS-in-JS encourages patterns that fragment design systems. Every component becomes a styling decision point. Designers lose control over the visual language.

```jsx
// Styling scattered across components
const HeaderButton = styled.button`
  background: #3b82f6;
  border-radius: 6px;
`

const SidebarButton = styled.button`
  background: #2563eb;
  border-radius: 4px;
`

const FooterButton = styled.button`
  background: #1d4ed8;
  border-radius: 8px;
`
```

Each button has slightly different colors and border radius. The design system fragments because styling decisions happen in isolation. Consistency requires vigilant code review and shared constants that developers often ignore.

CSS design systems prevent this fragmentation:

```css
button {
  background: var(--primary-600);
  border-radius: var(--radius);
}
```

One source of truth. Consistent everywhere. Designers control the system through CSS variables. Developers use semantic HTML without making visual decisions.

## Real CSS solutions

Modern CSS provides clean solutions for every problem CSS-in-JS tries to solve:

**Custom properties** replace JavaScript variables with better performance and browser optimization.

**Cascade layers** eliminate specificity conflicts more elegantly than generated class names.

**Container queries** make components responsive without JavaScript media query libraries.

**Logical properties** handle internationalization better than CSS-in-JS direction utilities.

**Native nesting** provides the syntax benefits without build complexity.

These aren't workarounds or polyfills. They're native browser features optimized at the engine level.

## Choose your complexity

CSS-in-JS asks you to accept JavaScript complexity to solve CSS problems. Modern CSS asks you to learn CSS features to solve CSS problems directly.

The complexity you choose shapes your entire development experience. CSS-in-JS complexity grows with your application. CSS complexity stays constant because the browser handles optimization.

When you bet on web standards instead of JavaScript abstractions, your investment compounds over time. Your CSS skills apply everywhere. Your design systems outlast framework changes. Your performance improves as browsers optimize further.

CSS didn't get worse when CSS-in-JS emerged. CSS got better while we were looking elsewhere. It's time to look back.