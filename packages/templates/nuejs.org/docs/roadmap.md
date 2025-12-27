
# Roadmap

## World-class templates
Launch a new website with world-class design and your desired template type:

```sh
nue create agency --design massimo
nue create startup --design inter
nue create blog --design aalto
```

Get Apple/Linear-level design instantly. No design team required.


## Hosting and deployments
Push all your sites to production with a single command:

```sh
# Push all sites (only changed files)
nue push --all
→ app.acme.com    5 files   [220ms]
→ blog.acme.com   12 files  [200ms]
→ partners.com    8 files   [110ms]
```

Subdomains at yoursite.nuejs.com will be free. Custom domain hosting start at $2/month.


## Agentic development
Make Nue the best framework for AI-assisted development:

**Global design system for everyone** - Show how Claude Code helps build production-grade design systems even without deep CSS knowledge. Design system development becomes accessible, not just for CSS professionals.

**Content at scale** - When presentation is handled by the system, AI focuses purely on content. What used to require design reviews and engineering handoffs becomes: generate content, publish sites.


## What's next
After templates, deployments, and AI content, the exact sequence depends on what ships first. But these are all coming since we're building them on nuejs.org:

**Headless services** - Payments, contact forms, analytics. Each is a complete client/server app with management interface. CLI-first, then web UI.

**E-commerce templates** - Full commerce platform with product catalogs, checkout, and order management. Same design system inheritance, same one-command deployment.

**Single-page applications** - Build complex SPAs that integrate to your headless services and by inheriting 90% from the base system. The result is a world-class application that you can use your own or use as basis for your customers-apps.

Nue will be equally capable with apps as it is with websites: here's a glimplse of what's coming. A full app with complex state management:

[IMAGE + LINK]

The app is actually smaller than a single React/ShadCN button. There's also a [Rust/WASM version](link) handling 150k rows.


## Get involved
The first three items - templates, deployments, and agentic development - are the priority. Everything after depends on how those land and what users need most.

**Want to follow progress?** Join the mailing list for updates when each piece ships:

[mailing-list]

**Want to build now?** The framework is production-ready. CSS professionals can start with `nue create multi-site` and build their own design systems while waiting for templates.
