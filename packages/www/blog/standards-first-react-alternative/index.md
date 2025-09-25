
---
title: Hyper: Standards first React alternative
hero_title: **Hyper:** Standards first React alternative
date: 2025-05-08
---

[.note]
  ### Note
  Hyper was an early preview of what became [Nuedom](/docs/nuedom). The syntax here is a bit different, but the core ideas remain the same.

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



## Simple components
Below is a basic `<table>` component defined in three ways:

[.flex]
  [! img/simple-table-1.png]
    caption: Modern React
    href: simple-table

  [! img/simple-table-2.png]
    caption: Old school React
    href: simple-table#oldschool

  [! img/simple-table-3.png]
    caption: Hyper
    href: simple-table#hyper


1. **Modern React** Modern React represents a common approach to building user interfaces today using component libraries such as ShadCN/UI, Material UI, Chakra, or Tailwind Catalyst. In this example, we chose ShadCN as it's gained significant popularity in recent years and has strong AI tool support. For example, Claude and ChatGPT offer built-in support for ShadCN in their code previews. [Source](simple-table) • [Demo](/hyper/demo/react/simple-table)

2. **Old school React** is how React components were built back in the days when styling was decoupled from the component code. [Source](simple-table#oldschool) • [Demo](/hyper/demo/react/simple-table-oldschool)

3. **Hyper** demonstrates the standards-first approach. [Source](simple-table#hyper) • [Demo](/hyper/demo/table/simple-table)

While these differences might seem minor, they become apparent when we move to more complex components:


## Complex components
Next we examine how these approaches handle increasing complexity. Here's the same table component, but now with sorting and filtering:

[.flex]
  [! img/complex-table-1.png caption="Modern React"]
    href: complex-table

  [! img/complex-table-2.png caption="Vanilla TSX"]
    href: complex-table#oldschool

  [! img/complex-table-3.png caption="Hyper"]
    href: complex-table#hyper


1. **Modern React** is assembled according to ShadCN's [data table](//ui.shadcn.com/docs/components/data-table) documentation. The bundled JavaScript is **91.3KB**. [Source](complex-table) • [Demo](/hyper/demo/react/complex-table)

2. **Vanilla TSX** uses `useState` and `useMemo` to implement the added functionality, and the HTML is tagged the old school way with numerous class names.

3. **Hyper** uses semantic HTML with minimal class names and two instance methods for sorting and filtering. The resulting JS is only **3.9KB** minzipped (1.2KB + 2.7KB for hyper.js). [Source](complex-table#hyper) • [Demo](/hyper/demo/table/complex-table)



## Design systems
Here's an example dashboard assembled with Hyper:

[image.large]
  large: img/minimalist-big.png
  small: img/minimalist.png
  href: /hyper/demo/dashboard/minimal

[Source](//github.com/nuejs/nue/blob/master/packages/hyper/demo/dashboard/components/0-dashboard) • [Demo](/hyper/demo/dashboard/minimal)

Here is the same dashboard, but with "Ramsian" look and feel:

[image.large]
  large: img/ramsian-big.png
  small: img/ramsian.png
  href: /hyper/demo/dashboard/ramsian

This transformation required zero changes to component code. Just a [32-line CSS file](//github.com/nuejs/nue/blob/master/packages/hyper/demo/dashboard/ramsian.css) extending the base design system. [Demo](/hyper/demo/dashboard/ramsian)


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

[image]
  small: /blog/large-scale-apps/react-button.png
  large: /blog/large-scale-apps/react-button-big.png
  size:  704 × 394

Your application starts simple, and remains simple as the project grows. [Source](//github.com/nuejs/nue/tree/master/packages/examples/simple-mpa) • [Demo](//mpa.nuejs.org/app/)



## FAQ

### How is this different from Svelte and Vue?
While Svelte and Vue both offer a more lightweight development environment than React, they still diverge from Hyper's standards-first vision. Though they provide better separation of concerns with their component structure, many popular patterns in these ecosystems still encourage coupling design with components through scoped CSS, CSS-in-JS libraries, or Tailwind integration.


### What is Nue?
Nue is a website/webapp generator based on [Nue JS](//github.com/nuejs/nue/tree/master/packages/nuejs) templating. Hyper is the next evolution of Nue JS, which it will replace. All Nue projects reside under the same [monorepo](//github.com/nuejs/nue/tree/master/packages/).


### Isn't this just another framework?
Hyper takes a different approach than what this question suggests. Rather than adding to the ecosystem of tools and abstractions, Hyper aims to reduce tooling and complexity by returning to web standards. It eliminates the need for many specialized frameworks, libraries, and practices that have emerged to solve challenges within the React ecosystem. Our goal is to offer a simpler path reducing the need for constantly learning new frameworks and tools.


### Why are standards so important?
Standards offer significant long-term benefits:

1. **Timeless skills**: Knowledge of HTML, CSS, and JavaScript fundamentals remains valuable across decades, while framework-specific knowledge can become outdated.

2. **Sustainable products**: Applications built primarily with web standards tend to require less frequent and less disruptive rewrites.

Consider how React's ecosystem has evolved over time: Class components gave way to hooks, state management shifted from Redux to Context to various alternatives like Zustand and Jotai, and styling approaches continue to evolve from Styled Components to Emotion to CSS Modules and beyond. Each shift requires developers to learn new patterns and often refactor existing code.



