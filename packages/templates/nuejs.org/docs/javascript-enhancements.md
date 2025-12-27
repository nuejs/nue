
# JavaScript enhancements
This document explains how to add global JavaScript to your design system in `@base`. This is JavaScript that runs across all inheriting sites - keyboard shortcuts, analytics, tooltip systems, or any behavior that needs to work everywhere.

Unlike [interactive features](adding-interactivity) this document covers:

**Global controllers** - JavaScript files in `@shared/lib/` that handle cross-cutting concerns like keyboard navigation or analytics

**External libraries** - How to include third-party code (d3, chart libraries, etc.) in your design system

**Include configuration** - How sites opt into these optional JavaScript features


## Global controllers
Some JavaScript needs to work across your entire application: keyboard shortcuts that work on every page, analytics modules that track user behavior globally, or tooltip systems that enhance any element. These cross-cutting concerns don't belong in individual components. They live in `@shared/lib/` as optional extensions that sites choose to include.

```javascript
// @shared/lib/keyboard.js
document.addEventListener('keydown', (evt) => {
  const { target, key } = evt

  if (key == 'Escape') {
    // close modals, clear forms
  }

  if (key == 'Tab') {
    // focus management
  }
})
```

Sites include these controllers explicitly in their configuration:

```yaml
# @base/site.yaml or acme.com/site.yaml
include: [ keyboard, analytics]
```

This makes controllers available to all inheriting sites when included in `@base/site.yaml`, or to specific sites when included in their own `site.yaml`.


### Controller organization
You can organize controllers however makes sense. Flat files work fine:

```
@base/@shared/lib/
├── keyboard.js
├── analytics.js
└── tooltips.js
```

Or group by category:

```
@base/@shared/lib/
└── ui/
    ├── keyboard.js
    ├── analytics.js
    └── tooltips.js
```

Include them the same way:

```yaml
include: [ui/keyboard, ui/analytics]
```


## External libraries
The modern web platform provides surprisingly complete functionality out of the box. Before reaching for a library, check if native APIs can handle your needs. When you do need external code, download minimal versions to `@shared/lib/` and configure them through `import_map`.

### Recommended structure
Download libraries to `@shared/lib/`:

```
@base/@shared/lib/
├── d3.js
└── utils.js
```

Configure imports in `site.yaml`:

```yaml
import_map:
  d3: /@shared/lib/d3.js
  utils: /@shared/lib/utils.js
```

Use in your JavaScript modules:

```javascript
import * as d3 from 'd3'
import { formatCurrency } from 'utils'
```


### External scripts
Non-module scripts like Google Analytics load through [layout modules](/docs/layout-modules):

```html
<!-- @shared/layout/head.html -->
<head>
  <script async src="https://www.googletagmanager.com/gtag/js"></script>
</head>
```

Or in the "bottom" slot for scripts that should load after page content.


