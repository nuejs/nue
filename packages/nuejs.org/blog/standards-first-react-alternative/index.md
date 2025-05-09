
---
title: "Hyper: Standards first React alternative"
hero_title: "Introducing Hyper — Standards first React alternative _(Developer Preview)_"
og: img/hyper-og.png
date: 2025-05-08
---

Hyper is a standards first markup language for building user interfaces. It enables developers (and AI models) to generate complex UIs with amazingly clean syntax.

[image.bordered]
  large: img/hyper-banner-dark-big.png
  small: img/hyper-banner-dark.png
  size: 1305 × 517


## Project goals
1. **Standards first**: User interfaces should be assembled with HTML, styled with CSS, and enhanced with JavaScript.

2. **Simplicity**: UI composition should be easy and require as few idioms and abstractions as possible, both on client and server (SSR).

3. **Design Systems**: Design should be a separate subsystem, easily accessible for developers who care about and understand design.

4. **Scalability**: Complex UIs should retain simplicity as the application grows.

To understand how these goals are met, we use React as a counter-example because it's the opposite of Hyper's architecture and design goals. React embraces a monolithic architecture where logic, structure, and styling are mixed together, while Hyper is what React 1.0 (2013) originally envisioned: just a headless view layer.

Let's study the difference in more detail:



