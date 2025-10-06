
# One data model
Nue leans on single data architecture that works the same way for all businesses.

> **Local development only**: This currently works as a local mockup for prototyping. Production deployments with CloudFlare integration come later in the [roadmap](roadmap).

## The problem
Your business data lives in different places. Customer info in Stripe. Leads in MailChimp. Traffic and events in Google Analytics. Users in Auth0. Support tickets somewhere else.

Every question needs multiple API calls. Every feature needs complex database queries. These systems don't talk to each other well. Every change needs migrations and new endpoints.

## The solution
Your entire business history is smaller than you think. A large company with 3,000 events per month over 10 years compresses to 6MB. That's smaller than a typical JavaScript bundle.

With brotli compression:

- Small business: 30 events/mo × 10 years = 60KB
- Medium business: 300 events/mo × 10 years = 600KB
- Large business: 3,000 events/mo × 10 years = 6MB

Load your entire history into browser memory. Query it at JavaScript speed. Three simple concepts replace your entire data stack:

### Events
Immutable history of everything that happened. Your source of truth.

### Records
Current state of things. Simple CRUD with automatic indexing.

### Aggregates
Pre-computed totals. Fast analytics without scanning.


## How it works

### Server side
Simple CRUD operations. Foreign keys automatically indexed.

```js
const order = orders.create({
  userId: user.id,
  total: 4900
})

const userOrders = orders.getAll({ userId: user.id })
```

No schemas. No migrations. No query optimization.


### Client side
Load your history once. Query however you want.

```js
// Calculate revenue
const revenue = events
  .filter(e => e.type == 'charge')
  .filter(e => e.ts >= lastMonth)
  .reduce((sum, e) => sum + e.amount, 0)

// Find top customers
const topCustomers = events
  .filter(e => e.type == 'purchase')
  .reduce((acc, e) => {
    acc[e.customerId] = (acc[e.customerId] || 0) + e.amount
    return acc
  }, {})
```

No API calls. No pagination. No loading states. Just JavaScript.


## What changes
Traditional approach: every question needs a database query, an API endpoint, and a loading spinner. A single packaged data model is loaded once and you can query it forever. Like a JavaScript array.

