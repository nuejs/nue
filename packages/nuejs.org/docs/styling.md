
# Styling
Go trough the simple blog.

! No CSS --> With CSS



## CSS architecture

! IMG simple blog / CSS


## Globals
CSS is global by nature. Consistent typography, colors, sizing, spacing, layout, and transitions to make the website feel like one cohesive unit.

These files are automatically. Define a [design system][#ds]

- `typography.css` has all typographic elements like headings, paragraphs, text formatting, lists, links, blockquotes, etc.

- `navigation.css` with settings for global header and footer

- `form.css` with all form elements like inputs, text areas, select boxes, checkboxes, radios, sliders, etc.


## Libraries
These files are included on demand. Re-used accross.


- forms.css
- cards.css


### Applications
`blog` is an [application directory]()
Inheritance

``` yaml
include: [ content, cards, motion ]
```

`contact/contatc.css, specific to this app only. not intended to be re-used outside this directory.




### Scoping
Inheritance, Overriding




## CSS practises

### Scoping
You can safely nest your CSS selectors


### Class names

- semantic: "card", ""
- visual: "pink", "blue"


### Resetting
```css
*, *::before, *::after {
  box-sizing: border-box
}
```



## Terminology

[^de]:
  ### Design engineering
  Most of your code is CSS.

  Wikipedia


Design system


Global scope:


  https://css-tricks.com/regarding-css-global-scope/

  Local scope
    CSS selectors, [table], ...

  Namespace pollution
Global Design System


## Further reading
Links to actual articles

- [Ahmad Shadeed](//ishadeed.com/)
- [Chris Coyier](//chriscoyier.net/)
- [CSS tricks](//css-tricks.com/)
- [Josh Comeau](//www.joshwcomeau.com/)
- [Ryan Mulligan](//ryanmulligan.dev/blog/)


There is tons of [misinformation](/blog/tailwind-misinformation-engine/) about CSS that makes beginner developers move away from web standards and adopt the idea of inline styling.

But if you grasp the power of the global design system and see how you can accomplish the same thing with significantly less effort you begin to think why you ever bought the idea of tight coupling in the first place.

Understand the power of constraints, design systems, and web standards. Become a professional UX developer and stay relevant for years to come.




