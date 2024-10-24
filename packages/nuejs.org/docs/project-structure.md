

# Project structure
Nue project is a mixture of different kinds of files and folders that you can freely organize based on the functionality of your website.


## Files
Here are all the different kind of files your project consist of.

[table.deftable]
  File type | Suffix | Description

  [Content](content.html) | `.md`
  Your content written in extended Markdown format

  [Settings](settings.html) | `.yaml`
  Settings that impact site generation

  [Data](data.html) | `.yaml`
  SEO metadata and other data (like products and team members)

  [Styling](styling.html) | `.css`
  Global, application, and page-level styles

  [Scripts](styling.html) | `.js`, `.ts`
  To progressively enhance the experience

  [Server components](server-components.html) | `.html`
  Layout modules, reusable HTML snippets, and Markdown extensions

  [Client components](components.html) | `.htm`, `.nue`
  Client-side components and reactive "islands"


#### Static files
Static files like `.png`, `.jpg`, `.txt`, `.csv`, or `.json` are copied directly from the source directory to the distribution directory without processing. They work outside the page dependency management system.


#### 404 file
A file named `404.md` in the root level, acts as a target for non-existent files.



## Directories
These are the four different kind of folders you can have in Nue



### Application directories
Encapsulate all assets (content, layouts, data, styling, components) specific to that application only. Example apps: blog, documentation,



### Root directory
All scripts, styles, and components in the root level are dependencies for the front page and all other root level pages, so they are not propagated upwards to the application directories.

You may want to clean up the root directory from front page assets by placing them into a folder named "home", for example, and declaring it in the frontmatter area of the front page:

```yaml
appdir: home
```

With the above setting all assets inside the "home" directory become dependencies of your root level `index.md`.



### Globals
You can define directories that are global in `site.yaml`. For example:

```yaml
globals: [ "@globals" ]
```

If a global directory resides on the root level, then all assets inside that directory are automatically included on every page, regardless of which app they belong to or how deeply they are nested in the file system.

When a global directory resides inside an application directory, then all assets in the directory are included on all pages of the app. Here, for example, we have defined `@globals` and `css` as global dirs:


[image.gridpaper]
  small: /img/global-dirs.png
  large: /img/global-dirs-big.png
  size: 747 × 417 px


### Libraries
Library folders contain assets that can be explicitly included on a page with an `include` statement. You can define certain folders to be libraries in the `site.yaml` file. For example:

```yaml
libs: ["@lib", lib]
```

These libraries can reside both on the root level, and inside a specific application. Once the libraries have been defined, you include library assets in `site.yaml`, application data (like `docs/app.yaml`), or in the page's frontmatter with an `include` statement as follows:

```
include: [ button, gallery ]
```

this would include all assets (can be css, js, data, components) matching a substring "button" or "gallery" on the file name.


### Page directories
Scripts, styles, and components for a specific directory under the application directory. For example

/blog/announcing-v2.0/index.md

The index.md is under the final "leaf" directory containing assets specific to that index.md page only




### Static directories
no content files on these dirs

example 1: img: Images, videos, etc
example 2: icons: svg icons only. can be easily switched to another iconset



## Example structures

### Blogging site
Example blogging site directory structure (files and folders)

[.folders]
  - `@global` global styles: colors, layout, and typography
  - `@library` reusable styles
  - `blog` blogging area
  - `blog/blog.yaml` blog-specific settings
  - `contact` contact app
  - `img` images and icons
  - `index.md` the front page
  - `site.yaml` global settings


### Business app
Extends the above as follows

[.folders]
  - index.md - rich front page
  - home (front page assets)
  - docs (documentation area)
  - blog (blogging area)
  - about/index.md (about page with it's own assets)
  - pricing/index.md (pricing page with it's own assets)
