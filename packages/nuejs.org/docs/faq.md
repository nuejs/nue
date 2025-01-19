---
beside: false
---

# FAQ


### The industry has standardized around component-based architecture across React, Vue, and Svelte. Why go against this unified direction?
Because something went wrong in web development. Let me explain:

If you look at the first waves of innovation – DHTML bringing interactivity to static pages, jQuery making cross-browser development possible – these technologies represented genuine progress. Each step made the web more dynamic and developer-friendly.

Then came React and the component era. What started as a promise to simplify UI development and enable reuse has instead created a culture of JavaScript monoliths. Components became large containers for markup, styles, business logic, state management – even database queries. Rather than simplifying the UI layer, this mixing of concerns made frontend development more complex than ever.

But while JavaScript frameworks kept adding new layers to the ever-growing stack, browsers quietly evolved. It's almost ironic: just as components became these "kitchen sinks" to solve every problem, native browser features emerged that made most of these framework abstractions unnecessary.


### How is Markdown "standards-first" when it's not even a web standard?
While Markdown itself isn't a web standard, it's a strategic choice that reinforces standards-first development by generating pure, semantic HTML. This creates a natural separation between content structure and visual presentation.

Consider the impact on CSS development. In React codebases, engineers spend 90% of their time writing JavaScript – managing state, coordinating effects, optimizing builds. Style sheets become an afterthought, buried under framework patterns and utility classes.

Nue flips this ratio: codebases become 90% CSS, focusing engineering effort on systematic design through web standards. By keeping content in Markdown and presentation in stylesheets, we maximize the power of native CSS features – from custom properties and container queries to mathematical relationships for typography and spacing.

This pure separation amplifies what browsers do best. Content flows naturally from semantic HTML into sophisticated visual systems through native CSS capabilities. It's standards-first architecture working exactly as intended.


### Isn't the comparison betwen "JavaScript monolith" and "Separation of concerns" apples vs oranges?

This comparison reveals how deeply framework thinking has shaped our understanding of web development and how thoroughly we've accepted JavaScript monoliths as normal. Why have we normalized a world where marketing pages require JavaScript bundles with mixed content? Why do we consider utility classes more "maintainable" than systematic design? Why must every solution flow through JavaScript when browsers provide these capabilities natively?

I have tremendous difficulty explaining these concepts to engineers, who consistently turn the discussion toward technical implementation details instead of examining the fundamental architectural principles.


### I just getting more grumpy or is every new framework just complete bloat?

There's an interesting cognitive bias at play. We've accepted Next.js requiring 330MB and 250+ dependencies as "production-ready," yet view simpler alternatives built on web standards as "yet another framework." This mindset often dismisses solutions that are smaller, faster, and closer to web standards in favor of established complexity. It's worth examining why we consider massive dependency chains stable and "boring" while viewing standards-first approaches with skepticism.



### Teams have invested years in learning and building with React. What's the practical path to adopting a completely different approach?
The secret is to understand that Nue can work alongside your React expertise – there's no need for an immediate, complete switch. You can start using Nue for content-heavy parts of your projects like marketing sites, documentation, or blogs, while keeping React for your complex applications. This practical approach lets you explore web standards without disrupting existing work.

If you understand web standards, you already know most of what you need to work with Nue. More importantly, this knowledge becomes more valuable over time, unlike framework patterns that become outdated with each new version.

This is an opportunity to deepen your understanding of what browsers can actually do. Knowledge of HTML semantics, CSS capabilities, and core JavaScript patterns will serve you well regardless of which frameworks come and go. The web platform itself is becoming more powerful every year – now is the time to build directly on these capabilities rather than hiding them behind framework abstractions.

These are timeless skills that grow more valuable as browsers evolve. When you understand the platform itself, you can evaluate frameworks based on what they truly add rather than accepting unnecessary complexity.


### Why not use Web Components and Lit for a standards-first approach?
While Web Components are indeed part of web standards, frameworks like Lit still perpetuate the JavaScript monolith problem. They encourage wrapping every UI element in JavaScript, even for content that should be purely semantic HTML.

