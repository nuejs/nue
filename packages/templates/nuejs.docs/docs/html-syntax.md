
# Nue HTML syntax

Nue extends standard HTML with dynamic features so it can be used as a template language for:

- **Layout modules** - Reusable headers, footers, and page structure
- **Markdown extensions** - Custom tags you use in content files
- **Reactive components** - Interactive elements that run in the browser
- **Server-side pages** - Static pages rendered at build time
- **Single-page apps** - Complete, dynamic applications

Nue is literally HTML so that every HTML snippet is valid Nue:

```html
<article>
  <h1>Welcome</h1>
  <p>This is standard HTML that works as-is in Nue.</p>
  <button onclick="alert('Hello')">Click me</button>
</article>
```

Standard HTML is extended with expressions, loops, conditionals, and a component system. It's designed to provide the semantic "Zen Garden" for a global design system.


## Expressions
Insert dynamic values using curly brackets. This works anywhere you'd normally put text content:

```html
<span>{ username }</span>
<h1>{ title }</h1>
<p>Welcome back, { firstName }!</p>
```

Expressions can contain any JavaScript:

```html
<p>{ username.toUpperCase() }</p>
<span>{ items.length } items</span>
<time>{ new Date().toLocaleDateString() }</time>
```

By default, expressions escape HTML to prevent XSS attacks. Use double curly brackets to render unescaped HTML:

```html
<div>{{ markdown(description) }}</div>
<article>{{ renderContent(post.body) }}</article>
```

Triple brackets also work for unescaped content:

```html
<div>{{{ userSubmittedContent }}}</div>
```

Use double or triple brackets only with trusted content. Never render user-submitted data unescaped.


## Attributes

Dynamic attribute values use the same expression syntax:

```html
<img src="{ avatarUrl }" alt="{ userName }">
<a href="{ link.url }">{ link.text }</a>
<time datetime="{ date.toISOString() }">{ formattedDate }</time>
```

Boolean attributes are removed when the expression evaluates to a falsy value:

```html
<button disabled="{ isProcessing }">Submit</button>
<input required="{ isRequired }">
```

### Class names

Interpolate class names directly in the class attribute:

```html
<div class="card { cardType }">
<article class="post { status }">
```

Use bracket notation for conditional classes:

```html
<div class="[ is-active: isActive, has-error: hasError ]">
```

Combine static and dynamic classes:

```html
<div class="gallery grid [ is-loading: loading ]">
```

The design system provides the class names. You just apply them conditionally based on state.


## Loops

Render lists with the `:each` attribute:

```html
<li :each="item in items">{ item.name }</li>
```

Access the index as the second parameter:

```html
<li :each="item, i in items">
  { i + 1 }. { item.name }
</li>
```

Destructure objects directly in the loop:

```html
<li :each="{ name, price } in products">
  { name } costs ${ price }
</li>
```

Loop over object entries:

```html
<li :each="[key, val] in Object.entries(data)">
  { key }: { val }
</li>
```

Use `<template>` when you need to loop without a wrapper element:

```html
<dl>
  <template :each="term in glossary">
    <dt>{ term.word }</dt>
    <dd>{ term.definition }</dd>
  </template>
</dl>
```

This generates multiple `<dt>` and `<dd>` elements without wrapping them in an extra container.


## Conditionals

Control rendering with `:if`, `:else-if`, and `:else`:

```html
<p :if="count > 100">Too many items!</p>
<p :else-if="count > 10">Getting there</p>
<p :else>Only { count } items</p>
```

Conditionals work with loops. The condition is evaluated first:

```html
<ul :if="items.length">
  <li :each="item in items">{ item }</li>
</ul>
<p :else>No items found</p>
```

Use conditionals to show and hide entire sections based on state:

```html
<section :if="user">
  <h2>Welcome, { user.name }</h2>
</section>

<section :else>
  <h2>Please log in</h2>
</section>
```


## Components

Components are reusable pieces of UI that you define once and use throughout your project:

```html
<product-card>
  <img src="{ image }">
  <h3>{ name }</h3>
  <p>${ price }</p>

  <script>
    this.name = 'Untitled'
    this.price = 0
    this.image = '/placeholder.png'
  </script>
</product-card>
```

