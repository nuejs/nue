
# Template syntax
Nue has a built-in template language for developing server-side layouts and reactive, client-side components.


## Extended HTML
Nue template syntax is designed for [UX developers](/docs/) who prefer to write user interfaces with clean, semantic HTML instead of JavaScript. Think Nue as standard HTML, that you can extend with custom HTML-based components. These components help you build modern web applications in a simple, declarative way. For example:


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

If React is "Just JavaScript", then Nue is "Just HTML" because any valid HTML is also valid Nue.



### Custom components
Custom components are the building blocks of your HTML-based layouts and apps. You can loop over them, render them conditionally, and they can be nested within other components. They can operate both server-side and client-side. Essentially components are HTML fragments that have a name and this name is given in a `@name` attribute:

```html
<div •@name="media-object"• class="{ class }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p>{ desc }</p>
  </aside>
</div>
```

You can place components inside other components to form more complex applications and tree-like structures. For example:

```html
<section @name="image-gallery" class="gallery">
  <header>
    <h1>{ title }</h1>
    <p>{ desc }</p>
  </header>

  <!-- array of images -->
  <image-object :for="item in items" :bind="item"/>
</section>
```

The client-side, [reactive components](reactive-components.html) are interactive: They can respond to user input and render themselves to a new state.


### Mounting
Nue allows you to define multiple components in a single file with a `.htm` or `.nue` extension. After being saved, you can mount components in your Markdown files. For example:

```md
[image-gallery]
```

You can also mount them within your server-side [layout components](custom-layouts.html)

```html
<image-gallery/>
```


### Scripting
Nue components are like [ES6 classes](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes): With instance variables and methods. You can reference these variables and call the methods from the template code:

```html
<div @name="media-object" class="{ type }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p>{ format(desc) }</p>
  </aside>

  <!-- instance variables and methods -->
  <script>

    // instance variable
    •title• = 'Default title'

    // called when the component is created
    •constructor(opts)• {
      console.info(opts.index)
    }

    // a method called by the template
    •format(value)• {

    }
  </script>

</div>
```

ES6 classes make your code look amazingly compact and clean and you can use modern JavaScript powers like getters, setters and `async` methods.

Check out the reasoning behind classes and the HTML-based syntax from our blog entry: [Rethinking reactivity](/blog/rethinking-reactivity/)



### Passing data
You can pass data to your components with attributes. These can be static or dynamic, and the values can be anything: Strings, numbers, arrays and objects. Here we pass a simple number:

```md
[image-gallery index="1"]
```

### The &lt;script&gt; tag { #script-tag }
The instance variables are defined in the script tag that is a direct descendant of the parent. Other script tags are simply removed unless they have a `type` or `src` attribute:

```html
<!-- passed to the client directly -->
<script async
  src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"></script>

<!-- same here -->
<script type="text/javascript">
  console.info({ hello: 'World' })
</script>
```

You can also use a `client` attribute in place of the old-school `type="text/javascript"`:

```html
<script client>
  console.info('hey')
</script>
```

Is rendered as

```html
<script>
  console.info('hey')
</script>
```



### Slots
Slots help you build highly reusable, multi-purpose components. They enable a parent component to inherit functionality from a child:

```html
<!-- parent component -->
<div class="{ type }">
  <img src="{ img }">
  <aside>
    <h3>{ title }</h3>
    <p>{ desc }</p>
>   <slot/>
  </aside>
</div>
```

Now we can pass custom content for the parent:

```html
<media-object :for="item in items" :bind="item">

  <!-- the <slot/> is replaced with this nested markupd -->
  <h4>{ item.price }</h4>
  <button>Add to cart</button>

</media-object>
```

The slot element in the media object is replaced with the nested content in the loop. The nested content can contain anything: Text, HTML tags, other custom components like product rating, a comment section or product metadata.



## Expressions


### Text expressions
The simplest form of expressions are placed inside curly brackets:

```html
<span>Text: { text }</span>
```

The brackets are replaced with the value of the `text` property from the corresponding component instance. The value will be updated on the client side whenever the `text` property changes.


### HTML expressions
The single brackets interpret the data as plain text, not HTML. To output HTML, you will need to use double brackets. Here's how `{ value: 'Hello, <b>World</b>!' }` is rendered:

```html
<!-- Value is escaped: Hello, &lt;b&gt;World!&lt;/b&gt; -->
<p>{ value }</p>

<!-- Value is rendered as HTML: Hello, <b>World!</b> -->
<p>{{ value }}</p>

<!-- Same as the above (Vue compatibility) -->
<p :html="value"/>
```

Be aware that rendering HTML can lead to XSS vulnerabilities if the content is user-generated.


### Complex expressions
Nue supports the full power of JavaScript expressions inside expressions:

```html
<p>{ message.split('').reverse().join('') }</p>

<p>{ ok ? '👍' : '😡' }</p>
```

An expression is a piece of code that can be evaluated to a value. Therefore, the following will *NOT* work:

```html
<!-- this is a statement, not an expression -->
{ var a = 1 }

<!-- use a ternary expression, not flow control  -->
{ if (ok) { return message } }
```

