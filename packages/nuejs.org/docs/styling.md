
# Styling


## CSS — the design language of the web

Nue champions CSS as the primary tool for styling, moving away from JavaScript monoliths where structure and styling are tightly coupled. This approach gives you far more **control** and **powerful tools** for designing:

### Design Systems

CSS-in-JS falls short when it comes to building design systems—modern CSS should handle this:

- **CSS and design systems are global** by nature. Elements like typography, colors, spacing, and base content (headings, paragraphs, etc.) need to be managed globally for consistency.

- **Design Systems belong to Design Engineers**. Scattering styles inside JavaScript components fragments global control, making it harder to manage without constant designer-developer coordination.

### CSS superpowers

Modern CSS has evolved into a **powerful, standalone language**, often underestimated in JavaScript component-based models. Some things are outright **impossible** or far more tedious to achieve with CSS-in-JS:

- **CSS Variables (Custom Properties)** — They make far more sense when used directly in CSS. Custom Properties allow for global theming and dynamic adjustments that CSS-in-JS can’t match in terms of flexibility.

- **`@starting-style`** — A powerful way to implement smooth animations and motion directly in CSS. It’s nearly impossible to express this kind of motion logic with utility-first or CSS-in-JS approaches.

- **CSS `:is()` Selector** — Utility-based models completely ignore the power of selectors. The `:is()` selector opens up new ways to handle conditional styling and write ad-hoc modules without relying on class names.

These are just a few highlights. Features like **Grid Template Areas**, **scroll-snap**, and **clip-path** are examples of CSS’s constant evolution. By sticking to component-based styles, you risk lagging behind while CSS continues to unlock new possibilities.

### Performance benefits

Vanilla CSS offers clear performance advantages:

1. **HMR Speed** — Individual CSS files compile in nanoseconds, whereas JavaScript monoliths with massive dependency trees take several seconds to rebuild.

2. **Smaller footprint** — Vanilla CSS results in significantly lighter page weight. For example, this website's entire CSS footprint is about the same size as popular reset libraries like Tailwind’s Preflight CSS.



### Timeless skills and products
The JS monolith and its various unstandardized features are popular right now, but it's hard to predict what will happen in five years. The complicated utility syntaxes and missed opportunities indicate potential technology debt. It's wise to stick with web standards, as this benefits your skills and career. Plus, the products you create will be more durable over time.




## What is a design system?

A **design system** is a set of rules and reusable components that bring consistency, structure, and efficiency to your design and development process. It bridges the gap between design and code, allowing for a cohesive visual identity that is reflected in both the user interface and the underlying CSS.

In Nue, your design system becomes the **single source of truth** for all styling decisions. It ensures that elements like typography, colors, spacing, and layout are consistently applied across every page and component on your site. By organizing your styles into **global**, **library**, **area-specific**, and **page-specific** layers, you create a design framework that scales effortlessly.

### Why use a design system?

- **Consistency**: A design system guarantees that your visual patterns remain consistent across the entire site, reducing the risk of mismatched styles and ensuring a cohesive user experience.
- **Efficiency**: With reusable components and predefined styles, developers can work faster without having to reinvent the wheel for every new page or feature. Designers can trust that their work will be faithfully implemented.
- **Scalability**: As your project grows, your design system helps you maintain control. Updates to global styles propagate throughout the site, ensuring that new content and features automatically align with the design.
- **Collaboration**: A design system ensures that developers and designers speak the same language, streamlining communication and reducing misunderstandings.

### From global to granular

At the heart of your design system are **global styles**—core elements like colors, fonts, and spacing that are applied site-wide. Beyond that, you can create **UI libraries** of reusable components like forms and buttons, which can be shared across different parts of your site. For larger, more complex projects, **area-specific** and **page-specific** styles allow for flexibility, so you can adapt designs to specific sections of your site while still adhering to global rules.

By thinking in terms of layers—from broad global styles down to specific page-level tweaks—you ensure that your CSS remains modular and maintainable as your site evolves.


## Setting things up

In Nue, your CSS is structured into a clear hierarchy, taking advantage of CSS’s native cascade and inheritance capabilities. This structure ensures that your design system remains organized and scalable.

### The CSS hierarchy

By organizing your styles into **global**, **library**, **area-**, and **page-specific** layers, you achieve both consistency and flexibility, allowing your design system to scale effortlessly.

