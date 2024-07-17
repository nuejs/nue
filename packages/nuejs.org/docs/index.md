
---
exclude: [syntax, video]
---

# Nue is a web framework for UX developers
Nue is a rapid website development environment focusing on content, design, and user experience. It changes the way you think about web development. Chances are that you'll become a professional UX/CSS developer and stay relevant for years to come.


## Target audience
Nue is a great fit for the following people:

1. **UX developers**: who prefer to jump to CSS directly from **Figma** without the [complex](//medium.com/design-warp/5-most-common-designer-developer-handoff-mishaps-ba96012be8a7) and time-consuming _developer-designer handoff_ process.

2. **Beginner web developers**: who want to skip the redundant layers in the [frontend stack](//roadmap.sh/frontend) and start building websites quickly with HTML, CSS, and JavaScript.

3. **Experienced JS developers**: who are frustrated with the [absurd amount of layers](//roadmap.sh/react) in the current JavaScript stack and look for simpler ways to develop modern websites.



## Less, but better
If there's one word to describe Nue, it's _minimalism_ — what used to take React specialists and thousands of lines of JavaScript is now assembled with a content file and a small amount of CSS. To give you a rough idea, here are source codes for [tailwindcss.com](//tailwindcss.com) front page (a next.js app) and [nuejs.org](/) front page:


[.stack]
  [image.bordered]
    small: /img/react-page.png
    large: /img/react-page-big.png
    caption: Next.js
    width: 500
    href: //github.com/tailwindlabs/tailwindcss.com/blob/master/src/pages/index.js

  ---
  [image.bordered]
    small: /img/nue-page.png
    large: /img/nue-page-big.png
    caption: Nue
    width: 500
    href: //github.com/tipiirai/nue/blob/master/new-www/index.md?plain=1


The first apparent difference is that Nue embraces *a content-first* approach. No matter how rich and complex your page is, it is first assembled with an easy-to-read — easy-to-write content format suitable for planning, marketing, and technical writing.

The second important difference is that your website is mostly implemented with CSS. You no longer need a React specialist to develop websites. Instead, the work moves naturally to UX developers — the people who master the craft of design and user experience, where the responsibility should be in the first place.

The third, and the most important difference is, that you need _significantly_ less effort to design and develop new things. Let's check some numbers:

// //github.com/tailwindlabs/tailwindcss.com/tree/master/src/components/home
! Line count: Next.js vs Nue


1. **Nue requires less code**. The front page requires only 350 lines of code and 90% is pure CSS. This is less than what is needed to develop the Tailwind hero area _alone_. Nue front page in total is just a fraction of the Tailwind codebase.

1. **Nue is for UX developers**, who are fluent with **Figma**, they think in terms of design systems, and CSS is their native language. No complex JavaScript with embedded images, markup, styling, React idioms, or type definitions.

3. **Nue sites are leaner**. Nue produces significantly leaner websites. For example, the combined weight of all the JavaScript and CSS on this page is only 7kb, which equals to a single Tailwind button component.


How is this possible?


## A different mindset


### Global Design System
Nue's power leans heavily on a thing called _global design system_. It allows UX developers to rapidly create different designs using the same exact markup between projects:

! Global design system + CSS = UX

Nue frees you from implementing page layouts and basic UI elements over and over again so you can move faster with nothing but CSS. [Brad Frost](//bradfrost.com/), the man behind the global design system and a well-known UX developer puts it this way:

> Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential. *Brad Frost*


Think Nue as a modern-day [CSS Zen Graden](//csszengarden.com/) — a demonstration of what can be accomplished through CSS. Nue takes this a couple of steps further and expands the idea to a rapid UX development environment and takes everything out of the modern web stack.


### Web Standards Model

[image.floating]
  src: /img/ux-stack.png
  width: 300

Global design system separates the HTML markup from styling and logic. This allows you to build websites with vanilla CSS and enhance them with JavaSript. You'll get to know [how the web works][standards]: the way CSS cascades, when to use Web Components, and how to tackle responsive web design.

Instead of trusting your career on commercially-biased 3rd parties, you'll stay closer to the [web standards model](//www.w3.org/wiki/The_web_standards_model_-_HTML_CSS_and_JavaScript). The code you writing now is something that all developers can understand — now and in the future.

Become a professional UX developer and stay relevant for years to come.



### Design and CSS
Over the years CSS has evolved from static styling utility to an immensely powerful UX development language including support for motion- and interaction design. Nue extracts this hidden power from the complex world of JavaScript and passes it directly to where it belongs: for UX developers. No extra layers, no third-party idioms, no namespace issues. Just the raw power of modernized CSS with the bliss of instant hot-reloading.

This totally changes your approach to web development. Instead of dealing with hundreds or thousands of JavaScript files, you now have a small, organized set of CSS files. The tooling, development flow, and optimization strategies are now _simpler_ in all meanings of the word.



### Page performance
Perhaps the most unique feature of Nue is that your website can reach the same performance levels as text-only websites like [motherfuckingwebsite.com](//motherfuckingwebsite.com/), but without compromising on design. That is: you can get the fastest possible page loads with the design and user experience levels of Stripe or Linear.

[image.gridpaper]
  small: /img/first-paint.png
  large: /img/first-paint-big.png

This is achieved by bundling your minified CSS together with the HTML and serving everything as one, small package. This is the most important [performance optimization](performance-optimization.html) method you can use. No matter how fast or clever your JavaScript bundler is, it can never beat a single HTTP request that has everything to render the page.



### The UX mindset
Nue's [CSS best practices](css-best-practices.html) focus strongly on aesthetics and user experience while keeping your CSS clean and organized:

[image.gridpaper]
  small: /img/ux-development.png
  large: /img/ux-development-big.png
  href: css-best-practices.html


This makes a complete shift in your focus:

[table head="Topic | Engineers| UX developers"]
  - Building blocks | React components | Global Design System
  - Key strategy | Tight coupling | Separation of concerns
  - Primary language | TypeScript | CSS
  - Optimization | JS bundling | HTML+CSS bundling
  - Highly valued | Type Safety | Minimalism
  - Key technologies | React + Tailwind | Web Standards
  - Styling approach | Local styling | External styling
  - Start with | Technologies | User experience


Keeping your focus on UX is vital because you may have chosen the latest and coolest tech, but if the UX fails, everything fails. Or as the master UX developer [Steve Jobs says](//youtu.be/dI93BvrBxQ0?si=Ub2Q_S_E7uKVilVL&t=104):

> You've got to start with the customer experience and work backwards for the technology *Steve Jobs*




## Increased productivity
Nue offers a clean development environment for all core tasks on your web stack. Your team members can work on areas they are natively good at


[image.gridpaper]
  small: /img/scale.png
  large: /img/scale-big.png
  caption: Separation of concerns in action


### Content development
*Marketers, copywriters* and *technical writers* can focus on content without blocking developers. All your pages, from simple blog entries to rich landing pages are editable by non-technical people.

### Application development
Nue separates your business model from the rest of your frontend code, so application developers can write pure, testable JavaScript APIs without burdening themselves with 3rd party abstractions. The code becomes cleaner and significantly easier to deal with. There is absolutely no reason to uglify your application code with HTML or gigantic class attributes.

### UX development
Nue is for people who love design, UX development, and the power of modern CSS. It changes the way you think about web development. You might not believe that until you actually try it. Chances are, that you start wondering why you ever built websites any other way.


## The UX framework

[grid]
  ### Global Design System
  Create wildly different designs

  [Learn more](global-design-system.html)
  ---

  ### UX development
  Best practices for UX and CSS

  [Learn more](css-best-practices.html)
  ---

  ### Content development
  Develop content like a hacker

  [Learn more](content-management-system.html)
  ---

  ### Application development
  Build beautiful apps with less effort

  [Learn more](single-page-applications.html)