### Function calls
Expressions can call [instance methods](#instances):

```html
<time :datetime="date.toISOString()">
  { prettyTime(date) }

  <script>
    prettyTime(date) {
      return MY_CUTE_FORMAT.format(date)
    }
  </script>
</time>
```

Functions inside expressions are called every time a reactive component updates, so they should not have any side effects, such as changing data or triggering asynchronous operations.


## Attributes
You can pass values to your components with attributes. These values can be static or dynamic, and the values can be anything: Strings, numbers, arrays and objects:

```html
<!-- static parameter -->
<media title="Introduction to Nue"/>

<!-- dynamic parameter -->
<media :title="item.title" :class="item.class"/>

<!-- array value -->
<media-list :items="items"/>
```

All the attribute values are available inside the component:

```html
<div @name="media">
  <h3>{ title }</h3>
</div>
```

Standard HTML attributes like `id`, `class`, `style`, and `data-*` remain on the element. Nonstandard attributes like `:title` are removed after the value is passed to the component.


### Interpolation
Nue supports the bracket syntax or [string interpolation](//en.wikipedia.org/wiki/String_interpolation) directly in attribute values:

```html
<!-- attribute value with brackets -->
<input type="{ type }"></input>

<!-- Vue-style binding also works -->
<input :type="type"></input>

<!-- string interpolation with brackets -->
<div class="gallery { class }">

<!-- a more complex example -->
<div style="background: url('{ background }')">
```


### Boolean Attributes
Nue automatically detects [boolean attributes](//html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes). In the following example, the `disabled` attribute will be included if `is_disabled` has a truthy value, otherwise the attribute will be omitted.

```html
<button :disabled="is_disabled">Press me</button>
```


### Class attribute { #class }
Nue supports a special object notation to help render the `class` attribute:

```html
<label :class="field { is-active: isActive, has-error: hasError }"></label>
```

If both `isActive` and `hasError` are truthful Nue will render:

```html
<label class="field is-active has-error"></label>
```

You can combine the object notation with other bracket expressions:

```html
<label :class="field { is-active: isActive } { getErrorClass() }"></label>
```



### Class attribute merging
The parent class attribute is automatically merged with the child's class attribute: Suppose we have the following component:

```html
<button @name="my-button" class="btn">Click me</button>
```

And we mount it as follows:

```html
<my-button class="large"/>
```

Then the final rendered button would merge both classes:

```html
<button class="btn large">click me</button>
```


### Passing data with `:bind` { #bind }
The bind directive makes every object property directly accessible from the component. Instead of writing `{ data.title }` inside the component, you can just write `{ title }`. This is particularly useful when looping components.

```html
<!-- pass properties for the media object one by one -->
<media-object :for="item in items"
  :title="item.title"
  :desc="item.desc"
  :img="item.img"/>

<!-- or pass all properties at once with :bind -->
<media-object :for="item in items" :bind="item"/>
```



### Rendering attributes with `:attr` { #attr }
Attr directive renders a DOM attribute for each property in an object. So the following components:

```html
<p :attr="data">
  <script>
    data = {
      title: 'My title',
      alt: 'My alt',
    }
  </script>
</p>
```

would be rendered as:

```html
<p title="My title" alt="My alt"></p>
```


### `$attrs` property
All parent attributes are available via the `$attrs` property. Here, the nested input field will inherit all parent attributes.

```html
<label @name="field">
  <h5>{ title }</h5>
! <input :attr="$attrs">
</label>
```

When the above component is used as follows:

```html
<field title="Email" type="email" placeholder="me@acme.org" required="true"/>
```

the rendered HTML would be:

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
Use `:else` to indicate an "else block" for `:if`

```html
<div>
  <h1 :if="cool">I'm cool!</h1>
  <h1 :else>I'm ordinary</h1>

  <button @click="cool = !cool">Toggle</button>
</div>
```

An `:else` element must immediately follow an `:if` or `:else-if` element — otherwise it will not be recognized.


### :else-if condition
The `:else-if` serves as an "else if block" for `:if`. It can be chained multiple times:

```html
<b :if="type == 'A'">A</b>

<b :else-if="type == 'B'">B</b>

<b :else-if="type == 'C'">C </b>

<b :else>Not A/B/C</b>
```

Similar to `:else`, a `:else-if` element must immediately follow a `:if` or a `:else-if` block.




### :for loop
Nue uses the `:for` attribute to iterate over lists and objects. Loops are defined with syntax like `item in items`, where `items` is the data array and `item` is the element being iterated:

```html
<ul>
  <li •:for="item in items"•>
    { item.lang } = { item.text }
  </li>

  <script>
    items = [
      { lang: 'en', text: 'Hello' },
      { lang: 'es', text: 'Hola' },
      { lang: 'it', text: 'Ciao' },
      { lang: 'fi', text: 'Moi' }
    ]
  </script>
</ul>
```

Inside the loop, template expressions have access to the item being looped, as well as all parent properties. In addition, `:for` supports an optional second alias for the index of the looped item:

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

Loops can be nested and each `:for` scope has access to all parent scopes.

```html
<li :for="item in items">
  <p :for="child in item.children">
    { item.text } { child.text }
  </p>
</li>
```

You can also use `of` as the delimiter instead of `in` so that it is closer to JavaScript's syntax for iterators:

```html
<div :for="item of items"></div>
```


### Object loops
You can loop through Object values using the standard `Object.entries()` method:

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
    }
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
When they exist in the same node, :if has a higher priority than :for. That means the :if is executed first.

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

or you can use [`:bind` attribute](#bind) to pass all the data at once:

```html
<my-component :for="item in items" :bind="item"/>
```

The bind attribute makes the item properties accessible directly to the component. So instead of `{ item.title }` you can write `{ title }` inside the component.

