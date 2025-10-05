
# HTML page types
Nue uses document type declarations to determine how `.html` files should be processed. Each type serves a different purpose for pages, components, and layouts.


## Server-side HTML
Server-rendered static pages that generate complete HTML documents:

```
<!doctype html>
<h1>About Us</h1>
<p>We build standards-first web experiences.</p>
```

Generates a complete HTML document with head, body, and meta tags during build time. Best for static content, landing pages, and server-rendered templates.

## Dynamic HTML pages
Client-rendered dynamic pages with interactive behavior:

```
<!doctype dhtml>
<article>
  <button :onclick="count++">{ count }</button>

  <script>
    this.count = 0
  </script>
</article>
```

Becomes a client-side component that mounts and runs in the browser. Used for interactive pages, forms, dashboards, and single-page applications.

## HTML libraries
Create reusable components and [layout modules](/docs/layout-system) for server-rendered pages:

```
<!html lib>

<header>
  <a href="/">Home</a>
</header>

<footer>
  © Copyright { new Date().getFullYear() } Acme Inc
</footer>

<author class="card">
  <img src="{ avatar }" alt="{ name }">
  <h3>{ name }</h3>
  <p>{ role }</p>

  <script>
    this.avatar = this.avatar || '/img/default-avatar.png'
  </script>
</author>

```

Components defined in HTML libraries can be used in other HTML pages and in Nuemark content as custom tags.


### DHTML libraries
Create interactive components for client-side use:

```
<!dhtml lib>

<script>
  import { postMember } from 'app'
</script>

<form :is="member-form" :onsubmit="submit">
  <label>
    <h3>Email</h3>
    <input type="email" name="email" required autocomplete="email">
  </label>

  <label>
    <h3>Feedback</h3>
    <textarea name="comment" rows="4"
      placeholder="Optional, but highly valued!"></textarea>
  </label>

  <p>
    <button>Join mailing list</button>
  </p>

  <script>
    async submit(e) {
      const data = Object.fromEntries(new FormData(e.target))
      await postMember(data)
      location.href = '/contact/thanks'
    }
  </script>

</form>
```

DHTML library components become interactive client-side elements that can be embedded in any page.


### Isomorphic libraries
Components that work on both server and client:

```
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

Isomorphic libraries render on the server during build and can also be used as interactive components on the client. Essential for design systems and reusable UI components.

## Shorthand syntax
You can omit the `doctype` keyword:

```
<!html>        <!-- same as <!doctype html> -->
<!dhtml>       <!-- same as <!doctype dhtml> -->
<!html lib>    <!-- library declaration -->
<!dhtml lib>   <!-- library declaration -->
<!html+dhtml>  <!-- isomorphic library -->
```

The `<!doctype ...>` prefix is recommended for pages, and should be omitted from libraries.

## Auto-detection
When `<!...>` declaration is missing, Nue automatically detects the type:

### DHTML when it finds:
- Event handlers (`:onclick`, `:onsubmit`, etc.)
- JavaScript imports (`import { ... } from '...'`)
- Client-side scripting patterns

```
<button :onclick="handleClick">Click me</button>
```

### HTML when:
- First element is semantic (`<main>`, `<article>`, `<section>`, `<body>`)
- No dynamic features detected
- Pure content structure

```
<main>
  <h1>Static content</h1>
</main>
```

### Library when:
Nue auto-detects libraries when all elements are custom

```
<my-component>
  <h3>Custom component</h3>
</my-component>

<figure :is="media">
  <h3>Custom component via :is attribute</h3>
</figure>
```

At minimum you should declare at least <!dhtml> for robustness and clarity.


