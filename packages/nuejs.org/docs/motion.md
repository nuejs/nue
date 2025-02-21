# Motion
Motion and animation are optional yet powerful elements of progressive enhancement. When applied thoughtfully, motion can improve user experience, communicate interactions, and reinforce your brand identity. Subtle animations guide users' attention, make interfaces feel more responsive, and enhance overall usability without detracting from the content.

## CSS transitions
CSS is the backbone of interactive motion on the web. CSS transitions handle much of the work involved in creating smooth, lightweight animations. With modern capabilities, CSS offers a performance-friendly alternative to JavaScript-heavy animation libraries.

Here are some key use cases for CSS transitions:

1. **Enter animations**: Subtle animations as elements appear in the viewport, giving users visual cues about interactive elements.

2. **Scroll-based transitions**: Motion triggered by scrolling, such as revealing content dynamically or using sticky elements that animate based on scroll position.

3. **View transitions**: Smooth transitions between different views or pages, enhancing the sense of continuity and reducing the perceived load time.

4. **Mouse states**: Simple yet effective animations triggered by mouse interactions like hover or mousedown, adding visual feedback and improving interactivity.

Modern CSS goes far beyond basic hover effects. It enables complex, highly-performant animations without the need for cumbersome JavaScript workarounds. Techniques that once required libraries like **Framer Motion** can now be achieved using pure CSS, providing a cleaner, faster, and more maintainable solution for developers.


### Progressive enhancement
In Nue, motion is an enhancement, not a requirement. Motion can be applied or removed without affecting core functionality. This ensures your site remains accessible and lightweight, regardless of user preferences or device capabilities.

**Stylesheets are pluggable**. CSS-based motion can be packaged into pluggable stylesheets, making it easy to enable or disable animations as needed. For example, subtle animations can be applied globally, with increased animation on marketing pages and no animation for technical documentation.


## Enter animations
One of the most underused but incredibly powerful CSS properties is `@starting-style`. While not widely known, it already has an impressive 84% browser adoption rate according to [Can I Use](//caniuse.com/?search=%40starting-style). This property enables you to define the starting values for an element before it becomes visible, allowing for smooth entry animations without the need for JavaScript workarounds or keyframe animations.

`@starting-style` is especially useful for creating seamless animations for elements such as headers, hero images, sidebars, and dialogs. It defines the initial styles for an element, which the browser can transition from when the element first appears. Here's an example of how it can be applied to a popover:

```css
[popover] {
  &::backdrop {
    background-color: #0005;
    backdrop-filter: blur(4px);
    transition: 0.5s;
  }

  @starting-style {
    transform: scale(0.5);
    opacity: 0;

    &::backdrop {
      background-color: #0001;
      backdrop-filter: blur(0);
    }
  }
}
```

In this example, the popover starts off scaled down and transparent, then smoothly transitions to full size and opacity when it opens. The backdrop also transitions to a blurred state, creating a polished and modern effect. Using `@starting-style` makes it easy to handle these first-load animations without requiring heavy JavaScript solutions.

Despite its relative obscurity, `@starting-style` is a highly capable tool for creating entry animations and is well-supported in most modern browsers, making it a great choice for developers who prioritize performance and simplicity.


## View transitions
You can enable view transitions globally by adding this to your `site.yaml` file:

```yaml
view_transitions: true
```

When enabled, view transitions add only a minimal 1.9kB (minified and gzipped) script to your page: `/@nue/view-transitions.js`, which does two things:

1. **Page diffing/swap**: Instead of fully reloading the entire page on each navigation, Page diff/swap intelligently updates only the elements that differ in the new document.

2. **Transition effect**: Nue automatically invokes the [Document: startViewTransition()](//developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) method when a user navigates to a new page, enabling smooth transitions between views.

The best part for motion designers is the ability to fully customize the default fadeout/fadein transition with CSS. For example, here we implement a subtle yet attractive **fade and scale effect** for the main content:

```css
::view-transition-group(main) {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

::view-transition-old(main) {
  opacity: 1;
  transform: scale(1);
}

::view-transition-new(main) {
  opacity: 0;
  transform: scale(0.95);
}
```

In this example, the default fade effect is enhanced with a slight scaling effect, adding depth and smoothness to the user experience.


### View transition + @starting-style
Nue's intelligent page diffing ensures that only the elements that have changed are swapped in, while other parts like headers, sidebars, and footers remain untouched. This makes it possible to use the `@starting-style` technique specifically for newly updated elements. For example, in a documentation page where only the article content changes, you can apply `@starting-style` to create smooth entry animations while the sidebar stays stable.


### View transitioned images
One of the most impressive animations today is the ability to perform a view transition while fluidly morphing the hero image onto the new page. Nue automates this by assigning a `view-transition-name: active-image` when the element that triggered the navigation was an image. This allows you to create a CSS morph effect that transitions the image seamlessly between pages. For example:

```css
.hero-image {
  view-transition-name: active-image;
}

::view-transition-group(active-image) {
  animation-duration: .4s;
}
```

In this example, when the hero image transitions between views, it seamlessly morphs across the pages with a smooth 0.4s animation. This effect creates a polished, cohesive user experience during navigation by maintaining visual continuity.



