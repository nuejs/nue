
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




## Later
Depending on the situation:

**Single-page apps** - Functional tools like CRM built on the services. Same design system inheritance, same content-first philosophy.

**AI generator** - Generate sites that understand your design system. Content + structure in natural language, design handled automatically.

**Headless services** - Contacts, analytics, and payments. Simple APIs that work with file-based content.
