
---
hero_title: "*Nue 1.0 (Beta)* — A web framework for UX developers"
title: Nue 1.0 (Beta)
desc: A web framework for UX developers
---

Exactly one year ago I [decided](/blog/backstory/) to create the slickest website generator in the world, that is easy enough for UX developers and other design-minded people. Today this vision is becoming a reality:

[image.larger]
  small: /img/og-blue.png
  large: /img/og-blue-big.png
  size: 747 x 474
  caption: "Nue: go directly from Figma to CSS"

[.note]
  ### The gist
  Nue is simpler. What used to take a separate designer, React engineer, and an absurd amount of JavaScript can now be done by a UX developer and a small amount of CSS.


### Who is Nue for?
Nue is a great fit for the following people:


1. **UX developers**: who natively jump between **Figma** and **CSS** without a confusing [designer-developer handoff](//medium.com/design-warp/5-most-common-designer-developer-handoff-mishaps-ba96012be8a7) processes in the way.


2. **Beginner web developers**: who want to skip the [redundant frontend layers](//roadmap.sh/frontend) and start building websites quickly with HTML, CSS, and JavaScript.

3. **Experienced JS developers**: frustrated with the absurd amount of layers in the [React stack](//roadmap.sh/react) and looking for simpler ways to develop professional websites.

[.quote]
  > “Nue is **exactly** what I want. As a technical founder, I need easier ways to build websites. I don't want to hire devs and watch all my profits disappear in salaries.”

  — Alan Hemmings / [BigNameHunter](//bignamehunter.com/?refer=nuejs) / CEO

4. **Designers**: aiming to learn web development, but find the React/JavaScript ecosystem impossible to grasp



- - -


## What's new?
v1.0 Beta is by far the biggest release yet with 80 commits commits and over 400 files changed. This is a breakdown of new features, updates, and breaking changes.


## Global design system
[Global design system](/docs/global-design-system.html) is by far the biggest new feature in this release. It guarantees that you always get the kind of markup for your projects, but you can write CSS to achieve wildly different designs.

[image]
  small: /img/global-design-system.png
  large: /img/global-design-system-big.png
  caption: Same markup, but wildly different designs
  href: /docs/global-design-system.html

Think Nue like a modern-day [CSS Zen Graden](//csszengarden.com/): a demonstration of what you can accomplish with nothing but CSS. Nue frees you from implementing page layouts and basic UI elements over and over again so you can move faster with nothing but CSS. Or as Brad puts it:

> Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential. *Brad Frost*



## CSS theming improvements
Nue has a powerful CSS theming system that supports [hot-reloading](/docs/hot-reloading.html), CSS inlining, error reporting, and automatic dependency management. This version improves the system with the following features:


* [Lightning CSS](//lightningcss.dev/) is now enabled by default allowing you to use CSS nesting, color-mix, and other modern features now without browser-compatibility concerns.

* [Library folders](/docs/project-structure.html#libraries) to hold re-usable CSS which can be explicitly included on your pages with a new `include` property. You can include assets globally, at the application level, or page level. This helps you take maximum advantage of the [CSS cascade](//developer.mozilla.org/en-US/docs/Web/CSS/Cascade).

* [Exclude property](/docs/project-structure.html#exclude) allows you to strip unneeded assets from the request and lighten the payload.




### CSS best practices
Nue's new [CSS best practices](/docs/css-best-practices.html) are targeted at UX developers who understand the power of external, cascaded styling. It's also a great resource for engineers, who understand the benefits of using modern CSS instead of writing your styles with JavaScript in the name of "global namespace pollution".

These best practices focus on writing clear, reusable CSS that is easy to read, maintain, and scale. It unpacks decades of CSS experience with a heavy focus on _minimalism_. All the practices could be squeezed into one sentence:

[.blueprint]
  10 lines of code is easier to maintain than 100 lines of code

Nue helps you build professional websites with the same amount of CSS as you can find on a typical normalization library or Tailwind's "preflight" CSS.



## View transitions
View transitions are an important part of a seamless user experience and obviously a key feature in the Nue framework. They can now be enabled with this simple configuration variable:

``` yaml
# enable animated page switches globally
view_transitions: true
```

This option was previously called `router`, but this feature is now much more than just a router. It now triggers a [view transition](//developer.mozilla.org/en-US/docs/Web/API/ViewTransition) effect that you can customize with [::view-transition](https://developer.mozilla.org/en-US/docs/Web/CSS/::view-transition) CSS pseudo-element. This website, for example, has a "scale down" transition effect on the page's `article` element. It's defined with this fairly simple CSS:


``` css.blue
article {
  view-transition-name: article;
}

/* view transition (scales down the old article) */
::view-transition-old(article) {
> transform: scale(.8);
> transition: .4s;
}
```

Nue's view transition mechanism implements a simple diffing algorithm to check which parts of the page have been added, changed, or removed and updates the page accordingly. This helps you take advantage of CSS [@starting-style](//developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) to trigger animations when the page sections are updated. The non-updating elements stay in place. You can see this in action when you click the sidebar elements under the [documentation](/docs/) area.

View transitions is a broad standard with tons of visual possibilities that are yet unexplored. Nue is going to stay at the forefront of this technology and you'll see tutorials, templates, and new features in the future.



### Dynamic sections and grid items
You can turn your [page sections](/docs/page-layout.html#sections) into web components with a `section_component` configuration option. For example, on the front page of this website, we have a "scroll-transition" component to help implement all the scroll-triggered CSS transitions.

```
section_component: scroll-transition
```

The web component can be assigned globally in `site.yaml` for all page sections or it can be assigned on the area level, or at the page level (in front matter). Similar to dynamic sections, you can also create [dynamic grids](/docs/reactivity.html#grid-items) with a newly added [grid](/docs/tags.html#grid) component.


### Freeform file naming
There are no longer hardcoded `app.yaml`, `layout.yaml`, or `main.js` file names to give them a special meaning. You can now freely name your CSS, YAML, JavaScript, or HTML files. You can also have multiple data and layout files and they are all grouped or concatenated together. You could, for example, create a `layout.html` file for layout-specific components and a `components.html` file for other server-side components.


## Small updates

* Inline SVG support: you can inline your SVG files with a new inline attribute. For example: `[image /img/my-animated.svg inline]`. This allows you to control the image and its transitions/animations with CSS.

* Files with a `.htm` suffix are treated as [client-side components](/docs/reactive-components.html). Now both `.nue` and `.htm` files are treated the same.

* Blog entries are now sorted by both `pubDate` and a new, shorter `date` property.

* You can use both `og_image` and a new, shorter `og` property to assign an open graph image for the page.



## Breaking changes
The major version number goes from zero to one, which means that ~this version of Nue is not backward compatible~. There are the following changes that might break your HTML or CSS from working:

* The former `css_2023` configuration is now called `native_css_nesting`, which attempts to more accurately describe what it does: uses native CSS nesting. Setting this to `true` generates a smaller CSS output, but is not supported by the oldest of browsers. Check the current [Can I Use](//caniuse.com/css-nesting) statistics for details.

* Syntax highlighted blocks are no longer marked with a `glow` attribute so you must change your `[glow]` CSS selector to `pre`. This change is in line with our goal to strive more standards-based HTML layout without exotic class- or attribute names.

* Selected navigation links are no longer marked `active` attribute, but with `aria-selected` attribute to make them more compatible with the HTML standard.

* HTML generated with the `[image]` Markdown extension (or "tag") has always a `<figure>` tag as the parent element to make it easier to style the different `figure`, `img`, `picture`, and `figcaption` combinations.

* The content is always wrapped inside a `<section>` element, even if there is only a single section on the document. This generates always the same markup so it's easier to style.

* Dropped the `[icon]` tag due to lack of usage. Use the `[image]` tag instead.

* Fenced code blocks can now be assigned a classname as follows

``` html
\``` .blue
<p>the code here is rendered bigger</p>
\```
```

This will nest the generated `<pre>` element with a wrapper element like this:


``` html
<div class="blue">
  <pre>...</pre>
</div>
```

Previously the class name would be set directly to the `pre` element. This makes a more consistent behavior with the `[code]` tag.


## New website and documentation
Unsurprisingly, the biggest job was the documentation area, which now focuses on [UX development](/docs/ux-development.html). About 80% of the documentation is completely rewritten and there are several new documents.

[image.larger.shadowed]
  small: /img/new-docs.png
  large: /img/new-docs-big.png
  _size: 747 x 474
  caption: The documentation focuses on UX development

The most important thing, however, is that the website is generated with the public Nue version, forcing us to "eat our own dogfood".



## Towards 1.0 stable
At least the following things should be solved before the official 1.0 launch day:

* Collect feedback from users and improve the product and the documentation so that everything is as easy and smooth as possible.

* Easier product onboarding. The current `bun install` and `create-nue` combination is not the easiest solution. Ideally, this would be a single bash script similar to what Bun does. I'm not a shell scripter so help is appreciated here.

* Extra smooth and solid view transition support. Improve the current implementation even more, fix all issues, expose the CSS and JavaScript API, and provide examples and better documentation. I want Nue to be the best web framework in the world and solid view transitions are a fundamental part of a great user experience.



## Installation
Head over to [installation docs](/docs/installation.html) to try the new 1.0 beta. If something does not feel right, don't hesitate to give feedback in [Github Discussions](https://github.com/nuejs/nue/discussions).


