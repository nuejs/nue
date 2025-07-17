
# Nue dependency system
Nue dependency system is based on two concepts: **where to find things** (`lib`) and **what to use** (`use`). This approach handles everything from global stylesheets to page-level dependencies with the same syntax.


## Library paths

The `lib` configuration defines where to scan for dependencies:

```yaml
lib: ["@system", "./view", "./components"]
```

**Default behavior**: If no `lib` is specified, Nue defaults to:

- `@system` - Your system directory
- `./view` - Local HTML templates and layouts
- `./components` - Local component files


## Use declarations

The `use` configuration declares what dependencies to include:

```yaml
use: ["core/*.css", "syntax.css", "form"]
```

Dependencies are resolved by searching through each path in the `lib` array until found. The matches are fuzzy. For example "form" could match "modules/form.css" and "controllers/form-validation.js".


## File type handling

By default, Nue treats different file types differently to encourage good architecture:

**CSS files**: Only resolved from `@system` (to enforce central design system)
**HTML, JS and TS files**: Resolved from all `lib` paths

This enforces design system discipline while allowing flexible local organization for templates and behavior.

To allow local CSS files, use the override flag:

```yaml
use_local_css: true
```

This could be benefical while developing the system.


## Hierarchical configuration

Configuration cascades from site level to page level, with deeper levels completely overriding parent configuration:

```yaml
# site.yaml
use: ["design/core.css", "syntax.css"]

# blog/blog.yaml  
use: ["design/article.css", "!syntax"]

# specific-post.md frontmatter
use: ["design/minimal.css"]
```

The specific post only gets `minimal.css` - no inheritance or merging.


## Path resolution

### System paths

References without prefixes resolve through the `lib` search paths:

```yaml
# searches @system/design/core.css, ./view/design/core.css, etc.
use: ["design/core.css"]
```

### Local paths

The `./` prefix explicitly references files relative to the current folder:

```yaml
use: ["./layout/**", "./modules/header.html"]
```

### Patterns and exclusions

Glob patterns and negation provide flexible selection:

```yaml
use: [
  "design/*.css",    # all CSS files in design/
  "!syntax",         # except syntax.css
  "modules/nav.*"    # nav component (any extension)
]
```

Nue selectors supports all familiar [glob patterns](https://bun.sh/docs/api/glob).


### Directory-level files
In addition to explicit `use` declarations, Nue automatically discovers all `.html`, `.js`, `.ts`, and `.css` files (if local css is enabled) in the same directory as your content are automatically available.



