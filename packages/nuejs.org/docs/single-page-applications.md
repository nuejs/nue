
# Single-page applications `TODO`
Nue is a multi-page application builder. That is: you can use the same content-first approach to build content-heavy applications and single-page applications.

[.note]
  ### Note
  The support for single-page applications is in progress. All issues regarding Nue JS are marked as [low priority](https://github.com/nuejs/nue/labels/low%20priority) because the focus is currently on content-heavy multi-page applications.


## Traditional model
Today, single-page applications are made out of components, which are essentially JavaScript functions sprinkled with markup and locally scoped styling. There is a component for everything from individual elements (links, buttons, inputs, paragraphs) to their compositions (headers, footers, navigations). And when the styling and logic are coupled to the component, you often have multiple versions of a component for different contexts. Tailwind's Catalyst UI library, for example, has four different paragraph components: `<Text>`, `<Description>`, `<DialogDescription>`, and `<AlertDescription>`.

As you build more complex applications, the amount of components is also increasing. It is not uncommon for large scale projects to contain hundreds, even thousands of components. *Vite*, for example, was specifically built to solve the performance problems with module-heavy applications.


## Shift in focus
Nue is different. It embraces the separation of concerns design pattern and splits your application in three major blocks: application code, UI code, and styling code:

[image.gridpaper]
  small: /img/spa-stack.png
  large: /img/spa-stack-big.png


This split makes a big difference on how you code looks like:


### Decoupled application code
The application code becomes an separate entity with no complexities from the the presentation layer: there is no knowledge of views nor state and the code is absent from framework specific concepts like hooks, refs, or events. And there are no extra domain specific idioms *JSX* or *Tailwind*.

This dramatically simplifies the code and makes it easier to understan for newcomers. The application can be a totally isolated *NPM* module, that can be tested separately and the decoupling allows building for different frontends like console, slack agent, mobile app.

You can even use a true typed language like *Rust* or *Go* and compile the application to *WASM* like *Figma* does. Decoupled application logic opens new doors for frontend developers.


### Decoupled UI code
When styling and the application code is decoupled from the UI, the code becomes simple enough for UX developers to manage and scale. Instead of creating a custom components for the various context, the UX developer can use native HTML inputs, buttons, and other elements to build the layout. This dramatically reduces the amount of components and UI code.

The more complex operations narrows down to simple JavaScript calls to the application API and updating the UI accordingly.


### Controller code
Nue comes with an app-router.js that acts as a _controller_ between the application code and the user interface.

! Application -> Controller (dot) -> HTML- based UI (Nue) || TypeScript- based UI (React)

React support is coming later.




## Multi-page applications
Global page transitions
Seamless routing with page transitions: docs -> login -> SPA


### Shared design system
Shared design system as the rest of the site


