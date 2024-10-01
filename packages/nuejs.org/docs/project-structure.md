
# Project structure
Nue projects consist of one or more application folders with a freeform mixture of different configuration, layout, styling and scripting.

[image.gridpaper]
  small: /img/application-dirs.png
  large: /img/application-dirs-big.png
  caption: Two new areas were added as the project grew up
  size: 747 × 519 px


Nue does not force you to adopt any fixed directory structure: There are no system folders and you can freely name your root-level application folders.



## File types
All your pages have different kinds of dependencies to enhance their look and feel:

[table.api head]
  - Extension   | Type
  - .css        | CSS files for [styling](css-best-practices.html)
  - .js, .ts    | JavaScript files for [interactivity](interactivity.html)
  - .ts         | TypeScript files for [interactivity](interactivity.html)
  - .html       | [Layout components](custom-layouts.html) and server-side components
  - .htm, .nue  | [Reactive components](reactive-components.html)



### Static files
Static files like `.png`, `.jpg`, `.txt`, `.csv`, or `.json` are copied directly from the source directory to the distribution directory without processing. They work outside the page dependency management system.



### 404 file
A file named `404.md` in the root level, acts as a target for non-existent files. You can use the `include` statement to customize its styling and behaviour.




[image.gridpaper]
  small: /img/dependencies.png
  large: /img/dependencies-big.png
  size:   747 × 378 px


### Global directories { #globals }
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

```yaml
include: [syntax-highlight, video]
```

If you include assets in several levels, the values of include statements are *concatenated* into one single array. The matches are partial so that a value such as "syntax" will match both "syntax-highlight" and "syntax-extras".


### Excluding assets { #exclude }
You can exclude assets from the pages with an `exclude` property, which works the same way as the `include` statement:

```yaml
exclude: [syntax-highlight, video]
```

This allows you to strip unneeded assets from the request and reduce the payload.

#### Example
Here's a more complex example that gives you an idea how dependencies are calculated:

[image.gridpaper]
  small: /img/libraries.png
  large: /img/libraries-big.png
  size:  747 × 591 px


### Frontpage
All scripts, styles, and components in the root level are dependencies for the front page and all other root level pages, so they are not propagated upwards to the application directories.

You may want to clean up the root directory from front page assets by placing them into a folder named "home", for example, and declaring it in the frontmatter area of the front page:

```yaml
appdir: home
```

With the above setting all assets inside the "home" directory become dependencies of your root level `index.md`.





