
# SVG development
Nue offers a focused development environment for developing SVG graphics. A programmatic alternative to design tools, for creating static and interactive visuals that integrate with your design system.

## Setting up
By default, SVG files are served directly without processing. Enable SVG processing at the directory level with `app.yaml`:

```yaml
# In visuals/app.yaml
svg:
  process: true
```

This tells Nue to process SVG files in the `visuals/` directory as templates rather than serving them as static assets.

## Dynamic SVG markup
Mix SVG elements with HTML and Nue's template syntax:

```xml
<!-- table.svg -->
<svg width="500" height="400">
  <!-- SVG elements -->
  <circle r="100" class="primary"/>

  <!-- Mixed HTML content -->
  <html>
    <table>
      <tr :each="user in users">
        <td>{ user.name }</td>
        <td>{ user.email }</td>
      </tr>
    </table>
  </html>
</svg>
```

**Dynamic syntax** - Use the full [HTML syntax](/docs/html-syntax) reference: loops, conditionals, expressions, and data binding.

**Data cascade** - Variables come from the same sources as HTML templates: parent YAML files, `@shared/data/`, and front matter.

**HTML embedding** - The `<html>` tag becomes a `<foreignObject>` automatically, letting you embed rich HTML content inside SVG graphics.

### Generated output
The above template generates clean, standalone SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 500 400"
     width="500" height="400">

  <circle r="100" class="primary"/>

  <foreignObject x="0" y="0" width="100%" height="100%">
    <table xmlns="http://www.w3.org/1999/xhtml">
      <tr><td>Alice Johnson</td><td>alice@example.com</td></tr>
      <tr><td>Bob Smith</td><td>bob@example.com</td></tr>
    </table>
  </foreignObject>
</svg>
```

**Automatic namespaces** - SVG and HTML namespaces are added automatically if missing.

**Auto viewBox** - When not specified, viewBox matches the width/height attributes.

**foreignObject wrapper** - HTML content gets wrapped with proper positioning and sizing.

## Styling and fonts
Embed your design system directly into SVG output for consistent, self-contained graphics.

### Design system integration
Include your CSS design system in SVG output:

```xml
<!--
  @include [base, graphics]
-->
<svg>
  <circle class="accent"/>
  <rect class="primary-bg"/>

  <html>
    <div class="card">
      <h3>Design system styles work here</h3>
    </div>
  </html>
</svg>
```

Your CSS design system styles both SVG elements and HTML content:

```css
/* In @shared/design/graphics.css */
.accent {
  fill: var(--accent-color);
  stroke: var(--border-color);
}

.primary-bg {
  fill: var(--primary-color);
}

.card {
  background: var(--surface-color);
  border-radius: var(--radius);
}
```

**Explicit inclusion** - Unlike HTML pages, SVG processing starts with no styles. Use `@include` to add what you need.

**Style embedding** - CSS gets embedded as `<style>` blocks with proper CDATA sections for SVG compatibility.

### Font embedding
Configure fonts at the directory level:

```yaml
# In visuals/app.yaml
svg:
  fonts:
    Inter: @shared/design/inter.woff2
    Mono: @shared/design/mono.woff2
```

Or customize per file with HTML comments:

```xml
<!--
  @fonts [Inter, Mono]
-->
<svg>
  <text font-family="Inter">Embedded font text</text>
</svg>
```

**Default behavior** - All configured fonts are embedded by default.

**Per-file control** - Use `@fonts false` to disable embedding, or `@fonts [Inter]` to include specific fonts only.



## Hot reloading
View SVG files with live updates during development:

```
http://localhost:4000/visuals/table.svg?hmr
```

The `?hmr` parameter generates an HTML wrapper that enables hot reloading:

- **CSS changes** - Styling updates instantly
- **SVG changes** - Graphics update without refresh
- **Data changes** - Template re-renders with new data


### Production output
Without the `?hmr` parameter, you get clean, standalone SVG that works anywhere:

```xml
<!-- Production SVG output -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400">
  <style><![CDATA[
    /* embedded design system styles */
    circle { fill: var(--brand-color); }
    .card { background: var(--surface-color); }
  ]]></style>
  <!-- embedded font definitions -->
  <!-- your dynamic content -->
</svg>
```

## Interactive visuals
For graphics that need user interaction, create SVG components instead of processed files.

### Component definition
Define interactive SVG in library files:

```html
<!-- In ui/graphics.html -->
<svg :is="interactive-chart" width="500" height="300">
  <rect :each="bar in data"
    :onclick="selectBar(bar)"
    class="bar { bar.selected ? 'selected' : '' }"
    width="{ bar.width }"
    height="{ bar.height }"/>

  <script>
    selectBar(bar) {
      this.data.forEach(b => b.selected = false)
      bar.selected = true
      this.update()
    }
  </script>
</svg>
```

Style with your design system:

```css
/* In @shared/design/graphics.css */
.bar {
  fill: var(--muted-color);
  transition: fill 0.2s;

  &.selected {
    fill: var(--primary-color);
  }

  &:hover {
    fill: var(--accent-color);
  }
}

```

### Usage in content
Use interactive components in Nuemark content:

```md
# Sales Dashboard

Here's our quarterly performance:

[interactive-chart]
  data:
    - width: 100
      height: 200
      label: Q1
    - width: 120
      height: 180
      label: Q2
```

Or in HTML templates:

```html
<main>
  <h1>Dashboard</h1>
  <interactive-chart :data="salesData"/>
</main>
```

## Use cases

### Static graphics
Perfect for generating charts, diagrams, and infographics that scale perfectly and integrate with your design system:

```xml
<!-- org-chart.svg -->
<svg width="800" height="600">
  <html>
    <div class="org-chart">
      <div :each="person in team" class="person-card">
        <h3>{ person.name }</h3>
        <p>{ person.role }</p>
      </div>
    </div>
  </html>
</svg>
```

### Dynamic visualizations
Create data-driven graphics that update based on your content:

```xml
<!-- progress-chart.svg -->
<svg width="400" height="200">
  <rect :each="project in projects"
    class="progress-bar { project.status }"
    width="{ project.completion * 300 }"
    height="30"
    y="{ $index * 40 }"/>
</svg>
```

Style with CSS:

```css
.progress-bar {
  fill: var(--muted-color);

  &.completed {
    fill: var(--success-color);
  }

  &.in-progress {
    fill: var(--warning-color);
  }
}
```

### Design system assets
Generate consistent icons and graphics that match your brand:

```xml
<!-- icon-set.svg -->
<svg width="100" height="100">
  <circle class="icon-bg"/>
  <path class="icon-fg" d="..."/>
</svg>
```

The same design tokens that style your HTML also style your graphics, ensuring complete visual consistency across your entire application.