1. **Global styles:** Define the universal look and feel of your site. These set the foundation for typography, colors, spacing, and layout, ensuring a cohesive visual language across your project.

2. **UI libraries:** Contain reusable component-level styles that can be shared across different parts of your site. These are applied on demand and keep your CSS lean by avoiding duplication.

3. **Area-specific styles:** Tailored for specific sections of the site, such as a blog or documentation. These styles allow localized design variations while still following global rules.

4. **Page-specific styles:** Styles that are applied to individual pages only, providing precise control over design and functionality for each page.

Each layer builds upon the one below it, with **global styles** acting as the base, and more specific styles (area- and page-specific) overriding or refining those global styles. This structure leverages CSS’s cascading nature, ensuring that styles flow naturally from general (global) to specific (page/area), while keeping your code clean, manageable, and modular.


## Global styles

CSS is global by nature, and this global approach provides the foundation for a consistent design system that spans all pages, elements, and components. By defining key elements like typography, color schemes, and spacing centrally, you ensure your site looks cohesive no matter how large or complex it becomes.

**Global styles typically include:**

- `colors.css` — Defines your brand palette, base colors like shades of gray, and accent colors.
- `settings.css` — Global resets, base styles, and CSS variables for colors, spacing, and other essential settings.
- `elements.css` — Universal styles for elements like links, images, tables, and other common elements.
- `typography.css` — Typographic styles for headings, paragraphs, text formatting, blockquotes, lists, and links.
- `navigation.css` — Styles for global navigation components, including headers, footers, and other key navigation elements.

By centralizing key design tokens like colors, spacing, and typography into CSS variables, your global styles provide a **single source of truth** for your design. This approach ensures consistency and maintainability across your entire site.

Example of CSS variables in a global style:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #2563eb;
  --font-size-base: 16px;
  --spacing-small: 0.5rem;
  --spacing-large: 2rem;
}

body {
  background-color: var(--primary-color);
  font-size: var(--font-size-base);
}

h1 {
  margin-bottom: var(--spacing-large);
}
```

By using variables in your global styles, you ensure that changes to your design (like adjusting the primary color or base font size) are simple, efficient, and applied site-wide.

Global directories are defined in your `site.yaml` configuration file as follows:

```yaml
globals: ["@globals"]
```

The `@` prefix for directory names is optional but serves as a useful convention to signify that the folder contains global assets rather than application-specific files like `blog`.


## UI libraries

Your design system extends into **UI libraries**, where you define styles for reusable components and elements. Unlike global styles, these are included on demand, keeping your CSS efficient and tailored to the specific needs of your site’s various sections. UI libraries help you avoid duplication by creating a **single source of truth** for frequently used components.

Typical **library files** might include:

- `form.css` — Contains styles for form elements like inputs, text areas, select boxes, and buttons.
- `cards.css` — Styles for card components that can be reused across different pages or sections.

UI libraries ensure modularity and reusability in your design system. By centralizing these components, you make it easier to maintain consistency and efficiency across your site, allowing different areas or pages to reuse the same styles without duplicating code. For example:

#### `card.css`

```css
/* Reusable card component */
.card {
  box-shadow: 0 0 2em #0001;
  border-radius: 0.5em;
  padding: 1.5rem;
}
```

#### `form.css`

```css
/* Form element styling */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

UI libraries are defined in your `site.yaml` configuration file like this:

```yaml
libs: ["@library"]
```

By structuring your CSS with reusable components in mind, you create a design system that scales effortlessly while keeping your styles lean and maintainable.


## Area-specific styles

In Nue, **area-specific styles** allow you to apply unique design elements to different sections of your site, such as a blog, documentation, or store. These styles override or refine global rules while still adhering to the overall design system, ensuring consistency across your site.

When organizing your CSS with area-specific files, there is no need for class name prefixing (e.g., `.blog .card`). The styles within an area-specific file are automatically scoped to that section of your site, making class names like `.blog .card` redundant. By keeping your class names simple and reusable (e.g., `.card`), your CSS remains cleaner and more modular.

Area-specific styles are applied using the `include` statement in the `.yaml` file of the corresponding area folder. For example, in your blog app, you might include styles tailored specifically for that section:

```yaml
# blog/blog.yaml
include: [ form, card, motion ]
```

This configuration includes all styles, scripts, and components from the UI library that match "form," "card," or "motion" in their filenames, applying them specifically to the blog area without the need for repetitive class names.

### Example of area-specific CSS:

