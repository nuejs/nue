
# Universal hot-reloading
Nue provides a unique hot-reloading feature that automatically updates *all* your website assets on the browser when you edit your content, styling, layout, data files, or components.

[bunny-video]
  videoId: 18714305-d2f3-453d-83a9-0bd017166949
  poster: /img/hot-reload-hero.jpg


## Updatable assets
Hot-reloading is automatically enabled in development. The client-server communication is based on server-sent events. Instead of making a full reload, Nue uses a technique called *DOM diffing* to only update the parts on the page that have changed. Here are the details of what gets automatically updated:


### Content
- Markdown content
- Front matter (example: document.title updates)
- Layout files: both root- and app-level `layout.html`
- `site.yaml`, `app.yaml` data (example: master navigation updates)
- Updates to other than the active page routes automatically to the new page

### Styling
- CSS file updates
- Inline styling changes
- New CSS files & CSS file removals
- Complete theme change via changes in the `globals: []` array in `site.yaml`

### Reactive components
- All component updates
- Form components: potential form data is restored to the updated component
- Dialog components: dialogs and overlays remain open after they update

[bunny-video]
  videoId: abe66a92-71a9-4441-866b-20fdf31a7180
  caption: Hot-reloading a reactive component


### Syntax errors
- JavaScript/TypeScript files (.js, .ts)
- Reactive components (.nue, .htm)
- HTML layout files (.html)
- CSS files (.css)

[.stack]
  ![JS error](/img/js-error.png)
  ---
  ![Layout error](/img/nue-error.png)


## Non-goals
Nue hot-reloading applies to UI components only so updates to JavaScript/TypeScript extensions have no impact. These extensions are best developed and tested on the server side. The same goes to WebComponents — the browser does not have the means to re-hydrate updated components.


## Disable hot-reloading
You can disable hot-reloading with the `hotreload: false` configuration option. Hot-reloading is automatically disabled for the production build, as it makes no sense there.




