

# Project Structure
Nue projects consists of one or more _applications_. Each directory on the root of your project folder is a separate application with it's own configuration, layout, styling, and dynamics.

[image.gridpaper]
  small: /img/application-dirs.png
  large: /img/application-dirs-big.png
  caption: Two new areas were added as the project grew up


Nue does not force you to any fixed directory structure: there are no system folders and you can freely name your root-level application folders.


## Applications
Nue is designed for building two kinds of applications:

1. *Multi-page applications*. These consist of one or more Markdown files. Good examples are documentation, blogging area, or a feature tour. These apps are rendered server-side so that they can be easily consumed by search engines. The use of client-side JavaScript is optional.

2. [Single-page applications](single-page-applications) consist of a single `index.html` file that serves all the HTML requests within the app. Good examples are admin dashboards, onboarding flows, surveys, or login pages. The application is rendered on the client side with reactive components. These apps are usually hidden from search engines.


[image.gridpaper]
  small: /img/mpa-vs-spa.png
  large: /img/mpa-vs-spa-big.png



## Pages
Pages are the building blocks of multi-page applications. These pages are written with a rich component-based Markdown dialect called "Nuemark", which is designed for non-technical people like marketers and copywriters.


### Page data
Each page is backed with different kinds of data:

1. *Metadata* like title, description, theme color, favicon, and hero image. This data is made accessible for search engines and [content colllections](content-collections)

1. *Component data* for rendering headers, footers, sidebars and other components inside or outside the page.

1. *Settings* to fine tune rendering details like whether CSS should be inlined on the page or what styles can be excluded from the page.

1. *Dependencies* — information about scripts, styles, components, and other assets that the page functionality depends on.


### Data propagation
The data is defined in three levels:

1. The global, site-wide data is defined in `site.yaml` at the root directory

2. Application data is defined in `app.yaml` file inside the application directory. There can be multiple app.yaml files nested inside the application  subdirectories.

3. Ppage-specific data is defined in the *frontmatter* section of the Markdown page.

The data gets extended as you move from site level to page level.

[image.gridpaper]
  small: /img/data-propagation.png
  large: /img/data-propagation-big.png



## Page dependencies
Your pages can have following kind of depenencies to enhance it's looks and behaviour:

[table.api "Extension | Type"]
  - .js | [JavaScript files](scripting)
  - .ts | [TypeScript files](scripting)
  - .css | [Stylesheets](styling)
  - .html | [Server-side components](layout-system) and layout files
  - .nue | [Reactive components](reactive-components)



All scripts, styles, and components are automatically included in page dependency tree similar to how data is propagated. The assets on the application root are included in all pages in the app and subdirectory assets are included for the pages in that subdirectory. For example:


[image.gridpaper]
  small: /img/dependencies.png
  large: /img/dependencies-big.png


### Global directories
You can define directories that are global in `site.yaml`. For example:

```
globals: [ "@globals", "scripts", "styles" ]
```

If a global directory resides on the root level, then all assets inside that directory are automatically included to every page, regardless of which app they belong to or how deeply they are nested on the file system.

When a global directory resides inside an application directory, then all assets in the directory are included on all pages on the app. Here, for example, we have defined `@globals` and `css` as global dirs:


[image.gridpaper]
  small: /img/global-dirs.png
  large: /img/global-dirs-big.png


### Libraries
Library folders contain assets that can be explicitly included on a page with an `include` statement. You can define certain folders to be libraries in the `site.yaml` file. For example:

```
libs: ["@lib"]
```

Here's how you include assets in `site.yaml`, `app.yaml`, or in page's frontmatter:

``` yaml
include: [syntax-highlight, video]
```

The values from all scopes are _concatenated_ into a one single array and the matches are partial so that a value such as "syntax" will match both "syntax-highlight" and "syntax-extras".


#### Exclulding assets
Include on all blog entries, but not in the blog index page.


```
exclude: [syntax-highlight, video]
```

#### Example
Here's a more complex example to give you on idea how dependencies are calculated:

[image.gridpaper]
  small: /img/libraries.png
  large: /img/libraries-big.png


### Front page
All scripts, styles, and components in the root level are dependencies for the front page and all other root level pages so they are not propageated onwards for the application directories.

You may want to clean up the root directory from front page assets by placing them into some folder, like "home" and assigning the application directory in the frontmatter area of the front page:

```
appdir: home
```

With the above setting all assets inside the "home" directory become dependencies for your root level `index.md`.



### Static files
Static files like `.png`, `.jpg`, `.txt`, `.csv`, or `.json` are simply copied from the source directory to the distribution directory without processing. They work outside the page dependency management system.







