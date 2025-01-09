
# FAQ

## Ecosystem questions

### The frontend ecosystem has evolved for good reasons. Aren't you just turning back the clock by rejecting modern frameworks?
The frontend ecosystem excelled at creating abstractions upon abstractions. While this solved problems initially, it has led to massive complexity: hundreds of dependencies, multiple build tools, conflicting patterns, and endless configuration. Meanwhile, browser standards have quietly evolved to provide native solutions that are often more powerful than their framework counterparts.

This isn't about rejecting progress - it's about recognizing that browsers now offer sophisticated capabilities that eliminate the need for most framework abstractions. From native dialogs to container queries, from CSS layers to view transitions, the platform itself provides cleaner solutions than framework implementations. We're not turning back the clock - we're embracing the remarkable capabilities that exist in browsers today.


### Next.js and modern meta-frameworks solved real deployment and performance challenges. How does Nue compare to these full-stack solutions?
Nue currently excels at what most teams actually need: sophisticated content management and blazing fast performance. For content-heavy sites, marketing pages, and documentation, Nue delivers better performance with far less complexity. Your content lives in clean Markdown files, your styling flows from mathematical systems, and your pages load instantly without framework overhead.

While we're not yet a full-stack solution for complex applications, our [vision](/vision/) shows how proper separation of concerns creates stronger foundations for sophisticated interfaces. By starting with content-first architecture, we're building toward something more ambitious than current meta-frameworks can achieve.


### The industry has standardized around component-based architecture across React, Vue, and Svelte. Why go against this unified direction?
Components are a powerful concept when used appropriately. The problem isn't components themselves - it's how current frameworks have turned them into monolithic units that mix concerns that should remain separate. We're seeing components that contain business logic, styling, database queries, and state management all in one file. This "kitchen sink" approach creates exactly the kind of tight coupling and maintenance challenges that components were supposed to solve.

Modern web standards offer a cleaner path: HTML for structure, CSS for styling, and JavaScript for behavior. This separation isn't a limitation - it's a source of power. When each technology focuses on its strengths, we create systems that are both more sophisticated and easier to maintain.

### Modern build tools like Vite have transformed development workflow. What's wrong with the current tooling ecosystem?
Current build tools are optimizing the wrong thing. They're focused on making JavaScript monoliths build faster, but the real solution is questioning why we need such complex builds in the first place. When a simple landing page requires processing thousands of lines of JavaScript through multiple transformation steps, we've lost sight of what makes the web powerful.

Nue's approach is different: optimize for the natural strengths of web standards. Content flows directly from Markdown to HTML. Styles compile through lightning-fast native CSS. JavaScript remains focused on true interactivity needs. The result isn't just faster builds - it's a development workflow that maintains flow and focus.


### Teams have invested years in learning and building with React. What's the practical path to adopting a completely different approach?
If you understand web standards, you already know most of what you need to work with Nue. More importantly, this knowledge becomes more valuable over time, unlike framework patterns that become outdated with each new version.

This is an opportunity to deepen your understanding of what browsers can actually do. Knowledge of HTML semantics, CSS capabilities, and core JavaScript patterns will serve you well regardless of which frameworks come and go. The web platform itself is becoming more powerful every year - now is the time to build directly on these capabilities rather than hiding them behind framework abstractions.

These are timeless skills that grow more valuable as browsers evolve. When you understand the platform itself, you can evaluate frameworks based on what they truly add rather than accepting unnecessary complexity.


### There are blazing fast Rust/Go optimizers like Turbopack in the market. How on earth can you win these mammoths?

The frontend world has become obsessed with the wrong kind of optimization. Complex bundlers written in Rust and Go slice, dice, and rearrange JavaScript code in increasingly sophisticated ways. Teams spend countless hours configuring build tools, optimizing chunk splitting, and fine-tuning tree-shaking algorithms. But this optimization theater misses a fundamental truth: the fastest page load is one that requires just a single request.

