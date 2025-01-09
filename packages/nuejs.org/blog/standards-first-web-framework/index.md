---
title: "Nue: The standards-first web framework"
description: Nue is a close-to-metal framework for fast tooling and clean code. It's the modern HTML, CSS, and JavaScript taken to their absolute peak.
date: 2025-01-15
# unlisted: true
---

Today, we're releasing a standards-first web framework, which is a closer-to-metal development environment for faster tooling and cleaner code. It's the modern HTML, Markdown, CSS, and JavaScript taken to their absolute peak. It is a carefully crafted solution to two major issues in the prevailing frontend development scene:


## The frontend engineering problem
I have lived through the eras of DHTML, jQuery, and now the era of React. I experienced huge positive growth in the first two eras, but this last one has been painful to watch: instead of building on web standards, we've buried them under massive layers of abstractions. What began as elegant HTML, CSS, and JavaScript has devolved into labyrinthine build systems demanding hundreds of dependencies.

We've somehow normalized extraordinary complexity. Simple landing pages need thousands of lines of TypeScript. Blog posts that should be static content require React components and complex state management. Documentation sites need separate frameworks with different patterns and maintenance burdens.

The cost isn't just in code complexity - it's in build times, development speed, and most importantly, in how we think about web development. Teams spend more time wrestling with framework configurations than solving real problems. Build times that could take milliseconds now routinely take seconds or even minutes.

But perhaps most troubling is what this means for developer knowledge. The more you invest in learning today's popular frameworks, the more technical debt you accumulate in your skillset. React patterns from just a few years ago are now considered anti-patterns. State management solutions have cycled through countless iterations. Meanwhile, the web platform itself has quietly evolved to provide native solutions for most of what these frameworks try to solve.

At least for me, the JavaScript monolith is killing the joy in web development.


## The design engineering problem
I've been building frontends for almost three decades now. I literally remember when CSS was released to Internet Explorer 3.0. Ever since, I've been living in the fascinating intersection between design and engineering. My heroes aren't framework creators but the masters of systematic design: Mies van der Rohe and Dieter Rams. They proved how mathematical precision and reduction to essentials creates more profound impact than decoration ever could.

Today should be the golden age for design engineering. Modern CSS finally gives us the power to express sophisticated design systems through pure mathematics. We can craft harmonious typographic scales. Create color relationships through precise OKLCH calculations. Build fluid layouts with container queries. The possibilities for systematic design are extraordinary.

But monolithic JavaScript is a blocker. Here's why:

1. JavaScript engineers have hijacked the conversation. They obsess over "global namespace pollution" and "CSS type safety" while completely missing the point. When was the last time you saw engineers debating the merits of the Perfect Fifth scale or the principles behind Dieter Rams's systematic approach?

2. Design engineers aren't just excluded from the conversation - we're actively blocked from practicing our craft. Design decisions are buried in TypeScript through cryptic expressions like `flex items-center shadow-lg p-6 hover:bg-gray-50 dark:bg-gray-800 py-[calc(theme(spacing[2.5])-1px)]`. This might satisfy engineering minds, but it's an insult to systematic design.

3. The gap between design and engineering has never been wider. We've created an artificial chasm between Figma and React, filled with complex and ineffective "design handoff" processes. Meanwhile, the mathematical precision possible with modern CSS variables and calculations remains almost entirely unexplored.

4. Most importantly: by coupling design decisions to JavaScript components, we've created a design monoculture. You cannot take a clean structure and apply different designs to it. You can't switch between Rams's functional clarity to Mies's commanding minimalism. The very essence of "form follows function" has been lost.

The JavaScript monolith isn't just a technical problem - it's suffocating creative, systematic design.



## The standards-first web framework

Today, I'm releasing a radically different way to build websites. Nue demonstrates how modern web standards, freed from framework complexity, create experiences that are more sophisticated, faster to build, and dramatically simpler to maintain.

The architecture is built on seven core principles:

