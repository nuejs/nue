
# Nue internals


## Multi-site architecture
Nue is a multi-site web framework assuming you're building a network of related sites. This makes a completely different internal architecture than what you see in traditional frameworks:

- **Inheritance chains** - Sites inherit from `@base` and each other. Styles, components, layouts, and content cascade through the chain.

- **Enforced separation** - CSS-in-JS, inline styles, and utility classes are strictly forbidden. This forces you to think in terms of true reusability across sites.

- **Standards first** - Nue adds minimal abstractions over web standards and lets you use the modern web stack as directly as possible.

Nue was built from scratch because the existing frameworks are so strongly biased towards single-site and component first mindset.


## Multi-site build system
The development server works differently from traditional bundlers. Instead of building to a dist folder, Nue serves files directly from your inheritance chain and compiles on demand. When you request a file, the server transpiles it in memory and sends it back. Nothing writes to disk during development.

Changes trigger surgical updates through WebSocket connections. Each browser tab maintains its own connection. The server tracks which site each tab represents and routes updates only where they apply. Edit a shared file and all inheriting sites update. Edit a site-specific file and only that tab updates.

The build system is optimized for two use cases:

1. **Content developers** - Edit markdown or YAML and only the changed section updates. Navigation changes update the related parts only. Paragraph edits patch the matching text only.

2. **Design system developers** - Modify components and they remount with new code. Edit stylesheets and changes patch in. The page preserves its state: form inputs keep their values and dialogs stay open.

This architecture eliminates the wait between editing and seeing results. Changes appear in milliseconds across every site that inherits them.



## The UNIX of the web
The UNIX philosophy teaches that software should do one thing well and compose cleanly with other tools. This principle shaped every package in Nue from the start:

**[nuedom](//github.com/nuejs/nue/tree/master/packages/nuedom)** - HTML syntax for component development

**[nuemark](//github.com/nuejs/nue/tree/master/packages/nuemark)** - Markdown flavour for rich, interactive pages

**[nueglow](//github.com/nuejs/nue/tree/master/packages/nueglow)** - Design system friendly syntax highlighting

**[nueyaml](//github.com/nuejs/nue/tree/master/packages/nueyaml)** - YAML without the problems

**[nuestate](//github.com/nuejs/nue/tree/master/packages/nuestate)** - URL first state management

**[nuekit](//github.com/nuejs/nue/tree/master/packages/nuekit)** - The framework core

The entire frontend stack weighs under 500KB with zero external dependencies. No version conflicts, no supply chain risks, no surprise breaking changes from upstream packages. One installation serves unlimited sites.

This focused approach eliminates complexity from large dependency trees. You're working with a stable, predictable system where every piece is designed to work together. Less abstraction layers, less debugging mysterious package interactions, less time spent on tooling problems.



## Give it a try

The framework is production-ready. You can create your first multi-site setup now.

**CSS professionals:** Use `nue create multi-site` to get a working foundation. Build your global design system on top of it.

**Everyone else:** Production-ready templates with Apple/Linear-level polish are coming next. Join the mailing list and we'll notify you when they're available:

[mailing-list]