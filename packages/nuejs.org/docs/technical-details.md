
# Technical details
Nuue consists of four projects within Nue [monorepo](//github.com/nuejs/nue/) as follows:

## Nuekit
Nuekit (or simply "Nue") is a standards-first web framework providing:

- Website generation for both MPA and SPA
- Development server with watch mode
- Universal hot-reloading for all asset types
- Seamless MPA/SPA routing and view transitions
- Component mounting and hydration
- CSS/JS optimization and minification

External dependencies:
- [diff-dom](//github.com/fiduswriter/diffDOM)
- [js-yaml](//github.com/nodeca/js-yaml)


## Nue JS
HTML-based template engine that handles:

- Server-side rendering
- Client-side reactivity
- Isomorphic components
- Template parsing and compilation

External dependencies:
- [htmlparser2](//github.com/fb55/htmlparser2)

## Nuemark
Extended Markdown processor providing:
- Content parsing and rendering
- Rich layouts and sections
- Core components and tags
- Data model access

External dependencies:
- [js-yaml](//github.com/nodeca/js-yaml)

## Glow
Syntax highlighter for Markdown code blocks:

- Language detection
- Token parsing
- HTML rendering
- CSS theming

No external dependencies




## How it works
Nuekit processes your project through the following steps:

1. ### File System Scanning
  - Scans all directories and files
  - Identifies content files (Markdown, YAML)
  - Detects SPA entry points: `{appdir}/index.html`
  - Catalogs all assets (CSS, JS, layouts, components, images)
  - Creates content collections
  - Maps URL structure from directory hierarchy

2. ### Asset Processing
  - Identifies shared/global resources
  - Detects includes and excludes for each app and page
  - Maps dependencies between content and assets
  - Maps dependencies between components and layout modules
  - Processes CSS (nested selectors, advanced functions)
  - Compiles client-side (reactive) components

3. ### Content/SPA Processing
  - Builds content models for each Markdown file
  - Sets up component mounting
  - Parses YAML data and configuration
  - Parses all components and layout modules
  - Inlines CSS when configured for site/app/page
  - Renders parsed Markdown with dependent data and assets
  - Builds SPA entry points with dependencies


### Development vs Production
In development mode, Nue runs a dedicated server optimized for:

- Hot Module Replacement
- MPA routing
- Real-time error reporting
- Instant feedback

For production, Nue:

- Processes and optimizes all assets
- Minifies CSS and JavaScript
- Generates static files
- Enables production preview through server



