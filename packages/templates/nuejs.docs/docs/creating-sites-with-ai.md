
# Creating sites with AI
This guide shows you how to use AI to generate content for your sites. Nue's separation of concerns makes this particularly effective: AI only reasons about content while the design system handles presentation. The workflow scales from single pages to entire site networks.


## Copy a template
Start with a template that matches your desired look. For example:

```sh
cp -r templates/startup clients/acme.com
```

You now have a complete site structure. Pages, layouts, design system - all ready. The content is placeholder text waiting to be replaced.

Open `acme.com.localhost:4000` and see AI at work in real time.


## Write specs
Create a specs directory with everything AI needs to know about this particular project. For example:

```
specs/acme/
├── product.md     # what it is, key features, differentiators:
├── audience.md    # for who the content should be tailored
└── tone.md        # how you speak
```

You can reuse these filess across every site and landing page for this client.


## Plan
Before generating content, ask AI to show its plan:

```sh
cd clients/acme.com

claude --plan "Rewrite all content in clients/acme.com using the specs in specs/acme/"
```

Review what comes back:

- Does it understand the product correctly?
- Is it mapping content to the right pages?
- Does the planned tone match your specs?

If something's off, adjust your specs and re-run. Catching problems here saves regenerating everything later.


## Generate
Once the plan looks right, let it execute:

```sh
claude "Rewrite all content in clients/acme.com using the specs in specs/acme/"
```

AI rewrites the markdown files while preserving the template structure. Headlines, body copy, feature descriptions, CTAs are all generated in one pass.

Nue HMR shows changes as they happen.


## Other uses
The pattern stays the same: templates define the structure, specs define the substance, AI does the transformation. The same workflow can be used for:

**Bulk content generation** populate an entire blog with AI-written posts based on topic outlines

**Localization** generate translated versions of your site while preserving structure

**A/B variations** create multiple landing page variants for testing

**Client migrations** rewrite an existing site's content to match new brand guidelines

**Template previews** fill templates with realistic content instead of lorem ipsum