1. [Standards first](/docs/#standards-first): Modern browsers offer remarkable native capabilities that eliminate the need for most framework abstractions. By working with web standards rather than against them, we create better experiences with less code.

2. [Progressive enhancement](/docs/#progressive-enhancement): Start with pure content and semantic structure. Each layer - styling, interactivity, motion - builds naturally on what came before. No framework initialization, no hydration, no complexity.

3. [Content first](/docs/#content-first): Rich Markdown syntax handles everything from marketing to documentation. Content lives in clean, accessible files - not buried in JavaScript.

4. [HTML first](/docs/#html): The web is built on semantic markup. We embrace HTML's natural structure rather than hiding it behind framework abstractions. Better for search engines, screen readers, and developers alike.

5. [CSS first](/docs/#css): CSS works at its full potential, enabling true mathematical design systems through variables, calculations, and color relationships. Design flows from systematic thinking rather than component libraries.

6. [Motion design](/docs/#motion): Modern CSS handles sophisticated animations natively. Smooth transitions between pages, scroll-driven effects - all without JavaScript.

7. [Extreme performance](/docs/#performance): The fastest page load is one that requires just a single request. No framework initialization, no cumulative layout shifts, no waiting for JavaScript. When content and styling arrive together, pages simply appear.

This technology stack enables me to finally implement what might be the most important project of my career:


## The design system of my dreams
I've been a design engineer since CSS was invented. From the beginning, I've been obsessed with building "systems of design" - starting with stupid, clumsy attempts that slowly grew more sophisticated with each iteration. Now, with modern CSS and proper separation of concerns, I can finally create the design system I've dreamed of for decades.

The goal is simple:

``` sh
nue create startup --design rams
```

This command is in fact the reason why I started building Nue. It demonstrates true separation of concerns - something impossible with the JavaScript monolith. A template defines the core functionality - whether it's a blog, an idea showcase, a startup platform, or an enterprise site. The design system then brings it to life through a user-selected look and feel.

Right now, I'm building a so called _global design system_ that acts as basis for four wildly different mathematical expressions:

1. **Mies** — This system achieves dramatic impact through extreme reduction. The result looks remarkably similar to Linear, but achieves its commanding presence through mathematical precision: stark contrasts, intense whitespace, and bold architectural functionalism. When every relationship emerges from calculation rather than decoration, interfaces achieve a timeless sophistication.

2. **Rams** — This system builds on Dieter Rams's human-centered functionalism. The end result closely resembles Stripe's clean aesthetic, but stripped of ornamental elements. This is perhaps closest to what current utility-first frameworks aim for, but achieved through systematic thinking rather than arbitrary utility classes.

3. **Zaha** — Translates Zaha Hadid's bold architectural vision into digital space. Where Linear suggests depth, this system fully embraces the third dimension. Systematic shadows, calculated blur effects, and precise transforms create dramatic movement that still maintains perfect mathematical relationships.

4. **Muriel** — Channels Muriel Cooper's pioneering work in digital design. It captures Apple's blend of precision and joy, proving how systematic thinking enables creative freedom while preserving absolute clarity. This isn't just about copying Apple's look - it's about understanding the mathematical principles that make their interfaces feel both playful and precise.

Imagine what this means for web development: you can create an Apple-like startup site for one client, a Stripe-like platform for another, and a Linear-inspired interface for a third. All through a single command that takes seconds rather than the months of custom development these looks typically require.

But even this is just the beginning...


## Single-page applications

As much as I love design, I've always loved JavaScript. Not because of its weaknesses obviously, but its strength in implementing beautiful, interactive frontends with UX-enhancing motion. Never before has the web been more ready for this level of design and functional quality.

SPAs are at the heart of design and engineering. There's a lot of both. But Nue allows me to build a much stronger foundation for SPAs than the JavaScript monolith ever could:

1. As expected, the design is separated from the functionality so you can easily swap the design system of your SPA to make it look wildly different.

1. The system will be based on classic MVC pattern to create natural separation of concerns. TypeScript engineers can focus purely on business logic without getting tangled in frontend complexities. Frontend developers can craft sophisticated user experiences without business logic getting in the way. Each team works in their domain of expertise.

3. Your SPA becomes a seamless part of your marketing site: the design system, blazing fast performance, and seamless client-side routing. View transitions create fluid movement between static and dynamic pages. Everything feels like one cohesive product rather than disconnected pieces built with different frameworks.

Think what this means for digital agencies: create a complete startup platform with a fully functional CRM, all expressing itself through the same sophisticated design system. What previously required multiple teams and frameworks now emerges from a single command:

``` sh
nue create spa --function crm --todir app --design inherit
```

This is a game changer. Instead of building everything from scratch, you get Linear-level design, Stripe-level functionality, and a consistent UX across your site — all through one simple command.

But even this is not enough. Nue will eventually expand to cloud too. The [ultimate goal](/vision/) is to provide a more powerful, content/design first alternative to Next.js and the JS monoculture.


## Invest in Nue?
Perhaps surprisingly, I have no trouble completing this vision. As an independent, commercially free developer I have both the time and, with templates having a price tag, will have the means. We can implement this vision without raising money. There's something powerful about maintaining complete creative freedom.

However, I'm increasingly thinking about external guidance, and possibly investment. An ambitious project that could fundamentally change web development might benefit from someone who shares the same commitment to web standards. This could help me maintain deep focus on implementation, while someone else could nurture the growing community. I'm notoriously bad at keeping in contact with people. Like Mies said: "Build, don't talk."

Still, I would love to discuss the bigger picture with someone who truly gets it. It gets lonely sometimes. If you feel drawn to this vision (or know someone who might be), reach out at tipiirai@gmail.com or through the form below. I'm still in the thinking phase with no commitments. Getting the fundamentals right is more important than moving fast.

