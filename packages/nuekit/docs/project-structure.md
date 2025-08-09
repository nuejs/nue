
```
@system/
├── app/        # client model/app
├── ui/         # client ui / controllers, loose MVC
├── server/     # server (CF compatible, strict MVC)
├── design/     # CSS design system
├── layout/     # server templates
└── data/       # SSR content (products, authors, ...)
```

## Configuration


```
design:
  base: base.css
  inline_css: true

  # later
  bundle: /design.css
```