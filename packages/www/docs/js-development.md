
# JavaScript development
Nue treats JavaScript as a supporting layer, not the foundation. While other frameworks put everything in JavaScript, Nue uses JS only where needed: business logic for SPAs, global controllers for cross-component behavior, and minimal external libraries. This creates cleaner architectures that are easier to test and maintain.

## Business model for SPAs
Your application's core logic should live independently of any UI framework. This is essential for testing, scaling, and future-proofing your code with clean standards-first architecture. When business logic stays separate from components, you can unit test without mounting DOM elements, migrate between frameworks without rewriting core functionality, and even replace JavaScript entirely for performance-critical applications.


### Small apps
For simple SPAs, use a single model file:

```javascript
// @system/app.js
export async function login(email, password) {
  const ret = await post('/api/login', { email, password })
  localStorage.$sid = ret.sessionId
}

export async function getUsers() {
  return await get('/api/users')
}
```

### Larger apps
Scale with separate modules for different domains:

```
@system/
├── app/
│   ├── index.js          # Main app exports
│   ├── users.js          # User operations
│   ├── payments.js       # Payment processing
│   └── analytics.js      # Analytics tracking
└── test/
    ├── users.test.js     # Unit tests
    ├── payments.test.js
    └── analytics.test.js
```

Configure imports in `site.yaml`:

```yaml
import_map:
  app: /@system/app/index.js
```

Use the model in your UI components, pages, and SPA entry points:

```javascript
import { login, getUsers } from 'app'
```


### Benefits of isolated models
**Scalability** - Business logic scales independently. No framework bloat or component concerns mixed in.

**Testability** - Pure functions with no UI dependencies. Easy to unit test without mounting components.

**Future-proof** - Your model works with any UI layer. Migrate from React to Vue to vanilla JavaScript (Nue) without rewriting core logic.

**WASM** - For truly ambitious applications, enhance JavaScript with Rust or Go like Figma and Notion do. The isolated architecture enables this transition.


## UI controllers
Some JavaScript needs to work across your entire application - keyboard shortcuts that work on every page, analytics modules that track user behavior globally, or tooltip systems that enhance any element. These cross-cutting concerns don't belong in individual components. Instead, they need their own space as global controllers that run once and manage application-wide behavior.

```javascript
// @system/ui/keyboard.js
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

Place controllers in `@system/ui/` where they automatically load on every page. They run globally across your entire application.

### Benefits of controllers
**Global behavior** - Handle interactions that span multiple pages and components.

**Logic decoupling** - Components stay focused on structure while controllers handle cross-cutting concerns.

**Centralized management** - All global JavaScript lives in one place, making it easy to maintain and debug.


## External libraries
The modern web platform provides surprisingly complete functionality out of the box. Before reaching for a library, check if native APIs can handle your needs. When you do need external code, simply place it to your system's library folder and avoid the dependency chaos that plagues many projects.

### Recommended structure
Download minimal versions to `@system/lib/`:

```yaml
import_map:
  d3: /@system/lib/d3.js
  utils: /@system/lib/utils.js
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