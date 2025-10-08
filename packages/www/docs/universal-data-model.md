
# Universal data model
Nue provides a single data architecture that works the same way for all online businesses.

> **Local development only**: This currently works as a local mockup for prototyping. Production deployments with CloudFlare integration come later in the [roadmap](roadmap).

## The problem
Every online business needs the same things: users, authentication, payments, subscriptions, analytics, email campaigns, support tickets. But each one requires a different service with its own API.

Stripe for payments. Auth0 for users. Mailchimp for email. Google Analytics for tracking. Intercom for support. Each service has its own data format, its own query language, its own way of doing things.

Want to see which customers from last month's email campaign made a purchase? You need to query Mailchimp, match email addresses in Stripe, cross-reference with your user database. Three APIs, three authentication methods, three different ways to filter and sort data.

Every feature becomes an integration project. Every question needs custom code to connect disparate systems.


## One model for everything
Future versions of Nue provide ready-made objects for everything an online business needs:

**Users and authentication** - Sign up, login, sessions, password resets. Works the same locally and on CloudFlare Workers.

**Payments and subscriptions** - Charges, refunds, recurring billing. Track revenue without external payment processors for development.

**Analytics and events** - Page views, conversions, custom events. Query your entire history at JavaScript speed.

**Email campaigns** - Subscribers, campaigns, open rates, conversions. Build mailing list features without third-party services.

**Customer relationships** - Contacts, notes, support tickets. CRM functionality built in.

The same API works everywhere. No environment variables. No switching between development mocks and production services. No integration complexity.


## How it works
During development, the model generates from JSON files in your project. For production, it connects to CloudFlare's edge infrastructure. The API stays identical:

```javascript
// Works in development and production, client and server
const { users, payments, events } = c.env

// Server-side: simple CRUD operations
const user = await users.get(id)
await users.update(id, { role: 'admin' })

// Client-side: query your data however you want
const revenue = events
  .filter(e => e.type == 'charge')
  .filter(e => e.ts >= lastMonth)
  .reduce((sum, e) => sum + e.amount, 0)
```

No schemas, nor query builders. Just JavaScript working with your data.


## Why this matters
Building the [analytics application](roadmap#analytics-application) requires solving the same problems every business application faces: authentication, data processing, aggregations, historical queries. By building analytics as a real product, we create the foundation that works for any business.

The SPA templates in the [roadmap](roadmap#more-to-come) (admin dashboards, CRM, mailing lists, payment processing) all build on this same model.

This is what makes Nue a complete foundation for building online businesses


