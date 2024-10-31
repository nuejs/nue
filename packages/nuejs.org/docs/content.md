# Content
Content comes **first** in Nue. It’s the first step in progressive enhancement, leading the way how your site is built. It’s also the first thing in design, ensuring that your UI evolves around the content, and not the other way around. When content is drafted first, everything that follows—layout, design, and interactivity—falls into place.

## Types of content

### Structured data
Structured data in Nue encompasses:

- **Application data**: Structured information such as products, team members, language tokens, and other specific data used across different areas of the site.
- **Information architecture**: Defines the hierarchy and organization of content, ensuring a clear structure for navigation and user flow.
- **Content metadata**: Provides key details like title, description, author, date, and Open Graph (OG) image data for each content piece.
- **Content collections**: Auto-generated [content colletions](content-collections.html) based on front-matter data, typically used to create page lists—such as blog entries displayed on an index page.

This data can be defined at the **global**, **library**, **area**, or **page** levels, making it easy to **reuse** across different parts of your site.

You can also group similar data into a single file for better organization, such as keeping all navigational items together to provide a bird’s-eye view of your information architecture. This approach also simplifies localization in future versions of Nue.

By **extracting structured data**, your layout modules remain clean and focused on **structure, semantics, and accessibility**.

### Unstructured content
Unstructured content in Nue varies in how **rich and interactive** it is:

- **Technical content**: Focuses on conveying detailed information, often heavy on lists, tables, and syntax/code blocks.
- **Marketing content**: The richest of all types, typically found on landing pages, product tours, and promotional sections. This content is highly visual, including images, videos, interactive elements, and motion effects.
- **Blog content**: This content often begins with a hero section and transitions into more technical content. Blogs may mix more complex layouts and interactive elements within the content flow, depending on the design needs.
- **Formal content**: Includes legal documents, policies, and terms. This is the **plainest** content type, focusing on straightforward, text-based content.

Nue comes with a powerful extended Markdown syntax, capable of rendering all these types seamlessly.

## Content formats
Nue relies on two main content formats: **YAML** and **extended Markdown**. These formats provide flexibility for both structured and unstructured content, making it easy to manage everything from application data to rich media pages.

### YAML
Nue uses **YAML** to define all structured data. Its expressive syntax is both easy to read and write, making it a popular choice among developers and content editors alike. YAML’s simplicity has found its way into mainstream usage, especially through **front matter** in static site generators like Jekyll—thanks to **Tom Preston-Werner's** pioneering work.

Unlike alternatives such as **TOML**, YAML excels at handling complex structures like **nested arrays**, making it perfect for organizing complex datasets in Nue. Additionally, many of the earlier issues with YAML, such as the notorious **"Norway problem"**, have been resolved, ensuring a smoother experience when dealing with geographical and multilingual data.

Here’s how simple YAML looks when describing a navigation structure in Nue:

```yaml
Building websites:
  - Step-by-step tutorial: tutorial.html
  - Project structure: project-structure.html
  - Content: content.html
  - Layout: layout.html
  - Islands: islands.html
  - Styling: styling.html
  - Motion: motion.html
  - Scripting: scripting.html
  - Optimization: optimization.html
```

This example showcases how YAML can clearly represent the **hierarchy and structure** of a site’s content.

### Extended Markdown
Markdown is by far the most popular format for authoring unstructured content due to its simplicity and intuitive syntax. However, there’s one significant limitation: **basic Markdown lacks the power to draft the rich, interactive elements** that modern websites demand.

Nue [**extends**](extended-markdown.html) the standard Markdown with advanced features like code blocks, tables, generic blocks for complex flex/grid layouts, tabs, accordions, interactive islands, and more—all while remaining **SEO-friendly** and fully compliant with **accessibility guidelines**.

These enhancements make it suitable for a wide range of content types, from **rich marketing pages** full of media and interactive elements to **technical documentation** requiring detailed layouts and precision.

#### Note on cloud content storage
In its current state, Nue's YAML/Markdown-based content editing is an excellent fit for designers and engineers. However, we recognize the need for cloud storage solutions when building websites for **non-technical customers** who require a more user-friendly, content-focused environment—preferably one where they can manage content directly from the website itself.

