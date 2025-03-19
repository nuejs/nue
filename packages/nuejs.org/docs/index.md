
# Why Nue
Nue is a standards-first framework pushing HTML, CSS, JS, and WASM to their limits. It lets you build truly ambitious web applications that deliver more with a fraction of the code.

[Video: Multi-page app demo]
[github.com/nuejs/simple-mpa](#)

The demo above is a multi-page application (MPA) with instant search across 10,000+ records, seamless view transitions, state management, and a design system—all in a production bundle smaller than a React button.

## Smaller than a React button
Yes — a single React button with a dialog, built with Shadcn/UI, weighs 249KB in production. The entire Nue MPA above is 60KB. That gap comes from an entirely different approach.

| Metric            | React Button | Nue MPA     | Difference       |
|-------------------|--------------|-------------|------------------|
| Bundle Size (KB)  | 249          | 60          | 4.2× smaller     |
| Dependencies      | 120 modules  | 5 modules   | 24× fewer        |

Nue achieves this by sticking to web standards—HTML, CSS, JS, and WASM—without the layers of abstraction that bloat frameworks like React. Details are in our [benchmark](#).

## Faster development
Development with Nue moves at a different pace. Build times shrink from seconds to milliseconds. Updates land the instant you save. The feedback loop is tight and direct.

| Metric            | React        | Nue         | Difference       |
|-------------------|--------------|-------------|------------------|
| Build Time (s)    | 2.5          | 0.15        | 17× faster       |
| HMR Latency (ms)  | 100-500      | 5-50        | Up to 20× faster |
| Dependencies      | 98MB, 77+    | 2MB, 5      | 49× smaller      |

[Video: SPA build and HMR in action]

This comes from a lean toolchain—fewer moving parts, no compromise on function.

## Cleaner codebases
Nue cuts the code you write and maintain. The MPA demo breaks down like this:

- 150 lines of controller logic
- 300 lines of model code
- 600 lines of view templates
- 1000 lines of CSS

Compare that to a React equivalent: thousands of lines across components, hooks, and utilities—often 10× more for the same result. Separation of concerns keeps Nue’s code standards-based and focused. Less to manage, more to build on.

## What this means
Efficiency is only part of it. The real value lies in the new possibilities for developers

### Systems engineering
Build clean, testable business models without the clutter of frontend abstractions. Nue separates logic from the UI entirely, letting you create applications on the scale of Figma or Notion. Use Rust and WASM to get serious speed and type safety that TypeScript can’t deliver.


### Design engineering
Shift focus from framework patterns to design systems. A React theme like Shadcn/UI’s “New York” takes 40,000 lines of TypeScript. Nue does it in 1000 lines of CSS—color, typography, and layout, not component glue.

[Bar chart: 40,000 lines TSX vs. 1000 lines CSS]

### UX Engineering
Leverage the browser fully—view transitions, container queries, animations—with a view layer of 10 semantic files, not hundreds of components. Craft experiences that last, not frameworks that churn.

[Video: HMR and styling in action]

## The Gist
Nue delivers ambitious applications with less code, faster builds, and cleaner structure. It’s a standards-first answer to a frontend weighed down by complexity. Find answers to common questions in our ]FAQ](faq.html)

