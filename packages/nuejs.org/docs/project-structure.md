
# Project Structure

The Nue project consists of various files and folders that you can organize based on your website's functionality. Understanding the project structure is key to building websites that are easy to manage and scale.

## Files

Here are all the different kinds of files your project consists of:


[table.deftable]
  File type | Suffix | Description

  [Content](content.html) | `.md`
  Files containing your website content written in extended Markdown format. This format facilitates a clear separation of content from code, enhancing readability and manageability, particularly in rich interactive websites.

  [Data](content.html) | `.yaml`
  Files that store structured data, encompassing SEO metadata, product listings, team member information, and navigational data. This structured approach is essential for establishing a clear information architecture, supporting a content-first philosophy by organizing and structuring content for improved usability and accessibility.

  [Settings](settings.html) | `.yaml`
  Configuration files that dictate how your site is generated. These files include metadata, layout settings, and other parameters that influence the overall structure and behavior of your application, ensuring a smooth and consistent site generation process.

  [Layout modules](layout.html) | `.html`
  These files define global layout components such as headers, footers, and sidebars that form the foundation of your semantic layout. They contribute to a consistent user interface and enhance the overall user experience by providing a familiar navigation structure.

  [Custom components](custom-components.html) | `.html`
  Custom Markdown extensions and other server-side components that assist in rendering the overall page layout. These components ensure that the layout remains cohesive and help structure the content effectively, while the interactive features are handled by client-side components.

  [Interactive islands](islands.html) | `.dhtml`, `.htm`
  Client-side components that create reactive "islands" of interactivity within a page. These components enable dynamic updates and user interactions without requiring a full page refresh, enhancing the user experience while keeping the core layout server-rendered.

  [Styling](styling.html) | `.css`
  Stylesheets that define global, application, and page-level styles. All CSS files contribute to the overarching design system, ensuring a cohesive visual language and consistent user experience across your project. This structured approach to styling facilitates easier maintenance and scalability as your project evolves.

  [Scripting](scripting.html) | `.js`, `.ts`
  Files that provide support for CSS-driven motion and animation effects, including the Intersection Observer API. These scripts also manage global keyboard and click event listeners in the document, enhancing interactivity while optimizing performance.


### Static Files
Static files like `.png`, `.jpg`, `.webp`, `.txt`, `.csv`, `.json`, etc. are copied directly from the source directory to the distribution directory without processing. They work outside the page dependency management system.

### 404 File
A file named `404.md` at the root level acts as a target for non-existent files.


## Directories
Here are the different types of folders you can have in Nue:


### Application Directories
Application directories encapsulate all assets specific to a single application, such as a blog or documentation site. This modular approach allows for clear separation of concerns and makes it easier to manage each part of your website independently. Each application can have its own settings, layouts, and content files, ensuring a tailored experience.


### Root Directory
The root directory contains scripts, styles, and components that are dependencies for the front page and all other root-level pages. Assets in this directory are not propagated upwards to application directories, ensuring that only relevant files are included in each application.

To maintain organization, you may want to clean up the root directory from front page assets by placing them into a dedicated folder, such as "home." You can declare this folder in the frontmatter area of the front page as follows:

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
  │   ├── settings.css       # Site-wide settings
  │   ├── colors.css         # Color palette
  │   ├── typography.css     # Font styles
  ├── @library               # Reusable styles
  │   ├── button.css         # Button styles
  │   ├── forms.css          # Form styles
  │   ├── cards.css          # Card component styles
  ├── blog                   # Blogging area
  │   ├── blog.yaml          # Blog-specific settings
  │   ├── index.md           # Blog index page
  │   ├── post1.md           # Blog post example
  │   ├── post2.md           # Another blog post
  ├── contact                # Contact app
  │   ├── index.md           # Contact form page
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
  ├── @global                  # Global styles: colors, layout, typography
  │   ├── settings.css         # Site-wide settings
  │   ├── colors.css           # Color palette
  │   ├── typography.css       # Font styles
  ├── @library                 # Reusable styles
  │   ├── button.css           # Button styles
  │   ├── forms.css            # Form styles
  │   ├── cards.css            # Card component styles
  ├── index.md                 # Rich front page content
  ├── home                     # Front page assets
  │   ├── home.yaml            # Front page settings
  │   ├── styles.css           # Front page-specific styles
  │   ├── scripts.js           # Front page-specific scripts
  ├── docs                     # Documentation area
  │   ├── index.md             # Documentation main page
  │   ├── guide.md             # User guide
  │   ├── reference.md         # API reference
  ├── blog                     # Blogging area
  │   ├── blog.yaml            # Blog settings
  │   ├── post1.md             # Blog post example
  │   ├── post2.md             # Another blog post
  ├── about                    # About page
  │   ├── index.md             # About page content
  │   ├── team.md              # Team information
  │   ├── history.md           # Company history
  ├── pricing                  # Pricing page
  │   ├── index.md             # Pricing page content
  │   ├── plans.md             # Details of pricing plans
  ├── img                      # Images and icons
  │   ├── logo.png             # Company logo
  │   ├── hero-banner.jpg      # Hero banner image
  │   ├── product-image.png    # Product showcase image
```

**Content Explanation:**
- **`index.md`**: The rich front page introducing the business and its offerings.
- **Documentation**: Includes `index.md` for the main documentation page, with guides and API references to help users understand the services.
- **Blog**: Similar to the blogging site, it has posts that provide insights and updates related to the business.
- **About Page**: Contains details about the company’s mission, team, and history.
- **Pricing Page**: Clearly outlines the different pricing plans available for customers.
