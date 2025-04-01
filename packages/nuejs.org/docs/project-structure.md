
# Project Structure

A website consists of content, data, layout definitions, interactive components, styling, and scripts. In Nue, each of these lives in its proper place, maintaining clean separation between different concerns. Understanding this structure is key to building maintainable sites.

## Files

Here are all the different kinds of files your project consists of:

[table.deftable]
  File type | Suffix | Purpose

  Content | `.md`
  Your website content in extended Markdown format.

  Data | `.yaml`
  Structured data for SEO metadata, product info, team details, and navigation.

  Settings | `.yaml`
  Configuration for site generation, metadata, and layout parameters.

  Layout modules | `.html`
  Global layout components like headers, footers, and sidebars.

  Custom components | `.html`
  Server-side components that extend Markdown capabilities.

  Interactive islands | `.dhtml`, `.htm`
  Client-side components for dynamic functionality.

  Styling | `.css`
  Global, application, and page-level styles.

  Scripting | `.js`, `.ts`
  Support for CSS-driven motion and global event handling.

### 404 File
A file named `404.md` at the root level acts as a target for non-existent files.


## Directories
Here are the different types of folders you can have in Nue:

### Static Directories
Static directories store assets that are served directly without processing. Common examples include:

```
/
  ├── img/                     # Images
  │   ├── hero/               # Hero images
  │   │   ├── home.webp
  │   │   └── about.webp
  │   ├── blog/              # Blog post images
  │   │   ├── post-1.webp
  │   │   └── post-2.webp
  │   └── team/              # Team member photos
  │       ├── sarah.webp
  │       └── james.webp
  │
  ├── icon/                   # UI icons
  │   ├── navigation/
  │   │   ├── menu.svg
  │   │   └── close.svg
  │   └── social/
  │       ├── github.svg
  │       └── twitter.svg
  │
  ├── video/                  # Video content
  │   ├── demos/
  │   │   └── feature-1.mp4
  │   └── tutorials/
  │       └── setup.mp4
```


### Application Directories
Application directories encapsulate all assets specific to a single application, such as a blog or documentation site. This modular approach allows for clear separation of concerns and makes it easier to manage each part of your website independently. Each application can have its own settings, layouts, and content files, ensuring a tailored experience.


### Root Directory
The root directory contains scripts, styles, and components that are dependencies for the front page and all other root-level pages. Assets in this directory are not propagated upwards to application directories, ensuring that only relevant files are included in each application.

To maintain organization, you may want to clean up the root directory from front page assets by placing them into a dedicated folder, such as "home". You can declare this folder in the front-matter area of the front page as follows:

```yaml
appdir: home
```

With this setting, all assets inside the "home" directory become dependencies of your root-level `index.md`, keeping the root directory uncluttered.


Here’s a more concise version of the "Globals" section, removing the specific reference to Tailwind and focusing on the importance of the Design System:


### Globals

You can define directories that are global in `site.yaml`, which is essential for managing assets that should be accessible across your entire site. This is particularly important for global CSS files, which comprise the bulk of your Design System. For example:

```yaml
globals: [ "@globals", 'css' ]
```

When a global directory is placed at the root level, all assets within it are automatically included on every page, ensuring a consistent design and enhancing maintainability.

If a global directory resides inside an application directory, its assets will be included on all pages of that application, promoting modularity while allowing for shared styles and components.

[image.gridpaper]
  small: /img/global-dirs.png
  large: /img/global-dirs-big.png
  alt: Global Directories


### Libraries
Library folders are essential for organizing assets that can be explicitly included on a page using an `include` statement. You can define certain folders as libraries in the `site.yaml` file. For example:

```yaml
libs: ["@lib", lib]
```

Once libraries are defined, you can include assets in your pages as follows:

```yaml
include: [ video, gallery ]
```

This statement will include all assets (such as CSS, JavaScript, data, and components) matching the substring "video" or "gallery" in their file names.

