

# Project structure
Nue project is a mixture of different kinds of files and folders that you can freely organize based on the functionality of your website.


## Files
Here are all the different kind of files your project consist of.

[table.deftable]
  File type | Suffix | description
  [Content](content.html) | `.md` | Your content written in extended Markdown format
  [Settings](settings.html) | `.yaml` | Settings that impact site generation
  [Data](data.html) | `.yaml` | SEO metadata and other data (like products and team members)
  [Styling](styling.html) | `.css` | Global, application, and page-level styles
  [Scripts](styling.html) | `.js`, `.ts` | To progressively enhance the experience
  [Server components](server-components.html)   | `.html` | Layout modules, reusable HTML snippets, and Markdown extensions
  [Client components](components.html)   | `.htm`, `.nue` | Client-side components and reactive "islands"


#### Static files
Static files like `.png`, `.jpg`, `.txt`, `.csv`, or `.json` are copied directly from the source directory to the distribution directory without processing. They work outside the page dependency management system.


#### 404 file
A file named `404.md` in the root level, acts as a target for non-existent files.



## Directories
These are the four different kind of folders you can have in Nue


### Root
Frontpage
All scripts, styles, and components in the root level are dependencies for the front page and all other root level pages, so they are not propagated upwards to the application directories.

You may want to clean up the root directory from front page assets by placing them into a folder named "home", for example, and declaring it in the frontmatter area of the front page:

```yaml
appdir: home
```

With the above setting all assets inside the "home" directory become dependencies of your root level `index.md`.


### Applications
...

### Globals
You can define directories that are global in `site.yaml`. For example:

```yaml
globals: [ "@globals", "scripts", "styles" ]
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




## Inheritance


### Data inheritance
If you include assets in several levels, the values of include statements are *concatenated* into one single array. The matches are partial so that a value such as "syntax" will match both "syntax-highlight" and "syntax-extras".

```yaml
include: [syntax-highlight, video]


[image.gridpaper]
  small: /img/dependencies.png
  large: /img/dependencies-big.png
  size:   747 × 378 px
```

Here's a more complex example that gives you an idea how dependencies are calculated:

[image.gridpaper]
  small: /img/libraries.png
  large: /img/libraries-big.png
  size:  747 × 591 px


### Page dependencies
Scripts, styles, and components

...
