---
title: CSS class naming strategies for scalable dashboard design
og: img/dashboard-3.png
thumb: img/dashboard-thumb.png
date: 2024-08-13
credits: ui8
---

In web development, CSS and design work hand-in-hand to create compelling user experiences. CSS brings designs to life digitally, translating visual mockups into actual rendered elements.

## Keep them short

When designing for the web, keeping CSS in mind from the start prevents frustration down the road. For example, layered graphical elements must be broken down into achievable HTML components. Typography and color schemes are also heavily influenced by CSS possibilities.

Designers should have a strong handle on core CSS concepts like the box model, selectors, specificity and inheritance.

> When designing for the web, keeping CSS in mind from the start prevents frustration down the road. For example, **typography and color schemes are heavily influenced by CSS** and layered graphical elements must be broken down into achievable HTML components.

``` js .blue
function toggleAttr(el, name, flag) {
  flag ? el.setAttribute(name, 1) :  el.removeAttribute(name)
}

function restoreTabs(flags) {
  const panels = $$('[role=tabpanel]')

  $$('[role=tab]').forEach((el, i) => {
    toggleAttr(el, 'aria-selected', flags[i])
    toggleAttr(panels[i], 'hidden', !flags[i])
  })
}
```

## Exploit the power of selectors

On the development side, CSS itself involves visual design skills. Bringing a layout to life requires not just coding, but typographic, spacing and color sensibilities. CSS skills give developers control over the final look and feel.

[! img/dashboard-1.png]

Overall, CSS is a uniquely visual language, with a direct impact on user-facing design. By embracing its connection to the design process, both designers and developers can build interfaces that are engaging and "CSS-native". The closer these roles work together, the better the end result. (edited)


## Conclusion

In conclusion, thoughtfully naming CSS classes, IDs, and other selectors is an important part of keeping stylesheets scalable and maintainable. Use semantic, descriptive names that communicate what a selector is styling. Implement methodical naming conventions and structures for better organization.


```css .pink
.pink {
  background-image: linear-gradient(#e879f9, #ec4899);
  padding: 3em 0 0 3em;
  border-radius: .8em;
  overflow: hidden;
  margin: 1.5em 0 2em;

  pre {
    padding: 2em;
    margin: 0;
  }
}
```

Avoid repetitive and overly specific names by separating structural styles from visual ones. And don’t be afraid to chain multiple classes together for more modular and flexible selectors.
