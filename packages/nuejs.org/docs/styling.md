
# Design Systems and Styling
Go trough the simple blog.



## Design Systems
Plnned or not. CSS forces you to think in terms of design systems.
CSS architecture


! CSS architecture or the simple blog


### Globals
Global styling defines typography, colors, sizing, spacing, layout, and transitions to make the website feel like one cohesive unit. These styles make the bulk of your design system:

These files are automatically. Define a [design system][#ds]

- `typography.css` has all typographic elements like headings, paragraphs, text formatting, lists, links, blockquotes, etc.

- `navigation.css` with settings for global header and footer

- `form.css` with all form elements like inputs, text areas, select boxes, checkboxes, radios, sliders, etc.

Global scope: https://css-tricks.com/regarding-css-global-scope/


### Libraries
UI libraries for components and elements
These files are included on demand. Re-used accross.

- forms.css
- cards.css


## Contexts
Cascade, specifity, inheritance

### Site
globals, site.yaml

### Areas
`blog` is an [application directory]()
Inheritance

``` yaml
include: [ content, cards, motion ]
```

### Pages
....


### Sections
...


`contact/contatc.css, specific to this app only. not intended to be re-used outside this directory.


## Design System best practises

### Content first
information architecture, contexts

### Respect constraints
...



## CSS Best practises


### Selectors

### Nesting
  Nue uses Lightning CSS to modernize your CSS. You can safely nest your CSS selectors

### Class names

Good:
  tons of names
Bad:


- semantic: "card", ""
- visual: "pink", "blue"

### Resetting

```css
*, *::before, *::after {
  box-sizing: border-box
}
```

### Templates
Stay tuned.. lessons from above wrapped