The `<script>` block defines the component's properties and their default values. These properties can be passed when using the component.

### Using components

Use a component by writing its tag name:

```html
<product-card/>
```

Pass data using the `:` prefix for property names:

```html
<product-card :name="Coffee Beans" :price="12.99" :image="/coffee.jpg"/>
```

Pass variables by referencing them without quotes:

```html
<product-card :name="productName" :price="productPrice" :image="productImage"/>
```

Use shorthand when the property name matches the variable name:

```html
<product-card :name :price :image/>
```

Regular HTML attributes without the `:` prefix are rendered on the root element:

```html
<product-card id="featured" class="highlight"/>
```

Loop through data to create multiple component instances:

```html
<product-card :each="item in products" :bind="item"/>
```

The `:bind` attribute passes all properties from the object to the component.

### Component root element

Components default to `<div>` as their wrapper element. Change this with the `:is` attribute:

```html
<figure :is="image-card">
  <img src="{ url }">
  <figcaption>{ caption }</figcaption>
</figure>
```

This component renders as a `<figure>` element instead of a `<div>`.


## Event handlers

**Client-only** - Event handlers only work in reactive components that run in the browser.

Handle events with the `:on` prefix followed by the event name:

```html
<counter>
  <button :onclick="count++">{ count }</button>

  <script>
    this.count = 0
  </script>
</counter>
```

Call methods defined in the component script:

```html
<counter>
  <button :onclick="increment">+</button>
  <button :onclick="decrement">-</button>
  <p>Count: { count }</p>

  <script>
    this.count = 0

    increment() {
      this.count++
    }

    decrement() {
      if (this.count > 0) this.count--
    }
  </script>
</counter>
```

Getter methods work for computed values:

```html
<counter>
  <p>Count: { count }</p>
  <p>Double: { double }</p>

  <script>
    this.count = 5

    get double() {
      return this.count * 2
    }
  </script>
</counter>
```

Access the event object in your handler:

```html
<form :onsubmit="handleSubmit">
  <input type="email" name="email">
  <button>Submit</button>

  <script>
    handleSubmit(e) {
      // forms automatically call e.preventDefault()
      const formData = new FormData(e.target)
      console.log('Email:', formData.get('email'))
    }
  </script>
</form>
```

Form submissions automatically prevent the default action, so you don't need to call `e.preventDefault()`.


## Lifecycle methods

**Client-only** - Lifecycle methods only work in reactive components.

Run code before the component mounts to the DOM:

```html
<user-profile>
  <h2>{ user.name }</h2>

  <script>
    onmount() {
      console.log('About to mount')
    }
  </script>
</user-profile>
```

Run code after mounting:

```html
<script>
  mounted() {
    console.log('Component is in the DOM')
  }
</script>
```

Run code before and after updates:

```html
<script>
  onupdate() {
    console.log('About to update')
  }

  updated() {
    console.log('Update complete')
  }
</script>
```

### Manual updates

Event handlers trigger updates automatically. For async operations or external events, call `this.update()` manually:

```html
<user-profile>
  <h2>{ user.name }</h2>
  <p>{ user.email }</p>

  <script>
    async mounted() {
      const response = await fetch('/api/user')
      const user = await response.json()

      // manual update required after async operations
      this.update({ user })
    }
  </script>
</user-profile>
```

Web socket messages, timers, and other external events need manual updates:

```html
<script>
  mounted() {
    const socket = new WebSocket('ws://localhost:8080')

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.update({ messages: [...this.messages, data] })
    }
  }
</script>
```


## Slots

Slots let you compose components by passing content into them:

```html
<card>
  <div class="card">
    <slot/>
  </div>
</card>
```

Use the component with nested content:

```html
<card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</card>
```

The `<slot/>` gets replaced with whatever content you put inside the component. This works for both static and reactive components.

Loop over data to create multiple instances with different content:

```html
<card :each="post in posts">
  <h2>{ post.title }</h2>
  <p>{ post.excerpt }</p>
  <a href="{ post.url }">Read more</a>
</card>
```


## CSS variables

Pass dynamic values to your design system using CSS custom properties. Prefix any attribute with `--` and it becomes a CSS variable:

```html
<section --spacing="2rem">
```

