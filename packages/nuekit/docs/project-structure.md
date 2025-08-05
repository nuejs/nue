
```
@system/
├── model/         # client-side data
├── ui/            # client components  
├── controller/    # global interactions
├── worker/        # backend (CF Workers)
├── design/        # CSS design system
├── layout/        # server templates
└── data/          # SSR content (products, authors)
```

## Configuration


```
design:
  base: base.css
  inline_css: true

  # later
  bundle: /design.css
```