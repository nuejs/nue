# Roadmap

Nue's development follows vision over schedules. Progress happens in bursts, and priorities shift when better approaches emerge. This roadmap reflects current direction, not firm commitments.

## Next: Templates & design systems

Professional templates for real-world use cases. Each template includes both a content site and a SPA for operations management.

### Template collection

**Personal blog** - Bloggin template with newsletter signup, members database and analytics. Yes: real analytics collected to Redis (local & global) + UI library optimized for data visualization.

**Early stage startup** - Like blog, but optimized for presenting an idea + capturing leads.

**Established startup** - Continuing from early stage, but with Stripe integration, and customer management.

Each template demonstrates Nue's full-stack capabilities. Static content sites paired with dynamic administrative interfaces.

 ### Design systems

Moving beyond the current brutalist foundation to sophisticated visual languages. Each system follows a different design philosophy:

**Miesian base system** - Perfect typography, mathematical color relationships, systematic whitespace usage. The foundation other systems build upon. 10 rules of good design from Dieter Rams applied.

**Derived expressions** (tentative):

- **Mies** - Content first. Bold minimalism.
- **Rams** - Usability first. Clean functionalism.
- **Zaha** - Dynamic, fluid.
- **Tadao** - Minimalism with stark contrast. Good for luxury feel.
- **Aalto** - Humanist, soft.

Each template can choose the right system trough create command:

```
nue create startup --design rams
```

### CSS validator

Automated analysis ensuring solid design system practices. Scans your CSS and flags violations:

- **HTML semantics** - Are you styling `<button>` or `.btn`?
- **Class naming** - Layout classes vs semantic elements
- **@layer usage** - Proper cascade management
- **Complexity metrics** - When your system becomes unmanageable

The validator enforces the principles that make design systems work. It's opinionated because good design needs constraints.


## Later: Deployments
Cloud hosting specifically built for Nue projects. The edge-first vision made real.


### True edge deployment
Submit forms that work. Administrative interfaces that persist data. Single-page apps with real backends. Everything you build locally works identically across 200+ global locations.

Auto-configuration handles the complexity. SPA routes work without setup. Pretty URLs happen automatically. Database schemas deploy with your code.

### Development to production
One command: `nue push`. Sub-100ms incremental deployments for all changes. HTML updates, CSS modifications, JavaScript additions - everything deploys instantly.


Follow progress on [GitHub](https://github.com/nuejs/nue) or join discussions on [Slack](https://join.slack.com/t/nuejs/shared_invite/zt-2wf8ozu5i-N2Y9PA_D17weIWuN2QPOqQ).

