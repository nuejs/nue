# Styling
Nue uses CSS as the primary tool for styling, moving away from JavaScript monoliths that tightly couple structure and styling. This gives you more control and flexibility in your styling.


## Design systems

A **design system** is a set of rules and reusable components that create consistency, structure, and efficiency across your design and development process. It bridges the gap between design and code, ensuring your visual identity is maintained in both the UI and underlying CSS.

In Nue, your design system is the **single source of truth** for all styling decisions, ensuring consistent application of typography, colors, spacing, and layout across your site.

By organizing your styles into layers, you create a design framework that scales effortlessly:

1. **Global styles**: Define the universal look and feel of your site, covering core elements like typography, colors, and layout.

2. **UI libraries**: Contain reusable component-level styles that can be shared across different parts of your site. These help keep your CSS lean by avoiding duplication.

3. **Area-specific styles**: Tailored for specific sections of the site, such as a blog or documentation, these styles allow localized design variations while still following global rules.

4. **Page-specific styles**: Applied to individual pages, giving you precise control over design and functionality for each page.

Each layer builds upon the one below it, with **global styles** forming the base and more specific styles (area- and page-specific) overriding or refining them. This structure leverages CSS's cascading nature, keeping your code clean, modular, and maintainable.


### Global styles
Global directories are defined in your `site.yaml` configuration file as follows:

```yaml
globals: ["@globals"]
```

Global styles typically include:

- `colors.css` — Defines your brand palette, base colors like shades of gray, and accent colors.
- `settings.css` — Global resets, base styles, and CSS variables for colors, spacing, and other essential settings.
- `elements.css` — Universal styles for elements like links, images, tables, and other common elements.
- `typography.css` — Typographic styles for headings, paragraphs, text formatting, blockquotes, lists, and links.
- `navigation.css` — Styles for global navigation components, including headers, footers, and other key navigation elements.

The `@` prefix for directory names is optional but serves as a useful convention to signify that the folder contains global assets rather than application-specific files like `blog`.

[image]
  small: /img/blog-colors.png
  large: /img/blog-colors-big.png
  caption: CSS is global by nature


### UI libraries
UI libraries are defined in your `site.yaml` configuration file like this:

```yaml
libs: ["@library"]
```
Unlike global styles, these styles are included on demand. Typical **library files** might include `card.css` or `form.css`.


[image]
  small: /img/blog-css-hierarchy.png
  large: /img/blog-css-hierarchy-big.png
  caption: Global styles and library files


### Area-specific styles

In Nue, **area-specific styles** allow you to apply unique design elements to different sections of your site, such as a blog, documentation, or store. These styles override or refine global rules while still adhering to the overall design system, ensuring consistency across your site.

Area-specific styles are applied using the `include` statement in the `.yaml` file of the corresponding area folder. For example, in your blog app, you might include styles tailored specifically for that section:

```yaml
# blog/blog.yaml
include: [ form, card, motion ]
```

When organizing your CSS with area-specific files, there is no need for class name prefixing (e.g., `.blog .card`). The styles within an area-specific file are automatically scoped to that section of your site, making class names like `.blog .card` redundant.


### Page-specific styles

**Page-specific styles** give you precise control over individual pages, allowing for unique design treatments that do not affect the rest of your site. These styles are ideal for one-off pages like landing pages or special content that requires custom design.

To apply page-specific styles, use the `include` statement in the front matter of the `.md` file. For example:

```yaml
# Front matter of the page
title: Announcing v2.0
include: [ dazzling-hero ]
```

This will include styles and components that match "dazzling-hero" in their filenames, applying them only to this page without affecting any other part of your site. For example:

```css
/* Styles for a page-specific hero section */
.dazzling-hero {
  background-image: url('/img/hero-background.jpg');
  padding: 4rem;
  text-align: center;
}
```


### Section-specific styles { #sections }

In Nue, **section-specific styles** allow you to divide your content into visually distinct sections for better readability and more control over styling. This approach works especially well for landing pages or long-form content where different sections require unique design treatments.

