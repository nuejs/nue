# Website Optimization

Separating content, structure and styling unlocks natural performance benefits:

1. **CSS inlining**: All HTML and CSS can be delivered in the initial request. This enables instant rendering because browsers don't need to wait for additional requests.

2. **View transitions**: Clean, semantic HTML enables smooth client-side navigation between pages. By diffing only the changed content, pages switch instantly.

3. **Page Weight**: Decoupled CSS stays extremely small. While utility frameworks require thousands of classes, proper separation of concerns keeps files light and focused.


### Shift in thinking

For years, the web engineering world has become obsessed with JavaScript bundlers — complex, Rust/Go-based tools that slice, dice, and rearrange code in the name of performance. But for content-heavy websites, this approach is like using a sledgehammer to crack a nut. The truth is, JavaScript has minimal impact on performance for these types of sites, and all the bundling wizardry in the world won't change that.

With proper separation of concerns, optimizations become natural: single request for initial render, no JavaScript by default, and perfectly valid HTML markup with lean stylesheets. This is what happens when you work *with* web standards rather than against them.



## CSS inlining
CSS inlining is one of the most effective optimizations for landing pages. It ensures that everything needed for the **first paint** (when visible content first appears on the screen) is delivered with the initial request. This includes HTML and CSS, while scripts and off-screen images are **lazily loaded** — only when they're needed, typically as they come into view.

[image.bordered]:
   small: /img/first-paint.png
   large: /img/first-paint-big.png
   width: 650

Enable CSS inlining on your `site.yaml` file as follows:

```yaml
inline_css: true
```

This inlines all CSS directly into each page. While you might have concerns about increased page weight or needing to rebuild all pages when global CSS changes, it's important to note that when CSS is properly decoupled and organized, it remains extremely small, and the build process is so fast that it has no noticeable impact on your development experience.


## View transitions

View transitions are valuable for two main reasons. First, they make page transitions feel instant and seamless, improving the overall speed and responsiveness. Second, they allow you to add smooth transition effects between pages, similar to the animations you see in presentation software like Keynote.

You can enable view transitions globally by adding this to your `site.yaml` file:

```yaml
view_transitions: true
```

When enabled, view transitions only add a minimal 1.9kB (minified and gzipped) script to your page: `/@nue/view-transitions.js`. This script optimizes performance by partially updating or replacing page segments instead of re-rendering the entire page. It also manages linked stylesheets by enabling or disabling them as needed, making CSS loading and applying significantly faster.


## Page Weight

Clean, semantic HTML with zero clutter is the natural outcome of proper separation of concerns. For guidance on writing efficient, modern CSS that remains lean as your site grows, refer to the [styling](styling.html) document.