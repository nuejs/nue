---
include: [compare]
inline_css: true
---


# Why Nue?
Nue is a design engineering framework that offers **unmatched performance**, **simplicity**, and a **content-first development model**. Here’s why it’s a great fit for your next project:


## 1. Development experience
Nue enhances the development experience by instantly detecting changes in **content**, **data**, **layouts**, **styles**, **components**, and **islands**, and applying them to your browser in real time with its intelligent diff and patch system. This creates a lightning-fast feedback loop that boosts your productivity and makes the development process more enjoyable:

[bunny-video]
  videoId: abb2cf75-c7f9-43e6-b126-8827d0c8721e
  style: "background-color: #282C30"
  poster: /img/blog-content-editing-big.png


With no burden of countless and unnecessary JavaScript abstractions and dependencies, Nue is **blazing fast**, leaving monolithic frameworks in the dust:

[table]
  Framework                         |  Next.js       |  Nue
  NPM modules                       |  300+          |  10+
  Project weight                    |  300M+         |  10M+
  Build speed / 10 pages            |  10+ seconds   |  0.01+ seconds
  Build speed / 100 pages           |  30+ seconds   |  0.1+ seconds
  Hot-reload times / complex app    |  1 - 5s        |  0.05 - 0.3s

[button.play-button popovertarget="buildperf" "See the difference"]

[#buildperf.simple-compare popover]

  ## Nue build speed
  Nue builds are measured in milliseconds

  [bunny-video]
    videoId: 7bcfcde2-912c-4c30-a442-198bc25ba250

  ## Next.js build speed
  JavaScript monoliths take several seconds to build

  [bunny-video]
    videoId: d9ebcf29-9314-4571-856c-0dfa7f49d6d1

  [button.action popovertarget="buildperf"]
    [image /icon/close.svg]



## 2. Design engineering
Nue is built on **progressive enhancement**, fundamentally transforming how websites are developed. What once required a **React specialist** and extensive **TypeScript** effort can now be achieved with a concise, standards-based codebase, allowing you to focus on what matters: **content**, **layout**, **design**, and **motion**.


[image.bordered]
  caption: "[button.above.zoom popovertarget=compare label='See the difference']"
  large: /img/clean-code-big.png
  small: /img/clean-code.png
  size: 747 × 381

[compare :compare="compare"]


## 3. Resulting sites
Nue helps developers create **stunning**, **fast**, and **user-friendly** websites with features like **turbolinking**, **CSS view transitions**, and **interactive islands**.

[bunny-video]
  videoId: 383e5c79-6747-4b1a-8d7a-9da9ae721d33
  poster: /img/hero-splash.jpg
  caption: "Nue templates preview. Hit **F** for fullscreen"

Surprisingly, these rich, interactive sites remain incredibly lean, similar in size to text-only websites. For comparison, here’s how this documentation area stacks up against the Next.js documentation:

[table.with-total]
  Resources         | Next.js   | Nue      | Difference
  HTML document     | 51kB      | 10kB     | 5 × smaller
  CSS               | 62kB      | 1kB      | 60 × less
  JavaScript        | 531kB     | 7kB      | 75 × less
  Total             | 644kB     | 19kB     | 30 × less

[button.zoom popovertarget="resources" "See the difference"]

[#resources.simple-compare popover]

  ## Nue documentaion
  27kB of HTML/CSS/JS

  [! /tour/img/assets-nue.png ]

  ## Next.js documentaion
  645kB of HTML/CSS/JS

  [! /tour/img/assets-next.png ]

  [button.action popovertarget="resources"]
    [image /icon/close.svg]


## Who is nue good for?
Nue is a great fit for:

1. **Beginner web developers**: Those looking to bypass [frontend redundancy](//roadmap.sh/frontend) and work directly with the Web Standard Model: HTML, CSS, and JavaScript.

2. **Experienced JavaScript developers**: Those frustrated with the overwhelming amount of abstractions in the [React stack](//roadmap.sh/react) and seeking simpler ways to develop professional websites.

3. **Design-focused teams**: Those prioritizing user experience and design systems, leveraging modern CSS to create efficient, lightweight websites that enhance usability without the bloat of JS monoliths.

In short: if you’re looking to build beautiful and innovative websites with faster tooling and a simpler development model, **Nue is the right choice for you**.


### Terminology
Key terms mentioned in this article:

[define]
  #### Asset hot-reloading
  A feature that instantly applies changes across all asset types — content, data, layouts, styles, and components — for faster, smoother development.

  #### Turbolinking
  A technique that speeds up navigation by loading pages with AJAX, enabling faster transitions without full page reloads.

  #### View transitions
  A feature that provides smooth visual transitions between different states or pages, enhancing user experience with fluid navigation.

  #### Interactive islands
  A design pattern that allows specific sections of a page to be interactive while the rest remains static, enhancing performance and user experience.

  #### JS monolith
  JavaScript bundles that pack numerous features into a single file, often leading to complexity, reduced clarity, and maintenance challenges.
