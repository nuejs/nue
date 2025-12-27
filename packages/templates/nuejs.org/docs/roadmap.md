
# Roadmap


## Webiste templates with world-class design
Launch with three production-ready design systems, each demonstrated
across 6 site types (startup, blog, docs, agency, personal profile):

```sh
nue create agency --design massimo
nue create startup --design mies
nue create blog --design rams
```

## Hosting and deployments
Push all your sites to production with a single command:

Add image/video (already using internally)

```sh
# Push all sites (only changed files)
nue push --all
→ app.acme.com    5 files   [220ms]
→ blog.acme.com   12 files  [200ms]
→ partners.com    8 files   [110ms]
```

Subdomains yoursite.nuejs.com are free, hosting with custom domains starts at $2.


## Agentic development
Our goal is to make Nue the best framework for agentic development. This includes two things:

1. **Global design system**: We want to design system development to be accessible to everyone, not just CSS professionals. We'll show how Claude Code helps build production-grade design systems even without deep CSS knowledge.

2. **Content at scale**: GDS makes Nue the best platform for AI-assisted content development. When presentation is completely taken care of by the system, AI can focus purely on content.

What used to require design reviews and engineering handoffs becomes: generate content, publish sites.


## Headless services
payments.
Contacts, analytics. Simple APIs that work with file-based content.


## Single-page apps
With same design system inheritance, same content-first philosophy.

SPAs are possible. Here's a complex app built with Nuestate and a design system:

[IMAGE + LINK]

What's remarkable is that this app is smaller than a single React/ShadCN button.

There's more. Here's a Rust/WASM version handling 150k rows in memory:

[RUST VERSION]

What you see here is a glimpse of what's coming after we perfect websites. The goal is to make SPA development mimic the website development flow and optimize it for AI generators - which would operate purely with YAML while the design system takes care of the rest.







