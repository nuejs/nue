---
date: 2024-01-23
title: The perfect web framework for UX developers
desc: Nue's ultimate goal and the development steps to get there
og: /img/perfect-banner-big.jpg
---


In June 2023 I had my final frontend rage quit moment. The anger was so intense that I decided to change the direction of my career from a startup founder to a full-time OSS developer. I would devote all my time to fixing everything that is wrong with the current front-end ecosystem.

I created a [project on GitHub](//github.com/nuejs/nue) and called it **"Nue"**. I wanted it to be the best web framework for [UX developers](//css-tricks.com/the-great-divide/) and design-led organizations. It'll consist of the following:


[image]:
  small: /img/perfect-banner.jpg
  large: /img/perfect-banner-big.jpg
  width: 550


[.note]
  ## Terms
  **UX** = improved user experience, **DX** = improved developer experience


## Content focused `DX` { #content }
The purpose of a website is to present content. To spread your thoughts or generate sales. For this obvious reason, your website should be optimized for content producers.

Ideally, content people should be able to create new content and update the information architecture without seeking assistance from designers or developers. Several authors could proceed in isolation and break nothing but their local language or grammar.

The content-first approach is the most important thing in a framework. It defines the overall system architecture and forms a solid ground for a [semantic design system](#cascade) and [universal template](#template).

Note that single-page applications are no different: The content just comes from a database and not from a file. The design system can be shared.


[.problem]
  Popular frameworks like **Next.js** or **Astro** are optimized for JavaScript developers with a deep understanding of **React**, **TypeScript**, **CSS-in-JS**, **Tailwind**, and whatnot. For example, you need hundreds of lines of code spanning 10-20 files to create a rich/interactive web page.


## World-class design `UX` { #design }
World-class means the highest caliber design in the world. The top 1% of websites. The future **Stripes**, **Amies**, and **Linears**.

Everything is pixel-perfect down to the tiniest detail. From design tokens to motion design. The underlying design system makes sure that all areas of your site have the same, consistent look and feel. Be it minimalistic, heroic, or playful.

When a content-first design system is in place, content teams can ship great-looking content, without disturbing designers or developers.

[.problem]
  Current frameworks like **Bootstrap** and Tailwind lack a global, content-first design system that spans the entire website. UX/CSS professionals have a hard time contributing because CSS is tightly coupled inside the JavaScript code.


## Motherf**king fast `UX` { #speed }
[motherfuckingwebsite.com](//motherfuckingwebsite.com/) is a developer meme from **Barry Smith**. This plaintext website carries an important message: Get rid of the clutter and focus on content and performance.

The lesser-known fact is that you can build a design system that offers the performance levels of MF, and the design standards of Stripe and Linear.

A perfect web framework gives you exactly that: The fastest possible website with a pixel-perfect design. A Moterf**king Stripe if you will.

[.problem]
  Current frameworks resort to [chickenshit minimalism][chicken] — the illusion of minimalism backed by megabytes of cruft. For example, the landing page of *create-next-app* uses 42,440 lines (363kb) of JavaScript to print "Hello, World"

  [chicken]: //idlewords.com/talks/website_obesity.htm#minimalism


## Consistent MPA+SPA experience `UX` { #ux }
All areas of your website should offer a consistently great user experience. This includes your content-heavy areas like the documentation and blog, the customer-facing app, and your internal admin dashboard.

The same "motherf**king" performance levels and the same pixel-perfect look and feel. And with a seamless "turbo" linking between your multi-page and single-page apps.

[.problem]
  Current frameworks lack a hybrid multi-page/single-page application development model. You end up mixing services and domain names. Say Astro for marketing pages, **Nuxt** for documentation, **Medium** for blog, and Vite for the SAAS app. It's impossible to offer a uniform design, performance, and user experience across the board.


## Instant development loop `DX` { #devloop }
A perfect framework should show a live preview of your change after you save a file. Be it content, styling, layout, server component, or client-side reactive component — you should see the change immediately. And if you make a mistake, the framework will tell you exactly what went wrong.

This kind of *universal hot-reloading* offers a true WYSIWYG experience for content producers, designers, and developers. Instant development loop gives a significant boost to your daily productivity.


[.problem]
  **Vite** and Next.js projects can have hundreds, even thousands of NPM modules. As the number of modules increases, your Hot Module Replacement (HMR) operations become heavier and slower. A styling change on your JS file can take seconds before it reaches the browser. And because HMR is limited to JavaScript and TypeScript files, both content teams and UX/HTML/CSS developers are missing the benefits of hot-reloading.


## Easy to scale `DX` { #scale }
An ideal framework lets people with different backgrounds take part in scaling the system. Content teams scale the content, UX engineers focus on design and user experience, and JS developers work on the business model, networking, and infrastructure.

They use the same system for content-focused apps and single-page apps and enjoy the productivity boost from universal hot-reloading. They share components and design elements, so they can move faster and keep things consistent.

[.problem]
  Vite and **React** place all the burden on the JavaScript developer. They develop React components where content, styling, and logic are all mixed. Scaling becomes hard when content teams and UX developers cannot participate. And if you use different systems for blogging, documentation, and single-page apps – extra developer time is spent on keeping the external services together.


## Sub-second deploy times `DX` { #ship }
When you push out a new blog entry or a product release, something always goes wrong: Typos, wording issues, missing links, broken styling on mobile, ... You name it. In this situation, it's critical to have a fast shipping engine in place. You want to fix your errors before the next bunch of visitors arrives.

This sort of hot deployment engine is an extension to a full-blown git-based deployment system with support for versioned pushes, rollbacks, and staging environments.

[.problem]
  Shipping with **Vercel** or **Netlify** is slow. Deployment always triggers a full rebuild: All the pages, styles, scripts, and images are re-pushed. Production pushes take several minutes, sometimes more than an hour. Even, if it was just a small typo.


## Universal template `DX` { #universal }
The universal template is a central starting point for hybrid multi-page and single-page applications. It lets you quickly create a blog, startup, e-commerce site, or anything in between. First, you choose the desired apps, and then you link them to a chosen look and feel.

For example, you might choose a rich front page, documentation area, blogging area, onboarding flow, admin dashboard, and login page. Then you choose the design: Minimalistic, modern, playful, or heroic. Or perhaps abstract, brutal, pixelated, or retro.

And of course, your site is automatically [content-first](#), [pixel-perfect](#), and [motherf**king fast](#).

[.problem]
  Tailwind, Bootstrap, or *WordPress* templates have no concept of apps and the tightly coupled design has limited customization possibilities. You only get what's there and implement the missing pieces from scratch.


## Built-in cloud services `DX` { #complete }
A perfect SAAS template comes with integrated customer relationship management, billing, and charging — along with unified analytics for traffic, people, and revenue.

This pack of services is connected to a desired cloud storage and the generated single-page application becomes part of your project directory. It automatically inherits your look and feel and extreme performance characteristics.

The best part: You can use this generic single-page app as a template for your customer-facing app.

We're looking at the fastest way to start a new, fully functional business.

[.problem]
  Vercel, *Heroku*, or *Render* don't have integrated services. You need to build them yourself or fall back to external services like HubSpot or Google Analytics. It's impossible to get a consistent UX/DX across the board.
