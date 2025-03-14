
# How Nue works: separation of concerns
Nue eparates content, structure, styling, and logic – returning web development to its natural clarity.

In software engineering, separation of concerns is a foundational principle: distinct problems demand distinct solutions. Desktop applications separate business logic from UI frameworks. Game engines maintain clear boundaries between physics, rendering, and input systems. Industrial design separates product engineering from materials and aesthetics. Each discipline masters its domain while working together through clean interfaces.

The React ecosystem stands as a strange anomaly: it forces every concern through a single abstraction. Business logic, interface structure, styling, state management - all must flow through components. This isn't just unconventional, it fundamentally contradicts how complex systems are built.

Nue returns web development to proper engineering principles. This document shows exactly how this separation works, from ambitious single-page applications through content-focused sites to seamless multi-page hybrids.


## Single-page applications
Nue breaks your app into clean layers—logic in models, structure in views, and controllers to tie them together. No more wrestling everything through components.


### Models: pure logic, no hooks
Your app’s core lives here—business rules, data handling, all free of UI clutter. No component state or prop drilling—just focused code doing its job. This opens doors: write it in JavaScript or TypeScript for quick work, or use Rust with WebAssembly for heavy lifting, like Figma’s model that deals with vectors. Tests get easier without framework mocks, and the logic moves anywhere because it’s not tied to React patterns.


### Views: simple structure, pure HTML
Views handle one thing: turning data into interfaces. No business logic, no styling—just semantic HTML you’d write by hand. A small scripting layer listens for model updates or clicks and refreshes the DOM, but that’s it. Think early React’s clarity, minus the JavaScript-heavy patterns. They stay pure by design—no `<style>` tags allowed—keeping structure separate from how it looks.


### Controllers: smooth coordination
Not every action fits in a component—routers, keyboard inputs, form validation need their own space. Controllers step in as the glue: a router fetches data and swaps views, a form controller checks inputs, a keyboard system handles shortcuts. They don’t mess with styling or view details—just connect logic to structure. This keeps each piece focused and simple to tweak.




## Websites
Nue turns content into the star—your files act as the model, layouts shape the structure, and controllers add just the right polish. No need for a component-heavy pile like React throws at you.


### Models: content as data
Your site’s heart is in its files—Markdown for stories, YAML for facts. Nue treats them like a real data model: Markdown parses into pages with metadata, YAML turns into data you can query, and folders set up your URLs. It’s not a trick—content does what components and databases do in apps, but cleaner. You write a page in Markdown, and Nue makes it work—no 100-file sprawl required.

### Views: layouts and islands
Two layers handle the visuals: layouts and islands. Layouts build your site’s backbone server-side—think headers, footers, content blocks—all in semantic HTML. They’re templates that shape your model, nothing more. Islands kick in client-side—small bits like a comment form or image gallery that add life where you need it. Each stays focused: layouts for structure, islands for sparks, no overlap.


### Controllers: focused behavior
Controllers come in two flavors: built-in and custom. Nue’s built-ins run the show quietly—client-side navigation for smooth page swaps, auto-mounting for islands, hot-reloading in dev mode. Custom ones you write—like a scroll trigger for animations or a form validator—add what’s yours. They watch the page and act, never mixing into content or layout. It’s light coordination, not a framework takeover.



## Design systems
React changed how styling happens—it pushed out a role called the design engineer. With Tailwind and components in charge, style gets locked into utilities and JSX, leaving systematic design behind. Nue brings that role back by giving style its own clean space. It uses Bun’s fast CSS parser and Lightning CSS under Node to unlock modern CSS, while keeping your builds smooth and hot-reloading snappy.


### Layers that flow
A design engineer builds style in layers, each with a clear purpose. Global rules start it off—think colors, fonts, spacing—setting your app’s foundation. Area layers come next, adjusting those rules for sections like docs or blogs, staying tied to the big picture. Page layers handle special tweaks, keeping everything in line.

Nue’s keeps these areas separate and automatically includes the correct stylesheets to your pages, based on where the page resides on the hierarcy.


[Learn how to build design systems with CSS](/docs/design-systems.html).

