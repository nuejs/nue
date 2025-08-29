
# HTML syntax
Nue extends standard HTML with expressions, control flow, and components. Everything works on both server and client unless marked **client-only**.

## Standard HTML
Every HTML document is a valid Nue document:

```html
<!doctype html>

<html>
  <head>...</head>

  <body>
    <article>
      <button onclick="history.go(-1)">Back</button>
      <button popovertarget="confirm-delete">Delete</button>
    </article>

    <dialog id="confirm-delete">
      <h2>Delete user?</h2>
    </dialog>
  </body>
</html>
```


## Expressions
Insert dynamic values with curly brackets:

```html
<!-- text content -->
<span>{ username }</span>

<!-- JavaScript expressions -->
<p>{ username.toUpperCase() }</p>

<!-- unescaped HTML -->
<div>{{ markdown(description) }}</div>
<div>{{ renderContent(article) }}</div>

<!-- triple brackets also supported -->
<div>{{{ userSubmittedContent }}}</div>

```




## Attributes
Dynamic attributes use the same expression syntax:

```html
<!-- attribute values -->
<time datetime="{ date.toISOString() }">

<!-- boolean attributes (falsy values remove the attribute) -->
<button disabled="{ is_disabled }">

<!-- class name interpolation -->
<div class="gallery { type }">

<!-- conditional classes -->
<div class="[ is-active: isActive, has-error: hasError ]">

<!-- combine static and dynamic -->
<div class="gallery { type } [ is-active: isActive ]">
```


## Loops
Render lists with `:each`:

```html
<!-- basic loop -->
<li :each="item in items">{ item.name }</li>

<!-- with index -->
<li :each="item, i in items">
  { i }: { item.name }
</li>

<!-- destructuring -->
<li :each="{ name, price } in products">
  { name } costs { price }
</li>

<!-- loop objects -->
<li :each="[key, val] in Object.entries(data)">
  { key } = { val }
</li>

<!-- template loops (no wrapper element) -->
<dl>
  <template :each="term in glossary">
    <dt>{ term.word }</dt>
    <dd>{ term.definition }</dd>
  </template>
</dl>
```


## Conditionals
Control rendering with `:if`:

```html
<p :if="count > 100">Too many!</p>
<p :else-if="count > 10">Getting there</p>
<p :else>{ count } items</p>

<!-- combine with loops (condition evaluated first) -->
<ul :if="items.length">
  <li :each="item in items">{ item }</li>
</ul>
<p :else>No items</p>
```


## Components
Reusable pieces of UI:

```html
<!-- define a component -->
<product-card>
  <h3>{ name }</h3>
  <p>{ price }</p>

  <script>
    // default values
    this.name = 'Untitled'
    this.price = 0
  </script>
</product-card>

<!-- use the component -->
<product-card/>

<!-- pass properties -->
<product-card :name="Coffee" :price="12"/>

<!-- pass data variables -->
<product-card :name="productName" :price="productPrice"/>

<!-- shorthand (passes the name and price variables) -->
<product-card :name :price/>

<!-- regular attributes (no colon prefix) are rendered -->
<product-card id="featured" class="highlight"/>

<!-- loop components -->
<product-card :each="item in products" :bind="item"/>
```

### Component root element
Components default to `<div>` wrapper. Change with `:is`:

```html
<!-- this component renders as <figure> -->
<image-card •:is="figure"•>
  <img src="{ url }">
  <figcaption>{ caption }</figcaption>
</image-card>
```


## Event handlers
**Client-only** - Handle user interactions:

```html
<counter>
  <button :onclick="count++">{ count }</button>

  <script>
    this.count = 0
  </script>
</counter>

<!-- method handlers -->
<counter>
  <button :onclick="increment">+</button>
  <button :onclick="decrement">-</button>
  <p>Count: { count }</p>
  <p>Double: { double }</p>

  <script>
    this.count = 0

    increment() {
      this.count++
    }

    decrement() {
      if (this.count > 0) this.count--
    }

    // getter methods are supported
    get double() {
      return this.count * 2
    }
  </script>
</counter>

<!-- event object -->
<form :onsubmit="handleSubmit">
  <script>
    handleSubmit(e) {
      // forms automatically call e.preventDefault()
      console.log('Submitted:', e.target)
    }
  </script>
</form>
```


## Lifecycle methods
**Client-only** - Run code at specific moments:

```html
<user-profile>
  <h2>{ user.name }</h2>

  <script>
    // before mounting to DOM
    onmount() {
      console.log('About to mount')
    }

    // after mounting to DOM
    mounted() {
      console.log('Mounted!')
    }

    // before updating
    onupdate() {
      console.log('About to update')
    }

    // after updating
    updated() {
      console.log('Updated!')
    }
  </script>
</user-profile>
```


### Manual updates
**Client-only** - Trigger component re-render with new data:

```javascript
this.update(data)
```

Event handlers update automatically, but async operations or external events (like web socket messages) need manual updates:


```html
<script>
  async mounted() {
    const data = await fetch('/api/user')
    const user = await data.json()

    // Manual update required after async operations
    this.update({ user })
  }
</script>
```


## Dynamic mounting
**Client-only** - Mount components programmatically inside a single-page app:

```javascript
this.mount(name, target, data)
```

**name** - Component name
**target** - DOM element or CSS selector
**data** - Optional data to pass to component

```html
<my-app>

  <article/>

  <script>
    state.on('id', ({ id }) => {
      this.mount(id ? 'user-details' : user-list', 'article')
    })
  </script>

</my-app>
```

See [single-page apps](/docs/single-page-apps) for routing patterns.


## Shared scripts
Define functions and data for multiple components:

```html
<!-- top-level script -->
<script>
  // available to all components
  const TAX_RATE = 0.08

  function formatPrice(num) {
    return '$' + num.toFixed(2)
  }
</script>

<!-- use in components -->
<product-card>
  <p>{ formatPrice(price) }</p>
  <p>Tax: { formatPrice(price * TAX_RATE) }</p>

  <script>
    this.price = 10
  </script>
</product-card>

<!-- another component definition -->
<shopping-cart>
  <p>{ formatPrice(price) }</p>

  <script>
    // ...
  </script<
</shopping-cart>
```


## JavaScript imports
**Client-only** - Import external modules:

```html
<script>
  import { formatDistance } from './utils.js'
  import { store } from './store.js'
</script>

<!-- imported functions available in templates -->
<article>
  <time>{ formatDistance(date) }</time>
  <p>Cart items: { store.cart.length }</p>
</article>
```


## Passthrough scripts
**Server-only** - Scripts with `type` or `src` pass through unchanged:

```html
<!-- these render as-is to the client -->
<script src="/analytics.js"></script>

<script type="module">
  console.log('This runs on the client')
</script>
```


## Slots
Component composition pattern:

```html
<!-- component with slot -->
<card>
  <div class="card">
    <slot/>
  </div>
</card>

<!-- using the slot -->
<card>
  <h2>This goes inside the card</h2>
  <p>So does this</p>
</card>

<!-- multiple instances -->
<card :each="post in posts">
  <h2>{ post.title }</h2>
  <p>{ post.excerpt }</p>
</card>
```


## CSS variables
Pass design tokens without inline styles:

```html
<!-- renders as style="--spacing: 2rem" -->
<section --spacing="2rem">
  <style>
    section {
      padding: var(--spacing);
    }
  </style>
</section>

<!-- dynamic values -->
<div --columns="{ columnCount }">
```

No inline styles or class overloading. Your design system stays the single source of truth.