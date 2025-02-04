---
date: 2024-04-12
og: /img/designers-vs-engineers.png
title: Summer 2024 status update
desc: A quick update to give you a little idea of the  past, present, and the future of the Nue framework.
---


The goal of Nue is to be the [perfect web framework](/blog/perfect-web-framework/) for UX developers and design-led organizations. We're not there yet, but here's how we keep the dream alive

[image]:
  small: /img/designers-vs-engineers.png
  large: /img/designers-vs-engineers-big.png
  caption:  "[The Great Divide](//css-tricks.com/the-great-divide/): UX developers are design-oriented and JS engineers are technology-oriented"


## For the love ❤️ of web standards
Today, there is an unexpected resistance towards vanilla JS and CSS. Nue is an attempt to bring people closer to web standards by showcasing the obvious benefits:


#### October 2, 2023 [Rethinking reactivity](/blog/rethinking-reactivity/)
[Nue JS](//github.com/nuejs/nue/tree/master/packages/nuejs) is a small micro-library for building user interfaces. While still buggy and in early beta, it showcases the value of separation of concerns and an HTML-first approach. That is: Your code becomes easier to read.


[image.floating src="/img/theo-tailwind-promoter.jpg"]:
  href: //youtu.be/yGBjXsrwK4M
  caption: "**Theo** is a famous JS/CSS hater and a passionate Tailwind promoter"


#### October 23, 2023 [Tailwind vs Semantic CSS](/blog/tailwind-vs-semantic-css/)
This article showcases the power of CSS and the web standards model by comparing the Tailwind "Spotlight" template (from the developers of Tailwind) with a version made with vanilla CSS.


#### February 18, 2024 [Tailwind marketing and misinformation engine](/blog/tailwind-misinformation-engine/)
How Tailwind positions vanilla CSS as the problem and the "utility first" approach as the hero. Well-known framing for CSS experts, but strongly [denied](//youtu.be/yGBjXsrwK4M) by the Tailwind community.

#### March 20, 2024 [Nue CSS preview](/blog/introducing-nue-css/)
Sneak preview of the upcoming design system approach and the best practices of writing maintainable CSS. The article demonstrates some crazy size differences to Tailwind.


## Project milestones


#### September 18, 2023 ["Frontend troublesolver"](/blog/backstory/)
The idea of Nue was posted to Hacker News. Here's the [backstory](/blog/backstory/) and why I decided to dedicate my career to this project.

#### December 14, 2023 [Content-first framework core](/blog/nuekit-010/)
[Nuekit 0.1](/blog/nuekit-010/) turned the idea into reality. This closer-to-metal framework is an order of magnitude smaller and faster than the alternatives and gives a near-instant feedback loop through universal hot-reloading.

#### January 12, 2024 [Markdown variant for rich content](/blog/introducing-nuemark/)
[Nuemark 0.1](/blog/introducing-nuemark/) is the cornerstone for the content-first development model, where content-heavy websites are primarily maintained by copywriters and technical writers. This project showcases the importance of the separation of concerns pattern.

#### February 13, 2024 [Markdown syntax highlighter](/blog/introducing-glow/)
[Glow 0.1](/blog/introducing-glow/) A Markdown code block syntax highlighter to meet the aesthetics and extreme minimalistic demands of Nue.


## Current status: Beta
You can use Nue to build production-ready websites but with the following limitations:

1. Windows support is sketchy
2. No documentation for Nue CSS yet
3. Nue JS's reactive parts are buggy and the issues are marked low priority


[.note]
  #### Help wanted
  Please [contact us](//github.com/nuejs/nue/discussions) if you are interested in building a HTML-first React alternative for UX developers. The reactive lib is our current development bottleneck.

[button.button href="/docs/" "Try beta now"]

## Up next: ☀️ Summertime
During the summer the focus will be on the following, but with a 33% pace:

[image.floating src="/img/sunflower.svg"]

### Nue design system
Finalize the Nue design system with complete documentation including:

1. Information Architecture
2. Global Design System
3. CSS architecture
4. CSS best practices
5. Design template


### Website rewrite
Rewrite the website narrative and the documentation so that the content-first approach becomes crystal clear and why Nue is an obvious choice for UX developers and design-led organizations:

1. What is a content-first framework
2. Why is it important
3. Pillars, values, principles


## 🦄 The Dream
Eventually Nue gives you the following:

1. World-class design for everyone
2. Ridiculously easy to maintain and scale
3. New levels of performance

We want everyone to have the ability to take the quality levels of *Stripe*, *Linear*, or *Apple* — with the speed levels of a text-only website. Here are the missing pieces, before a solid 1.0 release:


## Huge thanks to:
- [Nobkd](//github.com/nobkd) and [Fritz Lin](//github.com/fritx) for the very many updates and fixes. Thank you!

- [Mauricio Wolff](//www.linkedin.com/in/mauriciowolff/) (Lead Product Designer @ Atlassian) for the extremely important, high-level design feedback.

- [Alan Hemmings](//github.com/goblinfactory) for the developer feedback and the mental support. Much-needed!

- Thanks to all [25+ contributors](//github.com/nuejs/nue/graphs/contributors) for improving Nue's codebase.
