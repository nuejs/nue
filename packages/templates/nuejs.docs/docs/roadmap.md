
# Roadmap
Deployments tirst, then templates, then everything else.


## *Up next*: Multi-site deployments
Push all your sites to production with a single command:

```sh
nue push --all
→ @base            12 files   [220ms]
→ app.acme.com     5 files    [220ms]
→ blog.acme.com    7 files    [200ms]
→ partners.com     8 files    [110ms]
```

One command minifies assets, inlines CSS, uploads files, and purges CDN across all sites. Only changed files are pushed, so typo fixes take just seconds.

Compare this to traditional deployments where the same change means separate build pipelines, separate CI runs, and separate cache invalidations for each project.


## *Then*: World-class templates
Use a world-class template in your customer projects:

```sh
nue create blog --design rams
nue create agency --design aalto
nue create startup --design mies-dark
```

Get Apple/Linear-level design instantly without a design/engineering team.

These templates are backed by 25+ years of CSS and design system experience. They represent battle-tested patterns refined across hundreds of projects, now available as complete, production-ready systems you can deploy immediately.


## *Later*: Cloud infrastructure
The goal: a complete multi-site platform with the same minimalism and standards-first approach as the framework itself.

**Multi-site CRM** - Payments, contact forms, mailing lists, emailing. We're building this infrastructure for ourselves first, then exposing it. Starts as headless services with CLI access, then gets a proper admin UI.

**Multi-site analytics** - Lives alongside your CRM data. One dashboard for all your sites.

**E-commerce templates** - Full commerce platform with product catalogs, checkout, and order management. Same design system inheritance, same one-command deployment.

**SPA templates** - Complex single-page applications that integrate with your headless services while inheriting 90% from the base system. Build world-class apps for yourself or your customers.




## Get involved
The first three items - templates, deployments, and agentic development - are the priority. Everything after depends on how those land and what users need most.

**Want to follow progress?** Join the mailing list for updates when each piece ships:

[mailing-list]

**Want to build now?** The framework is production-ready. CSS professionals can start with `nue create multi-site` and build their own design systems while waiting for templates.