This misses a crucial point: most websites are fundamentally about content. Marketing pages, documentation, blogs – these don't need complex JavaScript components. They need clean content structures that flow naturally into systematic design.

That's why Markdown is central to standards-first development. It enables content teams to work directly with structure and meaning, while systematic CSS handles sophisticated presentation through web standards. This separation creates cleaner architectures than wrapping everything in JavaScript components, regardless of whether those components use Web Component standards.


### Next.js and modern meta-frameworks solved real deployment and performance challenges. How does Nue compare to these full-stack solutions?
Nue excels at what most teams actually need: sophisticated content management and blazing fast performance. For content-heavy sites, marketing pages, and documentation, Nue delivers better performance with far less complexity. Your content lives in clean Markdown files, your styling flows from mathematical systems, and your pages load instantly without framework overhead.

While we're not yet a full-stack solution for complex applications, our [vision](/vision/) shows how proper separation of concerns creates stronger foundations for sophisticated interfaces. By starting with content-first architecture, we're building toward something more ambitious than current meta-frameworks can achieve.


### There are blazing fast tools like Vite and Turbopack in the market. How can you compete with these mammoths?

The frontend world has become obsessed with the wrong kind of optimization. Complex bundlers written in Rust and Go slice, dice, and rearrange JavaScript code in increasingly sophisticated ways. Teams spend countless hours configuring build tools, optimizing chunk splitting, and fine-tuning tree-shaking algorithms. But this optimization theater misses a fundamental truth: the fastest page load is one that requires just a single request.

Nue solves this by inlining all CSS directly into the initial HTML response. This means everything needed to render the page – structure, styles, and critical content – arrives in a single request. There's no waterfall of CSS and JavaScript requests, no cumulative layout shifts, no waiting for framework initialization. The page simply appears.

The difference is dramatic: while others celebrate reducing JavaScript processing from seconds to milliseconds, our pages are already rendered before their frameworks even begin to initialize.


### Modern build tools like Vite have transformed development workflow. What's wrong with the current tooling?
Current build tools are optimizing the wrong thing. They're focused on making JavaScript monoliths build faster, but the real solution is questioning why we need such complex builds in the first place. When a simple landing page requires processing thousands of lines of JavaScript through multiple transformation steps, we've lost sight of what makes the web powerful.

Nue's approach is different: optimize for the natural strengths of web standards. Content flows directly from Markdown to HTML. Styles compile through lightning-fast native CSS. JavaScript remains focused on true interactivity needs. The result isn't just faster builds – it's a development workflow that maintains flow and focus.


### How does Nue's HMR and development workflow compare to modern framework tooling?
Modern development workflows have become unnecessarily complex, requiring extensive configuration and build setup just to get started. Nue takes a different approach by working working closer to metal with web standards.

For content-heavy sites, changes appear instantly through precise hot module replacement. Style updates flow naturally through the system without rebuilding components. Content changes reflect immediately without framework initialization. Because we're working directly with web standards, the development experience stays fast and focused.

Most importantly, the workflow maintains clean separation between concerns: content creators work with Markdown, designers iterate on systematic styles, and developers focus on true interactivity needs. Each team member can work efficiently in their domain without fighting framework complexity.


## Components and reusability

### JSX is amazing because it's just JavaScript. Why go back to HTML templating?
The phrase "It's just JavaScript" has become one of the most deceptive mantras in web development. While it sounds empowering, it has encouraged poor architectural decisions by convincing developers to solve every problem with JavaScript.

Consider JSX: what started as "simpler templating" has evolved into components where JavaScript, HTML, and CSS are hopelessly intertwined. Business logic, markup, styling decisions, and state management all live in the same files. This isn't simplification – it's the definition of spaghetti code.

Nue's HTML-based templates maintain clean separation between structure, styling, and behavior. This isn't about going "back" to templates – it's about recognizing that different concerns need different tools. HTML for structure, CSS for styling, JavaScript for behavior – each in its proper place, creating systems that are both more sophisticated and easier to maintain.