#### `card.css`

```css
/* Card styling specific to the blog area */
.card {
  border-color: var(--primary-color);
  background-color: var(--gray-100);
}
```

#### `motion.css`

```css
/* Motion styles specific to the blog area */
.motion {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
```

By organizing your CSS into area-specific files, you eliminate the need for area-specific prefixes like `.blog .card`. Instead, you can rely on clean, simple class names like `.card`, knowing they are scoped appropriately by where the styles are defined. This approach reduces redundancy and improves maintainability while keeping your CSS modular.


## Page-specific styles

**Page-specific styles** give you precise control over individual pages, allowing for unique design treatments that do not affect the rest of your site. These styles are ideal for one-off pages like landing pages or special content that requires custom design.

To apply page-specific styles, use the `include` statement in the front matter of the `.md` file. For example:

```yaml
# Front matter of the page
title: Announcing v2.0
include: [ dazzling-hero ]
```

This will include styles and components that match "dazzling-hero" in their filenames, applying them only to this page without affecting any other part of your site.

### Example of page-specific CSS:

```css
/* Styles for a page-specific hero section */
.dazzling-hero {
  background-image: url('/img/hero-background.jpg');
  padding: 4rem;
  text-align: center;
}
```

By organizing your styles this way, you avoid cluttering the global or area-specific CSS with unnecessary overrides, keeping your project clean and modular.


## Section-specific styles { #sections }

In Nue, **section-specific styles** allow you to divide your content into visually distinct sections for better readability and more control over styling. This approach works especially well for landing pages or long-form content where different sections require unique design treatments.

### Splitting content into sections

By default, Markdown-generated HTML is placed inside an `<article>` element. For richer layouts, you can split your content into multiple sections using the `sections` configuration in your front matter or YAML files.

For example, in the front matter of a page:

```md
---
sections: [hero, features, backstory]
---

# Hello world
This is an epic intro.

## Features
- Great design
- Stunning motion
- Awesome UX

## Backstory
Once upon a time...
```

This would generate the following HTML:

```html
<article>

  <section class="hero">
    <h1>Hello, World!</h1>
    <p>This is an epic intro.</p>
  </section>

  <section class="features">
    <h2>Features</h2>
    <ul>
      <li>Great design</li>
      <li>Stunning motion</li>
      <li>Awesome UX</li>
    </ul>
  </section>

  <section class="backstory">
    <h2>Backstory</h2>
    <p>Once upon a time...</p>
  </section>

</article>
```

### Styling your sections

Once your content is split into sections, you can style each section individually using class names like `.hero`, `.features`, or `.backstory`. Since your styles are scoped to sections through the `sections` configuration, there is no need for redundant prefixes like `.blog .hero`. The section-specific styles are already applied only within that section’s context.

```css
/* Section-specific styles */
.hero {
  background-color: #f5f5f5;
  padding: 4rem;
  text-align: center;
}

.features {
  background-color: #e5e7eb;
  padding: 3rem;
  display: flex;
  gap: 1rem;
}

.backstory {
  background-color: #d1d5db;
  padding: 2rem;
  font-style: italic;
}
```

### Automating section breaks

Nue can automatically split your content into sections based on `<h2>` headings. Each `<h2>` tag starts a new section, and the section is automatically assigned a class matching the heading (e.g., `.hero`, `.features`). This allows you to structure your content naturally without manually managing section breaks.

Alternatively, you can manually define section breaks using three dashes `---` in your Markdown or YAML configuration for greater control.

### Reusing section styles for consistency

To maintain design consistency across multiple pages, you can reuse the same section classes (like `.hero` or `.features`) on different pages. This ensures that similar content follows the same design patterns without needing to rewrite CSS for every page.

By consolidating section styles, your CSS remains clean and modular, ensuring consistency across your entire site while simplifying maintenance.


## Writing good, modern CSS

In Nue, writing CSS is about simplicity, efficiency, and ensuring that your styles grow effortlessly with your project. Rather than relying on complex methodologies like BEM or pre-processors like SASS, Nue embraces the native strengths of CSS — its cascading nature, global scope, and modern features like nesting.

The key to scalable CSS is **reusability** and **consistency**. By structuring your styles with a solid **design system** and using CSS variables for global tokens like typography, colors, and spacing, you create a single source of truth for your design. This minimizes repetition and ensures that your styles are adaptable and easy to maintain.

