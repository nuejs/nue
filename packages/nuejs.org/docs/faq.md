---
beside: false
---

# FAQ

## We've spent years investing in React. Isn't this throwing away our expertise?
React has pushed millions of developers to think deeply about user interfaces and application architecture. That knowledge is valuable. But ask yourself: how much of your time is spent wrestling with React-specific patterns versus spending time on topics that genuinely interests you?

The beauty of standards-first development is that it lets you go deeper into what actually excites you. If you love solving complex system challenges, you can focus purely on that — perhaps even diving into Rust and WebAssembly for high-performance computation. If you're drawn to design, you can master the mathematical precision that makes interfaces feel commanding. If you love crafting seamless user experiences, you can work directly with the platform's powerful capabilities.

Instead of being a "React developer" juggling dozens of framework-specific patterns, you can become a true master of your craft. Your React experience gives you a strong foundation in thinking about interfaces and architecture. Now you can build on that foundation to develop deeper expertise in the areas that genuinely interest you.

Perhaps explore Nue alongside your React work. Build something small first. You'll find that working directly with web standards not only makes development faster, but helps you learn how the web actually works.


## Components naturally group related code together — why break that?
You are correct. The first version of React beautifully solved UI rendering with a simple one-way data flow. Components were truly focused on the view layer. But that elegance slowly started to crack with Flux, then Redux, then more sophisticated state needs. Hooks tried to solve this growing complexity, but components kept accumulating more responsibilities: state management, side effects, styling, business logic. The simple model that made React beautiful became buried under layers of abstractions.

This is why we need to return to proper architectural separation. Not because components are wrong, but because they should focus purely on what they do best: presenting interfaces. State management, business logic, and systematic design deserve their own dedicated layers where they can evolve independently.


## Our team ships fast with React — why change?
React's component model can accelerate initial development. When your team has mastered React patterns and has a library of existing components, you can assemble features quickly. This is why so many teams feel productive with React.

But consider what you're actually assembling: Every new feature means more components, more dependencies, more build complexity. What feels like rapid development is actually accumulating technical debt. Even simple UI patterns require dozens of component imports and potentially hundreds of new dependencies you're not keeping track of.

Compare this to building on web standards: Your team can create more sophisticated features with a fraction of the code. Instead of wrestling with component abstractions, they work directly with the platform's capabilities. Development becomes genuinely faster because there's simply less to manage.

Try building something small with Nue alongside your React work. You'll find that what takes 300 dependencies and complex build pipelines in React can be achieved with pure web standards. This isn't about abandoning your team's expertise — it's about rediscovering how powerful the web platform has become.



## Most applications don't need WebAssembly or Rust — isn't this overkill?
The WebAssembly example in our demo isn't about raw performance — it demonstrates something far more important: what becomes possible when your business logic is properly separated from presentation.

But when your business logic lives in its own pure layer, entirely new possibilities emerge. Rust is just one example — you could model complex financial calculations, build sophisticated data visualization engines, or create real-time collaboration systems. Your logic can evolve independently of the interface, enabling the kind of architectural advances that the React monolith prevents.


## Isn't performance engineering all too theoretical in the frontend?
This is actually an untapped opportunity in the React ecosystem. While most frontend teams are stuck in component patterns, WebAssembly has quietly matured into a powerful standard supported by every major browser. Look at Figma — their vector engine processes complex boolean operations instantly while keeping the interface perfectly responsive.

These aren't theoretical possibilities — they're real applications pushing the boundaries of what's possible in the browser. But achieving this sophistication required breaking free from the component model.

This field is waiting to be explored. Whether through Rust, advanced JavaScript patterns, or entirely new approaches — the possibilities are endless when you free your business logic from component architecture.


## Isn't CSS a step backwards?
This view perfectly captures how the React ecosystem has shaped our thinking. CSS has evolved into an incredibly sophisticated language for systematic design — but most developers never experience its power because their design decisions are trapped in TypeScript components.

Think about the interfaces you admire: Linear's slick, dark look or Apple's functional clarity. These aren't achieved through component libraries or utility classes. They come from tailor made design systems built specifically for the purpose.

