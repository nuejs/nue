
# Complex content layouts
Most Markdown is simple. Paragraphs, headings, lists. But marketing pages need hero sections, feature grids, testimonial layouts, call-to-action blocks. Complex content layouts let you build these rich page structures in Markdown without writing HTML.

This guide covers structuring content inside the `<article>` element. For the complete page structure and layout modules that wrap around your content, see [Page layout](page-layout).

Your design system controls how things look. You focus on structure and meaning.


## Sections
Sections wrap your content in semantic `<section>` elements. Enable sectioning in your site or application configuration:

```yaml
# site.yaml or app.yaml
sections: true
```

Then use triple equals to create section breaks in your content:

```md
# Introduction
First section content...

===

## Features
Second section content...

===

## Technical Details
Third section content...
```

Generates:

```html
<article>
  <section>
    <h1>Introduction</h1>
    <p>First section content...</p>
  </section>
  <section>
    <h2>Features</h2>
    <p>Second section content...</p>
  </section>
  <section>
    <h2>Technical Details</h2>
    <p>Third section content...</p>
  </section>
</article>
```

The `===` divider creates explicit section boundaries. You control where sections break.


### Section classes
Assign semantic classes to sections:

```yaml
sections: [ hero, problem, solution, features, testimonials, cta ]
```

The first section gets class `hero`, the second gets `problem`, and so on. Use names that reflect content purpose, not visual style. Your design system uses these classes to style each section appropriately.

For a product page:

```yaml
sections: [ hero, benefits, how-it-works, pricing, faq, cta ]
```

These settings belong in `site.yaml` or `app.yaml`, not page front matter. They're design system decisions that ensure consistent structure across all pages in your site or application.


## Section wrapper
Wrap each section's content in an inner div for layout control:

```yaml
# site.yaml or app.yaml
section_wrapper: wrap
```

Generates:

```html
<section>
  <div class="wrap">
    <!-- content here -->
  </div>
</section>
```

The wrapper div lets your design system apply max-width constraints to content while allowing the section's background to extend full-width. Common pattern for centered content with edge-to-edge backgrounds.

Like sections configuration, this belongs in `site.yaml` or `app.yaml`. It's a design system setting that affects how all pages render.


## Blocks
Blocks wrap content in divs with your chosen class name. Any class from your design system works:

```md
[.note]
  ### Important Note
  This content is wrapped in a div with class "note"
```

Generates:

```html
<div class="note">
  <h3>Important Note</h3>
  <p>This content is wrapped in a div with class "note"</p>
</div>
```

The class name is entirely up to you. Use whatever makes sense for your design system:

```md
[.warning]          → <div class="warning">...</div>
[.testimonial]      → <div class="testimonial">...</div>
[.pricing-tier]     → <div class="pricing-tier">...</div>
[.photo-gallery]    → <div class="photo-gallery">...</div>
```

### Nested divs
Blocks automatically create nested divs based on content structure. The first heading level determines how content is grouped:

```md
[.features]
  ### Feature One
  First feature description

  ### Feature Two
  Second feature description
```

Since the first heading is `h3`, each `h3` creates a nested div:

```html
<div class="features">
  <div>
    <h3>Feature One</h3>
    <p>First feature description</p>
  </div>
  <div>
    <h3>Feature Two</h3>
    <p>Second feature description</p>
  </div>
</div>
```

Use triple dashes for explicit nested divs:

```md
[.testimonials]
  "Great product!"
  - Sarah Chen

  ---

  "Changed our workflow"
  - Michael Park
```

Generates:

```html
<div class="testimonials">
  <div>
    <p>"Great product!"</p>
    <p>- Sarah Chen</p>
  </div>
  <div>
    <p>"Changed our workflow"</p>
    <p>- Michael Park</p>
  </div>
</div>
```

### Common patterns

**Grid layouts** - For responsive multi-column layouts:

```md
[.grid]
  ### Feature One
  First feature description

  ### Feature Two
  Second feature description

  ### Feature Three
  Third feature description
```

**Stack layouts** - For vertical arrangements with consistent spacing:

```md
[.stack]
  ### Design
  Focus on systematic design

  ### Engineering
  Built for performance

  ### Content
  Pure content structure
```

These work because your CSS defines how `.grid` and `.stack` behave. Nuemark provides the structure. Your design system controls the presentation.

### Nested blocks

Blocks can nest inside each other:

```md
[.feature]
  ## Main Feature
  Feature description

  [.grid]
    ### Sub-feature A
    Description A

    ### Sub-feature B
    Description B
```

Generates:

```html
<div class="feature">
  <h2>Main Feature</h2>
  <p>Feature description</p>

  <div class="grid">
    <div>
      <h3>Sub-feature A</h3>
      <p>Description A</p>
    </div>
    <div>
      <h3>Sub-feature B</h3>
      <p>Description B</p>
    </div>
  </div>
</div>
```

## How structure maps to HTML
Content structure creates semantic HTML that your design system can style predictably:

**Sections** create `<section>` elements that group related content. Search engines and screen readers understand these boundaries.

**Blocks** create `<div>` elements with your chosen classes. The design system uses these classes to control layout, spacing, and visual style.

**Nested divs** create the structure needed for grid and stack layouts. Each nested div becomes a grid item or stack element.

The key principle: you define structure and meaning in Markdown. The design system defines presentation in CSS. They stay separate.


