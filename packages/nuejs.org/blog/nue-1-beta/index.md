
---
hero_title: "Announcing *Nue 1.0-beta*"
---

Exactly one year ago I [decided](/blog/backstory/) to create the absolute _slickest_ website generator in the world. Today is the day — the vision becomes reality:

[image.larger]
  small: /img/og-blue.png
  large: /img/og-blue-big.png
  size: 747 x 474
  caption: "Nue: go directly from Figma to CSS"

[.note]
  ### The gist
  What used to take a separate designer, React engineer, and an absurd amount of JavaScript can now be done by a UX developer and a small amount of CSS.


### Who is this for?
Nue is designed for the following people:

1. **UX developers**: who natively jump between **Figma** and **CSS** without confusing [designer-developer handoff](//medium.com/design-warp/5-most-common-designer-developer-handoff-mishaps-ba96012be8a7) processes in the way.

2. **Beginner web developers**: who want to skip the [redundant frontend layers](//roadmap.sh/frontend) and start building websites quickly with HTML, CSS, and JavaScript.

3. **Experienced JS developers**: frustrated with the absurd amount of layers in the [React stack](//roadmap.sh/react) and look for simpler ways to develop professional websites.

4. **Designers**: aiming to learn web development, but find the React/JavaScript ecosystem impossible to grasp


- - -


## What's new?
v1.0 Beta is by far the biggest release yet with xxx commits and xxx files changed.

### Global design system
Nue has always had the content-first idea of assembling .., but with this release this idea is taken further to something what Brad Frost calls a "global design system" (GDS).

[image.lightgray]
  small: /img/global-design-system.png
  large: /img/global-design-system-big.png
  caption: Shared layout, wildly different designs

GDS defines what Nue is. It allows you to Use the same exact layout but, ...

Think this as modern-day [CSS Zen Garden](//www.csszengarden.com/) where... A more familiar concept is Markdown: it always gives the same  HTML, but you can alter how it looks with CSS. Nue takes this idea and turns it into a rapid web application development environment with the following new features:

* standardized page layout
* headers, footers, "burger menus", and custom navigational components can now be defined without
* A new <navi/> tag to use the descriptive ..
* custom layouts for defining..
* <page-list/>, <toc/>, less HTML/JavaScript, and more CSS even with


**Brad Frost**, a famous UX developer and the man behind the idea [says][gds]:

> Global Design System improves the quality and accessibility of the world’s web experiences, saves the world’s web designers and developers millions of hours, and makes better use of our collective human potential. *Brad Frost*

The global design system allows you to build modern websites with nothing but CSS.


### CSS theming system
This version improves Nue's CSS framework with the following features to make it an ideal companion for styling the standardized layouts on the global design system:

* Lightning CSS enabled by default
* New Library folders with include
* Eexclude property to
*



### Improved view transitions
Great CSS support,


``` css.pink
article {
> view-transition-name: article;
}

/* view transition (scales down the old article) */
::view-transition-old(article) {
  transform: scale(.8);
  transition: .4s;
}
```

Unexplored area, together with @starting-style

``` css.blue
.hero {
  /* sidebar */
  @starting-style {
    opacity: 0
  }
}
```


### CSS best practices
To build .. with GDS

! UX development category floating

*
* CSS best practices


### Dynamic sections and grid items
[grid] tag


### 99% freeform folder structure
* no hardcoded app.yaml, layout.yaml, main.js
* any .data file, any .js file (no main.js), any .html file,


[image.purple]
  small: /img/web-editor.png
  large: /img/web-editor-big.png


## Smaller updates

* .nue --> .htm
* pubDate -> date
* inline SVG support
* list all new configuration options...


## Breaking changes
This version not backwards compatible.
Semver in action after 1.0 is out. Before that "practical versioning"


* [glow] --> pre
* dropped icon tag
* always figure tag
* css.className creates a wrapping element
* code wrapper not supported. provide with `[code.<className>]`
* always draw_sections, no <section/> tags elsewhere
* css_2023 --> css_nesting
* [active] --> [aria-selected]


## New website
About 80% of the xxx commits relate to the new website, which documentation.

! vertical widened hero image, labeled: "new front page"

Unsurprisingly, the biggest job was the documentaion area, which now focuses on [UX development](/docs/ux-development.html)

! UX development category floating: select UX development


## Towards 1.0 stable
Feedback: global design system HTML, part of Open UI,

* create-nue / onboarding
* view-transition is a fundamental feature and very much defines what Nue is. dom diffing, CSS examples, API docs,



## Installation

[.info]
  the focus is on websites and the dynamics pieces focus on reactive "islands"
  SPA-stuff delayed: app-router docs, demo, and tutorial are still there, but



