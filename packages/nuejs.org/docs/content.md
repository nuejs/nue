
# Content-first approach in Nue

Content is **first** in Nue. It shapes how your site is built, ensuring that design evolves around content. This approach aligns with the principle of progressive enhancement, ensuring that the structure, functionality, and design follow from the content.


[image]
  small: /img/content-development.png
  large: /img/content-development-big.png
  caption: Website development starts from content design


## Structured data

Structured data in Nue includes:

- **Information architecture**: Defines how content is organized, ensuring clear navigation and user flow.
- **Content metadata**: Includes essential details like title, description, author, date, and Open Graph (OG) images for each content piece.
- **Application data**: Covers specific data used across the site, such as products, team members, language tokens, etc.
- **Content collections**: Auto-generated [content collections](content-collections.html) based on metadata, typically used for page lists, like blog posts displayed on an index page.

By separating structured data from the layout, your design modules stay clean and focused on **structure, semantics**, and **accessibility**.


### YAML format
Nue uses **YAML** for structured data because of its simplicity, readability, and flexibility. YAML’s syntax is easy to write and understand, which makes it a popular choice for both developers and content editors. Here’s an example that defines a navigation structure in Nue:

```yaml
Building websites:
  - Step-by-step tutorial: tutorial.html
  - Project structure: project-structure.html
  - Content: content.html
```

YAML excels at handling complex structures, such as **nested arrays**, which is ideal for organizing complex datasets in Nue. Unlike alternatives like **TOML**, YAML’s expressive syntax makes it easier to represent hierarchical data. Additionally, YAML has resolved its infamous issues, such as the **"Norway problem"**.


## Information architecture { #ia }

**Information architecture** defines the relationships between pages, sections, and content. This hierarchy determines how users interact with your site and how content is presented. This website, for example, uses a global [navigation.yaml](//github.com/nuejs/nue/blob/dev/packages/nuejs.org/%40global/navigation.yaml) to define the site's navigation. It looks like this:

```yaml
globalnav:

  # master navigation
  main:
    - Home: /
    - Docs: /docs/
    - Blog: /blog/
    ...

  # toolbar
  toolbar:
    - Feed: //x.com/tipiirai
    ...

  # "burger menu"
  menu:
    - Home: /
    - Docs: /docs/
    - Blog: /blog/

documentation:

  Getting started:
    - Why Nue: /docs/
    - How it works: /docs/how-it-works.html
    - Installation: /docs/installation.html
    - ...

```

This data is used by [layout modules](layout.html) to generate elements like menus, sidebars, and breadcrumbs.


## Content metadata

**Metadata** like titles, descriptions, authors, and OG properties can be defined at three levels: global, app, and page. This flexible, layered approach ensures consistency while allowing overrides when necessary.

### Global data

At the **global level**, metadata is defined in the `site.yaml` file. For example, a `title_template` can dynamically format page titles:

```yaml
# In site.yaml
title_template: "%s / Nue Framework"
description: "The design engineering framework for the web"
```

This structure ensures that all pages follow the same title format.

### Application data

At the **app level**, you can override the global metadata for specific apps, like a blog:

```yaml
# In blog/blog.yaml
title: "Blog"
title_template: "%s / Blog"
description: "Latest news"
author: "John Doe"
og_image: "/images/blog-og.jpg"
```

### Page data

At the **page level**, metadata can be further customized via front matter in Markdown files:

```yaml
 # In a page's front matter (Markdown)
 ---
 title: "Getting Started with Nue"
 description: "Learn the basics of setting up your first project"
 ---
```

### Summary: data inheritance
As you move from the site level to the page level, the data gets extended or overridden, allowing for granular control over content and settings.

[image.gridpaper]
  small: /img/data-propagation.png
  large: /img/data-propagation-big.png
  caption: Data inheritance in Nue




## Unstructured content

Unstructured content in Nue varies in terms of its **richness and interactivity**:

- **Technical content**: Includes detailed information with lists, tables, and code blocks.
- **Marketing content**: Visual-heavy content like landing pages and promotional sections, often including images, videos, and interactive elements.
- **Blog content**: A mix of technical and interactive content, typically starting with a hero section.
- **Formal content**: Plain text like legal documents or policies.

### Extended Markdown

Nue supports an [extended Markdown syntax](content-syntax.html) that handles all these types of content seamlessly, including code blocks, tables, complex layouts, tabs, and interactive elements. It remains **SEO-friendly** and fully **accessible**.

[image.bordered]
  caption: Nue's extended Markdown syntax handles all varieties of content
  small: /img/content-files.png
  large: /img/content-files-big.png
  size: 745 × 383



### Cloud storage

While the current YAML/Markdown-based editing is well-suited for technical users, we recognize the need for a cloud storage solution for non-technical users. This will allow content management directly through the website. A cloud-based backend is on our roadmap, aligning with Nue's **decoupled architecture**, where content can be fetched from the cloud before rendering. See the [roadmap](/#roadmap) for more details.

## Content-first development

**Content-first development** is a central philosophy in Nue, ensuring both engineers and designers focus on the content, guiding the structure, functionality, and design of the site.

### For engineers: Semantic web development

For engineers, content-first means starting with **semantic HTML**, using content information to create a solid, accessible foundation. This approach emphasizes **progressive enhancement**, where functionality and design are layered on top of this foundational HTML.

This method promotes **separation of concerns**, keeping content, layout, and behavior distinct. It improves **SEO** and **accessibility**, ensuring that content is clear to both search engines and assistive technologies.

### For designers: Content-first design

Designers also follow a content-first approach, where the content shapes layout and design decisions. By adhering to **form follows function**, design systems are created with a focus on the content’s needs, ensuring they are efficient and easy to maintain.

This leads to **lean** and **flexible** design systems, delivering intuitive, content-driven user experiences.

### Design engineering

The content-first approach balances **performance**, **maintainability**, and **design**. It encourages collaboration between engineers and designers to build fast, accessible, and beautiful websites.
