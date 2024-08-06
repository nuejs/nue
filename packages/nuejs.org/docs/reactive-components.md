
---
# gallery, media-object
include: [demos, button]
---

# Reactive components
Reactive components have the same [template syntax](template-syntax.html) and mounting techniques as the server-side components, but reactive components have  extra interactive capabilities: they can respond to user input and render themselves to a new state. They have two use-cases:


1. *Islands of interactivity*: use a reactive component when you need more rendering capabilities than what a standard web component can offer. Things like feedback- and login forms, registration flows, or any sort of component with rich interactive features.

2. *Single-page applications*: reactive components are the building blocks for [single-page applications](single-page-applications.html)



## Components
Here is a simple image gallery component. You can navigate the images with the arrow icons and the small gray dots:

[image-gallery]
  images: [tomatoes.jpg, lemons.jpg, peas.jpg, popcorn.jpg]
  basedir: /img


Here's the source code for the reactive component:

```
<div @name="image-gallery" class="image-gallery" translate="no">

  <a class="seek prev" @click="index--" :if="index"></a>
  <img src="{ basedir }/{ images[index] }">
  <a class="seek next" @click="index++" :if="index + 1 < images.length"></a>

  <nav>
    <a :for="src, i in images" class="{ current: i == index }" @click="index = i"></a>
  </nav>

  <script>
    index = 0
  </script>

</div>
```

Inside the component, all the control flow operations like loops and conditionals are _reactive_ — they respond to user events and render themselves to a new "state". Here, we have a numeric state variable `index`, which gets updated as the user clicks the navigational elements and the UI automatically changes based on what the value of this variable is.



## Event handlers
Attributes starting with the `@` symbol define an event handler. These are JavaScript functions that are called on user interaction like click, keypress or mouse move.


### Inline handlers
Inline handlers are defined directly on the attribute:

```
<button @click="count++">Increment</button>
```

Inline handlers are good for simple expressions.


### Method handlers
More complex functionality should be relegated to an instance method:

```
<dialog>
  <button @click="close">Close</button>

  <script>
    close() {
      this.root.close()
      location.hash = ''
    }
  </script>
</dialog>
```


### Method calls
You can pass arguments for the method calls:

```
<div>
  <button @click="say('yo!')">Say yo!</button>

  <script>
    say(msg) {
      console.log(msg)
    }
  </script>
</div>
```