This renders as `style="--spacing: 2rem"` on the element. Your global design system can reference these variables in its CSS files:

```css
/* in your design system CSS */
section {
  padding: var(--spacing);
}
```

Use dynamic values from component state:

```html
<div --columns="{ columnCount }">
```

The design system defines how these variables are used:

```css
/* in your design system CSS */
div {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
}
```

CSS variables let you pass dynamic values from components to your design system without breaking separation of concerns. All styling rules stay in CSS files. Components just provide the values.

**Note:** Style blocks (`<style>`) are strictly forbidden in Nue and are stripped during processing. All CSS belongs in your global design system files, never embedded in components.


## Scripts and imports

Component scripts define properties, methods, and lifecycle hooks. Keep them focused on the component's behavior.

### Shared scripts

Define functions and data that multiple components can use:

```html
<script>
  // available to all components in this file
  const TAX_RATE = 0.08

  function formatPrice(num) {
    return '$' + num.toFixed(2)
  }
</script>

<product-card>
  <p>{ formatPrice(price) }</p>
  <p>Tax: { formatPrice(price * TAX_RATE) }</p>

  <script>
    this.price = 10
  </script>
</product-card>

<shopping-cart>
  <p>Total: { formatPrice(total) }</p>

  <script>
    this.total = 50
  </script>
</shopping-cart>
```

Shared scripts come before component definitions. They're available to all components in the file.

### JavaScript imports

**Client-only** - Import external modules at the top of your file. This only works in reactive components:

```html
<script>
  import { formatDistance } from './utils.js'
  import { store } from './store.js'
</script>

<article>
  <time>{ formatDistance(date) }</time>
  <p>Cart items: { store.cart.length }</p>
</article>
```

Imported functions and objects are available in templates and component scripts.

### Passthrough scripts

Scripts with `type` or `src` attributes pass through unchanged to the browser:

```html
<script src="/analytics.js"></script>

<script type="module">
  console.log('This runs on the client')
</script>
```

Use these for third-party scripts or code that should run outside the component system.


## Architectural constraints

Nue enforces separation of concerns through built-in constraints. These aren't limitations - they're guardrails toward maintainable architecture.

### No style blocks

CSS belongs in `.css` files, not embedded in HTML. Style blocks are stripped during processing:

```html
<!-- this doesn't work -->
<style>
  .card { padding: 1rem; }
</style>
```

All presentation decisions happen in your design system. Components focus on structure and behavior.

### No inline styles

The `style` attribute is ignored completely:

```html
<!-- this doesn't work -->
<div style="color: red">...</div>
```

Use CSS variables to pass dynamic values instead:

```html
<div --color="red">...</div>
```

Then reference the variable in your CSS:

```css
div {
  color: var(--color);
}
```

### Class name limits

Maximum 3 class names per element by default. This prevents utility class bloat:

```html
<!-- this works -->
<div class="card featured highlight">

<!-- this doesn't work (too many classes) -->
<div class="p-4 mt-2 bg-blue text-white rounded shadow">
```

The limit forces systematic design thinking. If you need more than 3 classes, your design system needs better component classes.

### Clean class syntax

Class names must be valid CSS identifiers. No colons, no special characters:

```html
<!-- this works -->
<div class="card is-active">

<!-- this doesn't work -->
<div class="card hover:scale-110">
```

These constraints keep your HTML clean and your design system focused. When you can't mix concerns, you're forced to separate them properly.


## In-browser compilation

Nue compiles directly in the browser with a 2KB compiler. No build tools, no Babel, no webpack:

```html
<!doctype html>

<head>
  <title>Nue Counter</title>
  <script src="//esm.sh/nuedom" type="module"></script>
</head>

<template>
  <button :onclick="count++">
    Count: <b>{ count }</b>

    <script>
      this.count = 0
    </script>
  </button>
</template>
```

Save as HTML, serve over HTTP (modules need the HTTP protocol), and it runs. The component auto-mounts and works immediately.

This is only practical for experiments and prototypes. For real projects, use Nuekit for the complete development experience with hot module replacement, multi-site support, and optimized builds.

The in-browser compiler exists because Nue's syntax is simple enough to compile in real-time without massive toolchains. Your production builds still happen at build time for optimal performance.
