
# Roadmap


## Multi-site deployments
Push all your sites to production with a single command:

```sh
nue push --all
→ @base            12 files   [220ms]
→ app.acme.com     5 files    [220ms]
→ blog.acme.com    7 files    [200ms]
→ partners.com     8 files    [110ms]
```

One command minifies, inlines critical CSS, uploads changed files, and purges CDN caches across all sites. For example; if you fix a typo in your shared design system you'd see the change live on three sites in seconds.

This is quite a different experience from traditional deployments, where the same change means separate build pipelines, separate CI runs, and separate cache invalidations for each project.


## World-class templates
Launch a new website with world-class design and your desired template type:

```sh
nue create blog --design rams
nue create agency --design aalto
nue create startup --design mies-dark
```

Get Apple/Linear-level design instantly without a design/engineering team.

These templates are backed by 25+ years of CSS and design system experience - as long as CSS has existed. They represent battle-tested patterns refined across hundreds of projects, now available as complete, production-ready systems you can deploy immediately.



## AI-assisted site generation
World-class templates and the global design system allow us to build the best AI-powered website generator:

**Single site:**
```bash
nue create "Documentation site about Rust. Generate front page
and 5 guides covering ownership, borrowing, lifetimes, smart
pointers, and concurrency"
```
→ Working site at `rust-docs.localhost:4000` in 30 seconds

**Multiple related sites:**
```bash
nue create "Three landing pages for our SaaS product: one for
developers, one for designers, and one for product managers.
Each highlights role-specific benefits"
```
→ Three sites, consistent design, tailored content

**Agency workflow:**
```bash
nue create "Portfolio sites for five clients: coffee shop,
yoga studio, law firm, dental practice, and boutique hotel.
Each gets appropriate personality"
```
→ Five production-ready sites from one command


With one-command deployments, the process of creating and launching a new website is almost like posting a tweet.


## What's next
After templates, deployments, and AI generation, the exact sequence depends on the situation at that point. But these are all coming since we're building them for our own website:

**Headless services** - Payments, contact forms, analytics. Each is a complete client/server app with management interface. CLI-first, then web UI.

**E-commerce templates** - Full commerce platform with product catalogs, checkout, and order management. Same design system inheritance, same one-command deployment.

**SPA templates** - Build complex SPAs that integrate with your headless services while inheriting 90% from the base system. Build world-class applications for your own use and for your customers.

Nue will be equally capable with apps as it is with websites. Here's a glimpse of what's already possible - a full app with complex state management:

[IMAGE + LINK]

The app is actually smaller than a single React/ShadCN button. There's also a [Rust/WASM version](link) handling 150k rows.



## Get involved
The first three items - templates, deployments, and agentic development - are the priority. Everything after depends on how those land and what users need most.

**Want to follow progress?** Join the mailing list for updates when each piece ships:

[mailing-list]

**Want to build now?** The framework is production-ready. CSS professionals can start with `nue create multi-site` and build their own design systems while waiting for templates.
