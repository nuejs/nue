
# Template syntax
Nue offers a HTML-based template syntax, which is shared across your Markdown extensions, server components, and client-side components.

## Expressions

### Text expressions
The simplest form of expressions is placed inside curly brackets:

```html
<span>Text: { text }</span>
```

In this example, the brackets are replaced with the value of the `text` property from the corresponding component instance. This value will update on the client side whenever the `text` property changes, allowing for dynamic content rendering.

### HTML expressions
Single brackets interpret the data as plain text, while double brackets are used to output HTML. Here's how `{ value: 'Hello, <b>World</b>!' }` is rendered:

```html
<!-- Value is escaped: Hello, &lt;b&gt;World!&lt;/b&gt; -->
<p>{ value }</p>

<!-- Value is rendered as HTML: Hello, <b>World!</b> -->
<p>{{ value }}</p>

<!-- Same as the above (Vue compatibility) -->
<p :html="value"/>
```

Be cautious when rendering HTML, as it can lead to XSS vulnerabilities if the content is user-generated.

### Complex expressions
Nue supports the full power of JavaScript expressions within the curly brackets:

```html
<p>{ message.split('').reverse().join('') }</p>

<p>{ ok ? '👍' : '😡' }</p>
```

An expression is a piece of code that evaluates to a value. Therefore, the following will *NOT* work:

```html
<!-- This is a statement, not an expression -->
-{ var a = 1 }

<!-- Use a ternary expression, not flow control  -->
-{ if (ok) { return message } }
```

