# Minimalism
The best solutions are often the simplest ones. While the web development ecosystem has grown increasingly complex, Nue returns to first principles: do one thing well, work together seamlessly, stay small and focused.

## The dependency hell
Modern web development has lost touch with simplicity. A fresh Next.js project created with `create-next-app` weighs 427MB just to display "Hello, World." That's eight times the size of Windows 95. Add a component library like ShadCN and you're at 470MB. Include content processing with MDX and you reach 550MB - over 500 times larger than what Nue needs for the same functionality.

This didn't happen overnight. Each package solved a real problem, but we stopped asking whether the cure was worse than the disease. We normalized the idea that thousands of dependencies are simply the cost of modern development. We accepted that `node_modules` would become a black hole of complexity that no one fully understands.

The absurdity becomes clear when you step back. We need hundreds of megabytes and thousands of files to serve HTML, CSS, and JavaScript - the same technologies that built the web with kilobytes for decades. Something fundamental went wrong.

## The 1MB ecosystem
Nue provides a complete full-stack development environment in 1MB. This includes everything you need: a dev server with universal hot reloading, static site generator with extended Markdown, component system with reactive updates, backend layer with CloudFlare compatibility, SQL and KV databases, API routing, testing framework, TypeScript transpiling, CSS processing, and production optimization.

This isn't about having fewer features. It's about having more capabilities through better architecture. When every piece is designed to work together from the ground up, you eliminate the redundancy that comes from assembling disparate packages. No duplicate parsers, no competing abstractions, no compatibility layers between tools that were never meant to work together.

The UNIX philosophy applies perfectly to web development: write programs that do one thing well, write programs that work together, write programs that handle text streams. Nue follows this principle - each tool focused, all tools integrated, everything working on the foundational web technologies.

Zero external dependencies means zero supply chain vulnerabilities, zero version conflicts, zero time spent resolving package compatibility issues. The entire system is comprehensible, maintainable, and under your control.


## Less is more
**Less is More.** This simple idea changed architecture forever. Rather than adding more ornament, more decoration, more complexity, **Mies van der Rohe** leaned on universal building blocks that could deliver simple, beautiful, timeless spaces.
Web development needs the same revolution.

Instead of adding more layers, more libraries, more API methods, we need better ways to reach elegant, lasting solutions. Just like Mies found the essential elements—steel, glass, open space—that could create any building, Nue takes the core web standards—HTML, CSS, JavaScript—to create uncompromising results.


> So einfach wie möglich, koste es, was es wolle.
As simple as possible, whatever the cost
Ludwig Mies van der Rohe
German Architect
1886 – 1969
