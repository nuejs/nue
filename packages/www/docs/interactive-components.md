
# Interactive components
Interactive components add dynamic behavior to your pages. Small, focused components like forms, dialogs, or image galleries that work alongside your content and layouts.

## Creating components

Components live in `.html` files using Nue's template syntax. Mark them with the `:is` attribute:

```html
<form :is="newsletter-form" :onsubmit="submit" autocomplete="on">
  <label>
    <span>Your name</span>
    <input type="text" name="name" placeholder="John Doe" required>
  </label>

  <label>
    <span>Your email</span>
    <input type="email" name="email" placeholder="your@email.com" required>
  </label>

  <button>Submit</button>

  <script>
    async submit(e) {
      const data = Object.fromEntries(new FormData(e.target))
      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      location.href = '/thanks'
    }
  </script>
</form>
```

The component starts as server-rendered HTML. When the browser loads it, a 2.5KB runtime makes it interactive. The `:onsubmit` handler prevents the default form submission and runs your custom logic instead.

 ## Using components

Drop components into content or layouts wherever you need interaction.

### In content

Add components to Markdown files:

```md
### Join our newsletter

Get updates on new releases.

[newsletter-form]
```

Nue replaces the tag with rendered HTML. Content writers use simple tags without touching code.

### In layouts

Embed components in layout modules:

```html
<footer>
  <h3>Stay updated</h3>
  <p>Get our latest news delivered to your inbox</p>
  <newsletter-form/>
</footer>
```

The component slots into static structure, adding interaction where needed.

## Component libraries

Components are discovered automatically based on file location:

```
@system/ui/          # Global components (all pages)
blog/ui/             # Blog-specific components
app/components.html  # App area components
```

Put multiple components in one file or separate them - Nue finds them either way:

```html
<!-- In @system/ui/forms.html -->
<form :is="newsletter-form">
  ...
</form>

<form :is="contact-form">
  ...
</form>
```

See [Project structure](/docs/project-structure) for details on organizing larger applications.

## Template data

Components receive data from multiple sources that cascade together:

```html
<form :is="newsletter-form">
  <h3>{ newsletter_title }</h3>
  <p>{ site_name } newsletter</p>
  <button>{ cta || 'Submit' }</button>
</form>
```

Data flows from YAML files, page front matter, and collections. The component above might use:

- `newsletter_title` from `site.yaml`
- `site_name` from global configuration
- `cta` from page front matter

Pass page-specific data through attributes:

```md
---
cta: "Subscribe now"
---

[newsletter-form]
```

Components also access collections and parsed content structure like headings. See [Template data](/docs/template-data) for complete details on data sources and precedence.

