
# The view layer
In Nue, complex apps are built with clean, semantic HTML. The view layer handles interfaces with light scripting, while styling is offloaded to an external design system.


## Clean HTML templating
With logic in the model, views become pure templates:

```html
<article @name="user-profile">
  <header>
    <img :src="user.avatar" class="avatar">
    <div>
      <h2>{ user.name }</h2>
      <p>{ user.email }</p>
    </div>
  </header>
  <dl>
    <dt>Company</dt>
    <dd>{ user.company }</dd>
    <dt>Plan</dt>
    <dd>{ user.plan }</dd>
    <dt>Member since</dt>
    <dd>{ formatDate(user.joined) }</dd>
  </dl>
  <footer>
    <button @click="edit">Edit Profile</button>
  </footer>
</article>
```

This approach delivers:
1. **Pure presentation**: Views handle structure only, using standard HTML for clarity — bugs stay obvious.
2. **Semantic markup**: Native elements like `<h2>`, `<dl>`, or `<details>` boost accessibility and performance without JS overhead.
3. **Minimal state**: Views track UI changes, leaving data and routing to the model and controllers.

These templates keep your code light and maintainable, rooted in web standards.

## Directory structure
Views live in `.dhtml` files, which group related components like CSS files — forming mini-libraries. Nue automatically makes components aware of each other, skipping manual imports. Place them in `app/view/`:

## Large applications
For bigger apps, use a nested structure:

```
app/
└── view/
    ├── layout/            # Core layout components
    │   ├── app.dhtml      # App shell
    │   ├── navigation.dhtml
    │   ├── main.dhtml     # Main panel
    │   └── details.dhtml  # Details panel
    ├── components/        # Reusable UI pieces
    │   ├── user-list.dhtml
    │   ├── search-input.dhtml
    │   └── ...
    ├── screens/           # Full-page views
    │   ├── login.dhtml    # Login screen
    │   ├── dashboard.dhtml
    │   └── ...
    └── utils/             # Shared utilities
        ├── utils.dhtml    # Helper components
        └── util.js        # Helper functions
```

This keeps roles clear and components grouped logically.

## Small applications
For simpler apps, a flat structure works:

```
app/
└── view/
    ├── app.dhtml          # App shell
    ├── navigation.dhtml   # Sidebar
    ├── main.dhtml         # Main panel
    ├── details.dhtml      # Details panel
    ├── login.dhtml        # Login screen
    ├── user-list.dhtml    # User list
    ├── utils.dhtml        # Utilities
    └── util.js            # Helpers
```

Refactor to the nested setup as complexity grows — no renaming needed.

## View composition
Views form a hierarchy:
1. **App shell**: The root, like `app.dhtml`, sets the UI frame.
2. **Layout containers**: Sections like navigation or main content.
3. **Screens**: Full-page states (e.g., login).
4. **UI components**: Reusable bits (e.g., user-list).

From the demo:

```html
<div @name="app" class="ui app">
  <nav-panel class="navigation panel"/>
  <main-panel class="card panel"/>
  <details-panel class="details card panel"/>
  <script>
    mounted() {
      router.initialize({ root: this.root })
    }
  </script>
</div>
```

The shell defines regions; subcomponents handle their jobs.

## Naming conventions
Use clear, consistent names:
1. **Descriptive**: `user-list` or `search-input` shows purpose.
2. **Prefixes**: `list-`, `panel-` for roles.
3. **Kebab-case**: Match filenames to component names (e.g., `user-list.dhtml`).

This aids discovery and routing, keeping the view layer organized.


