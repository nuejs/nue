
---
inline_css: true
---

# Web framework for UX developers
Nue is a web framework for design-minded people. You can turn your idea into a beautifully designed website using mostly CSS. You end up with a beautifully designed website, not just from the outside, but from the inside as well. Most importantly: you can build things faster, since there is no complex JavaScript ecosystem on your way.

[image.gray]
  small: /img/ux-development.png
  large: /img/ux-development-big.png
  size: 747 x 474


Nue's content-first [development flow](ux-development.html) focuses solely on the ~user experience~ because, it's the only thing that matters when building new products. Or as the master UX developer **Steve Jobs** once said:

> You've got to start with the customer experience and work back toward the technology, not the other way around. *Steve Jobs*

- - -

## Target audience
Nue is a great fit for the following group of people:

1. **UX developers**: who natively jump between **Figma** and **CSS** without a confusing [designer-developer handoff](//medium.com/design-warp/5-most-common-designer-developer-handoff-mishaps-ba96012be8a7) process in the way.

2. **Beginner web developers**: who want to skip the redundant layers in the [frontend stack](//roadmap.sh/frontend) and start building websites quickly with modern HTML, CSS and JavaScript.

3. **Experienced JS developers**: frustrated with the absurd amount of layers in the [React stack](//roadmap.sh/react), who desire better ways to develop professional websites.

4. **Designers**: planning to learn web development, but find the JavaScript ecosystem too scary

5. **Parents** and **teachers**: who wants to educate young people [how the web works](//www.websitearchitecture.co.uk/resources/examples/web-standards-model/)


## Key features and benefits


### Less but better code
What used to take a UI designer, React engineer and an absurd amount of JavaScript code can now be done by a UX developer and just a handful of CSS:

[image]
  small: /img/figma-to-css.png
  large: /img/figma-to-css-big.png


Nue allows you to take advantage of a [global design system](global-design-system.html) and [modern, minimalistic CSS](css-best-practices.html) to build websites with significantly less code than with a JavaScript-based framework like **Next.js**. Your codebase can be as small as a [single Tailwind button](/blog/introducing-nue-css/). This changes the way you think about web development. Chances are that Nue turns you into a professional UX developer, who thinks more like a designer and less like an engineer.


### New levels of performance
If there is one word to describe Nue, then it's _minimalism_. There's order of magnitude less of everything: NPM modules, API methods, configuration options and framework-specific idioms. This leads to significantly leaner websites with far less HTML, CSS and JavaScript in the final server response. Just take any professionally-designed website and compare it with Nue, and you'll see the difference. For example:

[image.gridpaper]
  small: /img/docs-sizes.png
  large: /img/docs-sizes-big.png
  caption: The total amount of HTML, CSS, and JavaScript loaded


But that's not all. Nue takes your website performance to new heights by combining your assets into [one, ultra-compact request](performance-optimization.html) which renders in a snap:

[image.gridpaper]
  small: /img/first-paint.png
  large: /img/first-paint-big.png

You can reach the performance levels of a text-only website like [motherfuckingwebsite.com](//motherfuckingwebsite.com/) but with the design standards of **Stripe** or **Apple**. This is literally as fast as you can get. No matter how clever your **Turbopack** or **Vite** is, their output can never beat a single, compact request that has everything to render the page.



### Advanced motion and reactivity
With Nue, things like view transitions and scroll-linked animations are easy to implement with nothing but CSS:

```
/* view transition: scale down the "old" page */
::view-transition-old(root) {
  transform: scale(.8);
  transition: .4s;
}
```

Over the years CSS has evolved from static styling utility to an immensely powerful UX development language. Things like tooltips, dialogs, sliders and popups no longer require JavaScript and are best implemented with CSS.

CSS offers better hardware acceleration than JavaScript and a simpler, more standards-based programming model. Even the more advanced stuff from libraries like **Framer Motion** can be [implemented with modern CSS](//motion.dev/blog/do-you-still-need-framer-motion).

CSS becomes more powerful when coupled with a small amount of JavaScript. Depending on your need you can [choose the best technology](reactivity.html) for the job: reactive island, isomorphic component, Web Component or vanilla JavaScript.



### Timeless skills and products
Nue is the best framework to work with the [web standards](//www.w3.org/wiki/The_web_standards_model_-_HTML_CSS_and_JavaScript): HTML, CSS and JavaScript.

[image.bordered]
  small: /img/web-editor.png
  large: /img/web-editor-big.png

The code you write now is something that all developers can understand now and in the future. There is no fear of it becoming outdated because it's based on standards that are part of the web.

Learn [the power of modern CSS](css-best-practices.html) and stay relevant for the decades to come.


### Easy customer handoff
No matter how rich and complex your page is, it can be assembled with an easy-to-write format suitable for non-technical people:

[bunny-video]
  videoId: 3bf8f658-185a-449c-93b9-9bd5e1ad0d05
  poster: /img/nuemark-splash.jpg

Nue takes the maintenance care off your shoulders. You can hand a finished website to your customers and they can move forward without your constant help.

Nue is a perfect system for freelancers and design agencies who want to offer the best-in-breed websites with an easy way to manage content.


### Try it
You might not believe all these big claims until you [give Nue a try](installation.html). Chances are, you will start wondering why you have ever built websites in any other way.






