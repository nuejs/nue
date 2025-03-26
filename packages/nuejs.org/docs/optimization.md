
# Performance optimization
Nue improves website performance by bundling CSS directly with HTML, enabling complete page rendering in a single request. No amount of JS bundling can beat this strategy.


## CSS inlining
Inlining CSS delivers HTML and styles in one request, rendering pages instantly. Enable it in `site.yaml`:

```yaml
inline_css: true
```

For a blog post, this might combine a 2kb HTML file with a 1kb CSS file into a single 3kb response—no extra fetches. Off-screen images and scripts load lazily, only when needed. Since Nue’s decoupled CSS stays small, page weight barely grows, and rebuilds remain fast even with global style updates.

## View transitions
View transitions make navigation feel instant by updating only changed content, not reloading the full page. Add this to `site.yaml`:

```yaml
view_transitions: true
```

This uses a 1.9kb script (`/@nue/view-transitions.js`) to:
- Diff and swap DOM segments efficiently.
- Toggle linked stylesheets (enabling/disabling, not reloading) for faster CSS handling.

On a docs site, clicking from one article to another updates just the `<main>` content, leaving the sidebar intact—paired with a smooth CSS fade. See [view-transitions.html](view-transitions.html) for styling details.

## Page weight
Clean, semantic HTML from proper separation keeps pages light. A typical Nue page—say, a blog post with header, content, and footer—might weigh 5kb with inlined CSS, compared to 50kb+ with utility frameworks. Lean stylesheets, guided by [styling.html](styling.html), ensure efficiency as your site scales.
