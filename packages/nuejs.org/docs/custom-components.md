
# Custom components
Nue's layout is built around custom components designed to enhance web development with a semantic approach. There are four types of components:

- **Markdown extensions**: Extend the Markdown syntax with custom tags for greater flexibility.
- **Layout modules**: Fill the slots in the [page layout](layout.html) to create structured designs.
- **Layout components**: Custom server-side components that reside within the layout modules, allowing for dynamic content.
- **Islands**: Interactive [islands](islands.html) rendered on the client side (CSR), enhancing the user experience with minimal JavaScript.

## Component syntax
Nue features a built-in HTML-based template language that simplifies the development of both server- and client-side components.

### Like React, but semantic
Nue components bring the power of React-like functionality while prioritizing semantic web principles. Think of them as programmable HTML fragments that function seamlessly on both the server and client sides. With a focus on clean, semantic markup, Nue enables developers to progressively enhance their applications without compromising structure.

Whereas React can be seen as "just JavaScript," Nue is "just HTML." Any valid HTML in Nue is also a valid component, making it intuitive and accessible.

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
Custom components are mounted in Markdown content just like the built-in [content tags](content-tags.html), using square brackets:

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
If a component is not defined server-side in a `.html` file, it can still be rendered directly as a custom element on the client side:

```html
<!-- this gets rendered on the client-side -->
<image-gallery custom="image-gallery"/>
```

In this case, the component is automatically mounted on the client side. Nue will first look for an implementation of the component or island defined in a `.dhtml` file. If it is not found, a standard Web Component will be mounted as specified in a `.js` or `.ts` file. This allows for flexibility in using interactive elements without the need for server-side definitions.

### Passing data
You can pass data to your components using attributes. These attributes can either be direct values or reference data from the [application data](settings.md) when the attribute name starts with a colon. This flexibility allows for dynamic data handling within your components.

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

#### Client-side components
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

## Scripting
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

The scripting block helps to extract complex JavaScript logic from the [HTML template block](template-syntax.html), resulting in cleaner and more readable markup. This is particularly important for [interactive islands](island-syntax.html), where the amount of scripting is typically much higher.

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


## Summary
Nue opens the door to a new way of building web applications, allowing you to harness the power of Markdown extensions, server-side components, and client-side components—all with a simple and intuitive syntax. By focusing on an HTML-based approach, you can prioritize layout, structure, semantics, and accessibility, freeing yourself from the frustration of tangled JavaScript stack traces.
