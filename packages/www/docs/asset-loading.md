
# Asset loading
Nue automatically discovers and loads assets (HTML, CSS, JavaScript, YAML) for each Markdown or HTML page based on directory hierarchy and configuration rules.

## Directory hierarchy
Assets are loaded in this order of precedence:


### Root level
Global assets that apply to every page:
```
global.css          # Site-wide styles
app.js              # Global JavaScript
site.yaml           # Site data
```

### App level
Area-specific assets that apply to pages within that directory:

```
blog/
├── blog.css        # Only applies to blog pages
├── layout.html     # Blog-specific layouts
└── data.yaml       # Blog data

admin/
├── admin.js        # Only applies to admin pages
└── uilib.html      # Admin UI components
```

## Page level
Assets in the same directory as the page.

```
blog/css-is-awesome/
├── effects.css     # Only applies to blog pages
├── awesome.html    # Page-specific components
└── products.yaml   # Blog data
```

Page-specific directories are rare but allow construction of specific/complex content.


## Larger projects
Larger projects can use a central @system directory for global assets available everywhere on your apps:

```
@system/
├── design/         # Design system CSS files (.css)
├── layout/         # Shared layouts and components  (.html)
├── ui/             # Dynamic UI components/controllers (.html, .js, .ts)
└── data/           # Site-wide data files (.yaml)
```


## Include and exclude
Control which assets load across your entire site in `site.yaml`:

```yaml
# Exclude files by name or pattern (applies to all asset types)
exclude: [apps.css, syntax.css]

# Rarely needed globally since assets are auto-included already
include: []
```


## App-level overrides
Override global settings in app directories with `app.yaml`:

```yaml
# In admin/app.yaml - only applies to admin pages
exclude: [ marketing-effects ]
include: [ apps.css ]
```

Patterns are fuzzy so "marketing-effects" would match both marketing-effects.html and marketing-effects.css.

App-level inclusions and exclusions override global ones (not extend the arrays).


## Single-page applications
SPA root files (`app/index.html`) automatically include all assets from their directory tree no matter what subdirectories are there:

```
app/
├── index.html      # SPA root
├── app.js          # Included
└── ui/             # All included
    ├── user.html
    ├── users.html
    └── utils.html
```




