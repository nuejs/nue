
# JavaScript enhancements
Content-driven websites uses (optional) JavaScript for global behavior

## UI controllers
Some JavaScript needs to work across your entire application: keyboard shortcuts that work on every page, analytics modules that track user behavior globally, or tooltip systems that enhance any element. These cross-cutting concerns don't belong in individual components. Instead, they need their own space as global controllers that run once and manage application-wide behavior.

```javascript
// @shared/ui/keyboard.js
document.addEventListener('keydown', (evt) => {
  const { target, key } = evt

  if (key == 'Escape') {
    // Close modals, clear forms
  }

  if (key == 'Tab') {
    // Focus management
  }
})
```

Place controllers in `@shared/ui/` where they automatically load on every page. They run globally across your entire application.

### Controller responsibilities:

**Global behavior** - Handle interactions that span multiple pages and components.

**Logic decoupling** - Components stay focused on structure while controllers handle cross-cutting concerns.

**Centralized management** - All global JavaScript lives in one place, making it easy to maintain and debug.


## External libraries
The modern web platform provides surprisingly complete functionality out of the box. Before reaching for a library, check if native APIs can handle your needs. When you do need external code, simply place it to your system's library folder and avoid the dependency chaos that plagues many projects.

### Recommended structure
Download minimal versions to `@shared/lib/`:

```yaml
import_map:
  d3: /@shared/lib/d3.js
  utils: /@shared/lib/utils.js
```

Use on your JS modules:

```javascript
import * as d3 from 'd3'
import { formatCurrency } from 'utils'
```

### External scripts
Non-module scripts like Google Analytics load through [layout modules](/docs/layout-system):

```html
<!-- In layout.html -->
<head>
  <script async src="https://www.googletagmanager.com/gtag/js"></script>
</head>
```

Or in the "bottom" slot for scripts that should load after page content.