Design engineering is an entirely new career path. Instead of being the person who converts Figma sketches to React components, you can be the engineer who creates sophisticated design systems.

The path is open: Start by understanding modern CSS capabilities alongside your React work. Experiment with container queries, color spaces, view transitions. You'll discover that what takes hundreds of components in React can be achieved more elegantly through systematic CSS. This isn't about going backwards — it's about mastering a discipline that most developers haven't even discovered yet.



## But isn't Tailwind already a great API to my design system?
Let's be clear about what Tailwind actually is: it's inline styling with better ergonomics. Calling it a "design system API" is like saying a paint brush or CSS is a design system. It gives you utilities for direct styling, but it doesn't say how your buttons or cards must look like.

This confusion between styling tools and design systems is telling. The React ecosystem's best attempts at true design systems are Shadcn and Catalyst. But they both carry a huge React tax. Look at Shadcn's "New York" theme — it requires ~40.000 lines of TSX to define what could be expressed with a few dozen CSS variables in a proper design system.

Tailwind is a styling tool, not a design system. Understanding this difference is crucial for building truly sophisticated interfaces.


## Didn't we move past "semantic HTML" already? That's so 2010.
Look at what's happening in React: Shadcn and Catalyst are actually attempting to bring semantics back, but with immense complexity. A simple button that opens a dialog requires importing "Button", "Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogFooter" — all to achieve what semantic HTML gives you naturally with `<button>` and `<dialog popover>`.

The React ecosystem has normalized this complexity to the point where developers have forgotten what clean HTML looks like. Tailwind promoted the idea of building interfaces with "just HTML", but then buried that HTML under walls of utility classes.

True semantic HTML is an entirely different game. When backed by a proper design system, you can craft sophisticated interfaces with clean, meaningful elements. No utility classes, no complex component imports — just structural elements that clearly express their purpose.

This is about rediscovering how powerful HTML becomes when freed from framework complexity. Your markup stays clean and meaningful while your design system handles the presentation.


## The codebase isn't using TypeScript. How can I take this seriously?
The React ecosystem has created a culture where every project, no matter how simple, must become a complex TypeScript application. This mindset assumes JavaScript is a "toy" language and pushes developers away from understanding how the web actually works.

But look at the most sophisticated web applications today. Figma's vector engine achieves its power through clean separation and WebAssembly, not TypeScript definitions. Notion's real-time collaboration comes from proper system architecture, not component types. The web's most ambitious applications succeed through architectural clarity, not type annotations.

This is about proper separation of concerns. When you break free from the TypeScript-everywhere mindset, you can focus on what truly matters: system programming for complex business logic, design engineering for sophisticated interfaces, UX development for seamless experiences. Use true static typing where it adds value — in your core business logic — while keeping your presentation layer clean and semantic.

The web platform itself is incredibly powerful. Instead of wrapping everything in types, you could be exploring what's possible when each technology focuses on what it does best. This is about understanding where TypeScript adds value and where it gets in the way of genuine innovation.


## I have proper, end-to-end type safety on my Remix app. How can Nue ever achieve this level of sophistication?

The TypeScript integration in Remix represents the best possible implementation of types within the React ecosystem. It connects your routes, loaders, and components through carefully crafted type definitions. This provides valuable development-time checks and autocompletion — genuine developer benefits that shouldn't be dismissed.

But these type definitions only exist during development. At runtime — when your application is actually running for users — all TypeScript types are stripped away. Your data arrives as untyped JSON. Your DOM operations work with untyped elements. Your form submissions produce untyped objects.

Nue approaches type safety from a fundamentally different perspective: architectural design that minimizes where type errors can occur in the first place.

For critical business logic that genuinely benefits from strong type safety, Nue's model layer can be implemented in Rust and compiled to WebAssembly. This provides something no amount of TypeScript can match: true static typing that persists at runtime with guarantees enforced by the compiler.

When your business logic is properly separated from presentation, each part can use the tools best suited to its purpose. This is the advantage of systematic engineering: using the right tool for each specific concern, rather than forcing everything through the same abstraction.


