
# Roadmap
Our next major steps:

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


## Deployments
Deploy your multi-site setup directly to cloud:

```sh
# Push all sites (only changed files)
nue push --all

→  app.acme.com   5 files    [220ms]
→  blog.acme.com  12 files   [200ms]
→  partners.com   8 files    [110ms]
```

Only the actual changes get **streamed** through one connection. Like everything else in Nue, deployments across multiple websites become almost instant. All `yoursite.nuejs.com` subdomains are free, with paid tiers starting at $2/month for custom domains later on.


## Templates
Create a professional website instantly from a template:

```sh
# Early-stage startup with Miesian design language
nue create mvp --design mies

# Full startup template with Ramsian principles
nue create startup --design rams

# Blog template with Muriel (Cooper) inspired design
nue create blog --design muriel
```

Templates work seamlessly with multi-site deployment:

```sh
# Push your new system
nue push --all
```

## Analytics application
We're building a complete analytics platform. Not a demo, not a prototype - a production application that handles millions of visitors.

**Multi-site tracking** - One dashboard for all your sites. Track acme.org, blog.acme.com, and app.acme.com separately while comparing metrics across your network. Privacy-friendly by design so no consent banners needed.

**Full-stack foundation** - Building analytics forces us to solve the hard problems every business application faces. Event sourcing for high-volume data. Aggregation for historical queries. Client-side processing of cacheable chunks. UI components for charts, customer dashboards, admin panels, and any data-heavy application.

**The ultimate stress test** - Analytics demands scale from day one. Millions of page views generate continuous event streams. Users expect instant visualizations across arbitrary time ranges. Aggregations need to handle months of historical data without sampling.

If the foundation works here, it works anywhere.


## More to come
We're building both frontend and backend ecosystems that grow together.

**Universal data model** - Authentication, user accounts, email notifications, mailing lists, payment processing, refunds. The fundamental operations every online business needs, built on the same foundation we develop for analytics.

**Local dev environment** - Generate realistic business scenarios from high-level parameters. A thousand customers with purchase histories. Email campaigns with open rates and conversions. Support tickets with resolution times. Develop against data that looks like production.

**SPA templates** - Pre-built admin interfaces for common business needs. Analytics dashboards, customer relationship management, mailing list administration, payment processing. Each template demonstrates the patterns while giving you a working starting point. Customize the design system, extend the data model, deploy immediately.


