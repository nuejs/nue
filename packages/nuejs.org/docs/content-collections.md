
# Content collections

A content collection is an array of content files, where each entry holds information about the content such as the title, description, and URL. You can use this collection to render a list of pages or blog entries.

## Content entries

Content information is stored in the "front matter" of each Markdown file. For example:

```yaml
\---
title: My Blog Post
thumb: /img/my-thumb.png
author: John Doe
date: 2023-12-11
\---
```

In addition to these user-defined properties, Nue provides the following system properties for each content entry.

- `url` "/docs/glossary/copyleft.html" (example)
- `dir` "docs/glossary"
- `slug` "copyleft.html"
- `basedir` "docs"

## Defining a collecion

Content collection is configured as follows:

```yaml
content_collection: posts
```

This will create a collection from all the pages inside the posts directory and the collection name is the same as the directory name. I.e. "posts". You can change the default name as follows:

```yaml
collection_name: blog_posts
```

Just like any other configuration option, you can also define the collection globally in `site.yaml` in which case you have the collection available on all your pages or you can define it inside your app on some `.yaml` file in which case the collection is available on all pages inside the application directory.

Content collections are "cheap" in a way that they don't cause much performance penalty when the site is generated. The collection data is read only once from the file system and then cached with the `collection_name` variable as a cache key.

## Rendering collections

### Gallery tag { #gallery }

Content collections are rendered with a `gallery` tag. This can be on your [layout modules](custom-layouts.html) for example.

```html
<gallery/>
```

Or on a Markdown page:

```md
[gallery]
```

#### Text-only HTML layout

The gallery tag is rendered as follows:

```html
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

#### Image gallery layout { #gallery-layout }

The HTML layout is different when the pages are configured with a [thumb](settings.html#thumb) property:

```html
<ul>
  <li>
    <a href="/posts/scaleable-design-system.html">
      <figure>
        <img src="/posts/img/ui-thumb.png" loading="lazy">
        <figcaption>
          <time datetime="2023-05-22T00:00:00.000Z">May 22, 2023</time>
          <h2>Crafting a scaleable CSS design system</h2>
        </figcaption>
      </figure>
    </a>
  </li>
  <li>...</li>
  <li>...</li>
  ...
</ul>
```

Example: [simple-blog.nuejs.org](//simple-blog.nuejs.org/)

## Custom page list layout

You can render the collections with fully customized markup with Nue's [template syntax](template-syntax.html) on your layout files. For example:

```html
<main>
  <div :for="post in •blog_posts•">
    <img :src="post.thumb">
    <h3>{ post.title }</h3>
    <p>{ post.description }</p>
  </div>
</div>
```

The `posts` variable is a regular JavaScript Array instance so you can slice, map, and filter it as you please:

```html
<div :for="post in posts.slice(0, 10)"> ... </div>
```

By default, collections are sorted by `date` property so the newest will be rendered first.
