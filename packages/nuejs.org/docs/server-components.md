
This documentation area, for example, has the following documentation-specific layouts in [docs/layout.html](//github.com/nuejs/nue/blob/master/packages/nuejs.org/docs/layout.html):


```html
<!-- main sidebar (left) -->
<aside id="sidebar" popover>
  <button popovertarget="sidebar">&times;</button>
  <navi :items="sidenav"/>
</aside>


<!-- complementary sidebar (right) -->
<aside @name="complementary">
  <h3>{ lang.this_page }</h3>
  <toc is="observing-nav"/>

  <div class="zen-toggle">
    <h5>Zen Mode</h5>
    <label class="toggle">
      <input type="checkbox" is="zen-toggle">
    </label>
  </div>
</aside>

<!-- the back button below the global header -->
<nav @name="subheader">
  <button popovertarget="sidebar"/>
  <strong>{ lang.menu } &rsaquo; { title }</strong>
</nav>
```