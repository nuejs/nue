---
include: [form, button]
---

# Single-page applications `Coming soon`
Nue is a rapid web application builder. That is: you can take advantage of the global design system, and use the same development approach to build both content-heavy applications and single-page applications.

[.note]
  ### Please note
  The development of single-page applications starts after a major Templates release. All issues regarding Nue JS are marked as [low priority](https://github.com/nuejs/nue/labels/low%20priority) because the focus is currently on content-heavy multi-page applications.


## Traditional model
Today, single-page applications are made out of JavaScript or TypeScript components. There is a component for everything from links, buttons, inputs, and paragraphs to their compositions. The codebase keeps growing when the styling is hard-coded to the component, because you need multiple versions of the same component with slightly different styling. Tailwind's Catalyst UI library, for example, has four different paragraph components: `<Text>`, `<Description>`, `<DialogDescription>`, and `<AlertDescription>`.

As you build more complex applications, the amount of components increases dramatically. It is not uncommon for large-scale projects to ~contain hundreds, even thousands of JavaScript modules~. **Vite**, for example, was specifically built to solve the issue with large codebases like that.


## Shift in focus
**Nue is different**. It embraces the separation of concerns design pattern and splits your application into three major layers: application layer, UI layer, and styling:

[image.gridpaper]
  small: /img/spa-stack.png
  large: /img/spa-stack-big.png


This split makes a big difference in how you code looks:


### Application layer
The application code becomes a separate entity with no complexities from the presentation layer: there is no knowledge of views nor state and the code is absent from framework-specific concepts like hooks, refs, or events. And there are no extra domain-specific idioms like *JSX* or *Tailwind*.

This dramatically simplifies the code and makes it easier to read and maintain. The application can be an isolated *NPM* module, that can be tested separately.

But most importantly: you can use the exact same application code for different frontends like Console, Slack agent, or the mobile app.

You can even use a true typed language like *Rust* or *Go* and compile the application to *WASM* like *Figma* does. Decoupled application logic opens new doors for front-end developers.


### View layer
When styling and the application code are decoupled from the UI, the code becomes simple enough for UX developers to manage and scale. Instead of creating custom components for the various contexts, the UX developer can use native HTML inputs, buttons, and other elements to build the layout. This dramatically reduces the amount of components and UI code.

The more complex operations narrow down to simple JavaScript calls to the application API and update the UI accordingly.

### Styling
You can re-use the same CSS code that is already present on your content-heavy websites. This further reduces the amount of code you need to write.

But most importantly: your styling code, its motion, and other effects are shared by both systems and are fully compliant with your design system.



## Get notified
Join our mailing list to get notified when this new development model is available.

[join-list]