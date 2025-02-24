---
title: Tailwind vs Semantic CSS
desc: Comparing two identically designed websites, their weight, amount of HTML and CSS, rendering speed, and best practices.
og: img/markup-big.png
date: 2023-10-23
---


This study compares two websites with similar design: The commercial Spotlight template from developers of Tailwind vs the same site with semantic CSS:

[.stack]
  [image]:
    href: //spotlight.tailwindui.com/
    small: img/tw-home.png
    large: img/tw-home-big.png
  ---
  [image]:
    href: /@spotlight/
    large: img/nue-home-big.png
    small: img/nue-home.png


## Front page HTML
The main difference: Tailwind uses "utility" classes and the semantic version uses external stylesheets. That is: Tailwind styles elements inline, directly on the markup and the semantic version respects the [separation of concerns](//en.wikipedia.org/wiki/Separation_of_concerns) principle.

You can see the difference by drilling down to the first A-element:

[image]:
  small: img/markup.png
  large: img/markup-big.png
  caption: Drilling down to the first element on the main navigation


Tailwind needs significantly more coding because you are completely lacking the power of CSS: The way it cascades and the richness of the selectors. You are forced to wrap divs inside divs inside divs and fill the elements with Tailwind-specific class syntax.

Here is the full HTML source code of the front page.

[image]:
  small: img/html.jpg
  large: img/html-big.jpg
  caption: Full HTML coding on the front page


Tailwind (and Next.js) generate 75K of unminified HTML, while the semantic version is only 8K. While some parts come from Next, it's pretty clear that Tailwind requires significantly more HTML to render the same design, than the semantic version.

With Tailwind the [Text to HTML Ratio][tw-ratio] is only 2.3%, which is "Very low" according to SiteGuru. [Nue ratio][nue-ratio], however, is 20.3% which is "Good".

[tw-ratio]: //www.siteguru.co/free-seo-tools/text-to-html-ratio?url=spotlight.tailwindui.com

[nue-ratio]: //www.siteguru.co/free-seo-tools/text-to-html-ratio?url=nuejs.org/@spotlight/


## Front page CSS
Let's study the difference in CSS coding:

[image]:
  small: img/css.jpg
  large: img/css-big.jpg
  caption: Full CSS coding on the front page


Blue is semantic CSS, gray is utility classes, and black-bordered is primary CSS (which makes your pages render faster).

Some key takes:

1. Tailwind CSS is seven times larger: 33K vs 4.6K. Overall you need eight times more HTML/CSS code with Tailwind to render the page (108K vs 12.6K). While the design is not identical, but it's easy to see the ballpark figure in there. Tailwind-generated sites are multiple times larger.

2. Most of the semantic CSS is reusable on other pages and only a fraction of the CSS is specific to the front page. It's easy to create new pages when the groundwork is already done.

3. "Spotlight" is just a *theme* extending a base design. There is an extremely minimalistic [base-version](/@base/) of the website that can be used to create new themes, like our Spotlight theme.

[image]:
  small: img/extending.png
  large: img/extending-big.png
  caption: Creating a new design by extending a semantic base design


Theming is a powerful concept in CSS. You can alter your design by swapping parts of your CSS with another one or overriding a [base version](/@base/). Theming is impossible with Tailwind because the design is tightly coupled to the markup. If you want a new design, you must edit your markup and override your earlier work.


## Rendering speed
The two metrics that measure page rendering speed are [first contentful paint](//web.dev/articles/fcp) (FCP) and [largest contentful paint](//web.dev/articles/lcp) (LCP). The semantic version is faster than in both metrics and in both mobile and PC. Here's LCP on mobile for example:

[image]:
  small: img/lcp-mobile.png
  large: img/lcp-mobile-big.png
  caption: Largest Contentful Paint (LCP) rendering speed on mobile


Please compare [Tailwind metrics](//pagespeed.web.dev/analysis/https-spotlight-tailwindui-com/cqtnf4xxoy?form_factor=mobile) with [Semantic CSS metrics](//pagespeed.web.dev/analysis/https-nuejs-org-spotlight/6nnhwwnz8b?form_factor=mobile).

Two reasons why the semantic version is faster:

1. The primary CSS is [inlined](//imkev.dev/loading-css) on the HTML page so that all the assets for the first viewport are fetched in the initial request. This is probably the most important performance optimization for the perceived page-loading experience.

2. The first request is [less than 14K][14k], which is the maximum size of the first TCP packet.

[14k]: //endtimes.dev/why-your-website-should-be-under-14kb-in-size/


## Separation of concerns
Tailwind embraces **tight coupling**. That is: The structure and styling are tied together. The semantic approach is the opposite: The structure and styling are **loosely coupled**. Here's what that means:

[image]:
  small: img/coupling.png
  large: img/coupling-big.png
  caption: Tight coupling vs Loose coupling


The semantic version, allows you to change the design of the gallery freely. You name the component and style it externally. With Tailwind the style cannot be separated from the structure.

Here's a better example. Let's look at the "Uses" or "Setup" page on both implementations:

[.stack]
  [image]:
    href: //spotlight.tailwindui.com/uses
    small: img/tw-uses.png
    large: img/tw-uses-big.png
    caption: Tailwind UI version →
  ---
  [image]:
    href: /@spotlight/setup/
    large: img/nue-uses-big.png
    small: img/nue-uses.png
    caption: Semantic version →

With Tailwind, you must create a JavaScript component to construct a suitable HTML structure for the design. With the semantic version, we can use Markdown in place of the custom JSX component because the generated HTML is semantic and can be styled externally with CSS selectors:

[image]:
  small: img/content-first.png
  large: img/content-first-big.png
  caption: Tight vs loose coupling from a different angle

Loose coupling makes you think **content first**. There is no need to write a component for every situation because you can use external CSS to do the heavy lifting.

&nbsp;


## But ...


### But naming things is unnecessary
Naming things is a skill. You name things that repeat. Think of function names in JavaScript or component names in Figma. The same goes for CSS class names. Be good at naming, and you can move from repeating things to reusing things. That is: You can move from this:

```html
<!-- utility-first css -->
<button className="group mb-8 flex h-10 w-10
  items-center justify-center rounded-full
  bg-white shadow-md shadow-zinc-800/5 ring-1
  ring-zinc-900/5 transition dark:border
  dark:border-zinc-700/50 dark:bg-zinc-800
  dark:ring-0 dark:ring-white/10
  dark:hover:border-zinc-700
  dark:hover:ring-white/20
  lg:absolute lg:-left-5
  lg:mb-0 lg:-mt-2
  xl:-top-1.5
  xl:left-0
  xl:mt-0">
```

To this

```html
<!-- semantic css -->
<button class="secondary">
```

Without turning into components.


### But co-location is important?
Co-location is a catchy name for tight coupling. A term to promote the idea that styling should be tied to the presentation. Repeating things vs. reusing things. See above.


### But Tailwind is a great design system
Tailwind has great defaults for colors, spacing, and responsive design. That part is roughly 3% of your Tailwind CSS file. It's easy to copy these defaults to your semantic design system if needed.


### But I move faster with Tailwind
Yes. You can move faster with Tailwind. But only when:

1. You are comparing Tailwind with your earlier, bad experiences with CSS or you are new to CSS development.

2. You don't care about building reusable CSS for later use. That is: You are not naming things that repeat.

If you really want to move faster, you'll create a set of CSS components that you can reuse. Like `<button class="secondary">`.


### But why is Tailwind so popular then?
Because mastering CSS requires practice. It takes several failed attempts before you get it. Most developers haven't gone through that, so they only remember the bad things.

The fact is that Tailwind's popularity will eventually fade. CSS-in-JS is trending now, but standards are forever. At some point, we'll all experience a "WTF moment" when looking at the tightly coupled Tailwind code.
