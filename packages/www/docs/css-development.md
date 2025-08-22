### Strict mode

When `strict: true`:
- Only global stylesheets load (no `blog/blog.css`)
- Forces consistent design across entire site
- Prevents local style overrides

### Exclusions

The `exclude` option uses fuzzy matching. These patterns:
```yaml
exclude: [table, syntax]
```

Would exclude:
- `table.css`
- `table-extras.css`
- `syntax-highlighting.css`
- `@system/design/table.css`



### 1. Central, not scattered
A design system is a single source of truth. When it lives in one place, you can see the whole system at once. You can understand relationships between components. You can spot inconsistencies. When CSS is scattered across component files, you have no system. Just a collection of accidents waiting to happen.

### 2. Trust HTML semantics
HTML already provides most of what a design system needs. Lists have `<ul>`, `<ol>`, `<dl>`. Tables have semantic structure. Forms have fieldsets and labels. Navigation has `<nav>`. Interactive elements have `<button>`, `<details>`, `<dialog>`.

Your design system styles these native elements directly. No need for `.list-component` when `ul` already tells you it's a list. Use attribute selectors (`[disabled]`, `[aria-expanded]`), pseudo-classes (`:invalid`, `:checked`), and `:has()` for state-based styling. The semantic richness is already there.

### 3. Class names to fill the gaps
HTML can't express layout or spacing. These aren't semantic. So class names become purely about spatial relationships: `.columns`, `.grid`, `.stack`, `.cluster`. A few modifiers for variations: `.primary`, `.inverted`, `.compact`.

That's it. Even the most complex design system needs surprisingly few classes. Maybe 10-30 total. Not 100. Not 1000. Constraints boost creativity - when you can't add another "utility class", you find the semantic element that already exists.

### 4. Layer everything
Layers solve the specificity wars forever. Base styles in one layer, components in another, utilities in a third. Each layer has clear boundaries and clear purpose. No more specificity hacks, no more source order gymnastics. The cascade becomes predictable.

### 5. Make it usable
A design system fails when developers abandon it for app-specific styles. Make the right way the easy way. If someone needs to change a button color, the path should be obvious: update `--button-color`. If they need more spacing: adjust `--spacing-unit`.

Name things clearly. Document patterns, not classes. Show examples, not specifications. The moment someone writes a one-off style because they couldn't figure out the system way, the system starts fragmenting. Design it so well that using it feels inevitable.