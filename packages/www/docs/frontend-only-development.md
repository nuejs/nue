
# Frontend-only development

> **Note**: This concept requires that CloudFlare deployments and Business Model as a Service are both ready. See the [roadmap](roadmap) for details.

Frontend-only development means building complete business applications by focusing purely on user experience. No backend code, no database schemas, no API endpoints. Just HTML, CSS, and client-side business logic.

This becomes possible when two things align: a universal backend that handles all CRUD operations, and event sourcing that brings business data to the client.


## The backend problem
Developers spend 60% of their time on infrastructure. Setting up databases, writing API endpoints, handling authentication, managing deployments. The actual product - what users see and interact with - gets 40% of the effort.

This ratio is backwards. Backend infrastructure should be solved once, not rebuilt for every project.


## CRM is universal
90% of web applications are variations of the same pattern:

**Core models** - Team, leads, customers, charges, items, emails, traffic, media

**Revenue cycle** - Leads convert to customers, customers generate charges, charges create users

**Specialized contexts** - Items become products, courses, properties, or inventory depending on your business

A marketplace for vintage guitars needs the same backend as a project management tool or a membership site. The difference is entirely frontend: how you display data, what workflows you enable, how users interact with the system.


## Event sourcing changes everything
Traditional architectures require server round trips for every query. Filter customers by city? API call. Sort by revenue? Another call. Calculate conversion rates? Complex aggregation on the server.

Event sourcing flips this model. Business data loads to the client as immutable monthly chunks:

```
customers/2024-01.jsonl  (immutable, cached forever)
customers/2024-02.jsonl  (immutable, cached forever)
customers/2025-09.jsonl  (live, updates via SSE)
```

Past months never change. The browser caches them permanently. Only the current month remains live. At midnight, it freezes and joins the immutable archive.

For typical businesses, this means loading 1MB of data to get a complete view of operations. Faster than loading an empty React application.


## Client-side business logic
With all data in memory, complex operations become instant:

**Zero latency queries** - Filter 10,000 customers by any criteria without server round trips

**Real-time analytics** - Calculate conversion rates, revenue trends, customer lifetime value instantly

**Audit trails** - Every change is an immutable event, replay history at any point

The server becomes simple: serve static files and accept mutations. All intelligence moves to the client where it can operate without latency.


## Frontend becomes the product
When backend is solved, development focuses entirely on user experience:

**Designers build applications** - With design systems and templates, non-developers create functional products

**Real-time prototyping** - Show clients working software during the first meeting

**Rapid iteration** - Test business models in days instead of months

**Vertical specialization** - Build industry-specific solutions without backend complexity


Firebase revolutionized real-time features. Stripe solved payments. BMaaS solves the entire business application layer. When backend becomes a solved problem, web development transforms from full-stack complexity to pure frontend craft.

