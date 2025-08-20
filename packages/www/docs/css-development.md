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
