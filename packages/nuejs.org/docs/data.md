
### Data
Each page is backed with different kinds of data:



## Metadata
like title, description, theme color, favicon and hero image. This data is made accessible for search engines and [content collections](content-collections.html).


### thumb
A thumbnail image for the document when listed and rendered by the [gallery](content-collections.html#gallery) tag.

### title_template
Allows formatting the value of the `<title>` tag in the way you like. A value such as `'%s | Acme Inc.'` prints "My page | Acme Inc." where the `%s` is replaced by the page title.


### og
Relative path to open graph image. Please also supply the [origin property](#origin) to turn this value into an absolute URL, which is the required format.

### robots
Value for "robots" meta property. Use "noindex" to exclude the page from search engines.


### title
The value of the `<title>` tag — the most important meta tag for SEO. By default, this is the value of the Markdown `# Level one title` if not explicitly defined.


### author
The author meta tag.

### class
CSS class name for the body element.

### date
The publication date of the article. The content collections are sorted by this property. The most recent one is listed as the first article.

### description
The value for the description meta tag.



## Front matter
You can pass optional [settings and metadata](settings.html) in the "front matter" section of the page. This is the first thing in your file between triple-dashed (`---`) lines taking a valid YAML format:


```yaml
\---
title: Page title
desc: Page description for search engines
og: /img/hero-image.png
\---
```