### Function calls
Expressions can also call [instance methods](#instances):

```html
<time :datetime="date.toISOString()">
  { prettyTime(date) }

  <script>
    prettyTime(date) {
      return MY_CUTE_FORMAT.format(date);
    }
  </script>
</time>
```

Be mindful that functions called within expressions run every time a reactive component updates. They should not produce side effects, such as altering data or triggering asynchronous operations.

## Attributes
You can pass values to your components using attributes. These values can be static or dynamic, and they can represent strings, numbers, arrays, or objects:

```html
<!-- Static parameter -->
<media title="Introduction to Nue"/>

<!-- Dynamic parameter -->
<media :title="item.title" :class="item.class"/>

<!-- Array value -->
<media-list :items="items"/>
```

All attribute values are accessible inside the component:

```html
<div @name="media">
  <h3>{ title }</h3>
</div>
```

Standard HTML attributes like `id`, `class`, `style`, and `data-*` remain on the element, while nonstandard attributes like `:title` are removed after the value is passed to the component.

### Interpolation
Nue supports both bracket syntax and [string interpolation](//en.wikipedia.org/wiki/String_interpolation) directly in attribute values:

```html
<!-- Attribute value with brackets -->
<input type="{ type }"></input>

<!-- Vue-style binding also works -->
<input :type="type"></input>

<!-- String interpolation with brackets -->
<div class="gallery { class }">

<!-- A more complex example -->
<div style="background: url('{ background }')">
```

### Boolean attributes
Nue automatically detects [boolean attributes](//html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes). In the following example, the `disabled` attribute will be included if `is_disabled` has a truthy value; otherwise, the attribute will be omitted.

```html
<button :disabled="is_disabled">Press me</button>
```

### Class attribute
Nue supports a special object notation to help render the `class` attribute:

```html
<label :class="field { is-active: isActive, has-error: hasError }"></label>
```

If both `isActive` and `hasError` are true, Nue will render:

```html
<label class="field is-active has-error"></label>
```

You can combine the object notation with other bracket expressions:

```html
<label :class="field { is-active: isActive } { getErrorClass() }"></label>
```

### Class attribute merging
The parent class attribute is automatically merged with the child's class attribute. Suppose we have the following component:

```html
<button @name="my-button" class="btn">Click me</button>
```

If we mount it as follows:

```html
<my-button class="large"/>
```

The final rendered button would combine both classes:

```html
<button class="btn large">Click me</button>
```

### Passing data with `:bind`
The `bind` directive makes every object property directly accessible from the component. Instead of writing `{ data.title }` inside the component, you can simply write `{ title }`. This is particularly useful when looping through components.

```html
<!-- Pass properties for the media object one by one -->
<media-object :for="item in items"
  :title="item.title"
  :desc="item.desc"
  :img="item.img"/>

<!-- Or pass all properties at once with :bind -->
<media-object :for="item in items" :bind="item"/>
```

### Rendering attributes with `:attr`
The `attr` directive renders a DOM attribute for each property in an object. So the following component:

```html
<p :attr="data">
  <script>
    data = {
      title: 'My title',
      alt: 'My alt',
    };
  </script>
</p>
```

Would be rendered as:

```html
<p title="My title" alt="My alt"></p>
```

### `$attrs` property
All parent attributes are accessible via the `$attrs` property. In this example, the nested input field will inherit all parent attributes.

```html
<label @name="field">
  <h5>{ title }</h5>
  <input :attr="$attrs">
</label>
```

When the above component is used as follows:

```html
<field title="Email" type="email" placeholder="me@acme.org" required="true"/>
```

The rendered HTML would be:

```html
<label>
  <h5>Email</h5>
  <input title="Email" type="email" placeholder="me@acme.org" required>
</label>
```

## Control flow

### :if condition
Use the `:if` attribute to conditionally render a block. The block will only be rendered if the given expression returns a truthy value.

```html
<figcaption :if="caption">{ caption }</figcaption>
```

### :else condition
Use `:else` to indicate an "else-block" for `:if`.

```html
<div>
  <h1 :if="cool">I'm cool!</h1>
  <h1 :else>I'm ordinary</h1>

  <button @click="cool = !cool">Toggle</button>
</div>
```

An `:else` element must immediately follow an `:if` or `:else-if` element; otherwise, it will not be recognized.

### :else-if condition
The `:else-if` serves as an "else if block" for `:if`. It can be chained multiple times:

```html
<b :if="type == 'A'">A</b>
<b :else-if="type == 'B'">B</b>
<b :else-if="type == 'C'">C</b>
<b :else>Not A/B/C</b>
```

Similar to `:else`, a `:else-if` element must immediately follow an `:if` or `:else-if` block.

### :for loop
Nue uses the `:for` attribute to iterate over lists and objects. Loops are defined with syntax like `item in items`, where `items` is the data array and `item` is the element being iterated:

```html
<ul>
  <li :for="item in items">
    { item.lang } = { item.text }
  </li>

  <script>
    items = [
      { lang: 'en', text: 'Hello' },
      { lang: 'es', text: 'Hola' },
      { lang: 'it', text: 'Ciao' },
      { lang: 'fi', text: 'Moi' }
    ];
  </script>
</ul>
```

Inside the loop, template expressions have access to the item being looped, as well as all parent properties. Additionally, `:for` supports an optional second alias for the index of the looped item:

```html
<li :for="(item, index) in items">
  { index }: { item.text }
</li>
```

You can use destructuring for the item variable, similar to destructuring function arguments:

```html
<li :for="{ lang, text } in items">
  { lang } = { text }
</li>
```

Destructuring and the index variable can be used together:

```html
<li :for="({ text }, index) in items">
  { text } { index }
</li>
```

Loops can be nested, and each `:for` scope has access to all parent scopes:

```html
<li :for="item in items">
  <p :for="child in item.children">
    { item

.text } { child.text }
  </p>
</li>
```

You can also use `of` as the delimiter instead of `in`, so that it is closer to JavaScript's syntax for iterators:

```html
<div :for="item of items"></div>
```

### Object loops
You can loop through object values using the standard `Object.entries()` method:

```html
<ul>
  <li :for="[lang, text] in Object.entries(items)">
    { lang } = { text }
  </li>
  <script>
    items = {
      en: 'Hello',
      es: 'Hola',
      it: 'Ciao',
      fi: 'Moi'
    };
  </script>
</ul>
```

You can provide an alias for the index variable as the third argument:

```html
<ul>
  <li :for="[lang, text, index] in Object.entries(items)">
    { index } / { lang } = { text }
  </li>
</ul>
```

### Conditional loops
When `:if` and `:for` exist in the same node, `:if` has a higher priority. This means the `:if` condition is evaluated first.

```html
<li :for="todo in todos" :if="todos">
  {{ todo.name }}
</li>
```

Use the standard `hidden` property to conditionally hide elements inside a loop:

```html
<li :for="todo in todos" :hidden="!todo.is_complete">
  {{ todo.name }}
</li>
```

### Component loops
Components can also be looped:

```html
<my-component :for="item in items"/>
```

You can pass the iterated data to the component with attributes:

```html
<my-component
  :for="(item, index) in items"
  :item="item"
  :index="index"
/>
```

Alternatively, you can use the [`:bind` attribute](#bind) to pass all the data at once:

```html
<my-component :for="item in items" :bind="item"/>
```

The `bind` attribute makes the item properties accessible directly to the component. So instead of `{ item.title }`, you can write `{ title }` inside the component.
