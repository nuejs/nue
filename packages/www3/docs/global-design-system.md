
# Global design system

[Three boxes diagram: GDS → Site A → Site B]

A global design system is the shared foundation that all your sites inherit from. It contains your typography, layout system, components, interactions, and motion design.

In React, you build with components. In Nue, you build with design systems. This is what makes multi-site development possible - you create the foundation once, and every site inherits 90% of its code from it.

This article walks through how to build a global design system using real examples. We'll start with what goes into a design system and work through semantic structure and global design. Then we'll show how a Linear-inspired design and an Apple-inspired design both inherit from the same foundation with minimal overrides.


## What's in a design system

A global design system is built from three standard web technologies. The word "global" means this foundation is shared across all your sites and inherited by default.

**HTML** provides structure through server-side layout modules and interactive components. These define the semantic skeleton of your pages but contain no styling.

**CSS** is the workhorse. It handles 80-90% of your code and defines styling, motion, and interaction design. This CSS dominance is why we call it a design system rather than a component library or framework.

**JavaScript** serves as supportive technology. It helps where CSS needs assistance, like providing more nuanced scroll behavior when animation-timeline needs ViewportObserver support.



## Semantic structure

### Semantic HTML as foundation

Semantic HTML is the bedrock of the global design system. Instead of divs with class names, you use meaningful elements like `<header>`, `<nav>`, `<article>`, `<aside>`, and `<footer>`. These elements tell browsers, search engines, and assistive technologies what each part of your page actually means.

Think of CSS Zen Garden if you remember it. One HTML file, hundreds of completely different designs. That's the mental model here. The HTML stays semantic and stable while CSS creates the visual expression. Modern semantic elements make this even more powerful. You need very few class names because the elements themselves provide the styling hooks and modern CSS with nesting can style inner elements without redundant class names. The "global namespace pollution" is not a thing here at all.

This approach makes your CSS predictable and maintainable. You style `<header>` once in your global design system, and every site inherits that styling. Want a different header style for a specific site? Override with minimal CSS. The semantic structure stays the same.


### Layout modules

Nue uses a slot-based layout system that works for any type of site. Marketing pages, documentation, blogs, product catalogs all use the same foundation.

[image with arrows showing HTML assembly]

Instead of one master template, you create modular layout components. A header component. A footer component. A sidebar component. Nue assembles them around your content using predefined slots. There are no traditional templates. Instead, modules fill slots to build the complete page.

Available slots include banner, header, subheader, main, aside, pagehead, pagefoot, beside, footer, and bottom. Your layout modules fill these slots. A documentation site might use header, aside, and footer. A marketing page might use header, pagehead, pagefoot, and footer. Same system, different combinations.

Layout modules typically live in `@shared/design/layout.html` or in a dedicated `@shared/layout/` directory that gets auto-included. Smaller sites often put everything in one layout.html file. Larger systems organize modules across multiple files.

Nue automatically generates the HTML page structure, meta tags, and top-level semantic elements. You focus on the modules that fill the slots. See the [layout system reference](layout-system) for complete details.


### The content area
Your page content comes from Markdown files processed by Nuemark: a componentized Markdown dialect specifically designed for generating rich, semantic HTML.

Nuemark extends standard Markdown with sections, blocks, and custom components. You can structure complex layouts in Markdown using semantic HTML syntax. Hero sections, feature grids, testimonial blocks all work with Nue's custom HTML elements.

```md
[.hero]
  # Welcome to our product
  The future of web development

[.features]
  ### Fast
  Build sites in seconds

  ### Simple
  Just HTML, CSS, and JavaScript
```

These Markdown components render as semantic HTML inside the `<article>` tag. The content author focuses on structure and meaning. The design system handles presentation.

Nuemark extensions can live in `lib/components.html` for larger systems or alongside layout modules in `design/layout.html` for smaller sites. See [Nuemark syntax](nuemark) for the full capabilities.


## Global design

### The 90% principle

The `@base` directory is your global design system. Inside it, the `@shared` directory contains all the code that your sites inherit from.

All sites, like our Linear-inspired and Apple-inspired examples, share most of their code from this shared foundation. Out of that 90%, maybe 80-90% is CSS. This is why it's called a "design system". Modern CSS gives you much that used to require JavaScript.


### Everything is design
Global design covers three interconnected areas: styling, interaction, and motion. CSS handles the heavy lifting for all three.

**Base design** defines typography, colors, spacing, layout primitives, and component appearance. This forms the visual foundation.

**Interaction design** creates responsive UI behaviors. Hover states, focus indicators, toggles, tabs, and dropdowns mostly use CSS. Web components and reactive components written in Nue's HTML syntax provide structure. JavaScript supports where needed.

**Motion design** brings interfaces to life through CSS transitions and animations. Scroll-triggered effects use animation-timeline where supported, with ViewportObserver providing fallback behavior when more nuanced control is needed.

### The `@shared/design` directory

