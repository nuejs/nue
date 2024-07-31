

# Global Design System
Nue's power leans heavily on a thing called _global design system_. It allows UX developers to rapidly create different designs using the same exact markup between projects:

[image.gridpaper]
  small: /img/global-design-system.png
  large: /img/global-design-system-big.png
  caption: Shared layout, wildly different designs


## Modern-day CSS Zen Garden
Think Nue like a modern-day [CSS Zen Graden](//csszengarden.com/): you get the exact same HTML markup, but you can write CSS to achieve wildly different designs. Nue frees you from implementing page layouts and basic UI elements over and over again so you can move faster with nothing but CSS. Or as the well-known UX developer [Brad Frost](//bradfrost.com/) puts it:

> Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential. *Brad Frost*


### Standardized layout
Nue lets you assemble rich web pages without touching a single line of code. Instead, you describe them with human-friendly text formats: YAML and Markdown. You'll get the [same layout](page-layout.html), but style it differently to meet the requirements of the context.


[image.gridpaper]
  src: /img/page-layout.svg

You can also [customize the layout](](custom-layouts.html)) with a minimal amount of HTML for all the different page types you may have like landing pages, blog entries, and technical documentation.


Once the HTML layout is in place, your work is to [style it with CSS](css-best-practices.html) and perfect the user experience with [motion and reactivity ](reactivity.html)


### Standardized content
Nue comes with a rich [Markdown flavor](content.html) for rich, interactive content.
Content authors and UX developers can rapidly build web pages without ever touching a single line of code. Things like buttons, tables, responsive images, tabbed content, and code blocks are built in.

This content assembly format always produces the exact same HTML output for the different components making it a perfect fit for the global design system. The produced markup is 100% headless so you are free to design the components the way you like.


[.note]
  ### Single-page apps
  The UI library will later expand with components that help you rapidly build [single-page applications](single-page-applications.html). Right now, the focus is on content-focused components.


### A theming system
The standardized layout is coupled with a powerful system to rapidly create different designs. It has the following features:


1. **Modernization** The CSS is processed with [Lightning CSS](//lightningcss.dev/) to give support for modern/future features like nesting and color functions.

2. **Hot-reloading** Nue offers a universal solution for [hot-reloading](hot-reloading.html). It intelligently diffs and auto-updates your browser whenever you update your content, styles, or components.

3. **Organization** Nue auto-calculates your page dependencies, keeps your CSS in order, and helps you take maximum advantage of the CSS cascade.

4. **Best practices** Nue offers [tips and recipes](css-best-practices.html) for writing reusable CSS that is easy to manage and scale. You typically end up with 10-100 times less code than in a traditional JavaScript-powered system.

5. **Optimization** Nue comes with a unique [performance optimization](performance-optimization.html)] system that minifies your CSS for production, and packages your CSS and HTML together into one, compact deliverable:





