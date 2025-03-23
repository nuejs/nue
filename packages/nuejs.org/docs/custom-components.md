---
include: [demos]
---

# Custom components
There are four types of custom components in Nue:

- **Markdown extensions**: These extend the Markdown syntax with custom tags, offering more flexibility in content formatting.
- **Layout modules**: These components fill the slots in the [page layout](layout.html), helping create a structured design for your pages.
- **Layout components**: These are custom server-side components used within layout modules, allowing for dynamic content rendering.
- **Interactive islands**: These are rendered on the client side (CSR) and enhance user interaction with minimal JavaScript. Here’s an example:

### Example island
Nue makes it easy to build interactive components like this:

[array-demo]
  users:
    - name: Alex Martinez
      role: Lead frontend developer
      img: /img/face-3.jpg
    - name: Sarah Park
      role: UI/UX Designer
      img: /img/face-4.jpg
    - name: Jamie Huang
      role: JS/TS developer
      img: /img/face-2.jpg
    - name: Heidi Blum
      role: UX developer
      img: /img/face-1.jpg
    - name: Adam Nattie
      role: Backend developer
      img: /img/face-5.jpg
    - name: Mila Harrison
      role: Senior frontend developer
      img: /img/face-6.jpg

- - -

## Like React, but semantic
Nue components offer React-like functionality while focusing on semantic web design. They work seamlessly on both the server and client sides, allowing developers to enhance applications progressively without losing structure.

Unlike React, which relies heavily on JavaScript, Nue is based on HTML. Any valid HTML in Nue is also a valid component, making it simple and accessible.

```html
<div class="{ type }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p :if="desc">{ desc }</p>
    <slot/>
  </aside>
</div>
```

### Block assembly language
Nue components are named HTML fragments that can be looped and rendered conditionally, enabling nesting within other components. Assign a component name using the `@name` attribute:

```html
<div •@name="media-object"• class="{ class }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p>{ desc }</p>
  </aside>
</div>
```

Once named, components can be nested inside one another to form more complex applications and tree-like structures. For example:

```html
<section @name="image-gallery" class="gallery">
  <header>
    <h1>{ title }</h1>
    <p>{ desc }</p>
  </header>

  <!-- media-object looped -->
  <media-object :for="item in items" :bind="item"/>
</section>
```

### Component libraries
Server-side components are saved with a `.html` extension, while client-side components or islands use a `.dhtml` or `.htm` extension. You can group related components together in the same file to create a cohesive component library.

Components can be stored at three levels: globally, area-level, or page-level. These components are automatically aware of each other, allowing you to reuse them in different files without the need for explicit import statements.

