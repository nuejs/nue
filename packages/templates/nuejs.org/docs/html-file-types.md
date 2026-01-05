
# HTML file types
HTML files in Nue serve different purposes depending on how they are declared:

- **No doctype** - Component library (default)
- **`<!dhtml>`** - Client-side (reactive) component library
- **`<!doctype dhtml>`** - Single-page app

### Rarely used
- **`<!doctype html>`** - Static HTML page
- **`<html>` at root** - Raw HTML passthrough
- **`<!html+dhtml>`** - Isomorphic: works client and server


## Library files
By default, .html files are treated as component libraries. These contain server-side layout modules, Markdown extensions, and client-side reactive components.

```html
<!-- site header -->
<header>
  <a href="/">Home</a>
</header>

<!-- site footer -->
<footer>
  © Copyright { new Date().getFullYear() } Acme Inc
</footer>

<!-- author card component -->
<author class="card">
  <img src="{ avatar }" alt="{ name }">
  <h3>{ name }</h3>
  <p>{ role }</p>
</author>
```

These components work in other HTML files and in Markdown content. They render on the server during build time and get included wherever you reference them.


### Client-side components
Client-side library files use the same syntax. Nue automatically detects they're reactive from event handlers (`:onclick`, `:onsubmit`) or import statements:

```html
<script>
  import { postMember } from 'app'
</script>

<form :is="member-form" :onsubmit="submit">
  <label>
    <h3>Email</h3>
    <input type="email" name="email" required autocomplete="email">
  </label>

  <button>Join mailing list</button>

  <script>
    async submit(e) {
      const data = new FormData(e.target)
      await postMember(data)
    }
  </script>
</form>
```

If there are no handlers, you can explicitly mark a file as dynamic by starting it with `<!dhtml>`:

```html
<!dhtml>

<counter>
  <button :onclick="count++">{ count }</button>

  <script>
    this.count = 0
  </script>
</counter>
```

This tells Nue to treat the file as client-side even without explicit event handlers.


### Isomorphic libraries
Components that work on both server and client start with `<!html+dhtml>`:

```html
<!html+dhtml>

<time :is="pretty-date">
  { pretty }

  <script>
    const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
    const date = this.date || new Date()
    this.pretty = DATE_FORMAT.format(date)
  </script>
</time>
```

These components render on the server during build and can also work as interactive components on the client. This is useful for design systems and reusable UI components that need to work in both contexts.

Note that this is a rare case - most components are either server-side or client-side, not both. A more common scenario is to use a mix: enrich the server-generated HTML with client-side components.


## Single-page apps
Client-rendered applications use `<!doctype dhtml>`:

```html
<!doctype dhtml>

<body>
  <main>
    <app/>
  </main>
</body>
```

This becomes a client-side application that mounts and runs in the browser. The page still inherits layout modules but renders and updates on the client.

See [single-page apps](single-page-apps) for building interactive applications with Nue.


## HTML pages
Server-rendered static pages that generate complete HTML documents use the standard doctype declaration:

```html
<!doctype html>

<h1>About Us</h1>
<p>We build standards-first web experiences.</p>
```

This generates a complete HTML document with head, body, and meta tags during build time. The page inherits your layout modules and design system automatically.

[.note]
  **Note:** HTML files are not recommended for content-heavy websites. Use Markdown with custom HTML components instead.


### Raw HTML
Pages with complete HTML structure at the root level bypass Nue processing entirely:

```html
<!doctype html>

<head>
  <title>Button Demo</title>
  <style>
    button { padding: 1em 2em; }
  </style>
</head>

<body>
  <button>Click me</button>
</body>
```

Useful for standalone demos, isolated component examples, or third-party embeds that need complete control over the HTML structure. No inherited layouts, no design system styles, no automatic processing. Just raw HTML served exactly as written.


