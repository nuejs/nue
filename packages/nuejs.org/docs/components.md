
### Layout components
You can create custom layout components and custom Markdown extensions for content authors with Nue's layout syntax. Here, for example, is a generic author component:

```html
<div @name="author" class="author">
  <span><img :src="img" width="36" height="36"></span>

  <aside>
    <b>{ name }</b>
    <a href="//x.com/{ username }">@{ username }</a>
  </aside>
</div>
```





