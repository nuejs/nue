

# Nue: A content-first framework

Content-first is a design and develoment strategy that places content ahead of everything else to create user-friendly products. This strategy builds on the followng foundations:

[image.floating]
  src: /img/ux-stack.png
  width: 300

- [Separation of Concerns](//en.wikipedia.org/wiki/Separation_of_concerns) is a web design principle for separating your code into clearly distinct layers: content, layout, styling, and reactivity. This increases the clarity and scalability of your code.

- [Form follows Function](//en.wikipedia.org/wiki/Form_follows_function) is a principle that states that the design of your website should primarily relate to its intended function. That is: draft your content first, before proceeding with the other layers of the product.

- [Progressive Enhancement](//en.wikipedia.org/wiki/Progressive_enhancement) is web design strategy allowing everyone to access the basic content and functionality first, which is then enhanced with visual- and reactive elements for users with more capable devices.

- [Minimalism](//en.wikipedia.org/wiki/Minimalism_(computing)) is a logical result from content-first development model. A design constrained to bare essentials produces the simplest and cleanest system architecture.



## Nue is for UX developers
Nue makes a big difference on how you code looks like. What used to take a React/Tailwind specialist and thousands of lines of TypeScript is now taken care by a [UX developer][brad] with a few hundred lines of CSS. And the result is a record-breaking performant website with great UX for both the end users (visitors) and the people managing website content. To give you a rough idea, here are Tailwind and Nue front page source codes compared:


[.stack]
  [image.bordered]
    small: /img/react-page.png
    large: /img/react-page-big.png
    caption: Tailwind front page made with mixed concerns
    width: 500
    href: //github.com/tailwindlabs/tailwindcss.com/blob/master/src/pages/index.js

  ---
  [image.bordered]
    small: /img/nue-page.png
    large: /img/nue-page-big.png
    caption: Nue front page with separated content
    width: 500
    href: //github.com/tipiirai/nue/blob/master/new-www/index.md?plain=1



### Shift in focus
Nue changes the way you think about web development. Instead on learning all the advanced programming concepts and framework-specific idioms, the focus shifts to designs systems and UX development. It's a [whole different mindset][divide]:

[table head="Preference | React developer | UX developer"]
  - Preferred tech | React + Tailwind | Web Standards
  - Primary language | TypeScript | CSS
  - Building blocks | Components | Global Design System
  - Strategy | Tight coupling | Separation of Concerns
  - Design strategy |  Utility classes | Form follows Function
  - Highly valued | Type Safety | Minimalism


[image.gridpaper]
  small: /img/ux-development.png
  large: /img/ux-development-big.png


UX developers approach development from the content side focusing on the problems and desires of it's audience. This reduces risk of over-engineering the technology stack. You may have the coolest technology choices in the world, with the sickest visual tricks possible, but if the content fails, everything fails. Or as [Steve Jobs says](//youtu.be/dI93BvrBxQ0?si=Ub2Q_S_E7uKVilVL&t=104):


[quote.floating from="Steve Jobs"]
  You've got to start with the customer experience and work backwards for the technology



### Do more with less
Nue requires significantly less code to build the same thing. For example, this documentation area ia made up with ~250 lines of documented CSS and ~50 lines of JavaScript (The "Zen mode" and scroll/navigation highlight). Contrast this to any React-based documentation generator and you are faced with thousands of lines with TypeScript/TSX.

The same goes to the results, where the difference is also massive. For example, the combined weight of all CSS on this page is 7kb, which is smaller than a [single Tailwind button](/).

Minimalism yields to most maintainable and scaleable products.



### Work closer to standards
Thanks to separation of concerns, Nue can operate closer to with significantly less abstractions and NPM modules. Websites is mostly built with vanilla CSS and little bit of JavaScript. You'll get to know how the web works on the lower level.

Most importantly: the code you are writing now is something that all developers can understand for years to come. Because trends come and go, but standards are forever.



### Build snappier experiences
Content-first stack generates leaner and more performant websites. The resulting pages are not just smaller, but can be easily inlined to one, compact package:

[image.gridpaper]
  small: /img/first-paint.png
  large: /img/first-paint-big.png


This is again, much different to what the other frameworks like Next.js and Vite are doing. They put most of their effort to Rust-based bundlres that can combine and minify hundreds, sometimes even thousands of JavaScript packages and NPM moules into one deliverable. This may work for single-page applications, but is suboptimal for content-heavy websites. No amount of JS bundling can beat a tiny packet that has all the HTML and CSS to to render the full experience.




## Nue makes you move faster
When the core parts of your web stack are neatly separated, people can focus on the areas they are natively interested in:

[image.gridpaper]
  small: /img/scale.png
  large: /img/scale-big.png


- *UX developers* can focus on design and user experience without troubling themselves with advanced TypeScript/React concepts.

- *Marketers, copywriters* and *technical writers* can focus on content in isolation without constant troubling of developers.

- *JavaScript developers* can focus on the application logic without troubling themselves with design or CSS.


## Key features of Nue

[.grid item="card"]
  ### Global Design System
  A styling framework to save you from repeating yourself

  [Learn more](global-design-system.html)
  ---

  ### Content Management System
  A powerful content management system for marketers, and technical writers

  [Learn more](content-management-system.html)
  ---

  ### Reactivity layer
  Turns your content into rich, interactive experience

  [Learn more](reactivity.html)
  ---

  ### Single-page Applications
  Content-first development model for single-page apps

  [Learn more](single-page-applications.html)