When the initial HTML response contains everything needed to render the page - structure, styles, and critical content - the browser can begin painting immediately. There's no waterfall of CSS and JavaScript requests, no cumulative layout shifts, no waiting for framework initialization. The page simply appears.

The difference is dramatic: while others celebrate reducing JavaScript processing from seconds to milliseconds, our pages are already rendered before their frameworks even begin to initialize.


Yes, this could be split into two focused questions that better address distinct concerns:


### How does Nue's development workflow compare to modern framework tooling?
Modern development workflows have become unnecessarily complex, requiring extensive configuration and build setup just to get started. Nue takes a different approach by working working closer to metal with web standards.

For content-heavy sites, changes appear instantly through precise hot module replacement. Style updates flow naturally through the system without rebuilding components. Content changes reflect immediately without framework initialization. Because we're working directly with web standards, the development experience stays fast and focused.

Most importantly, the workflow maintains clean separation between concerns: content creators work with Markdown, designers iterate on systematic styles, and developers focus on true interactivity needs. Each team member can work efficiently in their domain without fighting framework complexity.



===

## Components and reusability


### The component model is fundamental to modern web development. How do you structure and reuse UI patterns without components?
The frontend world has created an overwhelming explosion of components. We now have JavaScript components for everything - buttons, inputs, dialogs, labels - elements that browsers handle natively. Due to tightly coupled styling, teams create different versions of the same component for every context. Modern UI libraries ship with four different versions of a paragraph: Text, Description, DialogDescription, and AlertDescription. This isn't reuse - it's the opposite of DRY.

True reusability comes from proper separation of concerns. When structure flows from semantic HTML and styling lives in systematic CSS, we achieve maximum reuse with minimal code. A single dialog element handles all modal cases. A consistent typographic scale covers all text needs. Instead of maintaining hundreds of components that each do one thing, you craft ten patterns that work everywhere.


### JSX is amazing because it's just JavaScript. Why go back to HTML templating?
The phrase "It's just JavaScript" has become one of the most deceptive mantras in web development. While it sounds empowering, it has encouraged poor architectural decisions by convincing developers to solve every problem with JavaScript.

Consider JSX: what started as "simpler templating" has evolved into components where JavaScript, HTML, and CSS are hopelessly intertwined. Business logic, markup, styling decisions, and state management all live in the same files. This isn't simplification - it's the definition of spaghetti code.

Nue's HTML-based templates maintain clean separation between structure, styling, and behavior. This isn't about going "back" to templates - it's about recognizing that different concerns need different tools. HTML for structure, CSS for styling, JavaScript for behavior - each in its proper place, creating systems that are both more sophisticated and easier to maintain.

Remember: mixing everything into JavaScript didn't make web development simpler - it just made the complexity harder to manage.


### What's your alternative to component libraries like Material UI or Chakra for building consistent interfaces?
Instead of chasing ever-larger component libraries, Nue embraces systematic design. Mathematical relationships create consistent interfaces through calculated proportions, precise color relationships, and harmonious spacing. This systematic approach produces more sophisticated results than component libraries while requiring far less code.

We're releasing four distinct design systems that demonstrate this power: Mies achieves dramatic impact through extreme reduction, Rams builds on human-centered functionalism, Zaha embraces bold three-dimensional space, and Muriel captures playful precision. Each system creates complete, consistent interfaces through pure mathematical relationships rather than component collections.

### How do marketing and content teams update sites without a component-based CMS?
Nue provides a powerful component model through enhanced Markdown syntax. Built-in components handle common patterns while HTML-based templates enable custom extensions. The key difference is that these components generate pure semantic HTML that hooks directly into your design system.

This means marketing teams can focus on content while systematic design ensures everything looks great automatically. Whether they're crafting blog posts, technical documentation, or interactive landing pages, the content remains clean and accessible while the design system handles sophisticated presentation. This separation creates better experiences for both content creators and users.



===

