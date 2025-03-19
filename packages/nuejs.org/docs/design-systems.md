
# Design systems
A design system is a set of rules and reusable components that brings consistency, structure, and efficiency to your design and development process. It ensures your visual identity flows seamlessly from design into code. Nue embraces this through CSS, leveraging web standards to create scalable, maintainable systems—simplified by powerful tools like cascade layers, nesting, and automatic asset handling.


## What exactly is a CSS design system?
A CSS design system organizes styling by keeping design separate from components. This split lets CSS handle the visual layer—using variables, cascade layers, and nesting to maintain consistency and scale—while components focus on structure and behavior. It’s a deliberate choice to use CSS as the design language, distinct from template logic.

This separation makes theming practical. Change a few variables—colors, typography, spacing—and the whole system updates. For bigger shifts, override a layer or replace the stylesheet, all without altering markup. It’s a way to adjust design efficiently, from small tweaks to full reworks.

If you’re from the React world, design systems might not be as front-and-center as in design circles. In React, styling often mixes with components, and standalone design systems are less common. ShadCN is perhaps the closest implementation of design systems when it comes to the React ecosystem. It provides a default theme built with about 44,000 lines of TSX, including hooks and logic (see [GitHub](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4)).

Theming it, however, shows the limits of TSX: creating something like the "New York "theme ([GitHub link](https://github.com/shadcn-ui/ui/tree/main/apps/v4/registry/new-york-v4)) means copying and modifying that entire codebase.

With CSS, theming stays simpler—variables and layers handle changes without duplicating everything. For example, Nue’s demo styles an entire CRM/SPA application in around 1,000 lines total, which includes both global and application-specific components and styling.


## CSS processing in Nue
Nue simplifies CSS design system development with efficient processing and automation. It’s designed to make CSS work well for building and scaling design systems. Here’s how it handles it:

1. **CSS processing**
   Nue uses Bun’s internal CSS processor, with Lightning CSS as a fallback on Node. This setup supports modern CSS features like nesting and OKLCH color spaces natively. You get these tools without needing extra preprocessors or complex build steps.

2. **Automatic dependency management**
   Nue determines which CSS files a page needs based on their file system location and YAML `include`/`exclude` rules. A stylesheet in a blog directory applies only to blog pages. Root-level styles cover the front page and more. It manages dependencies automatically.

3. **Stylesheet-level HMR**
   Hot Module Replacement in Nue updates individual stylesheets instantly. Change a file, and only that file reloads—component state stays put, and updates show up right away. It’s built for a smooth development flow when adjusting design system layers.

4. **Performance optimization**
   Nue minifies CSS by removing unused code and whitespace. It also inlines critical styles where needed, reducing load times without overloading the markup. This keeps pages efficient while preserving design system flexibility.



## Templates
This documentation provides a solid starting point for systematic design with CSS, but mastering it takes practice. To help bridge that gap, Nue is developing templates for single-page applications and content-heavy websites. These templates draw on over 20 years of experience in vanilla CSS design and JavaScript frontend engineering. They offer pre-built examples of design systems—complete with variables, layers, and components—tailored to different use cases.

If you’d like to know when these templates are available, join the mailing list for a notification.