### Compare: React vs Hyper
* [Simple components](#simple-components)
* [Complex components](#complex-components)
* [Design systems](#design-systems)
* [Scalability](#scalability)


## Simple components
Below is a basic `<table>` component defined in three ways:

[.row]
  [! img/simple-table-1.png]
    caption: Modern React
    href: simple-table.html

  [! img/simple-table-2.png]
    caption: Old school React
    href: simple-table.html#oldschool

  [! img/simple-table-3.png]
    caption: Hyper
    href: simple-table.html#hyper


1. **Modern React** Modern React represents a common approach to building user interfaces today using component libraries such as ShadCN/UI, Material UI, Chakra, or Tailwind Catalyst. In this example, we chose ShadCN as it's gained significant popularity in recent years and has strong AI tool support. For example, Claude and ChatGPT offer built-in support for ShadCN in their code previews. [Source](simple-table.html) • [Demo](/hyper/demo/react/simple-table.html)

2. **Old school React** is how React components were built back in the days when styling was decoupled from the component code. [Source](simple-table.html#oldschool) • [Demo](/hyper/demo/react/simple-table-oldschool.html)

3. **Hyper** demonstrates the standards-first approach. [Source](simple-table.html#hyper) • [Demo](/hyper/demo/table/simple-table.html)

While these differences might seem minor, they become apparent when we move to more complex components:


## Complex components
Next we examine how these approaches handle increasing complexity. Here's the same table component, but now with sorting and filtering:

[.row]
  [! img/complex-table-1.png caption="Modern React"]
    href: complex-table.html

  [! img/complex-table-2.png caption="Vanilla TSX"]
    href: complex-table.html#oldschool

  [! img/complex-table-3.png caption="Hyper"]
    href: complex-table.html#hyper


1. **Modern React** is assembled according to ShadCN's [data table](//ui.shadcn.com/docs/components/data-table) documentation. The bundled JavaScript is **91.3KB**. [Source](complex-table.html) • [Demo](/hyper/demo/react/complex-table.html)

2. **Vanilla TSX** uses `useState` and `useMemo` to implement the added functionality, and the HTML is tagged the old school way with numerous class names.

3. **Hyper** uses semantic HTML with minimal class names and two instance methods for sorting and filtering. The resulting JS is only **3.9KB** minzipped (1.2KB + 2.7KB for hyper.js). [Source](complex-table.html#hyper) • [Demo](/hyper/demo/table/complex-table.html)



## Design systems
Here's an example dashboard assembled with Hyper:

[image.large]
  large: img/minimalist-big.png
  small: img/minimalist.png
  href: /hyper/demo/dashboard/minimal.html

[Source](//github.com/nuejs/nue/blob/master/packages/hyper/demo/dashboard/components/0-dashboard.html) • [Demo](/hyper/demo/dashboard/minimal.html)

Here is the same dashboard, but with "Ramsian" look and feel:

[image.large]
  large: img/ramsian-big.png
  small: img/ramsian.png
  href: /hyper/demo/dashboard/ramsian.html

This transformation required zero changes to component code. Just a [32-line CSS file](//github.com/nuejs/nue/blob/master/packages/hyper/demo/dashboard/ramsian.css) extending the base design system. [Demo](/hyper/demo/dashboard/ramsian.html)


### Modern React: tightly coupled design
This kind of design swap becomes a large programming effort when design choices are coupled into components via CSS-in-JS or Tailwind. For example, in ShadCN, to change the typography of your headings, you need to edit [alert-dialog.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/alert-dialog.tsx), [alert.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/alert.tsx), [card.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx), [dialog.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/dialog.tsx), [drawer.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/drawer.tsx), and [sheet.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sheet.tsx). This requires understanding of idioms like `data-slot`, `{...props}`, `cn()`, `clsx()`, and `twMerge()`. Here's the code for the title and description elements:

[image]
  large: img/shadcn-typo-big.png
  small: img/shadcn-typo.png

Tight coupling can also create a maintenance issue. For example, ShadCN's "New York" theme duplicates their default theme, resulting in 40,000+ lines of [additional TSX code][new_york] to maintain.

While you definitely *can* decouple your styling from your React components, this pattern is rarely seen in real-world applications. Instead, the use of vanilla CSS is often discouraged due to concerns about "global namespace pollution" or other reasons.


### Hyper: decoupled design system
By contrast, Hyper colocates your typography concerns into a single CSS file, acting as the single source of truth for your `h2` an `p` element styling:

```.thin
// typography.css
@layer globals {
  h2 {
    font-size: 1.125em;
    font-weight: 500;
  }
  p {
    color: var(--base-500);
    text-wrap: balance;
    line-height: 1.5;
  }

  // all typography rules "colocated" here
}
```

This solves three key issues in modern React:

1. **Truly reusable components** across projects and styling contexts
1. **Central design system** easily maintainable from the same place
1. **Zero boilerplate** due to strict separation of concerns

Nue actually _enforces_ you to external design system. Tight coupling in any form: CSS-in-JS, class name abuse, component-specific `<style>` elements, inline `style` attributes, or cryptic class name values like `size-[max(100%,2.75rem)]` are systematically eliminated.


## Scalability
Here's how simplicity scales: a full-scale [app](//mpa.nuejs.org/app/) lighter than a React button:

[bunny-video]
  videoId: 39b76cca-e55b-4e9b-8583-b053f9dbd55d
  poster: thumbnail_70d8de32.jpg
  width: 704
  height: 407

Hyper's standard first approach establishes a different paradigm, centered around simplicity:

[image]
  small: /img/react-button-vs-nue-spa.png
  large: /img/react-button-vs-nue-spa-big.png
  size:  704 × 394
  class: tall

Your application starts simple, and remains simple as the project grows. [Source](//github.com/nuejs/nue/tree/master/packages/examples/simple-mpa) • [Demo](//mpa.nuejs.org/app/)


[.note]
  ### Note
  The above app is written with [Nue JS](//github.com/nuejs/nue/tree/master/packages/nuejs), which Hyper eventually replaces. When converted to Hyper, the app is even smaller due to smaller executable and smaller components.

- - -


## Get started with Hyper
First, install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL //bun.sh/install | bash
```

Hyper uses Bun for its superior web standards support, built-in JavaScript bundler, minifier, and crushing performance. Check details on why we prefer Bun over Node in our [FAQ](/docs/faq.html).


#### Install Hyper

```sh
# Install Hyper
bun install nue-hyper
```


#### Learn Hyper
Check examples, API docs, and language syntax from [Hyper documentation](/hyper/)


## FAQ

### How is this different from Svelte and Vue?
While Svelte and Vue both offer a more lightweight development environment than React, they still diverge from Hyper's standards-first vision. Though they provide better separation of concerns with their component structure, many popular patterns in these ecosystems still encourage coupling design with components through scoped CSS, CSS-in-JS libraries, or Tailwind integration.


### What is Nue?
Nue is a website/webapp generator based on [Nue JS](//github.com/nuejs/nue/tree/master/packages/nuejs) templating. Hyper is the next evolution of Nue JS, which it will replace. All Nue projects reside under the same [monorepo](//github.com/nuejs/nue/tree/master/packages/). Here's how the product hierarchy will eventually look:


[image]
  large: img/branding-big.png
  caption: Hyperlink is the upcoming router solution. The shield icon represents the close connection to web standards
  small: img/branding.png
  width: 400


### Isn't this just another framework?
Hyper takes a different approach than what this question suggests. Rather than adding to the ecosystem of tools and abstractions, Hyper aims to reduce tooling and complexity by returning to web standards. It eliminates the need for many specialized frameworks, libraries, and practices that have emerged to solve challenges within the React ecosystem. Our goal is to offer a simpler path reducing the need for constantly learning new frameworks and tools.


### Why are standards so important?
Standards offer significant long-term benefits:

1. **Timeless skills**: Knowledge of HTML, CSS, and JavaScript fundamentals remains valuable across decades, while framework-specific knowledge can become outdated.

2. **Sustainable products**: Applications built primarily with web standards tend to require less frequent and less disruptive rewrites.

Consider how React's ecosystem has evolved over time: Class components gave way to hooks, state management shifted from Redux to Context to various alternatives like Zustand and Jotai, and styling approaches continue to evolve from Styled Components to Emotion to CSS Modules and beyond. Each shift requires developers to learn new patterns and often refactor existing code.


### What's next in line?
We make Hyper easily accessible to everyone including backend developers, beginners, and AI models in two phases:


#### Full-stack applications
A demonstration to what Hyper and Nue are capable of:

* Intuitive routing and navigation system
* Simple cross-component communication
* Backend server & database integrations
* Three swappable design systems
* Deployment to the cloud (runtime agnostic)

Estimate: 3 months.


#### Generative UIs
A way for you and AI's to generate UIs with minimal effort:

* Basic HTML and CSS building blocks
* Higher-level compositions
* Built-in accessibility and responsivity
* Self-documenting API and patterns
* Base design system (headless, grid only)

Estimate: 4-5 months.


### How can a small library challenge React's dominance?
Gradually. To succeed, we need to address the following:

1. **Developer perception**: Many frontend developers have come to view abstraction layers as essential. As Hyper demonstrates how professional UIs can be built without these complexities, this perception will shift.

2. **Product completion**: Several critical pieces remain in development, particularly solid starter templates and comprehensive design systems.

Once these challenges are addressed, Hyper has the potential to gain significant momentum.


### Isn't the name already in use?
Yes, "Hyper" a Rust HTTP library, an Electron terminal emulator, and now a HTML-based language syntax. Each serving a unique purpose in different contexts.

### Can I contribute?
Yes. Especially ideas that don't interfere with the core architecture. If you have deep CSS expertise, I'd particularly love to connect with you.


### Can I give feedback?
Definitely! Join our mailing list to be notified when Hyper officially launches. You can provide feedback as you join.

