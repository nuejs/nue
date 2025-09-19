
# Separation of concerns
UNIX tools do one thing well. `grep` finds patterns. `sort` orders data. Modern frameworks abandoned this wisdom, creating kitchen sink solutions that mix everything together. Nue returns to architectural clarity.

## The problem we created
Frontend development is the only ecosystem that abandoned separation of concerns. Server-side developers would never put SQL queries inside CSS files, yet we routinely embed styling in JavaScript components. Backend architects carefully separate data access, business logic, and API layers - but frontend treats this as old-fashioned thinking.

This cultural shift happened gradually. As JavaScript became more powerful, we started moving everything into it. CSS became CSS-in-JS. HTML became JSX. Business logic became hooks. Content became components. Each concern lost its dedicated domain.

The result is monolithic components that mix presentation, behavior, data fetching, and business rules. Testing becomes complex because you can't isolate logic from rendering. Collaboration breaks down because designers need to understand JavaScript to change colors. Maintenance becomes expensive because changing one concern affects all the others.

## The three concerns
Web applications have three distinct concerns, each requiring different skills and mindsets. Mixing them creates the complexity.

### Business model
This is your application core. It should be pure, testable, and isolated. Think of how Figma and Notion handle this. Their engines are built with Rust - completely separate from the UI. Keep your HTML and CSS out from the app. This should be obvious, but not these days.

### Design
Your visual language belongs in CSS. Colors, typography, spacing - the systematic approach that creates consistency across your product. When design lives in one place, you can rebrand without touching JavaScript. Teams work in parallel because the visual layer is decoupled from functionality.

### Content
Writers shouldn't need to understand JavaScript to publish content. When content lives in code, engineers become the bottleneck for every blog post and product description. Content must be separate or scaling becomes impossible.

## Website assembly
When concerns are neatly separated, web development becomes assembly. You can build complex applications with semantic markup alone.

### Content assembly
Content creators write in Markdown. Designers control presentation through CSS. Layout modules provide structure. The three layers combine automatically - content flows into layouts, layouts inherit design systems, everything renders as clean HTML.

Writers focus on messaging. Designers focus on visual language. Developers focus on functionality. Nobody blocks anyone else because each concern has its own domain and tools.

### UI assembly
Business logic lives in pure JavaScript modules. Design lives in CSS design systems. Structure lives in semantic HTML. Components become thin assembly layers that combine these concerns without owning them.

Change business logic without touching styles. Update the design system without breaking functionality. Restructure components without losing data operations. Each layer evolves independently because dependencies flow in one direction.

Nue enforces this pattern. Try to write CSS-in-JS and the system rejects it. Try to load utility classes everywhere and the design system stops you. These constraints aren't limitations - they're guardrails toward maintainable architecture that enable rapid application assembly.