#### Splitting content into sections

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

#### Styling your sections

Once your content is split into sections, you can style each section individually using class names like `.hero`, `.features`, or `.backstory`. Since your styles are scoped to sections through the `sections` configuration, there is no need for redundant prefixes like `.blog .hero`. The section-specific styles are already applied only within that section's context.

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

#### Automating section breaks

Nue can automatically split your content into sections based on `<h2>` headings. Each `<h2>` tag starts a new section, and the section is automatically assigned a class matching the heading (e.g., `.hero`, `.features`). This allows you to structure your content naturally without manually managing section breaks.

Alternatively, you can manually define section breaks using three pluses `+++` in your Markdown or YAML configuration for greater control.

#### Reusing section styles for consistency

To maintain design consistency across multiple pages, you can reuse the same section classes (like `.hero` or `.features`) on different pages. This ensures that similar content follows the same design patterns without needing to rewrite CSS for every page.

By consolidating section styles, your CSS remains clean and modular, ensuring consistency across your entire site while simplifying maintenance.


## Writing good, modern CSS

### Start with the content

Always begin by planning your information architecture and drafting your content. Your design and branding will naturally evolve from there. The better you understand your content, the more precisely you can structure your design system and CSS.

A content-first approach ensures that your design system is tailored to the real needs of your project, leading to a more cohesive, user-centered outcome.


### Use clean, semantic HTML

When building your [layouts](layout.html) and [Markdown extensions](markdown-extensions.html), always prioritize clean, semantic HTML. Avoid unnecessary `<div>` and `<span>` elements, and remove class names that are purely for styling purposes. By doing so, your HTML becomes more accessible, SEO-friendly, and easier to maintain. It also aligns perfectly with the principles of a **design system** by ensuring that styles are applied consistently and meaningfully.

Instead of this:


```html.bad "**BAD**: Unnecessary containers and class names"
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


```html.good "**GOOD**: Clean, semantic markup"
<div class="notification">
  <h3>ChitChat</h3>
  <p>You have a new message</p>
</div>
```

By removing unnecessary containers and focusing on meaningful, semantic elements, your code becomes more efficient, and your design system is easier to maintain. This approach improves both accessibility and performance, as well as fostering collaboration between developers and designers.


### Avoid inline styling

When styling your components, it's crucial to separate concerns by keeping styling out of the markup. This means avoiding inline styles, both through the `style` attribute and the use of class-based utility styles. Inline styling tightly couples the design to the structure, making it harder to maintain and update, and working against the principles of a **design system**.

For example, avoid this:


```html.bad "**BAD**: style embedded directly in the markup"
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


```html.good "**GOOD**: External styling (styles are separated from the markup)"
<div class="notification card">
  <h3>ChitChat</h3>
  <p>You have a new message</p>
</div>
```

In this approach, the **notification** and **card** classes are part of the design system, allowing the component to be styled consistently across your site while remaining flexible. This method makes your code easier to maintain and adapt while ensuring that all design changes flow from the central **design system**, not from individual components.

Decoupling styles from markup keeps your design flexible, maintainable, and scalable. It allows for different styling depending on the context, without changing the underlying HTML.


### Create reusable components

A scalable CSS strategy starts with reusable components. By extracting common patterns and styling them as reusable classes, you not only reduce code duplication but also create a design system that's easy to maintain and scale. These reusable components should be derived from your **design system**, which acts as the single source of truth for consistent styling across your entire site.

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

2. **No naming of things**: With nesting, you don't need to create class names for every element. This minimizes cognitive load and lets you focus on the structure of your HTML.

3. **No pre-processors needed**: By using native CSS features, you avoid needing pre-processors like SASS and stick to web standards, making your stylesheets more performant and future-proof.


### Avoid complex CSS resets

Avoid relying on complex CSS reset libraries. In most cases, a minimal reset is all you need:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Reset libraries can add unnecessary complexity, often resetting everything to zero only to reapply styling afterward. For instance, many resets remove default margins on elements like `h1` or `p`, which you'll need to restore later:

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

