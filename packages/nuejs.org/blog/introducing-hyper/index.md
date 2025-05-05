
---
# Show HN: Hyper — Crush React on every front (developer preview)
title: "Hyper: Crush React on every metric"
hero_title: "Introducing Hyper — Crush React on every metric _(Developer Preview)_"
og: img/hyper-og.png
date: 2025-05-02
unlisted: true
---

Today I'm releasing Hyper: a simple markup language for building user interfaces. It enables developers (and AI models) to generate complex UIs with amazingly clean syntax. It makes frontend development an enjoyable, almost liberating experience.

[image.bordered]
  large: img/hyper-banner-dark-big.png
  small: img/hyper-banner-dark.png
  size: 1305 × 517

### Compare: React vs Hyper
* Phase 1: [Simple components](#simple)
* Phase 2: [Complex components](#complexity)
* Phase 3: [Reusable components](#reusable)
* Phase 4: [Scalability](#scalability)


## Backstory
Hyper is the new reactive library for Nue, eventually replacing the current [Nue JS](https://github.com/nuejs/nue/tree/master/packages/nuejs) package. The sole purpose of this library is to embrace **simplicity** and **minimalism**. It stands against the complexity and bloat that pervade the current frontend ecosystem. This is particularly evident in modern React components where everything — logic, structure, and styling are mixed together. Hyper, however, is what React 1.0 originally envisioned: just a _headless view layer_ focused on rendering, with clear separation from styling concerns.

Let's study the difference.


## Phase 1: Simple components { #simple }
We begin with the fundamentals: how to define basic UI elements. Below is a simple `<table>` component defined in three ways:

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


1. **Modern React:** ShadCN <Table> component and TypeScript. The extra boilerplate comes through React patterns and the custom <Table> syntax. [Source](simple-table.html) • [Demo](/hyper/demo/react/simple-table.html)

2. **Old school React:** JSX with decoupled CSS. More straightforward markup but still needs JavaScript wiring and JSX transformation. [Source](simple-table.html#oldschool) • [Demo](/hyper/demo/react/simple-table-oldschool.html)

3. **Hyper:** Clean, standards- compliant HTML. Table is a <table>. [Source](simple-table.html#hyper) • [Demo](/hyper/demo/table/simple-table.html)

While these differences might seem minor, they become apparent when we move to more complex components:


## Phase 2: Complex components { #complexity }
Next we examine how these approaches handle increasing complexity. Here's the same table component, but now with sorting and filtering:

[.row]
  [! img/complex-table-1.png caption="Modern React"]
    href: complex-table.html

  [! img/complex-table-2.png caption="Vanilla TSX"]
    href: complex-table.html#oldschool

  [! img/complex-table-3.png caption="Hyper"]
    href: complex-table.html#hyper


Modern React ([Source](complex-table.html) • [Demo](/hyper/demo/react/complex-table.html))) extends the ShadCN table with features from Tanstack Table. The difference to Hyper ([Source](complex-table.html#hyper) • [Demo](/hyper/demo/table/complex-table.html))) becomes apparent:

1. **Excessive boilerplate:** Through Radix UI, Tanstack Table, and TypeScript interfaces. This results in approximately 170 lines of code, versus 40 lines in Hyper. An 75% increase in code and congitive load.

1. **Abstraction layers:** Six layers of abstraction are in play: React, ShadCN, Radix, Tanstack, TypeScript, and Tailwind. The bundled JavaScript is **91.3KB** and the Vite repository weighs 160MB. Hyper's table runs at **3.9KB** (1.2KB + 2.7KB for hyper.js).

1. **Multiple transpilers:** ShadCN table requires six different transpilers: ESBuild, JSX Transform, Rollup, TypeScript, Tailwind, and PostCSS. AI models like Claude and ChatGPT cannot generate preview for this large dependency tree. Hyper runs in the browser without compilation, or with single compilation step for a  production version.



## Phase 3: Reusable components { #reusable }
Here's a simple dashboard assembled with Hyper:

[image.large]
  large: img/minimalist-big.png
  small: img/minimalist.png
  href: /hyper/demo/dashboard/minimal.html

Now, the same dashboard with a "Ramsian" look:

[image.large]
  large: img/ramsian-big.png
  small: img/ramsian.png
  href: /hyper/demo/dashboard/ramsian.html

This transformation required zero changes to component code. Just a [30-line CSS file](/hyper/demo/dashboard/ramsian.css) extending the base design system.

Design system switching is impossible with modern React. Lets see why:


### The problem in React: hardcoded design
Modern React components aren't reusable across projects with varying design requirements because the design is hardcoded in the component. Even trivial typography changes (`h2` and `p`) require edits to multiple files. In ShadCN, you need to modify [alert-dialog.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/alert-dialog.tsx), [alert.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/alert.tsx), [card.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx), [dialog.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/dialog.tsx), [drawer.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/drawer.tsx), and [sheet.tsx](//github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sheet.tsx). Each file requires understanding of several React idioms (`data-slot`, `{...props}`), utility functions (`cn()`, `clsx()`, `twMerge()`), and primitives like `<AlertDialogPrimitive.Title>` and `<DrawerPrimitive.Description>` until these constructs ultimately map to CSS. Here are the title and description elements in the ShadCN .tsx files:

[image]
  large: img/shadcn-typo-big.png
  small: img/shadcn-typo.png

This hardcoding creates a scalability issue. For example, ShadCN's "New York" theme duplicates their default theme, resulting in 40,000+ lines of [additional TSX code][new_york]. This is a problem that would have been easily solved with CSS inheritance and cascade.


### Hyper's solution: decoupled design
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

This solves three major issues in modern React:

1. **Reusable components** accross projects and contexts
1. **Central design system** easily maintainable from the same place
1. **Zero boilerplate** due to stirct separation of concerns

Nue actually _enforces_ you to build simple, reusable components. Tight coupling in any form: CSS-in-JS, class name abuse, component-specific `<style>` elements, inline `style` attributes, or cryptic utility classes like `dark:bg-lime-400/10 size-[max(100%,2.75rem)]`—is systematically eliminated.

These simple units are the secret to truly scalable apps:


## Phase 4: Scalability { #scalability }
Here's how simplicity scales: a full-scale [app](//mpa.nuejs.org/app/) lighter than a single React button:

[bunny-video]
  videoId: 39b76cca-e55b-4e9b-8583-b053f9dbd55d
  poster: thumbnail_70d8de32.jpg
  width: 704
  height: 407

Hyper establishes an entirely different paradigm, centered around simplicity:

[image]
  small: /img/react-button-vs-nue-spa.png
  large: /img/react-button-vs-nue-spa-big.png
  size:  704 × 394
  class: tall

[.note]
  ### Note
  The above app is still written with Nue JS, but when converted to Hyper, the app becomes even smaller with virtually zero boilerplate.

- - -

## HTML needs a Hero
Hyper reveals the immense power in web standards, but we're just getting started. Our vision extends beyond components to make sophisticated UI development accessible to everyone—backend developers, beginners, and AI models alike:


### Phase 5: Full-stack applications
A demonstration to what Hyper and Nue are capable of:

* Intuitive routing and navigation system
* Simple cross-component communication
* Backend server & database integrations
* Three swappable design systems
* Deployement to the cloud (runtime agnostic)

Estimate: 3 months.


### Phase 6: Generative UIs
A way for you and AI's to generate UIs with minimal effort:

* Basic HTML and CSS building blocks
* Higher-level compositions
* Built-in accessibility and responsivity
* Self-documenting API and patterns
* Base design system (headless, grid only)

Estimate: 4-5 months.


## Get started with Hyper
First, install [Bun](//bun.sh):

```sh
# Install Bun
curl -fsSL https://bun.sh/install | bash
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


### What is Nue?
Nue is the "framework" (think Next.js + Astro, but simpler) and Hyper is the "language" (think React, but simpler). Both are developed under the same [monorepo](https://github.com/nuejs/nue/tree/master/packages/). Here's how the product hierarchy will look like.

[image]
  large: img/branding-big.png
  caption: The shield icon represents the close connection to web standards
  small: img/branding.png
  width: 400



### Isn't this just another framework?
Hyper is quite the opposite of what this question suggests. It ditches hundreds of frameworks/tools/languages/idioms/libraries/practises that attempt to solve problems they introduced within the idiomatic React stack. Hyper puts you on a whole new trajectory where the need for endless frameworks (and this question itself) becomes obsolete. The answer is: simplicity scales. Less is More. KISS.


### Why are standards so important?
Standards offer two invaluable benefits:

1. You'll learn skills that last forever
2. Your products will last forever

Think of all React-specific technologies that are no longer "hot" and will eventually turn into technical debt. Class components, Higher Order Components, createClass. Redux/Context/Zustand/Jotai, Webpack, Styled Components/Emotion, Material UI/Chakra... It's an endless cycle to keep your skills and products fresh.

Standards are forever.


### What do you mean by "generative"?
The idea of generative HTML assembly unveils once Hyper, and the core UI primitives are ready. After that, both you and AI models can rapidly generate user interfaces with simple, minimal syntax. No unnecessary junk in your way.


### Can Hyper actually challenge the status quo?
Absolutely. To succeed, we need to address two things:

1. **Developer perception**: Frontend developers view layers of abstraction as essential. As Hyper demonstrates how professional UIs can be generated without them, this perception will shift.

2. **Finish the product**: Several critical pieces remain in development, particularly the generative approach and design systems.

But once these challenges are addressed, Hyper becomes unstoppable.


### Isn't the name already in use?
Yes, "Hyper" a Rust HTTP library, an Electron terminal emulator, and now a HTML-based language syntax. Each serving a unique purpose in different contexts.

### Can I contribute?
Yes. Especially ideas that don't interfere with the core architecture. If you have 20+ years of experience with CSS and no wasted years in React, I'd particularly love to connect with you!

### Can I give feedback?
Definitely! Join our mailing list to be notified when Hyper officially launches. You can provide feedback as you join.

