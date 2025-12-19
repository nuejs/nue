
# Global design system
Global design system is the shift from component-driven development to building a reusable foundation that cascades through every site you create. Instead of building design separately for each project, you define typography, layout, interaction, and motion once. Every site inherits this complete foundation and overrides only what makes it unique.

The shift matters because most frameworks optimize for component-level thinking. React, Vue, Svelte - they assume you'll build UI piece by piece, site by site. You create components, package them, version them, and import them into each project. Design decisions get locked inside JavaScript. Sites customize through props and overrides. Each project maintains its own design implementation.

Nue inverts this. You build the complete design foundation once. Sites inherit everything and override minimally to express their personality.


## CSS and the inheritance model
The foundation is built with CSS. Not styled components. Not CSS-in-JS. Not utility classes. Just CSS files that cascade through the inheritance chain.

This is the only way to implement design inheritance at scale. CSS was designed for exactly this purpose: attaching presentation to semantic HTML structure. Think CSS Zen Garden if you remember it. One HTML file, hundreds of completely different designs. The HTML stays semantic and stable while CSS creates infinite visual expressions.

Modern CSS eliminates the problems that drove developers toward CSS-in-JS and utility frameworks. The rich HTML vocabulary gives you semantic elements to target and CSS nesting lets you style nested elements without extra class names. There's no such thing as "global namespace pollution".



## What makes a global design system?
In a properly designed system 80-90% of the code is CSS distributed as follows:

**Base design** defines the visual foundation and establishes consistency. Base typography, color systems, spacing, layout grids. The strategy is to find a good balance between what is shared and what is site-specific. For example, if the brands you work with are heavily typography-based, the typography.css should be thin or even absent.

**Interaction design** defines how interfaces respond to users. Hover/focus/active states. Toggles/tabs/dropwodns. Most of this happens in CSS through pseudo-classes and attribute selectors.

Interactive components add structure when CSS needs help. A tab component defines which panel is active. A toggle component manages checked state. But the visual feedback - the color change on hover, the animation on toggle, the transition between tabs - that's CSS responding to state changes.

**Motion design** brings interfaces to life. Elements fade in as they scroll into view. Panels slide open when triggered. Content transitions smoothly between states. Modern CSS handles most of this through transitions and animations. Scroll-triggered effects use `animation-timeline`. State transitions use `transition`. Complex sequences use `@keyframes`.

JavaScript provides fallback support when browser APIs need help. A ViewportObserver can trigger classes for scroll animations when `animation-timeline` isn't supported. A ResizeObserver can adjust layouts when container queries need assistance. But the motion itself - the easing curves, the timing, the visual transformation - that's defined in CSS.


## The 90% principle
The target architecture is that the sites inherit 90% of their code from the global design system. You define how buttons/cards/navigation look once and sites spend their code budget on personality.

A Linear-inspired site expresses its personality through the remaining 10%. Dark masking and shadow effects. The distinctive 3D CSS transition on the hero illustration. Purple accent colors and tight spacing. These overrides create Linear's specific aesthetic while the foundation provides everything else.

An Apple-inspired site creates personality differently. Generous whitespace. Card-based layouts. Colorful background gradients and patterns. Device framings for product shots. Again, roughly 10% of the total code.

Both sites feel completely different. But they share the same underlying system. The visual distinction comes through targeted overrides, not through rebuilding everything from scratch.

This only works when the foundation is comprehensive. If the base provides 50%, sites need to build the other 50%. But when the base provides 90%, sites focus purely on personality. The heavy lifting is done.


## Design as code
With Nue designers can work in code. They adjust CSS properties and see instant preview in the browser. Change a spacing variable and every site updates through hot module replacement. Tune a motion curve and the animation refines across all contexts. The preview can span multiple browser tabs showing different sites simultaneously. All updating in real time.

This workflow is surprisingly close to Figma. In Figma, you adjust flexbox properties with number inputs and see the result on the canvas. With Nue, you work directly with CSS and see the same immediate feedback. The difference is you have direct access to the full design language. Typography scales, spacing systems, color tokens, transitions, animations, pseudo-states, container queries. Everything CSS can express is available. No translation layer. No abstraction.

The design system and the sites stay synchronized because they share the same files. There's no handoff. No Figma-to-developer process where things get lost in translation. No back-and-forth about spacing details or motion timing. Designers adjust the source and see the result immediately across every site. This eliminates the complex, time-consuming handoff process where designs often degrade through multiple translation layers.

Component libraries require that translation layer. Designers spec in Figma. Developers interpret and implement. Design tokens try to bridge the gap with JSON configuration. But the final implementation still requires interpretation. With a global design system, designers and developers work in the same medium.

CSS is both the design tool and the implementation. It's the de facto language for design engineers.



## The compounding effect
Perhaps the best thing on global design system is that every refinement to it improves every site that extends it.

This compounds over time. Your second site looks better than your first because the foundation improved. Your tenth site reaches production quality in hours because you're mostly writing content and adding personality. The design system grows stronger with each project that extends and refines it.

The alternative is maintaining separate designs that drift apart. You rebuild the same patterns multiple times. You fix the same bugs independently. You spend effort keeping things aligned manually.

With a global design system you build the foundation once and let it compound.




