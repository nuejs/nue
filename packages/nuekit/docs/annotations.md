# Nue annotation system

The Nue framework uses a clean annotation system that gives developers precise control over how components are processed and rendered. Annotations are placed in HTML comments before components and determine everything from reactivity to asset processing.

## Core philosophy

Nue follows a standards-first approach, prioritizing semantic HTML over custom components. Instead of replacing `<button>` with `<Button>`, you enhance standard HTML elements with annotations when additional functionality is needed.

## File-level declarations

### HTML files

Files are processed based on their doctype declaration:

```html
<!-- Server layout module (default) -->
<header>...</header>

<!-- Generated static page -->
<!doctype html>
<html>...</html>

<!-- Reactive component -->
<!doctype dhtml>
<html>...</html>
```

### SVG files

SVG processing is controlled through XML declarations:

```xml
<!-- Standard SVG (copied as-is by default) -->
<svg>...</svg>

<!-- Interactive SVG for <object> embedding -->
<?xml version="1.0" standalone="no"?>
<svg>...</svg>
```

## Component-level annotations

Annotations are placed in HTML comments directly before the component they affect:

### @reactive

Compiles individual components into reactive JavaScript components:

```html
<div>
  <!-- @reactive -->
  <counter>0</counter>
  
  <p>This stays server-rendered</p>
</div>
```

### @interactive

Makes SVG components interactive and embeddable with `<object>`:

```html
<!-- @interactive -->
<svg>
  <script>/* interactive behaviors */</script>
  <circle onclick="handleClick()"/>
</svg>
```

### @isomorphic

Creates components that can render on both server and client:

```html
<!-- @isomorphic -->
<search-form>
  <input type="search" name="q">
  <button type="submit">Search</button>
</search-form>
```

## Asset processing

Directory-level configuration controls asset processing:

```yaml
# visuals/app.yaml
process_svg: true
```

When enabled, SVGs are processed according to their annotations and XML declarations.

## Complete ruleset

### HTML processing
- `*.html` (no doctype) → server layout modules
- `<!doctype html>` → generated static pages  
- `<!doctype dhtml>` → entire file compiled to reactive components
- `@reactive` → individual components compiled to reactive JS
- `@isomorphic` → components renderable on server and client

### SVG processing
- `app.yaml` / `process_svg: true` → enable SVG processing
- `<?xml version="1.0" standalone="no"?>` → entire file becomes interactive
- `@interactive` → individual components become interactive

### Special cases
- `index.html` + `<!doctype dhtml>` → SPA entry point with auto-mount

## Progressive enhancement

The annotation system enables powerful progressive enhancement patterns:

```html
<!doctype html>
<html>
  <body>
    <!-- Server-rendered for SEO and performance -->
    <header>
      <h1>My Site</h1>
      
      <!-- @reactive -->
      <nav-menu>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav-menu>
    </header>
    
    <main>
      <!-- @isomorphic -->
      <search-widget>
        <input type="search" placeholder="Search...">
      </search-widget>
      
      <article>
        <h2>Article Title</h2>
        <p>Server-rendered content...</p>
        
        <!-- @interactive -->
        <svg class="data-chart">
          <script>/* chart interactions */</script>
        </svg>
      </article>
    </main>
  </body>
</html>
```

This approach gives you:
- Fast initial page loads (server-rendered content)
- Interactive components where needed
- SEO-friendly markup
- Semantic HTML throughout
- Graceful degradation when JavaScript is disabled

## Benefits over React patterns

### Standards-first
- Use `<button>` instead of `<Button>`
- Semantic HTML over custom components
- No CSS-in-JS or utility class requirements

### Selective enhancement
- Only the parts that need reactivity become reactive
- Server rendering by default
- Smaller bundle sizes

### Mix and match
- Combine server, reactive, isomorphic, and interactive components in one file
- Each component uses the optimal rendering strategy
- HTML and SVG components work together seamlessly

The annotation system respects web standards while providing modern development capabilities, creating a framework that works with the web platform rather than against it.