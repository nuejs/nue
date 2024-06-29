

# Global Design System
Nue is powered by a global design system. It allows UX developers to rapidly create different designs using the same exact markup between projects.


## Modern-day CSS Zen Garden
Think Nue like a modern-day [CSS Zen Graden](//csszengarden.com/): you get the exact same HTML markup, but you can write CSS to achieve wildly different designs. Or as a well-known UX developer [Brad Frost](//bradfrost.com/) puts it:

[quote from="Brad Frost"]
  A Global Design System would improve the quality and accessibility of the world’s web experiences, save the world’s web designers and developers millions of hours, and make better use of our collective human potential.


### Shared page layout
Nue lets you develop rich web pages declaratively with YAML and extended Markdown syntax without ever touching HTML. There are also hooks for customizing the layout for all the different page types like you may have like landing pages, blog entries, and technical documentation. Once the layout is in place, your work is to style it with CSS.


[Learn more](page-layout.html)


### Shared components
Nue comes with a rich set of headless UI components and Markdown extensions. Things like buttons, tables, responsive images, tabbed content, and code blocks are readily available for UX developers and content writers. The semantic markup is clean from inline styling so you are free to design the components the way you like.


! img: article with sections and components


[.note]
  ### Single-page apps
  The UI library will later expand with components that helps you rapidly build [single-page applications](single-page-applications.html). Right now, the focus is on content-focused components.


[Learn more](markdown-extensions.html)


## A theming system
Nue offers a powerful system to rapidly create different designs for the markup in the global design system.


### Modernization
Nue is backed with [Lightning CSS](//lightningcss.dev/) to give support for modern/future CSS features like nesting and color functions.


### Hot-reloading
Nue provies a universal solution for hot-reloading. It intelligently diffs and auto-updates your browser whenever you update your content, styles, or components.


### Organization
Nue keeps your CSS files in order and offers tips and recipes for writing CSS that is easy to manage and scale. You might end up in a situation where you have 10-100 times less code than in a system where the styling is scattered inside a large set of React components.

[Learn more](ux-development.html)


### Optimization
Nue minififes your CSS for production, and packages your CSS and HTML together into one, compact deliverable:

[Learn more](performance-optimization.html)





