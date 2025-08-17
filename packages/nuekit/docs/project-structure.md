
```
@system/
├── app/        # client model/app
├── ui/         # client ui / controllers, loose MVC
├── server/     # server (edge first, CloudFlare compatible, strict MVC)
├── design/     # CSS design system. central.
├── layout/     # server templates
└── data/       # SSR content (products, authors, ...)

## apps
├── blog/        # .md files (with rich Nuemark syntax)
├── docs/        # .md files
├── admin/       # SPA, index.html takes control
```

## Configuration


```
design:
  base: base.css
  inline_css: true

  # later
  bundle: /design.css
```