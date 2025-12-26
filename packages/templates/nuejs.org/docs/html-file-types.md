
# HTML file types
By default, .html files are component libraries. This is the most common case since web pages are mostly .md files. Sometimes you need to craft pages with raw HTML - for standalone demos, pages with little content, or complete control over the structure. The doctype declaration changes this default behavior.

This article explains each file type and when to use them. We'll cover library files (the default), static HTML pages, dynamic client-side pages/SPAs, isomorphic components, and raw HTML for standalone demos.


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

These components render on the server during build and can also work as interactive components on the client. This is useful for design systems and reusable UI components that need to work in both contexts. This is a rare case - most components are either server-side or client-side, not both.



## HTML pages
Server-rendered static pages that generate complete HTML documents use the standard doctype declaration:

```html
<!doctype html>

<h1>About Us</h1>
<p>We build standards-first web experiences.</p>
```

This generates a complete HTML document with head, body, and meta tags during build time. The page inherits your layout modules and design system automatically.

This is great for getting to know Nue and enjoying web standards without the bloat of current ecosystems. When you're ready to build professional websites with a global design system and scalable content, you'll ultimately move to Markdown. Markdown gives you better control over output and works naturally with design systems.



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


## Raw HTML pages
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