With **CSS nesting**, structuring your styles is intuitive and efficient, allowing for clean, hierarchical CSS without the need for verbose class names. This enables your styles to flow naturally from global to page-specific rules, all while maintaining simplicity and flexibility.


### Start with the content

Always begin by planning your information architecture and drafting your content. Your design and branding will naturally evolve from there. The better you understand your content, the more precisely you can structure your design system and CSS.

A content-first approach ensures that your design system is tailored to the real needs of your project, leading to a more cohesive, user-centered outcome.


### Use clean, semantic HTML

When building your [layouts](layout.html) and [Markdown extensions](markdown-extensions.html), always prioritize clean, semantic HTML. Avoid unnecessary `<div>` and `<span>` elements, and remove class names that are purely for styling purposes. By doing so, your HTML becomes more accessible, SEO-friendly, and easier to maintain. It also aligns perfectly with the principles of a **design system** by ensuring that styles are applied consistently and meaningfully.

Instead of this:

**BAD**: Unnecessary containers and class names

```html.bad
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/chat.svg" alt="Chat icon">
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message</p>
  </div>
</div>
```

Write more semantic, minimal markup:

**GOOD**: Clean, semantic markup

```html.good
<div class="notification">
  <h3>ChitChat</h3>
  <p>You have a new message</p>
</div>
```

By removing unnecessary containers and focusing on meaningful, semantic elements, your code becomes more efficient, and your design system is easier to maintain. This approach improves both accessibility and performance, as well as fostering collaboration between developers and designers.


### Avoid inline styling

When styling your components, it’s crucial to separate concerns by keeping styling out of the markup. This means avoiding inline styles, both through the `style` attribute and the use of class-based utility styles. Inline styling tightly couples the design to the structure, making it harder to maintain and update, and working against the principles of a **design system**.

For example, avoid this:

**BAD**: Inline styling (style decisions embedded directly in the markup)

```html.bad
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/chat.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-slate-500">You have a new message</p>
  </div>
</div>
```

Instead, decouple your styles from the markup by using reusable components in your design system:

**GOOD**: External styling (styles are separated from the markup)

```html.good
<div class="notification card">
  <h3>ChitChat</h3>
  <p>You have a new message</p>
</div>
```

In this approach, the **notification** and **card** classes are part of the design system, allowing the component to be styled consistently across your site while remaining flexible. This method makes your code easier to maintain and adapt while ensuring that all design changes flow from the central **design system**, not from individual components.

Decoupling styles from markup keeps your design flexible, maintainable, and scalable. It allows for different styling depending on the context, without changing the underlying HTML.



### Create reusable components

A scalable CSS strategy starts with reusable components. By extracting common patterns and styling them as reusable classes, you not only reduce code duplication but also create a design system that’s easy to maintain and scale. These reusable components should be derived from your **design system**, which acts as the single source of truth for consistent styling across your entire site.

For example, a notification component can be divided into reusable parts like this:

```html.good "Using a reusable class name"
<div class="notification card">
  <h3>ChitChat</h3>
  <p>You have a new message</p>
</div>
```

In this case, we have two components: **card** (a reusable UI element) and **notification** (specific to this use case).

```css
/* Reusable styles for all card components */
.card {
  box-shadow: 0 0 2em #0001;
  border: var(--border);
  border-radius: .5em;
  padding: 1.5em;
  font-size: 95%;
}

/* Notification-specific styling */
.notification {
  background: url(/img/chat.svg) 10% center no-repeat;
  background-size: 3rem;
  padding-left: 6rem;
}
```

This separation of concerns not only reduces redundancy but also allows for easier updates. The **card** class can be reused across multiple components and pages, while the **notification** class applies only to the specific use case, making it easy to isolate and update.

#### Benefits of creating reusable components:

1. **Modularity**: Components like **card** can be applied anywhere on your site, encouraging consistency without duplication.

2. **Maintainability**: Changes to a single component propagate across your site. For example, updating the **card** class once will reflect wherever it’s used.

3. **Consistency**: Reusable components derived from your **design system** ensure that design patterns remain consistent across different sections of your website, improving both the user experience and the ease of collaboration between developers and designers.

4. **Scalability**: Reusable components naturally scale with your project. By limiting duplication and relying on your design system, your CSS remains clean, modular, and easy to extend.

By anchoring your components in the design system, you create a CSS structure that is not only scalable but also adaptable to changes in the design, ensuring long-term consistency and maintainability across your project.


