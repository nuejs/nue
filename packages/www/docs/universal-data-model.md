# Universal data model
Universal data model is one data architecture that works for any online business.

> **Local development only**: This currently works as a local mockup for prototyping. Production deployments with CloudFlare integration come later in the [roadmap](roadmap).


## The problem
Business software is overengineered. Every project starts with:

- Database setup and schema design
- ORM configuration and migrations
- API endpoints for every query
- Pagination logic and loading states
- Query optimization and indexing
- Separate analytics databases
- Client-side state management

Developers spend weeks building infrastructure before writing business logic. Then more weeks optimizing queries that shouldn't exist.

## The insight
The key event data for online businesses is unexpectedly small. A large company with 3,000 events per month over 10 years compresses to 6MB. That's smaller than a typical JavaScript bundle.

With brotli compression:

- Small business: 30 events/mo × 10 years = 60KB
- Medium business: 300 events/mo × 10 years = 600KB
- Large business: 3,000 events/mo × 10 years = 6MB

You can load your entire business history into browser memory and query it at JavaScript speed.

## Three concepts

Three simple concepts replace traditional databases:

### Events
Immutable history of everything that happened. The queryable source of truth.

### Records
Current state of entities. Simple CRUD with automatic indexing.

### Aggregates
Pre-computed totals for analytics. Fast reads without scanning.

## Server-side patterns

```js
const orders = records('orders')

// Use in routes
const order = orders.create({
  userId: user.id,
  total: 4900
})

const userOrders = orders.getAll({ userId: user.id })
```

Properties ending with `Id` are automatically indexed. No manual setup, or query optimization.

## Client-side queries

```js
// Load entire history into cache
GET /data/events/chunk-2
GET /data/events/chunk-1
GET /data/events/chunk-0

// Query with JavaScript
const revenue = events
  .filter(e => e.type == 'charge')
  .filter(e => e.ts >= lastMonth)
  .reduce((sum, e) => sum + e.amount, 0)

const topCustomers = events
  .filter(e => e.type == 'purchase')
  .reduce((acc, e) => {
    acc[e.customerId] = (acc[e.customerId] || 0) + e.amount
    return acc
  }, {})
```

No API calls, server-side pagination, nor loading spinners. Just functions over arrays.


## The paradigm shift

### Traditional approach

```
Database → Query → API → Paginate → Client → Render
```

Every question requires a database query, API endpoint, and loading state. Changing how you calculate metrics means database migrations and API updates.

### Universal data model

```
Events (cached) → JavaScript → Render
```

Load history once, query however you want. Change analytics by updating JavaScript functions. No backend changes.
