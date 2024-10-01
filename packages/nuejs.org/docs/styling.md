---
# complementary: false
---

# Styling
Nue relies on external CSS for designs by using exactly the same markup between projects. Nues Markdown can trust that the generated markup always has the same, limited set of elements whose HTML structure remains the same. This allows developers to use CSS to style the content differently based on the context. Be it blogging, marketing content, or technical documentation.

[image.gridpaper]
  small: /img/global-design-system.png
  large: /img/global-design-system-big.png
  caption: Same layout, wildly different designs
  size: 747 × 394 px


**Modernization** The CSS is processed with [Lightning CSS](//lightningcss.dev/) to take advantage of the modern/future features like nesting and color functions. It also parses CSS for any errors and Nue displays them to you on the browser.


**Organization** Nue keeps track of your [page dependencies](project-structure.html#page-dependencies) and helps you take maximum advantage of the CSS cascade.

**Best practices** Nue offers [tips and recipes](css-best-practices.html) for writing reusable CSS that is easy to manage and scale. You typically end up with 10-100 times less code than in a traditional JavaScript-powered system.

