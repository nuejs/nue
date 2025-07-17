
# Why Nue uses its own CSS parser

Nue implements a custom CSS parser and minifier instead of using Bun's built-in CSS processing. This decision aligns with Nue's philosophy of modern web development targeting Baseline 2023 browsers.


## Problems with CSS processors

### Unnecessary transformations
Most CSS processors, including Bun's, perform transformations designed for legacy browser compatibility:

- **Un-nesting selectors** - Modern browsers support CSS nesting natively
- **Color conversions** - Converting modern color syntax to hex values
- **Vendor prefixing** - Adding prefixes for features now widely supported
- **Syntax downgrading** - Converting modern CSS to older equivalents

These transformations add complexity and processing overhead while targeting browsers that modern websites no longer need to support.

### Bundling-first approach
Bun's CSS parser is optimized for bundling, which creates several issues:

- **Forced bundling** - All CSS gets combined into large bundles
- **Poor caching** - Changing one rule invalidates entire bundles
- **Slow rebuilds** - Any CSS change triggers full bundle regeneration
- **Debugging issues** - Source maps point to bundle files, not original sources

### No AST access
Built-in processors typically don't expose the Abstract Syntax Tree, preventing:

- Custom analysis and optimization
- Framework-specific tooling
- Intelligent include/exclude strategies
- Design token extraction

## Nue's approach

### Modern CSS preservation
Nue's parser preserves modern CSS exactly as written:

```css
.card {
  padding: 1rem;
  
  &:hover {
    background: oklch(0.7 0.15 180);
  }
}
```

This CSS remains unchanged in development and gets minimally processed for production - no unnecessary transformations or legacy compatibility layers.

### File-based architecture
Instead of bundling, Nue uses individual CSS files:

**Development**: Direct file serving preserves debugging context
```
src/
  components/
    header.css
    card.css
    button.css
```

**Production**: Selective inlining for critical CSS, async loading for the rest

### Instant HMR
Granular hot module replacement works at the file level:

- Modify `header.css` → instant update in browser
- No bundle rebuilds or dependency resolution
- Sub-100ms feedback loop
- Surgical precision - only affected styles reload

### Intelligent optimization
With AST access, Nue can implement smart optimizations:

- **Critical CSS extraction** - Inline above-the-fold styles
- **Unused CSS removal** - Dead code elimination per page
- **Design token analysis** - Extract and optimize custom properties
- **Dependency tracking** - Only rebuild what actually changed

## Performance benefits

### Faster development
- No build step for CSS changes
- Instant visual feedback
- Real file names in browser inspector
- No bundle invalidation cascades

### Better production performance
- Single HTML file with inlined critical CSS
- Eliminates render-blocking requests
- Non-critical CSS loads asynchronously
- Optimal caching per component

### Smaller output
Nue's minifier strips only what's necessary:
- Comments and whitespace removal
- No unnecessary transformations
- Preserves modern CSS features
- Maintains browser optimization opportunities

## Separation of concerns

Nue maintains proper separation between HTML, CSS, and JavaScript:

- **CSS files** contain only styling
- **No CSS-in-JS** runtime overhead
- **Component-scoped** styles without framework lock-in
- **Standard tooling** works with regular CSS files

This approach respects web platform conventions while leveraging modern browser capabilities for optimal performance and developer experience.