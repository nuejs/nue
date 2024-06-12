

# Global Design System
At its core Nue is based on a thing called [global design system][brad]. It provides designers, developers, and content creators a common way to structure web pages and user interfaces. On top of that, Nue also offers a styling framework for rapid application development and CSS best practices for writing scalable and easy-to-maintain web applications.


## Modern-day CSS Zen Garden
Think Nue like a modern-day [CSS Zen Graden](//csszengarden.com/): you get the same layout for your pages and components, but the design can change wildly just by using a different set of stylesheets. This allows you to build rich, content-focused websites with nothing but CSS.

! video: hot-reloading content and CSS

The idea of the global design system comes from [Brad Frost](//bradfrost.com/), a well-known UX/CSS developer:

[quote from="Brad Frost" cite="gds"]
  A Global Design System would improve the quality and accessibility of the world’s web experiences, save the world’s web designers and developers millions of hours, and make better use of our collective human potential.



### Standard page layouts
Nue offers fixed, and standards- based page layouts for all the common use cases: blog entries, documentation, index pages, and freeform content. Developing websites narrows down to styling these layouts with Nue's powerful theming system:

! IMG: docs layout + CSS = screenshot

The generated HTML is carefully crafted to meet the W3C standards, semantics, and accessibility guidelines so you don't have to reinvent the wheel over and over again.

[Learn more](page-layouts.html)



### Markdown extensions
Nue comes with a common set of Markdown extensions for building rich, content-focused websites. Things like buttons, tables, responsive images, tabbed content, and code blocks are supported out of the box. Once you make these components compatible with your design system, all the non-technical people can create rich, pixel-perfect content without any help from the developers:

! IMG: content -> screenshot

[.note]
  ### Note
  The global design system will later expand with UI components that help you build [single-page applications](single-page-applications.html). Right now, the focus is on content-related components.


[Learn more](markdown-extensions.html)



## Theming framework
Nue comes with a powerful theming framework to effectively propagate your design system to all areas of your website.

! IMG: globals -> areas -> pages

* Dependency management
  Nue automatically calculates your dependencies and loads the correct CSS files on your behalf.

* Hot-reloading
  auto-updates your browser when you update your styles. CSS error reporting

* Modernization:
  Nue is backed with [Lightning CSS](//lightningcss.dev/) to give support for modern/future CSS features like nesting and advanced color functions.

* Optimizations
  minififes your CSS for production, and packaging HTML and minified CSS into one, compact deliverable:


[Learn more](performance-optimization.html)




### Motion and Interactivity
Implment smooth scrolling, view transitions, and scroll effects with nothing but CSS.

! video: scroll animation, click around, docs scroll, mobile menu

[Learn more](css-best-practices.html)




### CSS best practices
Nue offers recipes for writing CSS that are easy to manage and scale. You can easily end up in a situation where you have 10-100x less CSS than in a system where the code is distributed and into components:

> 10 lines of code is easier to manage than 100 lines of code

[Learn more](css-best-practices.html)

