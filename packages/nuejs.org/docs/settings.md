---
class: apidoc
---

# Settings and metadata
Nue has a [hierarchical system](project-structure.html#data) for settings and configuration options. Here are all settings for Nue and your site, pages and components.


## Nue settings
List of all Nue-specific configuration options in the `site.yaml` file. These settings impact the system behaviour and are always global, that is, they cannot be overwritten in app or page level.


### dist
The output directory. The default is `.dist/dev` for the development version and `.dist/prod` for the production version.


### globals
Array of [global](project-structure.html#globals) directories. The scripts, styles and components under global directories are automatically included on all your pages.

### hotreload
Setting this to `false` disables [universal hot-reloading](hot-reloading.html). Hot-reloading is enabled (`true`) by default.


### libs
Array of directories that are treated as [libraries](project-structure.html#libraries) and used by the [`include`](#include) statement.

### links
List of reference links to be used in the Markdown content in the form of `[Link Label][link_reference]`. Links are supplied in a `name: url` format. For example:

```yaml
# name: url
links:
  gds: //bradfrost.com/blog/post/a-global-design-system/
  soc: //en.wikipedia.org/wiki/Separation_of_concerns
```

### lightning_css
Setting this to `false` disables the default processing by [Lightning CSS](//lightningcss.dev/) and the CSS is served directly as is.

### native_css_nesting
Use native CSS nesting intead of converting them to un-nested style rules that are supported in all browsers. Setting this to `true` generates a smaller CSS output, but is not supported by older browsers. Check the current [Can I Use](//caniuse.com/css-nesting) statistics for details.

### port
The port number of the development server. Default is 8080.

### syntax_highlight
Set this to `false` to disable the [built-in stylesheet](syntax-highlighting.html) for code blocks.

### view_transitions
Setting this to `true` enables [view transitions](reactivity.html#view-transitions) for instant and smooth page switches.





## Site settings
List of site-wide settings that impact your SEO data and other metadata inside your document `<head>` element. These are defined in your `site.yaml` but can be overwritten on area and page level.


### base
The value of the HTML [`<base>`](//developer.mozilla.org/en-US/docs/Web/HTML/Element/base) element.

### charset
The value of the charset meta tag. The default is "utf-8".

### direction
The value of `<html direction="{ direction }">` attribute. The default is "ltr" (left to right).

### favicon
Relative path to your favicon that overrides the "favicon.ico" on the browser tab.

### generator
The generator meta tag. The default is "Nue (nuejs.org)" and is only rendered in production mode.


### language
The value of `<html lang="{ language }">` attribute. The default is "en". You might want to change this to "en-us", "en-gb", "en-nz", ... depending on your dialect or for example "fi", if your content is written in the Finnish language.

### origin
Your full domain name including the protocol. For example: `"https://emmabennet.co"`. Nue uses this value to prefix the `og` property and later in RSS files.

### prefetch
Array of assets to prefetch before using them. These can be images, scripts, or CSS files.

### robots
Value for "robots" meta property. Use "noindex" to exclude the whole website from search engines.

### theme_color
Value for [theme color](//developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color) meta property. This is a color suggestion for user agents to customize the display of the page.

### thumb
A thumbnail image for the document when listed and rendered by the [gallery](content-collections.html#gallery) tag.

### title_template
Allows formatting the value of the `<title>` tag in the way you like. A value such as `'%s | Acme Inc.'` prints "My page | Acme Inc." where the `%s` is replaced by the page title.

### viewport
The [viewport](//developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag) value. The default is: "width=device-width,initial-scale=1"




## Layout settings
Settings to define the global navigational elements on your page with a common [YAML-based syntax](page-layout.html#nav-syntax).

### header
HTML layout for the global header.

### footer
HTML layout for the global footer.

### burger_menu
HTML layout for the burger menu.

### Disabling layouts {.no_api}
You can [disable individual layouts](custom-layouts.html#disabling) for areas or individual pages with settings such as `banner: false` or `footer: false`.


## Area settings
List of typical area-specific settings inside an application file such as `blog/blog.yaml` or any other YAML file in a specific application directory. These can also be set globally in `site.yaml` or individually in a specific page.


### include
A list of assets to be included from a [library directory](project-structure.html#libraries) to all pages on the area. For example, a value such as `include: [highlight, motion]`, would include all files matching a string "highlight" or "motion" in the file name.

### grid_item_component
Specifies a Web Component for your grid items. [Learn more](reactivity.html#grid-items)

### grid_item_class
Array of CSS class names for your grid items. [Learn more](page-layout.html#grid-items)


### section_classes
Array of CSS class names for the page sections. [Learn more](page-layout.html#section-classes)

### section_component
Specifies a Web Component for your page sections. [Learn more](reactivity.html#sections)






## Page settings
List of page-specific settings as specified in a page directory or in the front matter section of the Markdown file. Most of these settings can also be set globally or at area-level.


### appdir
Name of the application directory a page belongs to. For example, the root level `index.md` could set this to "home" and grab the layout, data, scripts, styles and components from that directory. This would keep the root level clean from front-page specific assets.


### author
The author meta tag.

### class
CSS class name for the body element.


### content_collection
This is a directory name for a [content collection](content-collections.html).

### collection_name
The name of the content collection variable. By default, this is the name of the directory i.e. the value of the `content_collection` option.

### date
The publication date of the article. The content collections are sorted by this property. The most recent one is listed as the first article.

### description
The value for the description meta tag.

### include
A list of assets to be included from a [library directory](project-structure.html#libraries). These values are concatenated to the possible area-specific includes.

### exclude
A list of assets to be excluded from a [library directory](project-structure.html#libraries). These values are concatenated to the possible area-specific excludes.


### inline_css
Setting this to `true` inlines all CSS directly into the page to make it load faster. See [performance optimization](performance-optimization.html).

### og
Relative path to open graph image. Please also supply the [origin property](#origin) to turn this value into an absolute URL, which is the required format.

### robots
Value for "robots" meta property. Use "noindex" to exclude the page from search engines.


### title
The value of the `<title>` tag — the most important meta tag for SEO. By default, this is the value of the Markdown `# Level one title` if not explicitly defined.

### unlisted
Do not include the page in content collections.