To explicitly include components from a [library folder](project-structure.html#libraries), you can use the [include](settings.html#include) statement. Components cascade similarly to CSS files, enabling a streamlined approach to component management.

## Mounting
Once a component is available on the page, mounting it is straightforward:

### In Markdown content
Custom components are mounted in Markdown content just like the built-in [content tags](markdown-extensions.html), using square brackets:

```md
[image-gallery]

// with "heroic" styling
[image-gallery.heroic]
```

### In layout modules
In layout modules, components are mounted as custom HTML elements:

```html
<image-gallery/>

<!-- with "heroic" styling -->
<image-gallery class="heroic"/>
```

### Islands
If a component is not defined server-side in a `.html` file, it is rendered directly as a custom element on the client side. For example:

```html
<!-- this gets rendered on the client-side -->
<image-gallery custom="image-gallery"/>
```

In this case, Nue will first look for an implementation of the component or island defined in a `.dhtml` file. If it is not found, a standard Web Component will be mounted as specified in a `.js` or `.ts` file.


## Passing data
You can pass data to your components using attributes. These attributes can either be direct values or reference data from the [unstructured data](content-authoring.html) when the attribute name starts with a colon.

#### Markdown example
In Markdown content, you can pass data as follows:

```md
// application data (items) vs direct value (1)
[image-gallery :items="screenshots" index="1"]
```

In this example, `:items` references the `screenshots` array from the application data, while `index` is a direct value set to `1`.

#### HTML component example
In layout modules and interactive islands, you can similarly pass data as arguments:

```html
<image-gallery :items="products" index="2"/>
```

Here, `:items` pulls from the `products` data, and `index` is set to `2`. This allows the component to dynamically render based on the provided data while keeping your templates clean and maintainable.

#### Islands
Client-side components, such as islands, receive data through nested JSON. This enables you to encapsulate data directly within the component:

```html
<image-gallery custom="image-gallery">
  <script type="application/json">
    {
      "items": [...],
      "index": 2
    }
  </script>
</image-gallery>
```

In this structure, the JSON data is embedded within a `<script>` tag of type `application/json`, allowing the component to access it seamlessly on the client side.

### Nested HTML and slots
Slots enable you to build highly reusable, multi-purpose components by allowing a parent component to inherit functionality from a child component. Here’s how it works:

#### Parent component
The parent component defines a structure that includes a slot for nested content:

```html
<!-- parent component -->
<div class="{ type }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p>{ desc }</p>
    <slot/>
  </aside>
</div>
```

#### Passing custom content
You can pass custom content to the parent component through the slot:

```html
<media-object>
  <!-- the <slot/> is replaced with this nested markup -->
  <h4>{ price }</h4>
  <button>Add to cart</button>
</media-object>
```

In this example, the `<slot/>` element in the `media-object` is replaced with the nested markup. The nested content can include anything from text and HTML tags to other custom components, such as product ratings, comment sections, or product metadata.

#### Looping through nested content
You can also pass nested content within loops, allowing for dynamic rendering:

```html
<media-object :for="item in items" :bind="item">
  <h4>{ item.price }</h4>
  <button>Add to cart</button>
</media-object>
```

### Nested Markdown
Nue allows you to pass nested Markdown content to your components. For example, consider a custom `background-video` component that includes nested table data:

```md
[background-video :src="bgvideo"]
  ## Hot reloading compared
  A brief overview of features and capabilities.

  [table]
    Hot-reloading         | Next.js | Nue
    --------------------- | ------- | ---
    Server components     | ×       | ×
    Client components     | ×       | ×
    Content               |         | ×
    Styling               |         | ×
    Data / metadata       |         | ×
    Page changes          |         | ×
    CSS errors            |         | ×
```

#### Simplified component implementation
Here’s a simplified implementation of the `background-video` component:

```html
<div @name="background-video" class="bg-video">
  <video :src/>

  <!-- the Markdown generated HTML goes here -->
  <slot/>
</div>
```

In this setup, the nested Markdown is processed and inserted into the `<slot/>` within the `background-video` component, allowing for rich content integration.

## Instances
Both server-side and client-side components in Nue can be scripted before rendering on the page. The scripting API is inspired by [ES6 classes](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), enabling each component to have properties and methods. You can reference these properties and call the methods directly from your template code.

### Properties and methods
Properties and methods are defined inside a `<script>` block that is a direct child of the component root. Here’s an example of a `pretty-date` server-side component:

```html
<time @name="pretty-date" :datetime="toIso(date)">
  { pretty(date) }

  <!-- Properties and methods -->
  <script>
    // Property to hold the locale for date formatting
    locale = 'en-US';

    // Constructor method runs when the component is created
    constructor({ date, locale }) {
      if (locale) this.locale = locale;
      this.date = date;
    }

    // Method to format the date into a readable string
    pretty(date) {
      return date.toLocaleDateString(this.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Method to convert the date to ISO format
    toIso(date) {
      return date.toISOString().slice(0, 10);
    }
  </script>
</time>
```

### How it works
In this example:


- **Properties** allow you to set default values and dynamic values for rendering. For instance, `locale` is initialized to `'en-US'` and can be overridden.
- The **constructor** method runs when the component is created, allowing you to manipulate user-provided data (like `date` and `locale`) before it is processed by the template.
- **Methods** are useful for formatting and transforming data. The `pretty` method formats the date for display, while the `toIso` method converts it to a standard format.

The scripting block helps to extract complex JavaScript logic from the [HTML template block](template-syntax.html), resulting in cleaner and more readable markup. This is particularly important for interactive islands, where the amount of scripting is typically much higher.


### Local scripts
You can set up local functions and variables using root-level script blocks:

```html
<script>
  let counter = 0; // Initialize a counter variable
</script>

<div @name="comp-a">
  <h3>A count: { counter }</h3>

  <script>
    constructor() {
      this.counter = ++counter; // Increment counter and store it in this component
    }
  </script>
</div>

<div @name="comp-b">
  <h3>B count: { counter }</h3>

  <script>
    constructor() {
      this.counter = ++counter; // Increment counter and store it in this component
    }
  </script>
</div>
```

Local variables and functions provide another way to decouple complex scripting logic from your components, allowing you to share functions and variables between components in the same file.

Note that currently, you can only use the `import` statement in client-side components, but support for server-side imports is planned for the future.

### Passthrough scripts
Sometimes you may want the script block to be executed directly by the browser. You can achieve this by using the `type`, `src`, or `client` attributes, which instruct the compiler to pass the scripts directly to the client. For example:

```html
<!-- Passed to the client directly -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"></script>

<!-- Same here -->
<script type="text/javascript">
  console.info({ hello: 'World' }); // Log a message to the console
</script>
```

You can also use a `client` attribute in place of the traditional `type="text/javascript"`:

```html
<script client>
  console.info('hey'); // Log a message to the console
</script>
```

The above will be rendered as:

```html
<script>
  console.info('hey'); // Log a message to the console
</script>
```

## Interactive components
Interactive components in Nue are executed on the client side, directly within the user's browser. They are created and mounted using the same syntax as server-side components, but interactive components can respond to user input and re-render themselves to reflect new states. This functionality makes them ideal for a variety of applications, such as feedback forms, login forms, registration flows, account dropdowns, image galleries, or any other component that requires interactivity.


### Example: Image Gallery
Let’s add a simple image gallery component to this page:

[image-gallery]
  images: [tomatoes.jpg, lemons.jpg, peas.jpg, popcorn.jpg]
  basedir: /img


```md render
[image-gallery]
  images: [tomatoes.jpg, lemons.jpg, peas.jpg, popcorn.jpg]
  basedir: /img
```


Here’s the source code for the gallery component:

```html
<div @name="image-gallery" class="image-gallery" translate="no">

  <!-- Action to seek to the previous image -->
  <a class="seek prev" @click="index--" :if="index"></a>

  <!-- The currently displayed image -->
  <img src="{ basedir }/{ images[index] }">

  <!-- Action to seek to the next image -->
  <a class="seek next" @click="index++" :if="index + 1 < images.length"></a>

  <!-- The gray dots below the image -->
  <nav>
    <a :for="src, i in images" class="{ current: i == index }" @click="index = i"></a>
  </nav>

  <!-- Scripting section -->
  <script>

    // Image index representing the component state
    index = 0;

  </script>

</div>
```

Inside the component, all control flow operations, such as loops and conditionals, are reactive — they respond to user events and re-render based on the new state. Here, we have a numeric state variable `index`, which updates as the user clicks the navigational elements, automatically changing the displayed image accordingly.

## Event handlers
In Nue, attributes starting with the `@` symbol define event handlers. These handlers are JavaScript functions that respond to user interactions, such as clicks, keypresses, or mouse movements.

### Inline handlers
Inline handlers are defined directly within the attribute:

```html
<button @click="count++">Increment</button>
```

Inline handlers are great for simple expressions that don’t require additional logic.

### Method handlers
For more complex functionality, it's best to move the logic into an instance method:

```html
<dialog>
  <button @click="close">Close</button>

  <script>
    close() {
      this.root.close(); // Close the dialog
      location.hash = ''; // Clear the URL hash
    }
  </script>
</dialog>
```

### Method calls
You can pass arguments to method calls:

```html
<div>
  <button @click="say('yo!')">Say yo!</button>

  <script>
    say(msg) {
      console.log(msg); // Log the message to the console
    }
  </script>
</div>
```

### Event argument
Method handlers always receive an [Event object](//developer.mozilla.org/en-US/docs/Web/API/Event) as the last argument, unless it is explicitly named `$event`:

```html
<div>
  <button @click="first">First</button>
  <button @click="second('Hello')">World</button>
  <button @click="third('Hello', $event, 'World')">Nue</button>

  <script>
    // prints "First"
    first($event) {
      console.info($event.target.textContent); // Log the button text
    }

    // prints "Hello World"
    second(hey, $event) {
      console.info(hey, $event.target.textContent); // Log hello and button text
    }

    // prints "Hello Nue World"
    third(hey, $event, who) {
      console.info(hey, $event.target.textContent, who); // Log all three
    }
  </script>
</div>
```

### Event modifiers
Nue provides convenient shortcuts for common DOM event manipulation functions. For instance, `@submit.prevent` is a shortcut to call [event.preventDefault()](//developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault).

```html
<!-- Prevent the default event from occurring -->
<form @submit.prevent="onSubmit"></form>

<!-- Modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- Run the modifier only -->
<form @submit.prevent></form>
```

The following modifiers are supported:

- `.prevent`: Prevents the default behavior of the event from occurring.
- `.stop`: Prevents further [propagation](//developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) of the event.
- `.self`: Only triggers the handler if `event.target` is the element itself.
- `.once`: The event will be triggered at most once.

### Key modifiers
Key modifiers bind the event handler to specific keyboard keys:

```html
<!-- Only call `submit` when the `key` is `Enter` -->
<input @keyup.enter="submit">
```

You can use any valid key names from [KeyboardEvent.key](//developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) as modifiers, converting them to kebab-case. For example, the following handler is called only if `event.key` is equal to `PageDown`:

```html
<input @keyup.page-down="onPageDown">
```

Nue provides aliases for commonly used keys:

- `.enter`: Captures both "Enter" and "Return".
- `.delete`: Captures both "Delete" and "Backspace".
- `.esc`: Captures both "Esc" and "Escape".
- `.space`: Captures "Spacebar", " ", "Space Bar".
- `.tab`: Captures "Tab".
- `.up`: Captures "Up" and "ArrowUp".
- `.down`: Captures "Down" and "ArrowDown".
- `.left`: Captures "Left" and "ArrowLeft".
- `.right`: Captures "Right" and "ArrowRight".

## Dynamic arrays
When you define a loop with the `:for` expression, Nue automatically detects if the looped array is mutated and triggers the necessary UI updates. The following [array methods](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) are supported:

- `push(item)`: Adds a new item to the end of the array.
- `unshift(item)`: Adds a new item to the beginning of the array.
- `sort(fn)`: Sorts items based on the given function.
- `reverse()`: Reverses the order of items.
- `splice(start, count)`: Removes items from the array.
- `shift()`: Removes the first item from the array.
- `pop()`: Removes the last item from the array.
- `remove(item)`: A Nue-specific helper method to remove the given item from the array.

### Replacing the array
Mutation methods modify the original array they are called on. Non-mutating methods, such as `filter()`, `concat()`, and `slice()`, return a new array. In these cases, you should replace the old array with the new one, and Nue will render the updates accordingly:

```js
search() {
  this.items = this.items.filter(item => item.text.match(/Foo/));
}
```

### Example: array.push
Here’s a simple demo of using an array:

[array-demo]
  users:
    - name: Alex Martinez
      role: Lead frontend developer
      img: /img/face-3.jpg
    - name: Sarah Park
      role: UI/UX Designer
      img: /img/face-4.jpg
    - name: Jamie Huang
      role: JS/TS developer
      img: /img/face-2.jpg
    - name: Heidi Blum
      role: UX developer
      img: /img/face-1.jpg
    - name: Adam Nattie
      role: Backend developer
      img: /img/face-5.jpg
    - name: Mila Harrison
      role: Senior frontend developer
      img: /img/face-6.jpg


```md
[array-demo]
  users:
    - name: Alex Martinez
      role: Lead frontend developer
      img: /img/face-3.jpg
    - name: Sarah Park
      role: UI/UX Designer
      img: /img/face-4.jpg
    - name: Jamie Huang
      role: JS/TS developer
      img: /img/face-2.jpg
    - name: Heidi Blum
      role: UX developer
      img: /img/face-1.jpg
    - name: Adam Nattie
      role: Backend developer
      img: /img/face-5.jpg
    - name: Mila Harrison
      role: Senior frontend developer
      img: /img/face-6.jpg
```

Here's the source code for the above demo:

```html
<div @name="array-demo" class="array-demo">

  <button @click="add" :disabled="items[5]">Add user</button>

  <ul>
    <li :for="el of items">
      <img :src="el.img">
      <h3>{ el.name }</h3>
      <p>{ el.role }</p>
    </li>
  </ul>

  <script>

    // render first three users
    constructor({ users }) {
      this.items = users.slice(0, 2)
      this.all = users
    }

    // insert a new item
    add() {
      const { items, all } = this
      const item = all[items.length]
      if (item) items.push(item)
    }
  </script>

</div>
```

Note that the transition effect is done with vanilla CSS using `@starting-style` without specialized `<transition>` elements or motion libraries. This keeps the implementation lean and clean.


## Lifecycle methods
Each component instance goes through a series of steps during its lifetime: first, it is created, then mounted on the page, and finally, it gets updated one or more times. Sometimes the component is removed or "unmounted" from the page.

You can hook custom functionality to these steps by creating instance methods with specific names:

```html
<script>

  // Called when the component is created. Data/args is provided as the

 first argument.
  constructor(data) {
    // Initialization logic here
  }

  // Called after the component is mounted on the page.
  mounted(data) {
    // Logic to run after mounting here
  }

  // Called after the component is updated.
  updated() {
    // Logic to run after an update here
  }

  // Called after the component is removed from the page.
  unmounted() {
    // Cleanup logic here
  }
</script>
```

Inside these callback functions, `this` points to the [instance API](#instance-api), allowing access to various properties and methods related to the component.

## Instance API
The component API is accessible via the `this` variable inside the lifecycle methods. It has the following attributes and methods:

- `root`: The root DOM node of the component instance.
- `$el`: An alias for the root DOM node.
- `$parent`: The root DOM node of the parent instance.
- `$refs`: Access to named DOM nodes and inner components within the component.
- `mount(root: DOMElement)`: Mounts the instance to the specified root element.
- `unmount()`: Removes the component from the current component tree.
- `update(data?: Object)`: Forces the component instance to re-render itself with optional data. This is useful after fetching data from a server or during any asynchronous event.
- `mountChild(name, wrap, data)`: Mounts a new child component on a DOM element inside the current component.

The component re-renders itself automatically after calling an event handler, but you need to call this manually if there is no clear interaction to detect.

### References
You can obtain a handle to nested DOM elements or components via the `$refs` property:

```html
<div @name="my-component">

  <!-- Name a DOM node with the "ref" attribute -->
  <figure ref="image"></figure>

  <!-- Or with the "name" attribute -->
  <input name="email" placeholder="Hey, dude">

  <!-- Custom elements are automatically named -->
  <image-gallery/>

  <!-- Refs work in templates too -->
  <h3>{ $refs.email.placeholder }</h3>

  <script>

    // References are available after mount
    mounted() {
      // Get a handle to the image DOM node
      const image = this.$refs.image;

      // Get a handle to the image-gallery component API
      const gallery = this.$refs['image-gallery'];
    }
  </script>
</div>
```

### Sharing code between components
You can add and import shared code within a top-level `<script>` tag. Here’s an example library that defines both a shopping cart and a button component that adds items to the cart. The cart itself is defined in "cart.js", which is a plain JavaScript file. This cart is used by both components.

```html
<!-- Shared code -->
<script>
  import { shopping_cart, addToCart } from './cart.js';
</script>

<!-- Shopping cart component -->
<article @name="shopping-cart">
  <div :for="item in items">
    <h3>{ item.price }</h3>
    <p>{ item.amount }</p>
  </div>

  <script>
    constructor() {
      this.items = shopping_cart.getItems(); // Load initial items
    }
  </script>
</article>

<!-- "Add to cart" component -->
<button @name="add-to-cart" @click="click">
  <script>
    click() {
      addToCart(this.data); // Add item to the cart
    }
  </script>
</button>
```


## Summary
Nue opens the door to a new way of building web applications, allowing you to harness the power of Markdown extensions, server-side components, and client-side components — all with a simple and intuitive syntax. By focusing on an HTML-based approach, you can prioritize layout, structure, semantics, and accessibility, freeing yourself from the frustration of tangled JavaScript stack traces.
