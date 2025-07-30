
# Nue's approach to modules

## What: Unbundled ES modules with import maps

Nue takes a different approach to JavaScript modules than mainstream frameworks. Instead of bundling everything into large JavaScript files, Nue keeps modules separate and uses native ES6 imports with import maps to resolve dependencies.

Every module in your application - whether it's your business logic, framework utilities, or external libraries - is loaded as an individual ES module. The browser's native module system handles loading, caching, and execution.

## Why: The bundling myth

The web development industry has normalized bundling as the "correct" way to handle JavaScript modules. This stems from limitations that no longer exist:

### Historical constraints (no longer relevant)
- **HTTP/1.1** made multiple requests expensive
- **No native module support** in browsers required custom loaders
- **Unreliable CDNs** made local bundling safer

### Modern reality
- **HTTP/2** makes parallel requests efficient
- **ES modules** are supported in all modern browsers
- **Import maps** provide clean dependency resolution
- **Reliable CDNs** and edge networks are standard

### The bundling cost

Bundling creates problems that we've accepted as normal:

**Slower development**: Every change requires rebuilding the entire bundle. Hot reloading becomes complex and slow.

**Worse caching**: Change one line and users must re-download the entire bundle, even if they already have 99% of the code cached.

**Artificial complexity**: Build tools, transpilers, and bundlers add layers of abstraction between you and web standards.

**Megabyte login pages**: Simple pages become JavaScript applications because the framework is bundled with every interaction.

## Nue's approach to bundling

Nue takes a minimal, purposeful approach to processing JavaScript modules:

### TypeScript conversion
TypeScript files are converted to JavaScript using Bun, but remain as separate modules:

```
src/model/user.ts    →    .dist/model/user.js
src/utils/dates.ts   →    .dist/utils/dates.js
```

No bundling occurs - each TypeScript file becomes a corresponding JavaScript file.

### JavaScript copying
JavaScript files are copied as-is to the `.dist` directory with no transformation:

```
src/model/api.js     →    .dist/model/api.js
src/utils/format.js  →    .dist/utils/format.js
```

What you write is what runs. No build step, no abstraction layer, no debugging complexity.

### Production minification
In production, files are minified individually using Bun:

```
.dist/model/user.js     →    .dist/model/user.min.js (smaller)
.dist/utils/dates.js    →    .dist/utils/dates.min.js (smaller)
```

Each module gets individually optimized but stays separate. You get file size benefits without losing granular caching.

### Why this works better

**Minification ≠ bundling.** You can make files smaller without combining them into monoliths.

- **Development**: Zero build step for JavaScript, instant feedback
- **Production**: Smaller files with granular caching still intact
- **Debugging**: Even in production, trace issues to specific modules
- **Browser-friendly**: HTTP/2 handles multiple small files efficiently

## How: Import maps and module separation

Nue uses import maps to create clean, declarative dependency management:

```html
<script type="importmap">
{
  "imports": {
    "nue": "/@system/nue/index.js",
    "model": "/@system/model/index.js", 
    "d3": "/@system/lib/d3.js"
  }
}
</script>
```

Then your code imports naturally:

```javascript
import { createApp } from 'nue'
import { model } from 'model'
import * as d3 from 'd3'
```

### Module organization

```
/@system/
  nue/           # Framework utilities
  model/         # Business logic
  lib/           # External libraries
    d3.js
    charts.js
```

### Configuration in site.yaml

```yaml
imports:
  model: /@system/model/index.js
  d3: /@system/lib/d3.js
  charts: /@system/lib/charts.js
  # Or load directly from CDN
  lodash: https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
  moment: https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
```

## Benefits in practice

### Development speed
- **10-50ms** content updates
- **5-20ms** style changes  
- **20-100ms** component modifications

No build step means changes appear instantly.

### Better caching
When you change your business logic, users don't re-download the entire framework. Only the changed module is fetched, while everything else remains cached.

### Natural code splitting
Load what you need, when you need it:

```javascript
// Load chart library only when needed
async showChart() {
  const { createChart } = await import('charts')
  createChart(this.data)
}
```

### Transparent CDN loading
Import maps provide a clean abstraction over where modules are loaded from. Your code remains the same whether dependencies come from your server or global CDNs:

```javascript
import _ from 'lodash'          // Could be local or CDN
import moment from 'moment'    // Client doesn't know or care
```

The import map handles the resolution transparently. This means you can:
- Load unlimited external libraries from CDNs like cdnjs.cloudflare.com
- Switch between local and CDN versions without code changes
- Mix and match sources based on performance needs
- Let users benefit from shared CDN caching across websites

### Simplified debugging
No source maps needed. The code in your browser is the code you wrote.

### Smaller initial payloads
A login page loads only login logic, not your entire application framework.

## The architecture advantage

This approach reinforces Nue's MVC architecture:

- **Model**: Business logic as ES modules
- **View**: Nue templates importing what they need
- **Controller**: Event handling and state management

Everything flows through the same import system. Your business model, framework utilities, and external libraries are all treated equally by the browser's native module system.

## Future tooling

While manual dependency management works today, Nue will add convenience tools:

```bash
nue install d3
# Fetches d3.js to /@system/lib/
# Updates import map automatically
```

But the foundation remains the same: individual modules loaded by the browser's native ES module system.

## Getting started

1. Configure your import map in site.yaml
2. Organize modules in /@system/
3. Import naturally with ES6 syntax
4. Experience the development speed difference

The controversial feeling of "no bundling" fades quickly when you experience 10ms hot reloads and see your users loading only what they need.

This isn't a limitation of Nue - it's the web platform working as designed.