You can also include assets at the application level by specifying them in the application's configuration file (e.g., `blog/blog.yaml`). This will auto-include the assets across all pages within that application.


### Page Directories

Page directories contain scripts, styles, and components specific to a particular page within the application structure. The "leaf" directory refers to the final part of the path in your project's structure, which typically contains assets that are unique to a specific page.

For example, consider the following directory structure for a page within a blog application:

```
/blog/announcing-v2.0/index.md
  ├── index.md
  ├── styles.css         # Specific styles for this page
  ├── script.js          # Specific scripts for this page
```

In this example, `index.md` is the main content file for the "Announcing v2.0" page, while `styles.css` and `script.js` are CSS and JavaScript files that apply only to this page.


### Static Directories

Static directories are designed for non-content files that do not require processing by the build system. These directories hold assets that are served directly as they are, making them ideal for images, videos, and other media. For example:


```
/
  ├── img/                  # Folder for image files
  │   ├── screenshot1.png   # Example screenshot for a blog
  │   ├── screenshot2.webp  # Another example screenshot
  │   └── ...               # Additional image files can be added here
  |
  ├── icon/                 # Folder for SVG icons
  │   ├── arrow-right.svg
  │   ├── arrow-left.svg
  │   ├── three-dots.svg
  │   └── ...               # Additional SVG files can be added here
```

In this example, the `img` folder contains sample images, such as screenshots or other real-world examples suitable for a blogger. The `icon` folder includes SVG files for icons, specifically `arrow-right.svg`, `arrow-left.svg`, and `three-dots.svg`. These assets can be referenced directly in your project without any processing.


## Example Structures

### Blogging Site
Example blogging site directory structure (files and folders):

```
/
  ├── @global                # Global styles: colors, layout, typography
  │   ├── settings.css
  │   ├── colors.css
  │   ├── typography.css
  ├── @library
  │   ├── button.css
  │   ├── forms.css
  │   ├── cards.css
  ├── blog                   # Blogging area
  │   ├── blog.yaml
  │   ├── index.md
  │   ├── post1.md
  │   ├── post2.md
  ├── contact
  │   ├── index.md
  ├── img                    # Images and icons
  ├── index.md               # The front page
  ├── site.yaml              # Global settings
```

**Content Explanation:**

- **`index.md`**: The front page of the blog introducing visitors and guiding them to the latest articles.
- **Blog Posts**: `post1.md` and `post2.md` contain articles on topics like "Understanding CSS Flexbox" and "Getting Started with JavaScript."
- **Contact Page**: `index.md` under the `contact` directory provides a form for users to get in touch.


### Business Websites
Directory structure for a business website, including specific assets:

```
/
  ├── @global                # Global styles
  │   ├── settings.css
  │   ├── colors.css
  │   ├── typography.css
  ├── @library              # Reusable styles
  │   ├── button.css
  │   ├── forms.css
  │   ├── cards.css
  ├── index.md              # Front page
  ├── home                  # Front page assets
  │   ├── home.yaml
  │   ├── styles.css
  │   ├── scripts.js
  ├── docs                  # Documentation
  │   ├── index.md
  │   ├── guide.md
  │   ├── reference.md
  ├── blog                  # Blog
  │   ├── blog.yaml
  │   ├── post1.md
  │   ├── post2.md
  ├── about                 # About section
  │   ├── index.md
  │   ├── team.md
  │   ├── history.md
  ├── pricing
  │   ├── index.md
  │   ├── plans.md
  ├── img                   # Static assets
  │   ├── logo.png
  │   ├── hero-banner.jpg
  │   ├── product-image.png
```

**Content Explanation:**
- **`index.md`**: The rich front page introducing the business and its offerings.
- **Documentation**: Includes `index.md` for the main documentation page, with guides and API references to help users understand the services.
- **Blog**: Similar to the blogging site, it has posts that provide insights and updates related to the business.
- **About Page**: Contains details about the company’s mission, team, and history.
- **Pricing Page**: Clearly outlines the different pricing plans available for customers.