Remember: mixing everything into JavaScript didn't make web development simpler – it just made the complexity harder to manage.


### How do you implement common UI solutions like modals, dropdowns, and responsive navigation without component libraries?
Browsers now provide remarkably powerful native components, yet most developers don't realize their capabilities. The native `<dialog>` element handles all modal interactions elegantly. The `<details>` element transforms into sophisticated dropdowns and accordions through pure CSS. Container queries enable responsive components without JavaScript.

Modern CSS is particularly powerful here. Features that once required complex JavaScript now work through pure styling: scroll-driven animations replace entire animation libraries, `@property` enables type-safe theming, `:has()` transforms layout capabilities. Even advanced patterns like tabbed interfaces or responsive navigation emerge naturally through CSS rather than requiring framework abstraction.


### How do you reuse UI elements without components?
The frontend world has created an overwhelming explosion of components. We now have JavaScript components for everything – buttons, inputs, dialogs, labels – elements that browsers handle natively. Due to tightly coupled styling, teams create different versions of the same component for every context. Modern UI libraries ship with four different versions of a paragraph: Text, Description, DialogDescription, and AlertDescription. This isn't reuse – it's the opposite of DRY.

True reusability comes from proper separation of concerns. When structure flows from semantic HTML and styling lives in systematic CSS, we achieve maximum reuse with minimal code. A single dialog element handles all modal cases. A consistent typographic scale covers all text needs. Instead of maintaining hundreds of components that each do one thing, you craft ten patterns that work everywhere.


### What's your alternative to libraries like Material UI or Chakra for building consistent interfaces?
Instead of chasing ever-larger component libraries, Nue embraces systematic design. Mathematical relationships create consistent interfaces through calculated proportions, precise color relationships, and harmonious spacing. This systematic approach produces more sophisticated results than component libraries while requiring far less code.

We're releasing four distinct design systems that demonstrate this power: Mies achieves dramatic impact through extreme reduction, Rams builds on human-centered functionalism, Zaha embraces bold three-dimensional space, and Muriel captures playful precision. Each system creates complete, consistent interfaces through pure mathematical relationships rather than component collections.


### How do marketing and content teams update sites without a component-based CMS?
Nue provides a powerful component model through enhanced Markdown syntax. Built-in components handle common patterns while HTML-based templates enable custom extensions. The key difference is that these components generate pure semantic HTML that hooks directly into your design system.

This means marketing teams can focus on content while systematic design ensures everything looks great automatically. Whether they're crafting blog posts, technical documentation, or interactive landing pages, the content remains clean and accessible while the design system handles sophisticated presentation. This separation creates better experiences for both content creators and users.


## Styling & UI patterns


### Tailwind and CSS-in-JS solved real maintainability problems. What's your solution for managing CSS at scale?
Tailwind and CSS-in-JS solved theoretical problems like "global namespace pollution" by essentially returning to inline styles through utility classes and co-location. This created new, more serious problems: design decisions scattered across HTML, maintenance burden as styles multiply, and rigid systems that resist change.

Nue's answer is systematic design. When every visual decision emerges from mathematical relationships – typography following musical scales, colors maintaining precise OKLCH relationships, spacing flowing from consistent ratios – you don't need to "scale" your CSS. The system maintains harmony automatically, letting you focus on scaling your content. This isn't just more maintainable – it creates more sophisticated interfaces through calculated precision rather than arbitrary values.


### Tailwind makes me super productive – I can build UIs really fast by never leaving my HTML. Why would I give up this speed?
It's true – Tailwind offers quick wins initially. The ability to style elements without switching files feels efficient, especially when you're focused on getting something built quickly.

But this immediate productivity is deceptive. What starts as "just adding a few classes" evolves into a maze of complex markup where design decisions are permanently embedded in your HTML. Each new feature adds more complexity until even simple changes require updating dozens of files.

