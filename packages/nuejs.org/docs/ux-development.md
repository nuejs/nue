

# UX development with Nue
Best practices and recipes for developing great user experiences and keeping your CSS clean and organized. Becoming great at CSS might take years, but this document gives you some great pointers and shortcuts to speed up the learning curve.


## Content comes first { #content-first }
UX development starts by understanding your reader and perfecting the content for that audience. This content determines the design of your site;

! content -> design system -> CSS -> motion -> interactivity >> UX

Take an inventory of what needs to go on each page. Any element on the screen is content: text, images, lists, tables, navigation, code blocks, and components. The more you know about what will go into the site, the better you can plan the design.

#### More info:
* [Balsamiq: Content-First Design](//balsamiq.com/learn/articles/content-first-design/)
* [PixelFridge: The benefits of a content-first approach](//www.pixelfridge.digital/the-benefits-of-a-content-first-approach/)
* [UX Planet: Information Architecture Design](//uxplanet.org/information-architecture-design-a-step-by-step-guide-41dcd4405ee3)
* [Bootcamp: Form follows Function](//bootcamp.uxdesign.cc/form-follows-function-48239b5cc19e)



## Create a design system { #design-system }
After understanding your content it's time for design. Look for the other, similar products on the market. How do you differentiate? What defines your unique look? Should it be minimalistic, functional, heroic, or playful?

Put that all down to a *design system* — a set of rules and building blocks that define the design of your product:

1. *Globals*: typography, colors, and the use of whitespace.
2. *Site layout*: global header, footer, and the content area
3. *Components*: grids, forms, boxes, tables, buttons, etc..
4. *Areas* — area specific layout and styling

The design system is usually a *Figma* or *Sketch* document shared with all the members of your UX team. Smaller, one-person projects can start developing the system directly with CSS.

#### More info:
* [Figma: What is a design system?](//www.figma.com/blog/design-systems-101-what-is-a-design-system/)
* [The Design System Guide](//thedesignsystem.guide/)
* [Figma: Marketing of design systems](//www.figma.com/blog/the-future-of-design-systems-is-marketing/)



## Respect constraints { #constraints }
Limit yourself to as few fonts, font weights, colors, variables, elements, class names, and components as possible. This is beneficial for several reasons:

1. *Easier to adopt* — A simple design system is easier to adopt and use. The fewer variables and components you have, the harder it is to mess things up.

1. *More creativity* — By narrowing the possibilities you allow for the quicker production of work and encourage developers to make creative combinations with the available options. With no limits, there are unlimited possibilities, similar to the effect a blank paper can make.

1. *Better consistency* — If engineers can "do anything", they definitely use their creative freedom to work against your design system. But when they can only use the stuff available you'll ensure that the design goes as planned.

1. *Long-lasting products* — Simple things last longer. The design decisions you make early on have long-lasting implications. Keep your design system simple and you are rewarded with great design and easily maintainable CSS code that lasts for future generations.


#### Links
* [Figma: Constraints in design](//www.figma.com/resource-library/constraints-in-design/)
* [LogRocket: Design constraints: Why they’re actually useful](//blog.logrocket.com/ux-design/design-constraints-why-theyre-useful/)



## Nail your CSS hierarchy { #css-hierarchy }
Split your design into globals, libraries, areas, and pages.

! example folder hierarchy (two Finders above each other?)

#### Globals
Put all the globally available settings and styles into a [global directory](project-structure.html#globals). Things like colors, fonts, headers, footers, popover menus, and all the components that are shared across all the areas on your website.

#### Libraries
Place all your reusable code into a [library directory](project-structure.html#libraries). This code is something you want to explicitly include on your pages. Things like syntax highlighting, videos, and settings for technical documentation can be shared by your blogging and documentation areas, but not everywhere on the site.


#### Areas
Place all area-specific CSS here. For example, a documentation area could set up sidebars and a fixed master header. These settings are specific to the area and not leaked to the global scope.


#### Pages
Place all page-specific CSS under the leaf folder, where the `index.md` file resides. These styles are only available for that single page only. These are very specific styles not used anywhere else. The amount of code here ranges from simple blog entry add-ons to your front page, which can have more page-specific coding than globals.



#### More info:
* [MDN: Cascade, specificity, and inheritance](//developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)



## Group things by function { #grouping }
Group similar things together into a single CSS file and name the files in such a way that everyone on your team can easily see what they do. For example:

- `typography.css` with all typographic elements like headings, paragraphs, text formatting, lists, links, blockquotes, etc.

- `navigation.css` with settings for global header and footer

- `form.css` with all form elements like inputs, text areas, select boxes, checkboxes, radios, sliders, etc.

Co-locating your elements by their intended function makes an intuitive CSS architecture that is easy to maintain and scale.



### Use simple selectors { #selectors }
One hugely important thing in the global design system is that you always know the exact [page layout](page-layout.html) you are styling. This allows you to take advantage of the global scope and use the simplest CSS selectors possible without worrying about conflicts.


```
h1 {

}

h2 {

}

p {

}

a {

}
```

If you want to vary the styling between the global elements and the bulk of the code this is trivial to do with CSS nesting:


```
/* navigation stuff always in nav scope */
nav {
  a {

  }

  hr {

  }
}

/* content always under article scope */
article {
  a {

  }

  hr {

  }
}
```

Simple selectors make easy-to-read and easy-to-maintain CSS, keep your file sizes to minimum, and use lower specifity for overrides.


#### Links
[Specificity and Hierarchy in CSS](//kelvinofili.hashnode.dev/specificity-and-hierarchy-in-css)


## Write clean, easy-to-read HTML { #clean-markup }
Avoid using unnecessary divs, spans, and class names in your [custom layouts](custom-layouts.html):

[code.bad]
  <div class="chat-notification">
    <div class="chat-notification-logo-wrapper">
      <img class="chat-notification-logo" src="/img/chat.svg" alt="Chat icon">
    </div>
    <div class="chat-notification-content">
      <h4 class="chat-notification-title">ChitChat</h4>
      <p class="chat-notification-message">You have a new message!</p>
    </div>
  </div>

Do this instead:

[code.good]
  <div class="notification">
    <h3>ChitChat</h3>
    <p>You have a new message!</p>
  </div>


Clean HTML is significantly easier to work with. Just strip all redundancy and only use class names on the root element and let CSS selectors do their job. It's surprising how little class names you need with clean, semantic markup. This website, for example, has only four class names on the global scope: "grid", "card", "stack", and "note". Global namespace pollution is just a myth and can be easily avoided with a simple, minimalistic CSS structure.



## Create re-usable class names { #reuse }
Always find ways to extract reusable components from your CSS code. In the above example, the notification component could be written as:

```
<div class="notification •card•">
  <h3>ChitChat</h3>
  <p>You have a new message!</p>
</div>
```

Here, the component was broken into two pieces: a highly re-usable "card" component and a notification-specific "notification" component:


```
/* styles for all cards */
.card {
  box-shadow: 0 0 2em #0001;
  border: var(--border);
  border-radius: .5em;
  padding: 1.5em;
  font-size: 95%;
}

/* notification-specific styling */
.notification {
  background: url(/img/chat.svg) 10% center no-repeat;
  background-size: 3rem;
  padding-left: 6rem;
}
```

Using re-usable CSS together with the global design system dramatically reduces the amount of code you need to write compared to component-based systems where the styling is inlined to the markup.

This entire website, for example, has the same amount of CSS code as a single Tailwind button component.


#### Links:
[Nicolas Gallagher: Compomnent Modifiers](//nicolasgallagher.com/about-html-semantics-front-end-architecture/#component-modifiers)



## Always use external styling { #external-css }
Avoid inline styling. That is: don't style your components directly on the markup:

[code.bad]
  <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
    <div class="shrink-0">
      <img class="h-12 w-12" src="/img/chat.svg" alt="ChitChat Logo">
    </div>
    <div>
      <div class="text-xl font-medium text-black">ChitChat</div>
      <p class="text-slate-500">You have a new message!</p>
    </div>
  </div>

Instead, write clean markup and style it externally:

[code.good]
  <div class="notification card">
    <h3>ChitChat</h3>
    <p>You have a new message!</p>
  </div>


This brings significant benefits:

1. *Easier to maintain* — clean HTML and CSS are easier to read, write, teach, share, and maintain.

1. *Less code to write* — external CSS leads to [maximum reuse](#reuse) and reduces the amount of code you need to write.

1. *Central control* — with external CSS, the styling is centrally controlled by UX developers, and the look and feel is dictated by the design system.

1. *Better SEO* — With clean HTML markup your [content to markup](//www.siteguru.co/free-seo-tools/text-to-html-ratio) ratio is significantly higher.

1. *Long-lasting products* — use the CSS standard to style your products so the codebase stands the test of time. There is zero risk for technical debt.


#### Links
[MDN: External Stylehseets](//developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/How_CSS_is_structured#external_stylesheet)


### Form follows function { #fff }
One killer feature of in external CSS is the ability to use the same exact markup, but a different stylesheet depending on the context. You could, for example, create a dedicated style for technical content and another for marketing content and include one or another depending on the context:


- `technical-content.css` for documentation and blog entries. Focuses on efficient information delivery and includes extra styling for tables, syntax highlighting, and API docs.

- `marketing-content.css` for the front page, customer cases, and feature tours. Has a more "heroic" tone with more prominent headings and more complex layouts.

Form follows function is a principle of design associated with late 19th- and early 20th-century industrial design, which states that the shape of a product should primarily relate to its intended function or purpose.

Global design system together with external CSS is the perfect demonstration of this principle on a modern web stack.




#### Prefer standard HTML { #html }
Don't create a custom component for every possible situation where a standard HTML element would do the job fine.

For example, in [Tailwind Catalyst](//catalyst.tailwindui.com/docs) there is a context-dependent component for every different context: `<DialogDescription>`, `<AlertDescription>`, `<Description>`, and `<Text>`. These could all be solved with a single `<p>` element.

Standard HTML helps you avoid *component overload* — a situation where you are constantly creating more and more new components. It's not unusual to see extremely complex codebases with hundreds, even thousands of components. Don't do that. Use semantic HTML + CSS, and do the same thing with less time and effort.



### Avoid CSS resets
Avoid CSS resets. They just add extra complexity and baggage and very little value. First, you set everything to zero and then set them to something you desire. It's better to just implement what's included in your design system and stay there. The only thing you need from a CSS reset library is this one sentence:

```
*, *::before, *::after {
  box-sizing: border-box
}
```

This sets your [CSS box model](//developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) globally to "border-box", which makes dealing with the sizes much easier, and eliminates several issues while laying out your content.



### Avoid CSS frameworks
Avoid CSS frameworks. They just add extra layers of complexity and very little value. Once you've created your design system, and know exactly what you're doing, the CSS comes naturally. Any 3rd party library is just on your way by adding tons of things you don't need. For example, Bootstrap 4 has around 9000 lines of CSS, which is orders of magnitude more than what is needed for this website.

Minimalism is probably the most undervalued development skill leading to significantly smaller and more manageable code.

> 10 lines of code is easier to maintain than 100 lines of code
> *Nue CSS best practice*



### Avoid CSS-in-JS
CSS-in-JS was introduced in 2014 to solve the problem of a global namespace in Facebook's gigantic, PHP-based codebase. However, this is a non-issue in well-organized CSS architectures.

A much better solution is to respect constraints and centralize your CSS for developers who care about UX. Having 5-15 carefully named components does not pollute anything. Instead, you'll create a library of reusable components that match your design system.



## Prefer CSS over JavaScript
Modern CSS is surprisingly powerful. Things that used to require JavaScript can now be expressed with nothing but CSS:

* Popover menus
* Scroll linked animations
* Smooth scrolling
* View transitions

Check [Motion and Reactivity](reactivity.html) for details.


### Learn modern CSS
There is tons of [misinformation](/blog/tailwind-misinformation-engine/) around CSS that attracts beginner developers to move away from web standards and adopt the idea of inline styling.

But if you gasp the power of the global design system and see how you can do the same thing with significantly less effort you begin to think why you ever bought the idea of tight coupling.

Harness the power of constraints, design systems, and web standards. Become great at developing user experiences and stay relevant for years to come.


#### Inspiration:
* [Ahmad Shadeed](//ishadeed.com/)
* [Chris Coyier](//chriscoyier.net/)
* [CSS tricks](//css-tricks.com/)
* [Josh Comeau](//www.joshwcomeau.com/)
* [Ryan Mulligan](//ryanmulligan.dev/blog/)