The `@shared/design` directory contains styles that are automatically included in all inheriting sites. This is your foundation.

Typical structure:

```
@base/@shared/design/
├── globals.css       # Reset styles and base element defaults
├── colors.css        # Color system and theme variables
├── typography.css    # Font definitions and text styles
├── layout.css        # Grid, spacing, and layout primitives
├── content.css       # Article and content area styling
├── button.css        # Button styles and variations
├── inputs.css        # Form elements and input fields
└── navigation.css    # Nav patterns and menu styles
```

Each file focuses on one aspect of the design system. The strategy is to find a good balance between what is shared and what is site-specific. For example, if the brands you work with are heavily typography-based, the typography.css should be thin or even absent. You want enough shared foundation to avoid duplication, but not so much that it constrains individual site expression.

While `@shared/design` can also contain HTML and JS files, it's not recommended. Keep the auto-included foundation focused on styles.


### The `@shared/lib` directory
The `@shared/lib` directory contains optional extensions that sites can include or exclude as needed. You can organize this however makes sense for your system.

Typical structure:

```
@base/@shared/lib/
├── components/      # Reusable UI components (tabs, modals, cards)
├── effects/         # Animation and transition effects
└── scripts/         # JavaScript utilities and interactions
```

These directories can contain CSS, HTML (server layouts or reactive components with Nue syntax), and JS files. Sites cherry-pick what they need using the include configuration in their site.yaml:

```
include: [ components/charts, effects ]
```

### Application-specific design
The `@base` can contain application folders like `blog/`, `docs/`, `store/`, or `products/`. Each application can have its own assets that extend the shared foundation.

```
@base/
├── @shared/
├── blog/
│   ├── layout.html
│   ├── styles.css
│   ├── index.md
│   └── first-post.md
├── docs/
│   ├── layout.html
│   ├── styles.css
│   ├── index.md
│   └── getting-started.md
└── products/
    ├── styles.css
    └── index.md
```


The `@base` is actually a standalone app that you can preview in the browser at `localhost:4000`. The look and feel should be plain or "headless" since it's the foundation other sites build upon.

These application-specific assets automatically apply to pages within that application. Inheriting sites get these applications automatically and can override or extend them by creating matching folder names with their own assets.

This lets you define patterns once for documentation or blog sections, then have all sites inherit those patterns while still allowing customization.


### CSS layers control order

Nue doesn't care about file loading order. Instead, you control styling priority using CSS layers defined in your `site.yaml`:

```yaml
design:
  layers: [ base, ui, design ]
```

Each file uses the `@layer {}` definition to specify which layer it belongs to. See the [CSS layers reference](css-layers) for details.



## Site-specific design

Inheriting sites customize the global design system through overrides. The most common pattern is a single root-level CSS file that defines the site's unique visual identity.

```
linear-clone/
├── site.yaml
├── linear.css           # Main design overrides
└── index.md

apple-clone/
├── site.yaml
├── apple.css            # Main design overrides
└── index.md
```

This single file typically overrides colors, typography, spacing, and component styles to match the brand. The Linear-inspired site might define its purple accent color and tight spacing. The Apple-inspired site defines its minimalist typography and generous whitespace. Both inherit the complete foundation from `@base/@shared`.


### Application overrides
Applications can have their own overrides when needed:

```
linear-clone/
├── linear.css
└── blog/
    ├── linear-blog.css  # Blog-specific overrides
    └── index.md
```

This lets you customize how applications look within a specific site while still inheriting the application structure and base styling from `@base/blog/`.


### Including optional components
Sites opt into optional styles, components and scripts from `@shared/lib` using fuzzy matching in `site.yaml`:

```yaml
include: [ components/charts, effects ]
```

You can also exclude components if they distract or you want to avoid loading unnecessary code:

```yaml
exclude: [ effects/parallax ]
```

Applications can define their own includes and excludes in `app.yaml`. Both `include` and `exclude` arrays expand through the inheritance chain: `@base` → `site` → `app`.


## Wrapping up

You now understand how global design systems work in Nue. The semantic structure provides the foundation. The global design defines the shared styling, interaction, and motion. Applications add specific patterns. Sites override with minimal CSS to create unique expressions.

Our Linear-inspired and Apple-inspired examples show this in practice. Both inherit the same foundation from `@base/@shared`. Both use the same application structures. The difference is just the overrides: Linear's purple accent and dense spacing versus Apple's minimalist typography and generous whitespace.

Start by building your `@base` foundation. Keep it plain and focused on reusable patterns. Add applications as you need them. Then create your first inheriting site and see how little code it takes to produce something distinctive.

See [multi-site development](multi-site-development) for setting up your project structure and [building your first site](first-site) to start implementing.


### Get notified
We're building foundational design systems for SaaS, agencies, and e-commerce with over 20 years of experience. Soon you won't need to know CSS or JavaScript at all. You'll get Apple-level design systems with a simple `nue create` command. Sign up here to get notified when they're available:

[cta-form]

