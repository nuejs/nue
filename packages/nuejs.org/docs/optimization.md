
# Performance Optimization

Progressive enhancement opens new doors for performance optimization:

1. **Single-file Requests**: All HTML and CSS can be delivered in the initial HTTP request. This results to faster load times when the browser don't have to wait for additional requests to render the page.

2. **View transitions**: Semantic, predictable HTML allows Nue to offer seamless support for fast client-side navigation (also known as "turbolinking") and view transitions, making page switches smooth and instantaneous.

3. **Page Weight**: Nue’s CSS is extremely small, far smaller than what you’d typically see in JavaScript monoliths. For example, this page’s CSS is smaller than even Tailwind’s "preflight" CSS.


### Shift on thinking

For years, the web engineering world has obsessed over JavaScript bundlers—complex, Rust/Go-based tools that slice, dice, and rearrange code in the name of performance. But for content-heavy websites, this approach is like using a sledgehammer to crack a nut. The truth is, JavaScript has minimal impact on performance for these types of sites, and all the bundling wizardry in the world won’t change that.

With **Nue**, we’re flipping that narrative.

**What if performance didn’t depend on endless configurations and convoluted build steps?** What if, instead of wrestling with bundlers, you could simply *not need them*? That’s the radical shift Nue offers. Performance optimization doesn’t come from juggling dependencies—it comes from avoiding that complexity entirely.

The breakthrough comes from **progressive enhancement**, which allows Nue to deliver the following:

1. **CSS inlining**:
   Traditional JavaScript monoliths rely on splitting multiple files and managing dependencies. Nue takes a different path: all HTML and CSS are delivered in the initial request. Nothing beats a single file that has everything needed to render the page.

2. **No JavaScript by default**:
   In monoliths, JavaScript is the backbone of everything. Nue is different. JavaScript is **optional**, used only when explicitly enabled for features like view transitions or specific interactivity.

3. **View transitions for everyone**:
   Nue leverages CSS-based view transitions, putting this powerful, underutilized tool into the hands of every developer.


## CSS inlining

Single-file requests mean that everything required for the **first paint** is delivered in the initial request. The first paint refers to the moment when visible content is first rendered on the screen. This includes all HTML and CSS, while scripts and off-screen images are **lazily loaded** (i.e., they are loaded only when needed, typically when they come into the user's viewport). This is by far the most impactful optimization you can apply to your landing pages.

[image.bordered]
   small: /img/first-paint.png
   large: /img/first-paint-big.png
   width: 650

Enabling single-file requests is as simple as setting `inline_css: true` in your `site.yaml` file. This inlines all CSS directly into each page. While you might have concerns about increased page weight or needing to rebuild all pages when global CSS changes, it’s important to note that Nue’s CSS is extremely small, and the build process is so fast (sub-millisecond, even for large sites) that it has no noticeable impact on your development experience.

If you'd prefer to inline CSS only for production builds, you can configure it like this:

```yaml
inline_css: production
```


## View transitions

View transitions are valuable for two main reasons. First, they make page transitions feel instant and seamless, improving the overall speed and responsiveness. Second, they allow you to add smooth transition effects between pages, similar to the animations you see in presentation software like Keynote.

You can enable view transitions globally by adding this to your `site.yaml` file:

```yaml
view_transitions: true
```

When enabled, view transitions only add a minimal 1.9kB (minified and gzipped) script to your page: `/@nue/view-transitions.js`. This script optimizes performance by partially updating or replacing page segments instead of re-rendering the entire page. It also manages linked stylesheets by enabling or disabling them as needed, making CSS loading and applying significantly faster.


## Page Weight

Nue always generates clean, semantic HTML with zero clutter. For guidance on writing efficient, modern CSS that remains lean as your site grows, refer to the [styling](styling.html) document.