## Styling & UI patterns


### How do you implement common UI patterns like modals, dropdowns, and responsive navigation without component libraries?
Browsers now provide remarkably powerful native components, yet most developers don't realize their capabilities. The native `<dialog>` element handles all modal interactions elegantly. The `<details>` element transforms into sophisticated dropdowns and accordions through pure CSS. Container queries enable responsive components without JavaScript.

Modern CSS is particularly powerful here. Features that once required complex JavaScript now work through pure styling: scroll-driven animations replace entire animation libraries, `@property` enables type-safe theming, `:has()` transforms layout capabilities. Even advanced patterns like tabbed interfaces or responsive navigation emerge naturally through CSS rather than requiring framework abstraction.


### Tailwind and CSS-in-JS solved real maintainability problems. What's your solution for managing CSS at scale?
Tailwind and CSS-in-JS solved theoretical problems like "global namespace pollution" by essentially returning to inline styles through utility classes and co-location. This created new, more serious problems: design decisions scattered across HTML, maintenance burden as styles multiply, and rigid systems that resist change.

Nue's answer is systematic design. When every visual decision emerges from mathematical relationships - typography following musical scales, colors maintaining precise OKLCH relationships, spacing flowing from consistent ratios - you don't need to "scale" your CSS. The system maintains harmony automatically, letting you focus on scaling your content. This isn't just more maintainable - it creates more sophisticated interfaces through calculated precision rather than arbitrary values.

### Semantic class names are what makes CSS hard to maintain. Isn't utility-first CSS objectively better?
The idea that semantic class names make CSS hard to maintain is a fundamental misunderstanding of web development. Class names were never the problem - they're simply hooks for applying systematic design decisions.

Utility classes try to solve this by moving design decisions into HTML. But this approach creates a new maintenance burden: updating design means hunting through templates to change dozens of utility classes. It's a band-aid that treats the symptom rather than the cause.

The real solution is systematic thinking. Instead of debating naming conventions or collecting utilities, we need proper design systems where visual decisions flow from mathematical precision. This creates naturally maintainable code because the system itself ensures consistency.

### Tailwind makes me super productive - I can build UIs really fast by never leaving my HTML. Why would I give up this speed?
It's true - Tailwind offers quick wins initially. The ability to style elements without switching files feels efficient, especially when you're focused on getting something built quickly.

But this immediate productivity is deceptive. What starts as "just adding a few classes" evolves into a maze of complex markup where design decisions are permanently embedded in your HTML. Each new feature adds more complexity until even simple changes require updating dozens of files.

This approach fundamentally misunderstands the difference between development speed and development efficiency. Real productivity comes from systems that grow cleanly, where changes flow naturally through mathematical relationships rather than requiring manual updates across templates. While the initial setup might take more thought, the long-term benefits in maintainability and consistency far outweigh the short-term convenience of utility classes.


### What's your approach to responsive design and breakpoints without utility classes?
Modern CSS handles responsive design with remarkable elegance. Container queries enable truly modular components. CSS layers manage style priorities. Custom properties handle theming and dark mode. With native nesting support, the code reads naturally and maintains clean separation of concerns.

The fact that frameworks push developers to inline these capabilities through utility classes shows how far we've strayed from web standards. There's no need to scatter responsive logic across HTML attributes when CSS handles these patterns natively. When these frameworks eventually become outdated, developers will face the task of unlearning these patterns to embrace the more powerful native solutions that have been there all along.



===


## Bunelers and tooling


### Modern JavaScript development relies on TypeScript and build tools. How do you ensure type safety and maintainability?
TypeScript support in Nue is automatic - your code is converted to JavaScript using either Bun directly or ESBuild in Node environments. But the real power comes from proper separation of concerns.

When we move to single-page applications, we're using the proven MVC pattern to create natural boundaries between teams. TypeScript engineers focus purely on business logic without getting tangled in frontend complexities. Frontend developers craft sophisticated user experiences without business logic getting in the way. Each team works in their domain of expertise, making the system naturally more maintainable as it grows.


