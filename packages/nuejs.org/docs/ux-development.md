

# UX development with Nue
Best practices for UX and CSS development


## Content first
UX development starts by understanding your reader and perfecting the content for that audience. This content determines the design of the site.

! content -> design system -> CSS -> motion -> interactivity >> UX

Start by defining your information architecture and taking an inventory of what needs to go on each page. Any element that goes on the screen is content: text, images, lists, tables, navigation, code blocks, and components. The more you know about what will go into the site, the better you can plan the design.

#### More info:
* [Balsamiq: Content-First Design](//balsamiq.com/learn/articles/content-first-design/)
* [PixelFridge: The benefits of a content-first approach](//www.pixelfridge.digital/the-benefits-of-a-content-first-approach/)
* [UX Planet: Information Architecture Design](//uxplanet.org/information-architecture-design-a-step-by-step-guide-41dcd4405ee3)
* [Bootcamp: Form follows Function](//bootcamp.uxdesign.cc/form-follows-function-48239b5cc19e)



## Create a design system { #design-system }
After designing the content it's time for branding and design. Look for the other products on the same market. What is your look and feel? How do you differentiate? Should it be minimalistic, functional, heroic, or perhaps playful?

Put this down to a *design system* — a set of rules and building blocks that define the design of your product:

1. *Global settings*: typography, colors, and the use of whitespace.
2. *Site structure*: global header, footer, and layout
3. *Components*: grids, forms, boxes, tables, buttons, etc..
4. *Areas* — all the area specific styles and/or overrides

The design system is usually expressed a *Figma* or *Sketch* document that is marketed to all the members on your UX team. Smaller, one-person projects doesn't have to go that deep and you can go pretty straight to CSS.

#### More info:
* [Figma: What is a design system?](//www.figma.com/blog/design-systems-101-what-is-a-design-system/)
* [Figma: Marketing of design systems](//www.figma.com/blog/the-future-of-design-systems-is-marketing/)
* [The Design System Guide](//thedesignsystem.guide/)



### Respect constraints { #constraints }
Limit yourself to as few fonts, font weights, colors, variables, elements, class names, and components as possible. This has several advantages:

1. *Simple design system* — The less variables and components you have, the harder it is to mess things up. A simple design system is easy to adopt and use.

1. *More creativity* — By narrowing the possibilities you allow for the quicker production of work and encourage developers to make creative combinations with the available options. With no limits, there is are unlimited possibilities, similar to the effect a blank paper can make.

1. *Better consistency* — If engineers can "do aything", they definitely use their creative freedom to work against your design system. But when they can only use the stuff available you'll ensure that the design goes as planned.


1. *Long-lasting products* — Simple things last longer. The design-decisionis you make early on have long lasting implications. Keep your design system simple and you are rewareded with great design and easily maintainable CSS code that lasts for future generations.


#### Links
* [Figma: Constraints in design](//www.figma.com/resource-library/constraints-in-design/)
* [LogRocket: Design constraints: Why they’re actually useful](//blog.logrocket.com/ux-design/design-constraints-why-theyre-useful/)




## Nail your CSS architecture { #architecture }
Organize your CSS files in such way that everyone on your team can easily see how things work. Group similar things together and name your files well. For example:

! example hierarchy

#### Globals
Put all the globally available settings and styles into a [global directory](project-structure.html#globals). Things like colors, fonts, links, inputs, buttons, popovers, and all the components that are shared accross all the areas on your website.

#### Libraries
Place all CSS code into libraries that you want to include on your pages, but which are not globally needed on all the pages on your site. For example:; things like syntax highlightning, videos, and settings for technical documentation can be shared by your blogging and documentation areas.


#### Areas
Place all area-specific CSS here. For example, a documentation area could setup sidebars and a fixed master header. These settings are not leaked to global scope so there is no fear of conflicts.

#### Pages
Place all page-specific CSS under the leaf folder, where the `index.md` file resides. These styles are only available for that single page only.

You can create as many files as you like and Nue takes care of all performance issues. The clarity of the CSS architecture is the most important thing at this point.


#### More info:
* [MDN: Cascade, specificity, and inheritance](//developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)



### Avoid CSS resets
Avoid CSS resets. They just add extra complexity and baggage and very little value. First you set everything to zero and then set them to something you desire. It's better to just implement what's included on your design system and nothing more. The only thing you need from these set/reset libraries is this setting:

```
*, *::before, *::after {
  box-sizing: border-box
}
```

This sets your [CSS box model][box-sizing] globally to "border-box", which makes dealing with the sizes of elements much easier, and eliminates a number of pitfalls you can stumble on while laying out your content.



### Avoid CSS frameworks
Avoid CSS frameworks. They just add extra complexity and baggage and very little value. Once you've created your design system, and know exactly what your're doing, the CSS comes naturally. Any 3rd party library is just on your way.

Respect constraints and you'll end up with a lean system with significantly less manageable code than with any of the popular frameworks on the market.



## Avoid inline styling { #clean-markup }
Always write clean, semantic, and style-free HTML. So instead of doing this:

[code.bad]
  <!-- styling tightly coupled with markup -->
  <div class="relative pt-6 lg:pt-8 flex items-center justify-between text-slate-700 font-semibold text-sm...">
    <svg viewBox="0 0 248 31" class="text-slate-900 dark:text-white w-auto ...">
      <path fill-rule="evenodd" clip-rule="evenodd" d="..." fill="currentColor"></path>
    </svg>
    <div class="hidden md:flex items-center"><nav><ul class="flex items-center gap-x-8">
      <a class="hover:text-sky-500 dark:hover:text-sky-400 ..." href="/docs/">Docs</a>
      <a class="hover:text-sky-500 dark:hover:text-sky-400 ..." href="/blog/">Blog</a>
      ...
    </div>
  </div>

Do this:

[code.good]
  <!-- semantic markup -->
  <header>
    <img src="/img/logo.svg">
    <nav>
      <a href="/docs/">Docs</a>
      <a href="/blog/">Blog</a>
      ...
    </nav>
  </header>


Clean, semantic markup makes a difference:


1. *Easier to read* — Clean markup is easier to read and write.

1. *Central control for UX developers* — With inline styling, all your styling information is scattered into React components and maintained by JavaScript engineers. With semantic markup, however, your styling is decoupled from the HTML and is centrally managed by UX developers.

1. *Maximum re-use* — Headless markup is re-usable so you won't be suffering from [component overload](#overload)

1. *Less code to manage* — Semantic markup leads to significantly smaller codebases. This entire website, for example, has same amount of CSS code than a single Tailwind button component. For real.

1. *More consitent design* — With external CSS, the styling is in the hands of the UX team and the look and feel is dictated by the design system. With inline styling JavaScript engineers can do anything without boundaries.

1. *Better SEO score* — With clean HTML markup your [content to markup](//www.siteguru.co/free-seo-tools/text-to-html-ratio) ratio is significantly higher.

1. *Long-lasting products* — With semantic HTML your use vanilla CSS to style your products. Every UX developer can understand it, now and in the future. Standards are forever.


#### More info:
* [SEM Rush: Semantic HTML and how to use it](//www.semrush.com/blog/semantic-html5-guide/)



### Avoid component overload { #overload }
CSS works on a global scale so not everything should operate as a component. Otherwise you'll end up in a situation where your codebase consist of hundreds, even thousands of modules.

Check out [Tailwind Catalyst](//catalyst.tailwindui.com/docs) as an example. You can see components like `<Text>`, `<Description>`, `<DialogDescription>`, and `<AlertDescription>`. These could all be solved with a standard `<p>` element.

Headless markup can be styled externally, so you don't need a new component for every context. This brings several benefits:

1. Less components, faster builds
1. Less code to maintain
1. Less naming of things
1. Less cognitive load, easier to read and learn
1. Less files, easier to locate things


Component overload has led to development of Rust and Go-based compilers that can handle massive amount of files and NPM modules. However, this trend is completely unnecessary, because component overload can can be avoided with constraints and well-organized CSS.




### Avoid unnecessary class names
Avoid class names and naming conventions that clutter your HTML with unnecessary semantics. In most cases, you don't need class names at all or use it for the root element. Modern CSS, with powerful selectors and nesting support keeps both your HTML and CSS clean. So instead of doing this:

[code.bad]
  <form class="form form--card">
    <input class="form__input" type="email">
    <button class="form__submit form__submit--disabled">Submit</button>
  </form>

Do this:

[code.good]
  <form class="card">
    <input type="email">
    <button disabled>Submit</button>
  </form>

It's surprising how little class names you need with clean, semantic markup. This website, for example, has only four class names on the global scope: "grid", "card", "stack", and "note". Global namespace pollution is a myth and can be easily avoided.



### Avoid CSS-in-JS
CSS-in-JS was introduced in 2014 to solve the problem with global namespace pollution in Facebook's gigantic, PHP-based codebase. However, this is a non-issue in well-organized CSS architectures.

A much better solution is to respect contstraints and centralize your CSS for developers who care about UX. Having 5-15 carefully named components does not pollute anything. Instead, you'll create a library of reusable components that match your design system.



## Prefer CSS over JavaScript
Modern CSS is surprisingly powerful. Things that used to require JavaScript can now be expressed with nothing but CSS:

* Popover menus
* Scroll triggered animations
* Scroll linked animations
* Smooth scrolling
* View transitions



#### More info:
* [Nue: Motion design](motion-design.html)
* [Nue: Reactivity](reactivity.html)
* [Vite: Why Vite?](//vitejs.dev/guide/why.html)



### Learn modern CSS
There is a lot of [misinformation](/blog/tailwind-misinformation-engine/) around CSS that attracts beginner developers to move away from web standards and adopt the idea of inline styling.

But if you gasp the power of the global design system and see how you can do the same thing with significantly less time and effort you begin to think why you ever bought the idea of tight coupling.

Harness the power of constraints, design systems, and web standards. Become great at developing user experiences and and stay competitive and relevant for years to come.


#### Inspiration:
* [Ahmad Shadeed](//ishadeed.com/)
* [Chris Coyier](//chriscoyier.net/)
* [CSS tricks](//css-tricks.com/)
* [Josh Comeau](//www.joshwcomeau.com/)
* [Ryan Mulligan](//ryanmulligan.dev/blog/)


