### Use CSS nesting

Take advantage of **CSS nesting** to simplify your styles. The lack of native nesting used to lead to workarounds like BEM and pre-processors like SASS. But now that nesting is supported in all modern browsers, you can avoid verbose class names and stick with vanilla CSS, making your styles more intuitive and hierarchical:

```css
/* Styles for the site-wide header */
body > header {

  /* Target the first child, likely the logo */
  > :first-child {
    /* Logo styles */
  }

  /* Style any navigation inside the header */
  > nav {
    /* Primary nav styles */
  }

  /* Subnavigation following the header */
  + nav {
    /* Subnav styles */
  }
}
```

**Benefits of CSS nesting:**

1. **Cleaner code**: CSS nesting mirrors your HTML structure, reducing the need for excessive class names and making your styles easier to read.

2. **No naming of things**: With nesting, you don’t need to create class names for every element. This minimizes cognitive load and lets you focus on the structure of your HTML.

3. **Streamlined development**: By using native CSS features, you avoid needing pre-processors like SASS and stick to web standards, making your styles simpler, more performant, and future-proof.


### Avoid complex CSS resets

Avoid relying on complex CSS reset libraries. In most cases, a minimal reset is all you need:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Reset libraries can add unnecessary complexity, often resetting everything to zero only to reapply styling afterward. For instance, many resets remove default margins on elements like `h1` or `p`, which you’ll need to restore later:

```css
h1, h2, h3, p {
  margin: 0;
}
```

Instead, let your **design system** define the correct margins and spacing from the outset. This approach ensures better control and avoids the clutter of redundant resets. For form elements, it's a good idea to organize styling in a separate `form.css` to keep your code modular and maintainable:

```css
/* form.css */
button, input, select, textarea {
  font: inherit;
}
```

This way, you maintain clarity and control in your styles while reducing complexity.


### Respect constraints

When crafting your design system, limit yourself to as few fonts, font weights, colors, variables, and components as possible. A simpler design system is easier to adopt, maintain, and use.

```css
:root {
  /* You rarely need every shade of your main color */
  --main-500: #3b82f6;
  --main-600: #2563eb;

  /* Same for your base color */
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

Limiting options reduces the potential for errors and ensures the design remains cohesive. A minimal design system fosters creativity by encouraging thoughtful combinations of the available resources. Fewer choices lead to more deliberate design decisions, making both development and design smoother.


## Templates

For many engineers, design can feel like a foreign concept—something abstract and difficult to master. The same often goes for CSS, which many find confusing or tricky to get right. Some even avoid it entirely. Nue’s **Templates** aim to bridge that gap.

### A learning tool for engineers

The next major project from the Nue team is **Templates**—carefully crafted, design-driven examples that showcase how design systems can be implemented flawlessly. These templates will provide consistency across your entire site, down to the finest details, and include well-thought-out motion design to create engaging user experiences.

### Prime examples of best practices

Each template will serve as an example of design and development best practices, offering valuable insights into:

- **Design systems**: How to structure and implement a reusable design system with a single source of truth.
- **CSS organization**: Best practices for organizing CSS into global, area-specific, and page-specific layers.
- **Reusable class naming**: How to create scalable and maintainable components that align with semantic, minimal naming conventions.

### Master advanced techniques

In addition to these foundational principles, each template will feature advanced CSS techniques, which are essential for building modern web applications. These will be clearly commented and documented, offering insights into more complex styling topics, including:

1. **CSS variables and tokens**: How to use them effectively to manage design tokens like color schemes, typography, and spacing.
2. **Flex & Grid layouts**: Mastering responsive and flexible layouts without relying on heavy frameworks.
3. **Media queries and responsiveness**: Best practices for ensuring a smooth user experience across devices, from mobile to desktop.
4. **CSS motion and animations**: Creating polished, performance-friendly motion effects using CSS, from basic transitions to advanced animations.

### A valuable resource for developers

Nue’s templates won’t just be tools for building beautiful websites—they will serve as a rich source of learning. Engineers who may not have a background in design will be able to study these examples to better understand design systems, CSS organization, and modern styling techniques.

By mastering these templates, you’ll gain the confidence to not only apply these principles to your own projects but also to improve your skills as a **design engineer**, combining the best of both worlds—design and development.

### Stay updated

If you’re excited about these templates and want to be notified as soon as they’re available, join the mailing list to stay in the loop.

[CTA: Join mailing list]
