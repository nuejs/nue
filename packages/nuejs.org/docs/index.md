
# Why Nue
Nue is a standards-first framework pushing HTML, CSS, JS, and WASM to their limits. It lets you build truly ambitious web applications that deliver more with a fraction of the code. For example, here's a Rust-backed multi-page app, lighter than a React button:

[Video: Multi-page app demo]

This app searches 50,000 records in an instant. It handles deep-linked URLs with state, routes between pages, runs Rust models, ties it together with a design system, and uses WASM for the heavy lifting. All that fits in 60KB.

## Lighter than a React button
Here's the reality we live in today:

[image]
  stacked bar chart

[How we measured this]()


## What this means


### For JS/TS/Rust engineers
The most ambitious frontends built today rely on a separated model layer. **Figma** is a perfect example. They use Rust to create a vector computation engine that runs fast and stays separate from the frontend. **Notion** is another case: their Rust-based sync is a separate subsystem.

[Video: Keypress search through 10k records in 2ms]

Nue applications follow this architecture. Development begins with the model. You design its API first, make it testable, and choose the best data-fetching approach for the job—perhaps event sourcing for instant, in-memory access. Rust can power the performance-critical parts when needed.

Nue restores the art of crafting robust, functional software. It’s the ideal platform for system engineers who value timeless algorithms and data structures. Nue is for hackers who build on Gang of Four (GoF) Design Patterns, not React hooks.



### For design engineers
The best UI designs out there are based on a carefully crafted _design system_, where typography, whitespace, motion, and colors follow exact mathematical precision — free from business logic, TypeScript types, or wild utility walls that block systematic thinking.

[Video: CSS HMR for user grid width]

Nue does exactly this. It takes styling out of the React monolith and hands the control to design engineers. It uses Bun’s internal CSS parser (or Lightning CSS under Node) to do the heavy lifting: CSS modernization, nesting, minification, and error reporting — plus it offers a millisecond-level HMR speed.

Nue is a perfect system for developers, who understand the value in CSS @layers, --variables, and calc(). The idea of copy/pasting 40,000 lines of TSX to create a new ShadCN theme becomes a thing of the past.



### For frontend engineers
When the business model and styling are taken out from the view layer, the remaining code is clean and free from complexities. This changes the way you build interfaces:

[Video: DHTML overlay editing + HMR, keeping the state]

The view layer in our demo uses 600 lines of semantic HTML. Think of building complete applications with with the same amount of code that you find behind a single React button.

Nue is a rapid application development (RAD) platform for frontend engineers.

Find answers to common questions in our [FAQ](faq.html)

