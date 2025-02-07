---
date: 2023-12-14
og: /img/nuekit-hero-big.jpg
title: Announcing Nuekit 0.1
desc: A simple, minimalistic alternative to Next.js and Astro with universal hot-reloading and much more.
---


Today I’m excited to share Nuekit: A new kind of static site generator and web application builder.

[image.larger]
  small: /img/nuekit-hero.jpg
  large: /img/nuekit-hero-big.jpg


It's a very different beast than the other tools you see around. Particularly the developer experience is something new and special.

*You'll get universal hot-reloading for content, layout, styling, and reactive islands*. Client-side routing for both websites and single-page applications. Extreme overall minimalism and simplicity, next-level build times, and much more. Most importantly: Nuekit brings you closer to web standards so your websites and apps will stand the test of time.

In other words: Nuekit is an amazingly simple and powerful alternative to *Next.js* and *Astro*. The release highlights include:


## Universal hot-reloading { #uhr }
Build entire websites without ever touching your browser. Your browser is instantly updated as you make changes to your content, styling, layout, and reactive islands:

[bunny-video.larger]
  videoId: 18714305-d2f3-453d-83a9-0bd017166949
  poster: /img/hot-reload-hero.jpg


## Great for websites and single-page apps { #multi }
Use the same simple syntax and development model for content-focused websites or reactive single-page applications — while enjoying the extra boost from universal hot-reloading.

[image]
  small: /img/simple-blog.png
  large: /img/simple-blog-big.png
  href: //simple-blog.nuejs.org
  width: 650

Build a simple blog: [Tutorial](/docs/tutorial.html) /
[Live demo](//simple-blog.nuejs.org) /
[Source code](//github.com/nuejs/nue/tree/master/packages/examples/simple-blog)

&nbsp;

[image]
  small: /img/simple-spa.png
  large: /img/simple-spa-big.png
  href: /@simple-admin
  width: 650

Build a simple SPA: [Tutorial](/docs/tutorials/build-a-simple-spa.html) /
[Live demo](/@simple-admin) /
  [Source code](//github.com/nuejs/create-nue/tree/master/simple-app)


## Significantly faster build times { #faster }
Nue is an order of magnitude faster than its cousins. An identical blogging site takes around *50ms* to build with Nuekit and over *ten seconds* with Next.js:

[bunny-video]
  videoId: 45b73e3a-3edd-47af-bcd8-49039496b107
  caption: Building blog template with Nue in 39ms ¯\_(ツ)_/¯
  width: 650

## Other notable highlights { #other }

- [View transitions](/docs/reactivity.html)
- [Layout components](/docs/layout.html)
- [JS/TypeScript modules](/docs/reactivity.html)
- [Content collections](/docs/content-collections.html)
- [Reactive components](/docs/islands.html)
- [Extreme performance](/docs/optimization.html)


### New, beautiful documentation area
With lots of explainer-images and -videos:

[image]
  small: /img/docs.png
  large: /img/docs-big.png
  href: /docs/


## Get started
Starting a new project in Nue is easy:

```sh
# Install Nue globally for all your sites and apps
bun install nuekit --global

# Start with a new template
bun create nue@latest
```

Check out our [Getting Started guide](/docs/) to learn the details


### Monorepo
The "nuejs" GitHub repository was renamed to [nue](//github.com/nuejs/nue) and has been converted to a monrepo, now holding both [nuejs](//github.com/nuejs/nue/tree/master/packages/nuejs) and [nuekit](//github.com/nuejs/nue/tree/master/packages/nuekit) packages. This monorepo will hold all the upcoming Nue-related projects like *Nuemark* and *Nue CSS*.


## Thank you!
Finally, I’d like to give a huge thanks to the [20+ developers](//github.com/nuejs/nue/graphs/contributors) who have participated in the early development of Nue JS. Your feedback has been essential in shaping Nue into the tool it is today. If you’re interested in getting involved, please join the [Discussion @ GitHub](//github.com/nuejs/nue/discussions)

