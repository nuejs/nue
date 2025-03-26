
# The model layer
In Nue, SPA development starts from your business- and data model. This ensures your interface grows from your model’s capabilities, keeping your app simple and purposeful.


## Structuring the model
Keep the model layer separate in its own directory:

```
app/
├── model/              # Your model layer
│   ├── index.js        # Public model API
│   ├── customers.js    # Customer operations
│   └── deals.js        # Deal logic
└── view/               # UI components
```

The `index.js` file defines a public API:

```js
// app/model/index.js
import { customers } from './customers'
import { deals } from './deals'

export { customers, deals }
```

Internal files hide details:

```js
// app/model/customers.js
function enrichCustomerData(customer) {
  return {
    ...customer,
    lifetimeValue: calculateRevenue(customer.purchases)
  }
}

export const customers = {
  async find(filters) {
    const results = await db.customers.find(filters)
    return results.map(enrichCustomerData)
  }
}
```

This encapsulates complexity and simplifies interfaces. For small apps, start with one `index.js`, then refactor into modules as needed—keeping the API stable.


## Core operations
The model provides a clean API for key tasks:

```js
export const model = {
  async login(email, password) {
    const session = await authenticateUser(email, password)
    storeSession(session)
    model.emit('login', session.user)
  },

  async get(id) {
    if (isCached(id)) return getFromCache(id)
    const data = await fetchFromAPI(id)
    const item = transformForDisplay(data)
    addToCache(id, item)
    return item
  },

  search(query) {
    const results = await fetchSearch(query)
    return results.map(r => ({
      ...r,
      country: convertCodeToCountryName(r.countryCode)
    }))
  },

  on(event, callback) {
    addListener(event, callback)
    return () => removeListener(event, callback)
  },

  emit(event, data) {
    notifyListeners(event, data)
  }
}
```

This handles authentication, data fetching with caching, and events. Transformations (e.g., codes to names) prep data for views, keeping presentation logic out of the UI.

## Domain-specific operations
Your model defines unique business logic, like:

- **CRM**: Lead scoring, customer segmentation.
- **E-commerce**: Inventory management, pricing optimization.
- **Analytics**: Time-series analysis, anomaly detection.

These operations evolve independently, driving your app’s value without UI friction.

## Rust and WASM
For high-performance needs, Rust and WebAssembly enhance the model. Our demo (mpa.nuejs.org) loads 10,000+ records, making searches instant. Rust excels with:

- Native speed and no GC pauses.
- True type safety beyond TypeScript.
- Compact WASM bundles via `wasm-bindgen`.

Example Rust API:

```rust
#[wasm_bindgen]
pub struct Model {
  events: Vec<String>,
}

#[wasm_bindgen]
impl Model {
  pub fn search(&self, query: String) -> String {
    let matches = self.events.iter()
      .filter(|e| e.contains(&query))
      .collect::<Vec<_>>();
    serde_json::to_string(&matches).unwrap()
  }
}
```

JS integration:

```js
import init, { Model } from './engine'
await init()
const engine = new Model()

export const model = {
  search(query) {
    const data = JSON.parse(engine.search(query))
    return data.map(el => hilite(query, el))
  }
}
```

Rust handles computation; JS keeps the API clean. Use types at boundaries for safety, flex internally.



### Event sourcing
Typically, web apps fetch data on demand via REST or GraphQL, but event sourcing flips this: it loads all relevant data into memory upfront, treating it as a sequence of immutable events. Combined with Rust and WebAssembly, this makes operations like searches and filters instant—no server roundtrips after the initial load. Our demo (mpa.nuejs.org) shows this with 10,000+ records, cached immutably via HTTP, enabling real-time responsiveness.

This pattern shines in SPAs like:
- **CRM**: Rebuild customer profiles from interaction events.
- **Messaging**: Support local search and offline access with message events.

JavaScript struggles with thousands of records, but Rust manages tens of thousands efficiently. Nue's extremely light footprint leaves more memory for this data-driven approach, making it a practical choice for ambitious applications.

