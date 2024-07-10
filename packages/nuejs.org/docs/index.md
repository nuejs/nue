
---
exclude: [syntax, video]
---

# Nue is a web framework for UX developers
Nue is a rapid website development environment for UX developers and other design-minded people. It changes the way you think about frontends: instead of dealing with complex technical issues, your focus turns on to content, design, and the user experience.


## Less, but better
Wat used to take a React specialists and a huge amount of JavaScript is now taken care of a UX developer and handful of CSS files:

[image.gridpaper]
  small: /img/react-vs-ux-dev.png
  large: /img/react-vs-ux-dev-big.png


To give you an idea of the difference, here are source codes for [tailwindcss.com](//tailwindcss.com) front page (a next.js app) and [nuejs.org](/) front page:


[.stack]
  [image.bordered]
    small: /img/react-page.png
    large: /img/react-page-big.png
    caption: "Next.js: mixed JavaScript, React, and Tailwind"
    width: 500
    href: //github.com/tailwindlabs/tailwindcss.com/blob/master/src/pages/index.js

  ---
  [image.bordered]
    small: /img/nue-page.png
    large: /img/nue-page-big.png
    caption: Nue is content driven
    width: 500
    href: //github.com/tipiirai/nue/blob/master/new-www/index.md?plain=1


The first apparent difference is that is that in Nue the web page is driven by content, which is separated from the rest of the code. No matter how rich and complex your page is, the content is easily accessible for non-technical people — they can move edit it in isolation without blocking the developers.

The second, much more important thing is that you need significantly less effort to design and develop new things. Here's what is needed to build the front page:


// //github.com/tailwindlabs/tailwindcss.com/tree/master/src/components/home
! Line count: Next.js vs Nue


1. Nue front page requires only 350 lines of code and 90% of it is pure CSS. This is less tnan what is needed to develop the Tailwind hero area alone. Nue front page is just 5% of the code in Tailwind front page.

1. Next.js is for React engineers, who specialize on JavaScript, JSX, and Tailwind. Nue is for UX developers, who are experts in design and UI development. They focus design systems´and CSS is their native language.

3. Nue produces significantly leaner websites. For example, the combined weight of all the JavaScript and CSS on this page is only 7kb, which equals to a single Tailwind button component.


How is this possible?


## A different mindset


### Global Design System
Nue's power leans heavily on a thing called _global design system_. It allows UX developers to rapidly create different designs using the same exact markup between projects:

! Global design system + CSS = UX

Nue frees you from implementing page layouts and basic UI elements over and over again or as a well-known UX developer [Brad Frost](//bradfrost.com/) puts it:

[quote from="Brad Frost" cite="//bradfrost.com/blog/post/a-global-design-system/"]
  Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential.

Think Nue as a modern-day [CSS Zen Graden](//csszengarden.com/) — a great demonstration of what can be accomplished through CSS. Nue just takes it a couple of steps further and expands the idea to a rapid UX development environment.


### Web Standards Model

[image.floating]
  src: /img/ux-stack.png
  width: 300

The grand idea behind the global design system is to separate the HTML markup from styling and logic. This allows you to build websites with vanilla CSS and JavaSript and you'll get to know [how the web works][standards]. The way CSS cascades, when to use Web Components, and how to go with responsive web design.

You'll learn new things from MDN Web Docs instead of leaning towards commercially-biased 3rd parties. The code you writing now is something that all developers can understand — now and in the future. You want to stay competitive and relevant for years to come.

Because trends come and go, but standards are forever.



### Focus on CSS
Over the years CSS has evolved from static styling language to a  powerhorse with full support to all aspect of UX development including motion- and interaction design. Nue extracts this hidden power from the complex world of JavaScript and passes it directly to where it belongs: for UX developers. No extra layers, no third party idioms, no namespace issues. Just the raw power of modernized CSS with the bliss of instant hot-reloading.

This totally changes your approach to web development. Instead of dealing with hundreds or thousands of JavaScript files, you now have a small, organized set of CSS files. The tooling, development flow, and optimization strategies are now _simpler_ in all meaning of the word.

The best part: your website can reach the same performance levels as text-only websites like [motherfuckingwebsite.com](//motherfuckingwebsite.com/), but without compromising on design. That is: you can get the fastest possible page loads with the design and user experience levels of Stripe or Linear.

[image.gridpaper]
  small: /img/first-paint.png
  large: /img/first-paint-big.png

No matter how fast or clever your JavaScript bundler is, it can never beat  a single HTTP request that has everything to render the page.



### The UX mindset
Nue's [develoment flow](ux-development.html) focuses on design and user experience while keeping your CSS clean and organized:

[image.gridpaper]
  small: /img/ux-development.png
  large: /img/ux-development-big.png


This makes a complete shift in your focus:

[table head="| React engineers | UX developers"]
  - Building blocks | React components | Global Design System
  - Key strategy | Tight coupling | Separation of concerns
  - Primary language | TypeScript | CSS
  - Highly valued | Type Safety | Minimalism
  - Key technologies | React + Tailwind | Web Standards
  - Styling approach | Local styling | External styling
  - Start with | Technologies | User experience


Keeping your focus on UX is vital because you may have chosen the latest and coolest tech, but if the UX fails, everything fails. Or as the master UX developer [Steve Jobs says](//youtu.be/dI93BvrBxQ0?si=Ub2Q_S_E7uKVilVL&t=104):

[quote.floating from="Steve Jobs"]
  You've got to start with the customer experience and work backwards for the technology




## Increased productivity
Nue offers a clean development environment for all core tasks on your web stack. Your team members can work on areas they are natively good at


[image.gridpaper]
  small: /img/scale.png
  large: /img/scale-big.png
  caption: Separation of concerns in action


### Content development
*Marketers, copywriters* and *technical writers* can focus on content without blocking developers. All your pages, from simple blog entries to rich landing pages are editable by non-technical people.


### Application development
Nue separates your business model from the rest of your frontend, so application developers can write pure, testable JavaScript APIs without burdening themselves with any custom 3rd party idioms and APIs. The code becomes cleaner and easier to deal with.


### UX development
Nue brings back to the lost art of UX development for people who love design, UX development, and the power of modern CSS. It changes the way you think about web evelopment. You might not believe that until you actually try it. Chances are, that you start wondering why you ever started uglifying your clearly separated code in the first place.


## The UX framework

[grid]
  ### Global Design System
  Create wildly different designs

  [Learn more](global-design-system.html)
  ---

  ### UX development
  Best practises for UX and CSS

  [Learn more](ux-development.html)
  ---

  ### Content development
  Develop content like a hacker

  [Learn more](content-management-system.html)
  ---

  ### Application development
  Build beautiful apps with less effort

  [Learn more](single-page-applications.html)