A cloud-based backend is firmly on our long-term roadmap, as it aligns well with our **decoupled architecture**. Unstructured content would simply be fetched from the cloud before rendering, ensuring a seamless integration between content management and site delivery. For more details, see the [roadmap](index.md#roadmap).

## Information architecture { #ia }
**Information architecture** in Nue defines how content is organized and structured across your site. It ensures that users can easily navigate through pages, apps, and sections, while also making content management clear and efficient for developers.

### Overview of information architecture
Information architecture establishes the **hierarchy** and **relationships** between pages, sections, and content. This hierarchy influences both how users interact with your site and how content is delivered. For example, the following **YAML** snippet shows how the global navigation is defined in [navigation.yaml](//github.com/nuejs/nue/blob/dev/packages/nuejs.org/%40global/navigation.yaml), organizing pages into a clear structure:

```yaml
globalnav:
  main:
    - Home: /
    - Docs: /docs/
    - Blog: /blog/
```

### Page hierarchies
Pages are arranged in a **parent-child** structure, with nested pages inheriting structure from parent sections. For instance, a blog post is placed under the blog section, and pages like **Docs** can have their own subsections. Additionally, apps like `/docs` or `/blog` act as containers for groups of pages, each with its own internal hierarchy. Here’s an example of a **docs hierarchy** in YAML:

```yaml
documentation:
  Getting started:
    - Why Nue: /docs/
    - How it works: /docs/how-it-works.html
    - Installation: /docs/installation.html
  Building websites:
    - Step-by-step tutorial: /docs/tutorial.html
    - Project structure: /docs/project-structure.html
```

### Navigation structure
Information architecture directly impacts the **navigation** of your site, such as **menus**, **sidebars**, and **breadcrumbs**. This navigation is typically defined in a global **navigation.yaml** file, where you can organize navigation globally or by specific app (e.g., `docs/docs.yaml`), keeping your content structure modular and flexible. Here’s an example of a **sidebar menu** for a documentation app:

```yaml
menu:
  - Home: /
  - Docs: /docs/
  - Blog: /blog/
  - GitHub: //github.com/nuejs/nue
```

### Metadata and inheritance
**Metadata** in Nue, such as titles, descriptions, authors, and Open Graph (OG) properties, can be defined globally, at the app level, or overridden at the page level. This layered approach creates an **inheritance chain**, ensuring consistency across the site while allowing flexibility for specific overrides when needed.

At the **global level**, metadata is defined in the `site.yaml` file. Here, a `title_template` can be used to format page titles dynamically. For example:

```yaml
# In site.yaml
title_template: "%s / Nue Framework"
description: "The design engineering framework for the web"
```

This `title_template` sets the structure for all page titles globally, where `%s` will be replaced by the specific title of each app or page.

At the **app level**, you can override the global metadata for a specific app by defining it in that app's YAML file. For instance, in `blog/blog.yaml`, you might specify an app-level title, description, author, and Open Graph properties, which will apply to all blog posts unless further overridden.

```yaml
# In blog/blog.yaml
title: "Blog"
title_template: "%s / Blog"
description: "The latest news and updates"
author: "John Doe"
og_image: "/images/blog-og.jpg"
og_description: "Stay updated with the latest posts"
```

This ensures that all blog posts inherit a consistent base title, "Blog," and use the app-specific `title_template`, while still allowing flexibility for page-level overrides.

At the **page level**, individual pages can further customize metadata through the front matter in Markdown files. This is where the `%s` from the global or app-level `title_template` will be replaced by a page-specific title. For example:

```yaml
# In a specific page's front matter (Markdown)
---
title: "Getting Started with Nue"
description: "Learn the basics of setting up your first project"
---
```

In this case, the title will become "Getting Started with Nue / Blog," as the `%s` in the app-level `title_template` is replaced by the page-specific title. The same inheritance applies to metadata like description, author, and Open Graph properties, with global

 and app-level defaults cascading down to the page level unless explicitly overridden.

This **inheritance chain** ensures that metadata is consistently managed across global, app, and page levels. Developers can easily adjust metadata at any level while maintaining a coherent and SEO-friendly structure throughout the site.

### Benefits of a clear structure
A well-defined information architecture improves **SEO** by helping search engines understand your content's structure and relationships. It also enhances **accessibility**, making it easier for users with assistive technologies to navigate and understand the content. By using a **well-structured hierarchy** in your navigation YAML file, you make it clear to both users and search engines how content is related:

```yaml
globalnav:
  main:
    - Home: /
    - Docs: /docs/
    - Blog: /blog/
    - About: /about/
```

### Implementation
For design engineers, the **information architecture** and **metadata** defined in YAML files can be directly used in **Markdown extensions** or **custom layout modules**, which control how and where this data is rendered on your pages. By using this structured data, you can effectively manage content display and ensure consistency across your site’s layout.

To get started, you can:
- Explore how to create **custom tags** that work with this structured data: [custom-tags.html](custom-tags.html).
- Learn how to build **custom layout modules** that integrate with your information architecture: [layout.html](layout.html).


## Content-first development
**Content-first development** is a core philosophy in Nue. It ensures that both engineers and designers focus on the content itself, allowing the site's structure, functionality, and design to evolve naturally.

### For engineers: Semantic web development
For engineers, content-first development involves using **content information** to generate **clean, semantic HTML**, forming the foundation for **progressive enhancement**. By starting with raw HTML, engineers build a solid, accessible foundation that works in all environments, with interactivity and styling layered on as needed.

This approach emphasizes **separation of concerns**, where content, layout, and behavior remain distinct, simplifying maintenance and reducing complexity. Semantic HTML also improves **SEO** and **accessibility**, making the structure of content clear to both search engines and assistive technologies.


### For designers: Content-first design
Designers follow a **content-first design** approach, where content shapes the layout and aesthetic decisions. By adhering to the principle of **form follows function**, design systems are built to meet the specific needs of the content, staying focused and efficient.

This leads to design systems that are **lean** and **flexible**, focusing on delivering intuitive, content-driven user experiences. Designers can ensure that the layout serves the content, resulting in more cohesive and meaningful interactions for users.

### Design engineering
Content-first development is the key to achieving a balance between **performance**, **maintainability**, and **design**. By placing content at the center of the process, both engineers and designers can collaborate to build fast, accessible, and beautiful websites that deliver real value.