### Event argument
The method handler always receives [Event object](//developer.mozilla.org/en-US/docs/Web/API/Event) as the last argument, unless it is explicitly given on the method call with a name `$event`:

```
<div>
  <button @click="first">First</button>
  <button @click="second('Hello')">World</button>
  <button @click="third('Hello', $event, 'World')">Nue</button>

  <script>
    // prints "First"
    first($event) {
      console.info($event.target.textContent)
    }

    // prints "Hello World"
    second(hey, $event) {
      console.info(hey, $event.target.textContent)
    }

    // prints "Hello Nue World"
    third(hey, $event, who) {
      console.info(hey, $event.target.textContent, who)
    }
  </script>
</div>
```


### Event modifiers
Nue provides some handy shortcuts to deal with the common DOM event manipulation functions. For example, `@submit.prevent` is a shortcut to [event.preventDefault()](//developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault).

```
<!-- prevent the default event from occurring-->
<form @submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- run the modifier only -->
<form @submit.prevent></form>
```

The following modifiers are supported:

- *.prevent* prevents the default behavior of the event from occurring
- *.stop* prevents further [propagation](//developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) of the event
- *.self* only trigger handler if `event.target` is the element itself
- *.once* the event will be triggered at most once



### Key modifiers
Key modifier binds the event handler to a specific keyboard key:

```
<!-- only call `submit` when the `key` is `Enter` -->
<input @keyup.enter="submit">
```

You can directly use any valid key names exposed via [KeyboardEvent.key](//developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) as modifiers by converting them to kebab-case. So the following handler will only be called if `event.key` is equal to 'PageDown'.

```
<input @keyup.page-down="onPageDown">
```

Nue provides the following aliases for the most commonly used keys:

- `.enter` captures both "Enter" and "Return"
- `.delete` captures both "Delete" and "Backspace" keys
- `.esc` captures both "Esc" and "Escape"
- `.space` captures "Spacebar", " ", "Space Bar"
- `.up` captures "Up" and "ArrowUp"
- `.down` captures "Down" and "ArrowDown"
- `.left` captures "Left" and "ArrowLeft"
- `.right` captures "Right" and "ArrowRight"



## Reactive arrays
When you define a for loop, with the `:for`- expression, Nue detects whether the looped array is mutated and triggers necessary UI updates. These [array methods](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) include:

* `push(item)` adds a new item to the end of the array
* `unshift(item)` adds a new item to the head of the array
* `sort(fn)` sorts items based on the given function
* `reverse()` reverses the order of items
* `splice(start, count)` removes items from the array
* `shift()`
* `pop()`
* `remove(item)` a Nue-specific helper method to remove the given item from the array



### Replacing the array

Mutation methods mutate the original array they are called on. The non-mutating methods like `filter(), concat()` and `slice()` always return a new array in which case you should replace the old array with the new one and Nue will render accordingly:

```
search() {
  this.items = this.items.filter(item => item.text.match(/Foo/))
}
```

### Loop animations
Nue lets you define an `oninsert` callback function that is called every time a new item is added to any of the array properties in the component. This gives you a chance to add a CSS transition effect (among other things) for the newly added DOM nodes. For example:

[animation-demo]
  - title: Alex Martinez
    desc: Lead frontend developer
    img: /img/face-3.jpg
  - title: Sarah Park
    desc: UI/UX Designer
    img: /img/face-4.jpg
  - title: Jamie Huang
    desc: JS/TS developer
    img: /img/face-2.jpg
  - title: Heidi Blum
    desc: UX developer
    img: /img/face-1.jpg
  - title: Adam Nattie
    desc: Backend developer
    img: /img/face-5.jpg
  - title: Mila Harrison
    desc: Senior frontend developer
    img: /img/face-6.jpg


Here's the source code for the above demo:

```
<div @name="animation-demo">

  <button @click="addUser" :disabled="users[5]">
    Add user
  </button>

  <div class="grid">
    <media-object :for="user in users" :bind="user"/>
  </div>

  <script>

    // fill list with the first three available items
    constructor({ items }) {
      this.users = items.slice(0, 2)
    }

    // insert a new user from the available items
    addUser() {
      const { items, users } = this
      const user = items[users.length]
      if (user) users.push(user)
    }

    // add a CSS transition class to a newly added dom nodes
    oninsert(node) {
>     setTimeout(() => node.classList.add('fade-in'), 1)
    }
  </script>

</div>
```




## Component instances

### Lifecycle methods
Each component instance goes through a series of steps during its lifetime: first, it is created, then mounted on the page, and then it gets updated one or more times. Sometimes the component is removed or "unmounted" from the page.

You can hook custom functionality to these steps by creating instance methods with a specific name:

```
<script>

  // when the component is created. data/args is given as the first argument
  constructor(data) {

  }

  // after the component is mounted on the page
  mounted(data) {

  }

  // after the component is updated
  updated() {

  }

  // after the component is removed from the page
  unmounted() {

  }
</script>
```

Inside the callback function `this` points to [instance API](#api).


### Instancer API { #api }
The component API is accessible via `this` variable inside the lifecycle methods. It has the following attributes and methods:


`root` the root DOM node of the component instance

`$el` alias for "root"

`$parent` is the root DOM node of the parent instance

`$refs` access to named DOM nodes and inner components inside the component

`mount(root: DOMElement)` mounts the instance to the given root element

`unmount()` removes the component from the current component tree

`update(data?: Object)` forces the component instance to re-render itself with optional data. You typically call this event after fetching data from the server or some other asynchronous event.

`mountChild(name, wrap, data)` mounts a new child component on a DOM element inside the current component.

The component re-renders itself automatically after calling an event handler, but you need to call this manually if there is no clear interaction to be detected.


### References { #refs }
You can get a handle to nested DOM element or components  via `$refs` property:

```
<div @name="my-component">

  <!-- name a DOM node with "ref" attribute -->
  <figure ref="image"></figure>

  <!-- or with "name" attribute -->
  <input name="email" placeholder="Hey, dude">

  <!-- custom elements are automatically named -->
  <image-gallery/>

  <!-- refs work on templates too-->
  <h3>{ $refs.email.placeholder }</h3>

  <script>

    // references are available after mount
    mounted() {

      // get a handle to the image DOM node
      const image = this.$refs.image

      // get a handle to image-gallery component API
      const gallery = this.$refs['image-gallery']
    }
  </script>
</div>
```



### Sharing code between components
You can add and import shared code inside a top-level `<script>` tag.
Here's an example library that defines both a shopping cart and a button component that adds items to the cart. The cart itself is defined in "cart.js", which is a plain JavaScript file. This cart is used by both components.

```
<!-- shared code -->
<script>
|  import { shopping_cart, addToCart } from './cart.js'
</script>

<!-- shopping bag component -->
<article @name="shopping-cart">
  <div :for="item in items">
    <h3>{ item.price }</h3>
    <p>{ item.amount }</p>
  </div>

  <script>
    constructor() {
     this.items = shopping_cart.getItems()
    }
  </script>
</article>

<!-- "add to cart" component -->
<button @name="add-to-cart" @click="click">
  <script>
    click() {
     addToCart(this.data)
    }
  </script>
</button>
```




