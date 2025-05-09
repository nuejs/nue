
# Content collections

Content collections are arrays of content files where each entry represents a page or blog post. These entries contain metadata such as the title, description, thumbnail, and URL, making it easy to render lists of pages on index or blog pages.

## Content entries

Each content entry is generated from metadata stored in the **front matter** of your Markdown files. For example:

```yaml
 ---
 title: My Blog Post
 thumb: /img/my-thumb.png
 author: John Doe
 date: 2023-12-11
 ---
```

You can define essential metadata like `title`, `date`, and `description`. In addition to these fields, Nue also provides the following system-generated properties for each content entry:

- `url`: The URL path, e.g., "/docs/glossary/copyleft.html"
- `dir`: The directory path, e.g., "docs/glossary"
- `slug`: The filename, e.g., "copyleft.html"
- `basedir`: The base directory for the content, e.g., "docs"
- `filepath`: The path to the content file, e.g., "docs/index.md"

These properties help you organize and retrieve content entries more efficiently across your project.

## Defining a collection

To define a content collection, you can configure it directly in your app’s `.yaml` file as follows:

```yaml
content_collection: posts
```

This configuration creates a collection from all pages in the `posts` directory, with the collection name set to the directory name by default (e.g., "posts"). You can rename the collection by specifying a different name:

```yaml
collection_name: blog_posts
```

Collections are sorted by the `date` property in descending order, so the newest items appear first.

### Global or app-specific collections

Collections can be defined either globally or app-specifically:

- **Global collection**: Define the collection in `site.yaml` to make it accessible on all pages across the site.
- **App-specific collection**: Define the collection in a `.yaml` file within the app directory, making it available only to pages within that directory.

Content collections are optimized for performance, as Nue reads the data from the file system once, caches it, and uses the `collection_name` as the cache key to avoid redundant data access.

## Rendering collections

### Page list tag { #page-list }

The built-in `<page-list>` tag provides an easy way to render a list of pages or blog entries in a semantic layout. You can use this tag in layout modules:

```html
<page-list/>
```

Or directly in a Markdown file:

```md
[page-list]
```

#### HTML output

The `<page-list>` tag generates the following HTML structure:

```html
<ul>
  <li>
    <time datetime="2024-04-12T00:00:00.000Z">April 12, 2024</time>
    <a href="/blog/status-update-01/index.html">
      <h2>Summer 2024 status update</h2>
      <p>The past, present, and future of the Nue framework</p>
    </a>
  </li>
  <li>...</li>
</ul>
```

#### Image gallery layout { #gallery-layout }

When content entries include a `thumb` property, the layout adjusts to display an image gallery format:

```html
<ul>
  <li>
    <a href="/posts/scaleable-design-system.html">
      <figure>
        <img src="/posts/img/ui-thumb.png" loading="lazy" alt="Scalable design system">
        <figcaption>
          <time datetime="2023-05-22T00:00:00.000Z">May 22, 2023</time>
          <h2>Crafting a scalable CSS design system</h2>
        </figcaption>
      </figure>
    </a>
  </li>
  <li>...</li>
</ul>
```

Example: [simple-blog.nuejs.org](//simple-blog.nuejs.org/)

## Custom layouts

For full control over the rendered output, you can create a [custom component](custom-components.html). For example:

```html
<div :is="blog-posts">
  <div :for="post in posts">
    <img :src="post.thumb" alt="{ post.title } thumbnail">
    <h3>{ post.title }</h3>
    <p>{ post.description }</p>
  </div>
</div>
```

The `posts` variable is a standard JavaScript Array, which means you can use array methods to slice, map, and filter your collection as needed. You can also add JavaScript logic to customize the collection further.

```html
<div :is="blog-posts">
  <div :for="post in posts">
    <img :src="post.thumb" alt="{ post.title } thumbnail">
    <h3>{ post.title }</h3>
    <p>{ post.description }</p>
  </div>

  <script>
    constructor({ posts }) {
      this.posts = posts.filter(post => post.tags.includes('design'))
    }
  </script>
</div>
```

In this example, the `posts` variable is filtered to include only those entries with a specific tag (e.g., `design`). This approach lets you refine your displayed content dynamically within your custom component.
