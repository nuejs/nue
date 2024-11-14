
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
One of the most underused but incredibly powerful CSS properties is `@starting-style`. While not widely known, it already has an impressive 84% browser adoption rate according to [Can I Use](https://caniuse.com/?search=%40starting-style). This property enables you to define the starting values for an element before it becomes visible, allowing for smooth entry animations without the need for JavaScript workarounds or keyframe animations.

`@starting-style` is especially useful for creating seamless animations for elements such as headers, hero images, sidebars, and dialogs. It defines the initial styles for an element, which the browser can transition from when the element first appears. Here’s an example of how it can be applied to a popover:

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

In this example, the popover starts off scaled down and transparent, then smoothly transitions to full size and opacity when it opens. The backdrop also transitions to a blurred state, creating a polished and modern effect. Using `@starting-style` makes it easy to handle these first-load animations without needing heavy JavaScript solutions.

Despite its relative obscurity, `@starting-style` is a highly capable tool for creating entry animations and is well-supported in most modern browsers, making it a great choice for developers who prioritize performance and simplicity.



## View transitions
You can enable view transitions globally by adding this to your `site.yaml` file:

```yaml
view_transitions: true
```

When enabled, view transitions add only a minimal 1.9kB (minified and gzipped) script to your page: `/@nue/view-transitions.js`, which does two things:

1. **Page diffing/swap**: Instead of fully reloading the entire page on each navigation, Page diff/swap intelligently updates only the elements that differ in the new document.

2. **Transition effect**: Nue automatically invokes the [Document: startViewTransition()](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) method when a user navigates to a new page, enabling smooth transitions between views.

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
Nue’s intelligent page diffing ensures that only the elements that have changed are swapped in, while other parts like headers, sidebars, and footers remain untouched. This makes it possible to use the `@starting-style` technique specifically for newly updated elements. For example, in a documentation page where only the article content changes, you can apply `@starting-style` to create smooth entry animations while the sidebar stays stable.


### View transitioned images
One of the most impressive animations today is the ability to perform a view transition while fluidly morphing the hero image onto the new page. Nue automates this by assigning a `view-transition-name: active-image` when the element that triggered the navigation was an image. This allows you to create a CSS morph effect that transitions the image seamlessly between pages. For example, you could do following for your hero image:

```css
.hero-image {
  view-transition-name: active-image;
}

::view-transition-group(active-image) {
  animation-duration: .4s;
}
```

In this example, when the hero image transitions between views, it seamlessly morphs across the pages with a smooth 0.4s animation. This effect creates a polished, cohesive user experience during navigation by maintaining visual continuity.


Here’s the full **Scroll triggered transitions** section with comments added to the code, along with an adjusted explanation:



## Scroll triggered transitions
One effective way to create smooth, visually engaging animations across a site is through scroll-triggered transitions. This can be done globally by adding a script that automatically detects when sections of the page scroll into view and applies custom CSS transitions for each section. With Nue, this system leverages a combination of JavaScript and CSS to achieve smooth animations while maintaining performance and separation of concerns.

Let’s walk through how to set up this system.

### Step 1: Defining page sections
First, we define the different sections of our page in the front matter. In this example, we create a page that is split into the following sections: `hero`, `explainer`, and `backstory`:

```md
---
sections: [hero, explainer, backstory]
---

# UX development
Hello, world! Introducing...

## How it works
1. World-class design
2. Slick motion
3. Great UX

## Backstory
UX development has always ...
```

### Step 2: Setting up the global scroll-triggered script
Next, we create a script called `global/scroll.js` that will apply an `outside-viewport` class to each section when it is out of view and remove it when the section enters the viewport. This class will allow us to customize transitions based on whether an element is visible or not.

Here’s the script that makes this happen:

```js
// Array to store sections on the active page
let sections = []

// Create an IntersectionObserver to toggle the "outside-viewport" class
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry =>
    entry.target.classList.toggle('outside-viewport', !entry.isIntersecting)
  )
})

// Trigger this when a new page is routed or transitioned
window.addEventListener('route', function() {

  // Cleanup previous observers
  sections.forEach(section => observer.unobserve(section))

  // Observe new sections on the current page
  sections = [...document.querySelectorAll('section')].filter(section => {
    observer.observe(section)
    return true
  })

})
```

**How this script works:**

- We use the **IntersectionObserver API**, which watches the position of each section relative to the viewport. When a section enters or exits the viewport, the API triggers, adding or removing the `outside-viewport` class.

- When the user navigates to a new page, the script cleans up the old observers (to avoid memory leaks) and sets up observers for the sections on the new page.

- The `route` event in the code simulates a single-page application (SPA)-style page transition, but if you're not using an SPA framework, you can run this logic on `DOMContentLoaded` for static sites.

### Step 3: Customizing section transitions with CSS
Now, you can use CSS to apply different animations to each section. Here’s how you could animate the **explainer** section and its list items with a sequential delay to create a smooth, staggered effect:

```css
.explainer {
  /* Default state when the section is visible */
  opacity: 1;
  transform: translateY(0);

  &.outside-viewport {
    /* State when the section is out of the viewport */
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  li {
    /* Default state for list items when visible */
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease, transform 0.6s ease;

    /* Apply a delay for sequential animation */
    &:nth-child(1) { transition-delay: 0.2s; }
    &:nth-child(2) { transition-delay: 0.4s; }
    &:nth-child(3) { transition-delay: 0.6s; }
  }

  &.outside-viewport li {
    /* List items are hidden and translated when outside the viewport */
    opacity: 0;
    transform: translateY(20px);
  }
}
```

### Explanation of the CSS:
- **.explainer & .outside-viewport**: The `.explainer` section starts fully visible (`opacity: 1`), and when it’s out of view (via the `outside-viewport` class), it fades out and translates down by 30px. This transition is set to take 0.5 seconds.

- **li elements**: The list items within `.explainer` start fully visible as well. When the section enters the viewport, the list items fade in with a slight delay between each item. The delays (`0.2s`, `0.4s`, `0.6s`) create a staggered animation effect.

- **Nesting**: The CSS nesting ensures a clean structure by placing related styles inside the `.explainer` block. This keeps the code minimal and easy to maintain.


