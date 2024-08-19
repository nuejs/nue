---
# complementary: false
---

# Global Design System

Nue's power leans heavily on a thing called *global design system*. It allows UX developers to rapidly create different designs by using exactly the same markup between projects:

[image.gridpaper]
  small: /img/global-design-system.png
  large: /img/global-design-system-big.png
  caption: Same layout, wildly different designs
  size: 747 × 394 px

## Modern CSS Zen Garden

Nue frees you from implementing page layouts and basic UI elements over and over and allows you to move faster with nothing but CSS. Or as the well-known UX developer [Brad Frost](//bradfrost.com/) [puts it][gds]:

> Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential. *Brad Frost*

Think Nue like a modern-day [CSS Zen Graden](//csszengarden.com/): a demonstration of what you can accomplish with nothing but CSS.

## How it works

Nue provides an [extended Markdown flavor](/docs/content.html) for authoring web content. In addition to the basic text formatting, Nue supports sections, grids, responsive images, videos, tabbed content, and more. This makes the flavor suitable for the web, unlike the standard Markdown optimized for writing emails.

UX developers love the idea behind Markdown because they can trust that the generated markup always has the same, limited set of elements whose HTML structure remains the same. This allows developers to use CSS to style the content differently based on the context. Be it blogging, marketing content, or technical documentation.

Nue extends this basic idea to span your entire website. You continue using YAML and Markdown for your content, but now you can also use YAML to describe your information architecture. This includes all your navigational elements, the global header, the global footer, and the "burger menu".

This makes a [standard page layout](page-layout.html) and allows you to use CSS to create wildly different designs between pages and projects.

[image.bordered /img/page-layout.svg width="600"]

You can also [customize the layout](custom-layouts.html) with a minimal amount of HTML to build the different areas of your website like documentation, blog, tutorials, customer cases, etc...

[.note]
  ### Note

  The global design system will later be expanded with components that help you build [single-page applications](single-page-applications.html)

## CSS theming system

The global design system comes with a powerful CSS theming framework. It has the following features:

1. **Modernization** The CSS is processed with [Lightning CSS](//lightningcss.dev/) to take advantage of the modern/future features like nesting and color functions. It also parses CSS for any errors and Nue displays them to you on the browser.
2. **Hot-reloading** Nue offers a universal solution for [hot-reloading](hot-reloading.html). It intelligently diffs and auto-updates your browser whenever you update your content, styles or components.
3. **Organization** Nue keeps track of your [page dependencies](project-structure.html#page-dependencies) and helps you take maximum advantage of the CSS cascade.
4. **Best practices** Nue offers [tips and recipes](css-best-practices.html) for writing reusable CSS that is easy to manage and scale. You typically end up with 10-100 times less code than in a traditional JavaScript-powered system.
5. **Optimization** Nue comes with a unique [performance optimization](performance-optimization.html) system that minifies your CSS for production and packages your CSS and HTML together into one, compact deliverable.
