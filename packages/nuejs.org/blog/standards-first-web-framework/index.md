---
title: A standards-first web framework
description: Nue is a close-to-metal framework for fast tooling and clean code. It's the modern HTML, CSS, and JavaScript taken to their absolute peak.
date: 2025-01-15
# unlisted: true
---

Today, we're releasing a "standards-first web framework": a development environment that removes all redundant layers between you and the web. It leverages modern **HTML**, **Markdown**, **CSS**, and **JavaScript** directly, addressing the to key issues in frontend development:

[.quote]
  > “Nue is exactly what it promises: faster tooling, cleaner code, and a liberating experience. You must try it.”

  **Mauricio Wolff**, design engineering lead at **Loom**


## The frontend engineering problem
I have lived through the eras of **DHTML**, **jQuery**, and now the era of **React**. I experienced positive growth in the first two eras, but this last one has been a struggle: instead of building on web standards, we've buried them under layers of abstractions. What began as elegant HTML, CSS, and JavaScript has devolved into a build theatre demanding hundreds of dependencies just to render a page.

We've normalized this extraordinary complexity. Simple landing pages need hundreds of lines of **TypeScript**, complex configurations, module bundlers, CSS preprocessors, and an endless chain of plugins. Blog posts that should be static content require React components and state management. Documentation sites need a new framework with different patterns and a separate maintenance burden.

The cost is more than just complexity, build times, and development speed. It's fundamentally changed how we think about web development. Teams spend more time wrestling with framework documentation than solving real problems. Build times that should take milliseconds are taking minutes. Each day we drift further from the web's core strengths.

The biggest trouble is this: the more you invest in learning today's frameworks, the more technical debt you accumulate in your mind. React patterns from just a few years ago are now considered anti-patterns. State management solutions keep cycling through **Redux**, **MobX**, **Recoil**, and countless others. Meanwhile, the web platform itself has quietly evolved to provide native solutions for most of what these frameworks try to solve. The untapped power might surprise you.



## The design engineering problem
I've been building frontends for almost three decades now. I literally remember when CSS was released to **Internet Explorer 3.0**. Ever since, I've been living in the fascinating intersection between design and engineering. My heroes aren't framework creators but the masters of systematic design: **Mies van der Rohe** and **Dieter Rams**. They showed how math and minimalism create more impact than decoration.

Today should be the golden age for design engineering. Modern CSS finally gives us the power to express sophisticated design systems through mathematics. We can create linear, typographic scales, color relationships through **OKLCH** calculations, and layouts with container queries. We have endless possibilities for systematic design.

But the JavaScript monolith has blocked the progress:

1. First, JavaScript engineers have hijacked the conversation. They obsess over "global namespace pollution", "dead code elimination", or "CSS type safety" while completely missing the point. When was the last time you saw engineers debating the merits of the **Perfect Fifth** typographic scale or the principles behind Dieter Rams's systematic approach?

2. The core issue, however, is the inability to participate in the actual craft. Design decisions are buried in React components with cryptic expressions like `flex items-center shadow-lg p-6 hover:bg-gray-50 dark:bg-gray-800 py-[calc(theme(spacing[2.5])-1px)]`. This might make sense for React engineers, but it's an insult to systematic design.

3. The gap between design and engineering has never been wider. There's even a name for it: "a designer-developer handoff". The path from Figma to React is cryptic. Meanwhile, the amazing dynamics between CSS variables and `calc()` remains unexplored.

By coupling design decisions to JavaScript components, we've created a design monoculture. You cannot take a headless structure and apply different designs to it. You can't switch between Rams's human-centric functionalism and Mies's architectural minimalism.

The JavaScript monolith isn't just a technical problem, it is suffocating the creative results of systematic design.

Form follows function is dead.



## The standards-first web framework

To relief my disappointment with the frontend ecosystem, I'm releasing a better way to build websites. It is based on the following foundations:

1. [Standards first](/docs/): Modern browsers offer native capabilities that eliminate the need for most framework abstractions. By working with web standards rather than against them, we create better products with less code.

1. [Content first](/docs/content.html): Rich Markdown syntax handles everything from marketing to documentation. Content lives in clean, accessible files - not in JavaScript.

1. [HTML first](/docs/layout.html): HTML should not be hidden behind abstractions. Better for search engines, screen readers, and developers.


It's the perfect system for web developers offering a powerful solution for:

1. [Styling](/docs/styling.html): I talked about this already. CSS is more powerful than you think. Master it, and you'll create better interfaces with less code.

1. [Scripting](/docs/scripting.html): Same thing here. Focus on the core language rather than temporary framework patterns. Standards last forever.

1. [Motion](/docs/motion.html): Modern CSS handles all this with ease. Forget Framer motion and learn the fundaments insted. After all UX, is more about reduction than deco.

1. [Performance](/docs/optimization.html): The fastest page load is one that requires just a single request. No framework initialization, no cumulative layout shifts, no waiting for JavaScript. When content and styling arrive together, pages simply appear.

This stack enables me to finally implement what I want:



## The design system of my dreams
I've been a design engineer since CSS was invented. From the beginning, I've been obsessed with building "systems of design" - starting with stupid, clumsy attempts that slowly grew more sophisticated over time. Now, with modern CSS and proper separation of concerns, I can finally create the design system I've been building in my mind for decades:

```sh
nue create startup --design rams
```

Let's dive into this. First off, this command structure is the very reason I started building Nue in the first place. It demonstrates the benefits of separation of concerns as clearly as possible. A template defines the **function** - whether it's a blog, an idea showcase, a startup platform, or an enterprise site. The design system defines the **form**, which brings the template to life through a user-selected look and feel.

Behind the "rams" argument is something called a **global design system** that acts as a basis for four wildly different mathematical expressions, aka design systems:

1. **Mies** — This design system is obviously special. It's the hardcore minimalism that designers look up to. The result looks remarkably similar to **Linear**, but achieves its commanding presence through mathematical precision: stark contrasts, intense whitespace, and bold architectural functionalism. Check **Seagram Building** in **New York** and you'll get the point.


2. **Rams** — Dieter Rams is the man behind **Apple**'s design philosophy. Like Mies, he used mathematics to achieve harmony. This design system is perhaps closest to what current utility-first frameworks aim for. Think **Stripe**, but without the decorative stripes.

3. **Zaha** — Translates **Zaha Hadid**'s bold architectural vision into digital space. Where Linear suggests depth through noise via `feTurbulence`, Zaha fully embraces the third dimension through systematic shadows, calculated blur effects, and precise transforms that create dramatic movement while maintaining perfect mathematical relationships.

4. **Muriel** —  **Muriel Cooper** revolutionized digital design at MIT by showing how mathematical systems could create both precision and joy. This system builds on her work, proving how systematic thinking enables creative freedom. Like Apple, it achieves playfulness through calculation - but goes further by making every relationship mathematically pure.

Imagine what this means for web development: you can create an Apple-like startup site for one client, a Stripe-like platform for another, and a Linear-inspired interface for a third. All through a single command that takes seconds rather than the months of custom development these looks typically require.

But even this is just the beginning...



## Single-page applications
As much as I love design, I've always loved JavaScript. Not because of its weaknesses obviously, but its strength in implementing beautiful, interactive frontends together with CSS. This is exactly what SPAs are about, and never before has the web been more ready for this level of design and functional quality.

SPAs sit right in the middle of design and engineering and want Nue to go further than the JavaScript monolith ever could. Three ways:

1. Architecture is based on **MVC** (model, view, controller) which creates the much needed separation of concerns. JS engineers work on pure business logic. UI developers craft the experience. Everyone stays in their zone of expertise.

2. The design system is clearly separated. Change the look and feel of the website from Mies to Muriel, and the SPA will follow. Form follows function again.

3. The SPA becomes a seamless part of your marketing site: the design system, performance, and view transitions. The movement between static and dynamic pages is seamless. It all feels like one product.

Think what this means for agencies and freelancers:

```sh
nue create spa --function crm --todir app --design inherit
```

This creates a complete startup platform, all expressing itself through the same sophisticated design system. What previously required multiple teams and months of development now emerges from one command.

You can see how this changes things. Instead of building from scratch, you get Linear-level design, Stripe-level functionality, and a consistent UX in an instant.

But we will not stop here. Our [ultimate goal](/vision/) is to be the frontend cloud of the future without the unnecessary bloat. And unlike many ambitious visions in tech, this one is actually achievable.



## Invest in Nue?
I have no trouble completing this. As an independent developer I have time, and with templates having a price tag, we'll have the money. That is: we can implement the vision without raising anything. And there's something powerful about maintaining complete creative freedom.

However, I'm increasingly thinking about external guidance, and possibly investment. An ambitious project like this might benefit from someone who shares the same level of commitment. This could help me maintain deep focus on design engineering, while someone else could deal with the growing community. I'm notoriously bad at keeping in contact with people. Like Mies said: "Build, don't talk."

Still, I would love to discuss the bigger picture with someone who gets it. It's lonely sometimes. If you feel drawn to this vision (or know someone who might be), reach out at tipiirai@gmail.com. I'm still in the thinking phase with no commitments. Getting the fundamentals right is more important than moving fast.

