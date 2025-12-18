
# Roadmap

## Design systems
Launch with three production-ready design systems, each demonstrated
across 6 site types (startup, blog, docs, agency, personal profile):

```sh
nue create startup --design mies
nue create blog --design rams
nue create docs --design massimo
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


## Later
Depending on the situation:

**AI generator** - Generate sites that understand your design system. Content + structure in natural language, design handled automatically.

**Headless services** - Contacts, analytics, and payments. Simple APIs that work with file-based content.

**Single-page apps** - Functional tools like CRM built on the services. Same design system inheritance, same content-first philosophy.