
# View transitions
Nue's view transitions provide smooth, fast page navigation with native CSS animations. With a simple configuration, you get quick page updates without full reloads, along with customizable visual effects.


## Setup and customization
Turn on view transitions in `site.yaml`:

```yaml
view_transitions: true
```

This adds a 1.9kb script (`/@nue/view-transitions.js`) that powers two features:
- **Fast navigation**: Only changed DOM elements update, avoiding full page reloads.
- **Transition effects**: The browser’s native `startViewTransition()` API triggers CSS animations during navigation.

Customize the effect with CSS, like this fade-and-scale for main content:

```css
::view-transition-group(main) {
  transition: opacity .4s ease, transform .4s ease;
}

::view-transition-old(main) {
  opacity: 1;
  transform: scale(1);
}

::view-transition-new(main) {
  opacity: 0;
  transform: scale(.95);
}
```

On a blog, this smooths the shift from a post list to an article, keeping navigation snappy and visually cohesive.

## Image transitions
Nue tags clicked images with `view-transition-name: active-image` for seamless morphing:

```css
.hero-image {
  view-transition-name: active-image;
}

::view-transition-group(active-image) {
  animation-duration: .4s;
}
```

A thumbnail can morph into a full header image across pages, linking views naturally.

## Performance tweaks
Nue optimizes view transitions beyond standard turbo-linking:
- **Smart DOM diffing**: Instead of replacing the `<body>`, only differing elements update, minimizing reflows.
- **Stylesheet toggling**: Linked stylesheets are enabled or disabled — not wiped and reloaded — boosting browser performance.

These tweaks ensure fast, fluid transitions across MPAs, from content pages to app views, without sacrificing efficiency.
