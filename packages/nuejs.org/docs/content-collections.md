

# Content collections
A content collection is an array of content files, where each entry holds information about the content such as the title, description, and URL. You can use this collection to render a list of pages or blog entries.


## Content entries
Content information is stored in the "front matter" of each Markdown file. For example:

``` yaml
 ---
 title: My Blog Post
 thumb: /img/my-thumb.png
 author: John Doe
 date: 2023-12-11
 ---
```

In addition to these user-defined properties, Nue provides the following system properties for each content entry.

[.reference]
  * *`url`* "/docs/glossary/copyleft.html" (example)
  * *`dir`* "docs/glossary"
  * *`slug`* "copyleft.html"
  * *`basedir`* "docs"



## Defining a collecion
Content collection is configured as follows:

``` yaml
content_collection: posts
```

This will create a collection from all the pages inside the posts directory and the collection name is the same as the directory name. Ie "posts". You can change the default name as follows:

```
collection_name: blog_posts
```

Just like any other configuration option, you can also define the collection globally in `site.yaml` in which case you have the collection available on all your pages or you can define it inside your app on `app.yaml` in which case the collection is available on all pages inside the application directory.

Content collections are "cheap" in a way that they don't cause much performance penalty when the site is generated. The collection data is read only once from the file system and then cached with the `collection_name` variable as a cache key.



## Rendering collections


### Page-list tag
You can render the collection on your [layout modules](custom-layots.html) with a `page-list` tag:

```
<page-list/>
```

Or on a Markdown page:

``` md
[page-list]
```


#### HTML layout
Page lists are rendered as follows:

```
<ul>
  <li>
    <time datetime="2024-04-12T00:00:00.000Z">April 12, 2024</time>
    <a href="/blog/status-update-01/index.html">
      <h2>Summer 2024 status update</h2>
      <p>The past, present, and the future of the Nue framework</p>
    </a>
  </li>
  <li>...</li>
  <li>...</li>
  ...
</ul>
```

As always, you use CSS to make your markup compatible with your design system.



## Custom layout
You can render the collections with fully customized markup with Nue's [template syntax](template-syntax.html) on your layout files. For example:


```
<main>
  <div :for="post in •blog_posts•">
    <img :src="post.thumb">
    <h3>{ post.title }</h3>
    <p>{ post.description }</p>
  </div>
</div>
```

The `posts` variable is a regular JavasSript Array instance so you can slice, map, and filter it as you please:

```
<div :for="post in posts.slice(0, 10)"> ... </div>
```

By default, collections are sorted by `date` property so the the newest will be rendered first.


