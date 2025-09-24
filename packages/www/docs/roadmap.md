
# Roadmap


## Multi-site development
Build multiple websites from one shared system. Think of it like having a design system that works across different brands, but for everything - layouts, business logic, and data.

```
@base/           # Global design system, components, logic
acme.org/        # Marketing site. Inherits @base
app.acme.com/    # Web application
blog.acme.com/   # Company blog
partners.com/    # Partner portal
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

Nue Edge also brings the [edge first](edge-first) vision to life, so your local D1 and KV mocks work seamlessly in the cloud.

All `yoursite.nuejs.org` subdomains are free, with paid tiers starting at $2/month for custom domains. We want to bring back the joy and experimentation of Geocities to modern web development.


## Templates
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

Global systems, local expressions, instant deployment, and fair pricing.

Nue changes the way you think about web development.



