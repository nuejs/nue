
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


To give you an idea of the difference, here's the difference in source code between tailwind.com front page written with JavaScript, React, and Tailwind and Nue front page written with a rich Markdown dialect:


[.stack]
  [image.bordered]
    small: /img/react-page.png
    large: /img/react-page-big.png
    caption: Next.js pages are written with JavaScript
    width: 500
    href: //github.com/tailwindlabs/tailwindcss.com/blob/master/src/pages/index.js

  ---
  [image.bordered]
    small: /img/nue-page.png
    large: /img/nue-page-big.png
    caption: Nue pages are content driven
    width: 500
    href: //github.com/tipiirai/nue/blob/master/new-www/index.md?plain=1


The first apparent difference is that is that in Nue the web page is driven by content, which is separated from the rest of the code. No matter how rich and complex your page is, the content is easily accessible for non-technical people — they can move edit it in isolation without blocking the developers.

The second, much more important thing is that you need significantly less effort to design and develop new content sections. Here's what the  list of files files needed to develop the pages:


// //github.com/tailwindlabs/tailwindcss.com/tree/master/src/components/home
! Line count: Next.js vs Nue


1. Next.js is targeted for React engineers, who specialize on JavaScript, JSX, and Tailwind. Nue is for UX developers, who are experts in design, and user experience. They prefer to build new things with CSS.

2. Nue front page requires only 350 lines of code where 90% of the code is vanilla CSS. This is less than what is needed for Tailwind hero area (hero.js) alone. The entire Tailwind front page requires a whopping 10.000 lines of JavaScript. It's a major React engineering project.

3. Nue produces extremely lean websites. For example, the combined weight of all the JavaScript and CSS on this page is only 7kb, which equals to a single Tailwind button component.


How is this possible?


## A different mindset


### Global Design System
Nue's power leans heavily on a thing called _global design system_. It allows UX developers to rapidly create different designs using the same exact markup between projects:


! Global design system + CSS = UX

Nue frees you from implementing page layouts and basic UI elements over and over again. Or as a well-known UX developer [Brad Frost](//bradfrost.com/) puts it:

[quote from="Brad Frost" cite="//bradfrost.com/blog/post/a-global-design-system/"]
  Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential.

Think Nue as a modern-day [CSS Zen Graden](//csszengarden.com/) — a great demonstration of what can be accomplished through CSS. Nue just takes it a couple of steps further and expands the idea to a rapid UX development environment.



### Web Standards Model

[image.floating]
  src: /img/ux-stack.png
  width: 300

The grand idea behind the global design system is to separate the HTML markup from styling and logic. This allows you to build websites with vanilla CSS and JavaSript. You'll get to know [the web and web standards][standards].

You'll learn new things from MDN Web Docs instead of leaning towards commercially-driven 3rd parties. The code you are writing now is something that all developers can understand in the future. You'll become great at developing user experiences and and stay competitive and relevant for years to come.

Because trends come and go, but standards are forever.


### Increased performance
Nue-powered sites can offer the same performance levels as text-only websites like [motherfuckingwebsite.com](//motherfuckingwebsite.com/), but without compromising on design. That is: you can get the fastest possible page loads with the design and user experience levels of Stripe or Linear.

Nue [optimizes](performance-optimization.html) your landing pages to a single, compact HTTP request that has everything to render the full experience:

[image.gridpaper]
  small: /img/first-paint.png
  large: /img/first-paint-big.png


This is the opposite of what the frameworks like *Next.js* and *Vite* are doing. Their sole purpose is to deal with hundreds, even thousands of JavaScript modules. This strategy works well for single-page applications, but is suboptimal for content-heavy websites. No amount of JS bundling can beat a single HTTP request that has everything to render the page.



### UX mindset
Nue's [develoment flow](ux-development.html) focuses heavily on building the best design and user experience for your audience and keeping your CSS clean and organized:

[image.gridpaper]
  small: /img/ux-development.png
  large: /img/ux-development-big.png


The UX mindset makes a shift in your focus:

[table head="| React engineers | UX developers"]
  - Focus on | Programming | Design and UX
  - Building blocks | React components | Global Design System
  - Key strategy | Tight coupling | Separation of concerns
  - Primary language | TypeScript | CSS
  - Highly valued | Type Safety | Minimalism
  - Key technologies | React + Tailwind | Web Standards
  - Styling method | Local styling | External styling


Keeping your focus on UX is vital because you may use the latest technology the coolest React tricks, but if the UX fails, everything fails. Or as [Steve Jobs says](//youtu.be/dI93BvrBxQ0?si=Ub2Q_S_E7uKVilVL&t=104):

[quote.floating from="Steve Jobs"]
  You've got to start with the customer experience and work backwards for the technology




## Increased productivity
Nue offers a clean development environment for all core tasks on your web stack. Your team members can work on areas they are natively good at


[image.gridpaper]
  small: /img/scale.png
  large: /img/scale-big.png
  caption: Separation of concerns in action


### Content people
*Marketers, copywriters* and *technical writers* can focus on content without blocking developers. All your pages, from simple blog entries to rich landing pages are editable by non-technical people.


### JavaScript developers
Nue separates your application code from the frontend code, so application developers can write pure, testable JavaScript APIs without the burden from the 3rd party frontend languages.


### UX developers
Nue brings back to the lost art of UX development for people who love design, UX development, and the power of modern CSS.

It changes the way you think about web evelopment. You might not believe that until you actually try it. Chances are, that you start wondering why you ever built websites any other way.


## The UX framework

[grid]
  ### Global Design System
  A powerful UX development framework for web projects

  [Learn more](global-design-system.html)
  ---

  ### UX development flow
  How to build great user experiences with Nue

  [Learn more](ux-development.html)
  ---

  ### Content Management System
  It's like Notion but text-based and adapts to your design

  [Learn more](content-management-system.html)
  ---

  ### Single-page Applications
  Use the global design system for rapid application development

  [Learn more](single-page-applications.html)