This approach fundamentally misunderstands the difference between development speed and development efficiency. Real productivity comes from systems that grow cleanly, where changes flow naturally through mathematical relationships rather than requiring manual updates across templates. While the initial setup might take more thought, the long-term benefits in maintainability and consistency far outweigh the short-term convenience of utility classes.


## Bundlers and tooling


### Modern JavaScript development relies on TypeScript and build tools. How do you ensure type safety and maintainability?
TypeScript support in Nue is automatic – your code is converted to JavaScript using either Bun directly or ESBuild in Node environments. But the real power comes from proper separation of concerns.

When we move to single-page applications, we're using the proven MVC pattern to create natural boundaries between teams. TypeScript engineers focus purely on business logic without getting tangled in frontend complexities. Frontend developers craft sophisticated user experiences without business logic getting in the way. Each team works in their domain of expertise, making the system naturally more maintainable as it grows.


### The React ecosystem provides proven solutions for routing and data fetching. What's your alternative?
One of the fundamental mistakes in today's frameworks is treating websites and applications as the same thing. This has led to unnecessary complexity: websites shouldn't need complex state management, and applications shouldn't be constrained by website patterns.

Nue maintains clean separation: websites are built with Markdown and targeted server-side and client-side components ("islands"). These islands use the native fetch() API when they need to interact with backend services. Even routing is properly separated: websites use one router, applications another, yet they work together seamlessly through CSS view transitions.


### What about code splitting and lazy loading for larger applications?
The MVC pattern opens possibilities that go far beyond traditional code splitting. Backend developers can work in whatever environment best suits their needs – whether that's Rust, Go, or JavaScript. As long as the model compiles to JavaScript or WASM, it can power sophisticated frontends.

This separation creates new opportunities for both teams. Backend developers can use powerful languages and testing tools to build robust business logic. Frontend developers can focus on creating exceptional user experiences without wrestling with complex state management. When you need the performance of Figma or the sophistication of Framer, you can leverage WASM without compromising frontend clarity.


### How do you handle data caching and state persistence without established React patterns?
Data caching and persistence belong in the model layer, where they can be implemented using the most appropriate strategy for each case. This is a perfect example of how separation of concerns keeps the UI layer clean – it doesn't need to know about caching strategies or persistence mechanisms.

The UI simply requests what it needs through a clean API. Whether that data comes from memory, localStorage, or an advanced caching system remains an implementation detail of the model. This separation makes the entire system more maintainable and easier to optimize.


## Reactivity & state management

### How do you manage global application state without solutions like Redux or Context?
State management has become unnecessarily complex in React. The ecosystem has exploded with competing solutions: Redux, MobX, Recoil, Zustand, Jotai, XState, and countless others – all essentially doing the same thing in different ways. This has created massive confusion about what to use and when, while obscuring a simple truth: "state" is just data that needs to be stored and accessed.

Nue returns to fundamental programming principles and web standards through proper separation of concerns. The model layer handles data management using standard programming patterns, while the view layer focuses purely on rendering that data:

- Local component state is just a variable
- Global state lives in localStorage or sessionStorage
- URL state uses the native History API
- Backend state comes through clean API calls

This isn't just simpler – it's more reliable. By working with web standards rather than framework abstractions, we create interfaces that are both more predictable and easier to debug. When business logic isn't tangled with UI rendering, both layers can be optimized independently.


### React's virtual DOM and optimization patterns are battle-tested. How do you ensure performance at scale?

Currently, Nue's server-side components are production-ready and deliver exceptional performance for content-heavy websites. Our HTML-first approach, combined with systematic CSS, already outperforms React-based solutions for most web projects.

For advanced single-page applications, we're taking a thoughtful approach to architecture. While our frontend library for React-like features (custom components, loops, state updates) is still in development, we're focusing on proper separation of concerns through the MVC pattern. This will enable better performance by default – when business logic isn't tangled with UI rendering, both layers can be optimized independently.

We're also exploring React integration for complex interactive components, while keeping Nue's HTML-based syntax for the majority of use cases. We'll share more specific details when we begin SPA development in earnest.



