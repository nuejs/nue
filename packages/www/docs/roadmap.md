
# **Roadmap:** our next major steps

## Multi-site development
Build multiple websites from one shared system.

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
Deploy your multi-site setup to CloudFlare CDN:

```sh
# Push all sites (only changed files)
nue push --all

→  app.acme.com   5 files    [220ms]
→  blog.acme.com  12 files   [200ms]
→  partners.com   8 files    [110ms]
```

Instead of rebuilding everything from scratch, only the actual changes get **streamed** through one connection. Like everything else in Nue, deployments across multiple websites become almost instant.

All `yoursite.nuejs.org` subdomains are free, with paid tiers starting at $2/month for custom domains.


## One data model (Basics)
One data architecture that works for any online business.

**Basic CRM models** - Users (authentication and permissions), leads (mailing lists and conversions), emails (communication).

**Event sourcing** - Load event data as cacheable chunks for client-side processing.

**Multi-site isolation** - Each site gets its own models. acme.org leads stay separate from blog.acme.com leads, while you still get shared access to all instances.

This minimal set enables content sites with mailing lists and basic customer tracking. Perfect for bloggers, newsletters, and early-stage startups.

See [one data model](one-data-model) for details.



## Website templates
Create a professional website instantly with a template:

```sh
# Early-stage startup with Miesian design language
nue create mvp --design mies

# Full startup template with Ramsian principles
nue create startup --design rams

# Blog template with Muriel (Cooper) inspired design
nue create blog --design muriel
```

Templates deploy seamlessly:

```sh
# Push your new multi-site system
nue push --all
```


## One data model (Completed)
Complete the rest of the models and functionality:

**All models** - Customers (user accounts), charges (payments) and collections (products, issues, .. any item type)

**Analytics** - Aggregation model for website traffic. Combines with event data to provide insights across your entire history.

**Event streaming** - Live streaming of key events to all active admin interfaces.

This completes the singuar backend, enabling full business applications with real-time analytics and customer management.


## Admin interfaces
Complete admin products built on the one data model. Works with any design system and matches your public interface.

**Frontend framework** - UI components, data models, and design systems working seamlessly together.

**Data mocking** - Generate realistic business data from high-level parameters. Develop against believable scenarios, not random noise.

**Admin templates** - Analytics dashboards, mailing list management, customer relations, and communication tools. Ready to customize for your business.