## Isn't MVC an outdated pattern that we moved past with React?
Every sophisticated web application is fundamentally an MVC system, whether it acknowledges this or not. Your application always has models that handle data and logic, views that present interfaces, and something orchestrating between them. This isn't a pattern you choose — it's the natural architecture of large-scale web applications.

Look closely at React: it actually repeats MVC at the component level, cramming models, views, and controllers all into the same files. State management, presentation logic, and orchestration get tangled together, creating the complexity we see in modern applications. What began as a simple view library has become a maze of repeated patterns.

But when you separate these concerns properly, each becomes its own artform. Your models can evolve into sophisticated engines for business logic — whether in pure JavaScript or compiled from Rust. Your views can focus purely on creating seamless user experiences. The orchestration layer can handle complex state flows and real-time updates.

This separation enables true specialization. System engineers can focus on business logic without touching interfaces. UX developers can craft experiences without wrestling state management. Design engineers can create systematic designs without fighting component architecture.

This isn't about going backwards — it's about understanding why the most ambitious web applications naturally separate these concerns. It's the foundation for building interfaces that are simultaneously more sophisticated and more maintainable than what the React monolith allows.


## Why Markdown? It's not even a web standard.
Web standards — HTML, CSS, and JavaScript — are about presentation, not content. HTML defines structure, CSS handles styling, and JavaScript adds interactivity. The content itself should live separately: in a database for applications, in content files for marketing sites, documentation, and blogs.

Markdown has emerged as the closest thing to a content standard. It's a human-friendly format that lets writers focus purely on their message without technical distractions. Giants like GitHub, Notion, and Slack all use Markdown because it strikes the perfect balance between readability and structure.

Nue's extended Markdown takes this separation further. Your content lives in clean files that anyone can edit. Your HTML handles presentation without content mixed in. This separation is crucial: marketing teams can launch pages without engineering bottlenecks, documentation stays current without fighting frameworks, and blog authors publish directly without complex deployment cycles.

This clean separation between content and presentation is fundamental to scalable websites. Markdown isn't competing with web standards — it complements them by keeping content independent from presentation. It's a timeless skill that will serve you well regardless of how frontend frameworks evolve.


## Do you mean my React app is just technical debt then?
Not so fast. Your React skills will be valuable for years to come, just like with jQuery or Angular the patterns remained for years, and the React ecosystem will follow a similar gradual transition.

But yes, technical debt might become a concern in the long run. The React monolith keeps growing more complex while web standards become more powerful. Teams are maintaining thousands of dependencies and complex build pipelines to achieve what browsers can now do natively. This gap between framework complexity and platform capabilities will continue to widen.

This is your opportunity to be at the forefront of change. Start learning the modern web stack alongside your React work. Experiment with standards-first development. Play around with Rust. Surprise your colleagues with dramatically better performance, cleaner code, and proper engineering principles.

The really ambitious developers might see even bigger possibilities: The React ecosystem's limitations create space for entirely new approaches. When the inevitable shift happens, you'll already understand what comes next.


## Why does Nue use Bun instead of Node.js?
Bun offers three critical advantages that align perfectly with Nue's philosophy:

First, Bun includes built-in support for JavaScript, TypeScript, and CSS parsing, bundling, and minification. This eliminates the need for heavy external dependencies like ESBuild or Lightning CSS that would bloat Nue's executable size by 5x or more. With Bun, these capabilities come standard, keeping the entire system lean and focused.

Second, Bun shares the exact same core philosophies as Nue: minimalism and standards-first development. Both projects are built on the principle that unnecessary abstractions should be stripped away, letting you work directly with the web platform. This philosophical alignment creates a seamless development experience where each tool reinforces the other's strengths.

Third, Bun delivers consistently better performance across all operations — typically 20% to 100% faster than Node.js alternatives. This transforms development workflows, particularly with test suites that snap to completion using Bun's built-in Jest interface.

While Nue maintains Node.js support for broader compatibility, certain optimizations like minification revert to simple file copying. Everything still works in Node.js, but the Bun experience represents Nue's ideal development environment: minimal, standards-focused, and blazingly fast.
