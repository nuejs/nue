---
include: [form, button]
---

# Single-page applications `Coming soon`

Ultimately Nue brings the UX development model and the global design system to the world of single-page applications. This makes for a better system architecture, a clearer coding style and a more enjoyable way to build new things:

[image.gridpaper]
  small: /img/single-page-app.png
  large: /img/single-page-app-big.png
  width: 500

Nue allows you to employ the same development approach to build both content-heavy applications and single-page applications. This brings a refreshing change, not only for UX developers but also for application developers, who can focus on writing clean code without dealing with the "messy" front-end elements. It's all about pure JavaScript, tested on the server side, and delivered through a clean, well-documented API.

[.note]
  ### Note

  The development of single-page applications starts after the templates project is finished, which is pretty major. All the related issues are marked as [low priority](https://github.com/nuejs/nue/labels/low%20priority).

## Separation of concerns

Today, the codebases of single-page applications are enormous. It's not unusual to see projects with hundreds, even thousands of JavaScript components, where the markup, styling and logic, are mixed together forming a massive canvas of "spaghetti code". Projects like **Vite** are specifically built to solve the issues that come with these massive component-heavy codebases.

Nue's approach is different. It splits your codebase in two: The application and the user interface. This split makes a big difference in how you code looks:

### Application code

The application code becomes a separate entity with no complexities from the UI layer: There is no knowledge of views nor state and the code is absent from framework-specific concepts like hooks, refs, or events. And there are no extra domain-specific idioms like *JSX* or *Tailwind*.

This dramatically simplifies the code, making it easier to read and maintain. The application can be an isolated *NPM* module, that can be tested separately.

But most importantly: You can use the same application code for different frontends like Console, a Slack agent or a mobile app.

You can even use a true typed language like *Rust* or *Go* and compile the application to *WASM* like *Figma* does. Decoupled application logic opens new doors for front-end developers.

### User interface code

When the styling and the application code are decoupled from the UI, the code becomes simple enough for UX developers to manage and scale. Instead of creating custom components for the various contexts, the UX developer can use native HTML inputs like buttons and other elements to build the layout. Together with the global design system, you'll end up with a dramatically simpler codebase. You need less time and effort to implement new things.

You can re-use the same global CSS code that is already present in your content-heavy website. This further reduces the amount of code you need to write.

But most importantly: Your styling code, its motion and other effects are shared by both systems and are fully compliant with your design system.

## Get notified

Join our mailing list to get notified when this new development model is available.

[join-list]
