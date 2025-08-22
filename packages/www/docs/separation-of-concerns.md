
# Separation of concerns
UNIX tools do one thing well. `grep` finds patterns. `sort` orders data. Modern frameworks abandoned this wisdom, creating kitchen sink solutions that mix everything together. Nue returns to architectural clarity.


## The four concerns
Web applications have four distinct concerns, each requiring different skills and mindsets. Mixing them creates the complexity.

### Business model
This is your application core. It should be pure, testable, and isolated. Think of how Figma and Notion handle this. Their engines are built with Rust — completely separate from the UI. Keep your HTML and CSS out from the app. This should be obvious, but not these days.

### Design
Your visual language belongs in CSS. Colors, typography, spacing—the systematic approach that creates consistency across your product. When design lives in one place, you can rebrand without touching JavaScript. Teams work in parallel because the visual layer is decoupled from functionality.

### Content
Writers shouldn't need to understand JavaScript to publish content. When content lives in code, engineers become the bottleneck for every blog post and product description. Content must be separate or scaling becomes impossible.


### Structure
This is `HTML`'s domain. Semantic elements that browsers understand natively. Navigation is `<nav>`. Forms are `<form>`. The structure describes what things are, not how they look or behave. This foundation makes applications accessible and future-proof.


## Application assembly
When concerns are neatly separated, web development becomes assembly. You can build complex applications with semantic markup alone.

Nue enforces this pattern. Try to write CSS-in-JS and the system rejects it. Try to load utility classes everywhere and the design system stops you. These constraints aren't limitations—they're guardrails toward maintainable architecture that enable rapid application assembly.