# **Roadmap:** our next major steps

## Multi-site development
Build multiple websites from one shared system. Think of it like having a design system that works across different brands, but for everything - layouts, business logic, and data.

```
.
@shared/          # Global design system, components, logic
acme.org/         # Marketing site
app.acme.com/     # Web application
blog.acme.com/    # Company blog
partners.com/     # Partner portal
global.yaml       # Shared configuration
```

Develop all sites with global hot reloading:

```sh
nue dev --all

acme.org      → http://localhost:4000
app.acme.com  → http://localhost:4001
blog.acme.com → http://localhost:4002
partners.com  → http://localhost:4003
```

Edit a shared component and watch it update across all running sites. Change the global color scheme and see it cascade everywhere. Add a new API endpoint and it's available to all sites.



## Nue Edge
Deploy and manage your sites on a global CDN:

```sh
# Push all sites (only changed files)
nue push --all

→  app.acme.com   5 files    [220ms]
→  blog.acme.com  12 files   [200ms]
→  partners.com   8 files
```

Instead of rebuilding everything from scratch, only the actual changes get streamed through one connection. Like everything else in Nue, deployments across multiple websites become almost instant.

All `yoursite.nuejs.org` subdomains are free, with paid tiers starting at $2/month for custom domains. We want to bring back the joy and experimentation of Geocities to modern web development.


## Frontend-only development
Frontend-only development means building complete business applications without writing backend code. This is enabled with a universal backend that every application needs: team management, authentication, customer records, payment tracking:


**Core models** - Team (authentication and permissions), leads (mailing lists and conversions), emails (communication).

**Event sourcing** - All business data loads as immutable monthly chunks. Past months cached forever, current month updates via SSE.

**Multi-site** - Each site instance gets its own isolated dataspace. acme.org leads stay separate from blog.acme.com leads, while you still get shared access to all instances.

This minimal set enables content-focused sites with mailing lists and basic customer tracking. Perfect for bloggers, newsletters, and early-stage startups. See [frontend-only development](/docs/frontend-only-development) for the complete vision.


## Website templates
Create a professional website instantly with a template:

```sh
# Early-stage startup with Miesian design language
nue create early-stage --design mies

# Full startup template with Ramsian principles
nue create startup --design rams

# Blog template with Muriel (Cooper) inspired design
nue create blog --design muriel
```

Templates work seamlessly with Nue Edge:

```sh
# Push your new multi-site system
nue push --all
```

By this point, nuejs.org runs on BMaaS. Templates come with proven architecture, not theoretical concepts.


## Business model as a service
Frontend-only development is only possible when all models are implemented and businesses can fully forget backend development:

**Additional models** - Customers (user accounts), charges (payments), items (products/inventory), traffic (analytics)

**Complete revenue cycle** - Leads convert to customers, customers generate charges, charges create users

**Application templates** - SAAS starter, e-commerce, marketplace, learning platform. Each template uses the same universal backend with specialized frontend.


Business Model as a Service (BMaaS), global design systems, local expressions, instant deployment, and fair pricing. Nue changes the way you think about web development.