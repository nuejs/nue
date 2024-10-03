---
# complementary: false
---

# Styling
Nue relies on external CSS for designs by using exactly the same markup between projects. Nues Markdown can trust that the generated markup always has the same, limited set of elements whose HTML structure remains the same. This allows developers to use CSS to style the content differently based on the context. Be it blogging, marketing content, or technical documentation.

[image.gridpaper]
  small: /img/global-design-system.png
  large: /img/global-design-system-big.png
  caption: Same layout, wildly different designs
  size: 747 × 394 px


**Modernization** The CSS is processed with [Lightning CSS](//lightningcss.dev/) to take advantage of the modern/future features like nesting and color functions. It also parses CSS for any errors and Nue displays them to you on the browser.


**Organization** Nue keeps track of your [page dependencies](project-structure.html#page-dependencies) and helps you take maximum advantage of the CSS cascade.

**Best practices** Nue offers [tips and recipes](css-best-practices.html) for writing reusable CSS that is easy to manage and scale. You typically end up with 10-100 times less code than in a traditional JavaScript-powered system.



## Page layout
Nue [extends](content.html) the basic Markdown syntax to make it suitable for assembling rich web pages. This content is nested inside an `article` element:


```html
<body>
  <main>
    <article>
>     <section>
>       <p>The content goes here</p>
>     </section>
    </article>
  </main>
</body>
```


## Sections
The content is always nested inside one or more section elements. A multi-section HTML output looks like this:

```html
<article>

> <section>
    <h1>Hello, World!</h1>
    <p>First section</p>
  </section>

> <section>
    <h2 id="hello-again">
      <a href="#hello-again" title="Hello again"></a>Hello again
    </h2>
    <p>Another section</p>
  </section>

</article>
```

The `section` elements are direct descendants of the article and cannot occur anywhere else on the page.



### Section classes
You typically want to define classes for the sections for styling purposes. These classes (and IDs) can be defined explicitly after the section separator. For example:


```md
\--- •#my-id.class-name•

# Section title
And a description
```

This will generate the following:

```html
<article>
  <section id="ux" class="features">...</section>
  ...
</article>
```

However, it's better to define these classes in the application data or the document's front matter. For example, the [front page](/) of this website has the following:

```yaml
sections: [hero, features, explainer, status, feedback]
```

Defining the classes outside the Markdown keeps the content clean and raises fewer questions from the copywriters.
