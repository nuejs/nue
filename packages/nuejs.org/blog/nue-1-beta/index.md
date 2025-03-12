---
hero_title: "*Nue 1.0 (Beta)* — A web framework for UX developers"
title: Nue 1.0 (Beta)
desc: We just released a beta version of the upcoming Nue 1.0 to give you a little idea what the final product will eventually look like.
date: 2024-08-15
---

Exactly one year ago I [decided](/blog/backstory/) to create a super simple website generator targeted for the following people:


1. **UX developers**: who natively jump between **Figma** and **CSS** without a confusing [designer-developer handoff](//medium.com/design-warp/5-most-common-designer-developer-handoff-mishaps-ba96012be8a7) process in the way.

2. **Beginner web developers**: who want to skip the [redundant frontend layers](//roadmap.sh/frontend) and start building websites quickly with HTML, CSS, and JavaScript.

3. **Experienced JS developers**: frustrated with the absurd amount of layers in the [React stack](//roadmap.sh/react) and looking for simpler ways to develop professional websites.

[.quote]
  > “Nue is **exactly** what I want. As a technical founder, I need easier ways to build websites. I don't want to hire devs and watch all my profits disappear in salaries.”

  — Alan Hemmings / [BigNameHunter](//bignamehunter.com/?refer=nuejs) / CEO

4. **Designers**: planning to learn web development, but find the JavaScript ecosystem too scary

5. **Parents & Teachers**: who wants to educate people [how the web works](//www.websitearchitecture.co.uk/resources/examples/web-standards-model/)


[image.larger]
  small: img/og-blue.png
  large: img/og-blue-big.png
  size: 747 x 474

- - -


## What's new?
**v1.0 Beta** is by far the biggest release yet with five months of work and over [500 files changed](//github.com/nuejs/nue/pull/316). This is a breakdown of new features, updates, and breaking changes.


## Improved CSS stack
Nue has a powerful CSS theming system that supports [hot-reloading](/docs/hot-reloading.html), CSS inlining, error reporting, and automatic dependency management. This version improves the system with the following features:


- [Lightning CSS](//lightningcss.dev/) is now enabled by default allowing you to use CSS nesting, color-mix, and other modern features now without browser-compatibility concerns.

- [Library folders](/docs/project-structure.html#libraries) to hold reusable CSS which can be explicitly included on your pages with a new `include` property. You can include assets globally, at the application level, or page level. This helps you take maximum advantage of the [CSS cascade](//developer.mozilla.org/en-US/docs/Web/CSS/Cascade).

- [Exclude property](/docs/project-structure.html#exclude) allows you to strip unneeded assets from the request and lighten the payload.


## CSS view transitions
View transitions are an important part of a seamless user experience and are a key feature in the Nue framework. They can now be enabled with this simple configuration variable:

``` yaml
# enable animated page switches globally
view_transitions: true
```

This option was previously called `router`, but this feature is now much more than just a router. It now triggers a [view transition](//developer.mozilla.org/en-US/docs/Web/API/ViewTransition) effect that you can customize with [::view-transition](//developer.mozilla.org/en-US/docs/Web/CSS/::view-transition) CSS pseudo-element. This website, for example, has a "scale down" transition effect on the page's `article` element. It's defined with this compact CSS:


```css.blue
article {
> view-transition-name: article;
}

/* view transition (scales down the old article) */
>::view-transition-old(article) {
  transform: scale(.8);
  transition: .4s;
}
```

Nue's view transition mechanism implements a simple diffing algorithm to check which parts of the page have been added, changed, or removed and updates the page accordingly. This helps you take advantage of the CSS [@starting-style](//developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) at-rule to trigger animations when the page sections are updated. The non-updating elements stay in place. You can see this in action when you click the sidebar elements under the new [documentation](/docs/) area.

View transitions is a broad standard with tons of visual possibilities that are yet unexplored. Nue helps you stay in the forefront CSS development.


## CSS best practices
Nue's new [CSS best practices](/docs/styling.html) brings out the best of modern CSS:

[image.larger]
  small: /img/blog-css-hierarchy.png
  large: /img/blog-css-hierarchy-big.png
  caption: Nue offers the shortest path from Figma to code
  href: /docs/styling.html

These lessons focus on writing reusable CSS that is easy to read, maintain, and scale. It unpacks decades of CSS experience with a heavy focus on *clarity* and *minimalism*. In fact, all the lessons can squeezed into this one sentence:

[.blueprint]
  10 lines of code are easier to maintain than 100 lines of code

Nue helps you build professional websites with the same amount of CSS as you can find on a typical normalization library or Tailwind's "preflight" CSS.


## New website and documentation
Unsurprisingly, the biggest job was the documentation area, which now focuses on [Design Engineering](/docs/how-it-works.html#design-engineering). About 80% of the documentation is completely rewritten and there are several new documents.

[image.larger.shadowed]
  small: /img/new-docs.png
  large: /img/new-docs-big.png
  _size: 747 x 474
  caption: The documentation focuses on UX development
  href: /docs/

The most important thing, however, is that the website is generated with the public Nue version, forcing us to "eat our own dogfood".


## Easier setup

Nue [installation](/docs/installation.html) is now simpler and the onboarding now comes with a handy `nue create` command that installs an example website and opens it on your browser. The opening screen looks like this:

[image]
  small: /img/create-welcome.png
  large: /img/create-welcome-big.png
  caption: The welcome screen after successful setup
  href: /docs/installation.html

The setup is supported by a [tutorial](/docs/tutorial.html) that explains how Nue and UX development works.

- - -


## Smaller updates


### Freeform file naming
There are no longer hard coded `app.yaml`, `layout.html`, or `main.js` file names to give them a special meaning. You can now freely name your CSS, YAML, JavaScript, or HTML files. You can also have multiple data and layout files, and they are all grouped or concatenated together. You could, for example, create a `layout.html` file for layout-specific components and a `components.html` file for other server-side components.


### Dynamic sections and grid items
You can turn your [sections](/docs/content.html#sections) and [grid items](/docs/reactivity.html#grid-items) into a native Web Component. For example, on the front page of this website, we have a "scroll-transition" component to help implement all the scroll-triggered CSS transitions.

```yaml
section_component: scroll-transition
```

The web component can be assigned globally in `site.yaml` for all page sections or it can be assigned on the area level, or at the page level (in the front matter).


### Miscellaneous new features
- New `<navi>`, `<markdown>`, `<pretty-date>`, and `<toc>` tags to help building [custom layouts](/docs/layout.html)

- A new [`<gallery>`](/docs/content-collections.html#gallery) tag to render content collections

- Inline SVG support: You can inline your SVG files with a new inline attribute. For example: `[image /img/my-animated.svg inline]`. This allows you to control the image and its transitions/animations with CSS.

- Files with a `.htm` suffix are treated as [client-side components](/docs/islands.html). Now both `.nue` and `.htm` files are treated the same.

- Blog entries are now sorted by both `pubDate` and a new, shorter `date` property.

- You can use both `og_image` and a new, shorter `og` property to assign an open graph image for the page.


## Breaking changes
The major version number goes from zero to one, which means that ~this version of Nue is not backward compatible~. There are the following changes that might break your HTML or CSS from working:

- The former `css_2023` configuration is now called `native_css_nesting`, which attempts to more accurately describe what it does: Using native CSS nesting. Setting this to `true` generates a smaller CSS output, but is not supported by the oldest of browsers. Check the current [Can I Use](//caniuse.com/css-nesting) statistics for details.

- Syntax highlighted blocks are no longer marked with a `glow` attribute so you must change your `[glow]` CSS selector to `pre`. This change is in line with our goal to strive for a more standards-based HTML layout without exotic class or attribute names.

- Selected navigation links are no longer marked `active` attribute, but with `aria-selected` attribute to make them more compatible with the HTML standard.

- HTML generated with the `[image]` Markdown extension (or "tag") now always has a `<figure>`-tag as the parent element to make it easier to style the different `figure`, `img`, `picture`, and `figcaption` combinations.

- The content is always wrapped inside a `<section>` element, even if there is only a single section on the document. This always generates the same markup so it's easier to style.

- Dropped the `[icon]` tag due to lack of usage. Use the more generic `[image]` tag instead.

- Fenced code blocks can now be assigned with a class name as follows:

```html
\``` .blue
<p>the code here is rendered bigger</p>
\```
```

This will nest the generated `<pre>` element with a wrapper element like this:


```html
<div class="blue">
  <pre>...</pre>
</div>
```

Previously the class name would be set directly to the `pre` element. This makes a more consistent behavior with the `[code]` tag.


## Try now!
Please [try it out](/docs/installation.html) and experience the difference in UX development. You might wonder why you ever built websites any other way.
