
# Design Systems and Styling


## CSS is for styling
Nue emphasizes the use of CSS for styling in contrast to JavaScript monoliths for several compelling reasons:

### Design Systems
The global nature of CSS allows creation of Design Systems that ensure design consistency across components and pages. A centralized, designer-friendly system helps prevent chaos as your website grows.


### Progressive enhancement
CSS enables a progressive enhancement approach to design, allowing you to start with basic styles and gradually enhance them for mobile devices, optional decorations, and motion effects.


### Modern CSS capabilities
Modern CSS is incredibly powerful, featuring capabilities such as view transitions, `@starting-style`, generic CSS transitions, and `@keyframe`s. These features surpass what can be achieved with monolithic JavaScript frameworks. Tailwind simply cannot keep pace with the advancements in CSS.

### Better performance
First, let's consider tooling performance. Hot Module Replacement (HMR) in Nue is lightning-fast, taking mere nanoseconds to compile a single CSS file, whereas JavaScript monoliths slow down as their dependencies grow.

Next, there's website performance. External CSS results in smaller file sizes. For example, this web page's size is smaller than the barebones Tailwind CSS "preflight" file.

### Web Sandards Model
Nue helps you build timeless skills and products using standards and practices that stands the test of time. While trends like Bootstrap or Tailwind come and go, web standards are forever.




## Design Systems
Plnned or not. CSS forces you to think in terms of design systems. CSS architecture

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
plan your information architecture, and draft your content first. the more you know about your content the more precise your design system is to match your brand and messaging.

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