### The React ecosystem provides proven solutions for routing and data fetching. What's your alternative?
One of the fundamental mistakes in today's frameworks is treating websites and applications as the same thing. This has led to unnecessary complexity: websites shouldn't need complex state management, and applications shouldn't be constrained by website patterns.

Nue maintains clean separation: websites are built with Markdown and targeted server-side and client-side components ("islands"). These islands use the native fetch() API when they need to interact with backend services. Even routing is properly separated: websites use one router, applications another, yet they work together seamlessly through CSS view transitions.



### What about code splitting and lazy loading for larger applications?
The MVC pattern opens possibilities that go far beyond traditional code splitting. Backend developers can work in whatever environment best suits their needs - whether that's Rust, Go, or JavaScript. As long as the model compiles to JavaScript or WASM, it can power sophisticated frontends.

This separation creates new opportunities for both teams. Backend developers can use powerful languages and testing tools to build robust business logic. Frontend developers can focus on creating exceptional user experiences without wrestling with complex state management. When you need the performance of Figma or the sophistication of Framer, you can leverage WASM without compromising frontend clarity.

### How do you handle data caching and state persistence without established React patterns?
Data caching and persistence belong in the model layer, where they can be implemented using the most appropriate strategy for each case. This is a perfect example of how separation of concerns keeps the UI layer clean - it doesn't need to know about caching strategies or persistence mechanisms.

The UI simply requests what it needs through a clean API. Whether that data comes from memory, localStorage, or an advanced caching system remains an implementation detail of the model. This separation makes the entire system more maintainable and easier to optimize.


===


## Reactivity & state management


### How do you manage global application state without solutions like Redux or Context?
State management has become unnecessarily complex in React. The ecosystem has exploded with competing solutions: Redux, MobX, Recoil, Zustand, Jotai, XState, and countless others - all essentially doing the same thing in different ways. This has created massive confusion about what to use and when, while obscuring a simple truth: "state" is just data that needs to be stored and accessed.

Nue returns to fundamental programming principles and web standards. Local component state is just a variable. Global state lives in localStorage or sessionStorage. URL state uses the native History API. Backend state comes through clean API calls. By working with these standard patterns rather than framework-specific abstractions, we create systems that are both simpler and more maintainable.

### React's declarative state management makes complex UIs predictable. How do you handle UI state without it?
React's approach to state management solved a specific problem: keeping the UI in sync with changing data. But it created new complexities by mixing this concern into components through hooks and context providers.

Nue takes a different approach through proper separation of concerns. The model layer handles data management using standard programming patterns. The view layer receives data and renders it, using native browser capabilities for updates. This separation actually makes UIs more predictable because each layer has clear responsibilities.

Consider a typical example: updating a user's settings. In React, this might involve multiple hooks, context updates, and component re-renders. With Nue, it's straightforward:

1. The model layer handles the data update
2. The view receives the new data through a clean API
3. The browser's native capabilities handle DOM updates

This isn't just simpler - it's more reliable. By working with web standards rather than framework abstractions, we create interfaces that are both more predictable and easier to debug.


### React's virtual DOM and optimization patterns are battle-tested. How do you ensure performance at scale?

Currently, Nue's server-side components are production-ready and deliver exceptional performance for content-heavy websites. Our HTML-first approach, combined with systematic CSS, already outperforms React-based solutions for most web projects.

For advanced single-page applications, we're taking a thoughtful approach to architecture. While our frontend library for React-like features (custom components, loops, state updates) is still in development, we're focusing on proper separation of concerns through the MVC pattern. This will enable better performance by default - when business logic isn't tangled with UI rendering, both layers can be optimized independently.

We're also exploring React integration for complex interactive components, while keeping Nue's HTML-based syntax for the majority of use cases. We'll share more specific details when we begin SPA development in earnest.



