
# Single-page applications
Nue is a web framework that prioritizes web standards, enabling developers to create large-scale single-page applications (SPAs) with less code than mainstream tools require and your codebase stays clean so it is easier to maintain and scale.


## Large-scale web applications
Large-scale or "ambitious" refers to an application that push the boundaries of browser capabilities, delivering complex functionality with native-like performance. **Figma** is a good example: a vector graphics editor that processes hundreds of layers instantly using WebAssembly, while its interface remains responsive. **Notion** is another case: its data engine enables real-time collaboration and fast searches across large documents, even offline, without bogging down the UI. These applications achieve their ambition by isolating sophisticated logic and data operations from presentation, raising the standard for web development.


#### Model-first approach
Nue isolates your business model to a separate layer. This ensures your application stays scalable and maintainable. This separation offers distinct advantages:

1. **Model engineering**: The model can evolve independently of the UI, freeing performance engineers to build sophisticated logic without navigating unfamiliar frontend patterns. The interface can also advance on its own, unhindered by backend changes.

2. **Extreme performance**: Performance-critical model operations can be written in languages like Rust, Go, or Zig and compiled to WebAssembly for native speed and true type safety, far beyond TypeScript’s capabilities — all independent of the UI.

3. **UX development**: Frontend developers can concentrate on crafting the presentation layer, building simple, focused components without wrestling with business logic complexities.



### Directory Structure
Nue organizes single-page applications with a clear, purpose-driven file structure that reflects its separation of concerns. Here’s a typical layout:

```
app/
├── index.html        # Main entry point for the application
├── app.yaml          # Application configuration
├── model/            # Business logic and data operations
├── view/             # UI components and templates
├── controllers/      # Routing and interaction handling
├── design/           # Application styling
└── img/              # Application-specific images
```

Each directory serves a distinct role:

- **index.html**: Acts as the universal entry point, served by Nue for all routes in the application.
- **app.yaml**: Defines application configuration, such as routes or settings.
- **model/**: Houses business logic and data operations, kept separate from presentation.
- **view/**: Contains HTML-based templates that define the interface structure.
- **controllers/**: Manages routing, keyboard controls, form handling, and other interactions.
- **design/**: Holds application-specific styling, independent of structure.
- **img/**: Stores images unique to the application, distinct from site-wide assets.

This structure ensures each aspect of the app — logic, presentation, and behavior — stays modular and maintainable, aligning with Nue’s standards-first philosophy.


### Templates
Nue’s SPA demo (accessible at [mpa.nuejs.org](//mpa.nuejs.org/)\) showcases how models, views, and controllers work together in a single-page application. However, Nue remains in active development, tailored for early adopters seeking better ways to build. We’re currently creating templates that span the full frontend spectrum: standards-first UI libraries, SPAs, and content-rich MPAs, all integrated with a design system of your choice. To stay updated on their release, join our mailing list for a notification.

