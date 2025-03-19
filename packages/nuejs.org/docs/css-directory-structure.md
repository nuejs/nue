
# Directory structure
The directory structure defines how you organize CSS files—and other assets—based on your application’s needs. It separates content, styles, and scripts into clear roles, making sites predictable and maintainable. Pairing folders with cascade layers builds a system that scales effortlessly, leveraging Nue’s automatic asset handling.

### Small applications
For small apps, a flat structure keeps everything simple yet organized:
```
app/
├── index.md          # Main content
├── settings.css      /* @layer settings */
├── components.css    /* @layer components */
├── containers.css    /* @layer containers */
└── utilities.css     /* @layer utilities */
```

In `components.css`:

```css
@layer components {
  .card {
    border-radius: 0.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```
Layers set a clear override order (settings < components < containers < utilities), keeping styles predictable without nested complexity.

### Medium applications
As apps grow, a single components file gets unwieldy. Split components into a folder while keeping other layers flat:
```
app/
├── index.md
├── settings.css
├── components/        # Component-specific files
│   ├── card.css
│   ├── navigation.css
│   └── forms.css
├── containers.css
└── utilities.css
```
Each component file still uses `@layer components`, but the split avoids clutter, making it easier to find and edit styles without scrolling through a massive file.

### Large applications
Big, multi-page projects need distinct scopes: global styles, reusable components, and app-specific tweaks. A structured directory delivers:
```
website/
├── @global/           # Shared foundations
│   ├── settings.css   /* @layer settings */
│   ├── components/    /* @layer components */
│   ├── containers.css /* @layer containers */
│   └── utilities.css  /* @layer utilities */
├── @components/       # Reusable library
│   ├── card.css
│   ├── pills.css
│   ├── button.css
│   └── form-inputs.css
├── blog/              # Blog app
│   ├── blog.yaml     # Config
│   ├── settings.css  # Blog-specific vars
│   ├── components/   # Blog-specific styles
│   └── containers.css
└── app/               # Admin app
    ├── admin.yaml    # Config
    ├── settings.css
    ├── components/
    └── containers.css
```
This separates global (site-wide foundations), library (reusable assets), and app-specific styles (scoped to blog or admin), reducing conflicts and clarifying intent.


## Globals and library directories
Nue uses special directories to manage shared assets. Define them in `site.yaml`:
```yaml
globals: ["@global"]    # Site-wide assets
libs: ["@components"]   # Reusable library
```
- **Globals**: Files in `@global` (e.g., `settings.css`) load on every page, setting up your design system—think base variables, typography, or resets.
- **Libraries**: Files in `@components` (e.g., `button.css`) are included explicitly via `include` statements (see below), keeping reusable pieces modular.
This setup, paired with layers, ensures a consistent cascade across all pages or apps.


### Stylesheet inclusion
Nue auto-includes CSS based on location:
1. **Root-level CSS**: Hits the front page and root pages (e.g., `index.md`).
2. **App directory CSS**: Applies to all pages in that app (e.g., `blog/settings.css`).
3. **Page-level CSS**: Targets specific pages (e.g., `blog/post1/styles.css`).
For precision, use YAML:
```yaml
# blog.yaml
include: [card, button]  # Pulls @components/card.css, etc.
```
This loads matching library assets across the app, keeping inclusion effortless and tied to your structure.

## Areas
Style specific areas in a multi-page app with scoped directories.

### For a blog
```
blog/
├── blog.yaml         # Config + includes
├── settings.css      /* @layer settings */
├── components/       /* @layer components */
│   ├── article.css
│   ├── comment.css
│   └── sidebar.css
└── containers.css    /* @layer containers */
```
This isolates blog styles, preventing bleed into other apps while keeping components reusable within the blog.

### For a marketing site
```
marketing/
├── marketing.yaml
├── settings.css      /* @layer settings */
├── components/       /* @layer components */
│   ├── hero.css
│   ├── testimonial.css
│   └── pricing-table.css
└── containers.css    /* @layer containers */
```

Here, styles stay branded and focused, tailored to marketing needs without affecting the broader site.

