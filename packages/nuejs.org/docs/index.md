
# The standards first web framework
Nue is a standards first framework that returns web development back to its core strengths. It takes modern HTML, CSS, and JavaScript to their natural peaks without introducing unnecessary abstractions.

[image /img/standards-first.png]:
  width: 600

## Web standards
Modern web development has become increasingly complex. What began as elegant HTML, CSS, and JavaScript has devolved into labyrinthine build systems demanding hundreds of dependencies. Today's projects require complex TypeScript configurations, module bundlers, CSS preprocessors, and an endless chain of plugins just to render a page. This mounting complexity doesn't merely slow development - it creates brittle foundations requiring constant maintenance.

The cost becomes particularly apparent in how quickly framework knowledge depreciates. **React** patterns from just a few years ago - class components, lifecycle methods, higher-order components - are now considered anti-patterns. State management solutions have cycled through **Flux, Redux, MobX, Recoil**, and **Jotai**. Even fundamental concepts like server-side rendering have been reimagined multiple times through framework iterations.

We've normalized the idea that simple tasks demand massive amounts of JavaScript. That basic styling needs thousands of utility classes. That design changes mean updating countless components. While this approach might seem efficient initially, it produces rigid systems that resist change and grow increasingly difficult to maintain over time.

But during this pursuit of framework complexity, browsers have quietly evolved. They now offer sophisticated native capabilities that eliminate the need for most framework abstractions. The gap between what frameworks provide and what browsers can do natively has narrowed dramatically - and in many cases, reversed.

Knowledge of web standards compounds over time. Understanding CSS Grid from 2017 remains valuable today and has only grown more powerful as browser support improved. Knowledge of custom elements from 2015 translates directly to modern web components. Semantic HTML principles from the early web still form the foundation of accessible applications.

This isn't about rejecting modern development - it's about recognizing that browsers now offer sophisticated capabilities that eliminate the need for most framework abstractions. From native dialogs to container queries, from CSS layers to view transitions, the platform itself provides cleaner solutions than framework implementations.


## HTML
Modern HTML provides remarkable power that most developers overlook. Take for example a `<dialog>` element:

```html.good "Standard HTML"
<button popovertarget="delete-dialog">Delete Account</button>

<dialog id="delete-dialog" popover>
  <h2>Delete Account</h2>
  <p>Are you sure you want to delete your account?</p>
  <footer>
    <button type="button" popovertarget="delete-dialog">Cancel</button>
    <button type="submit">Delete</button>
  </footer>
</dialog>
```

The native `popover` and `popovertarget` attributes provide everything needed: launching the dialog, closing with Escape key or backdrop click, smooth transitions, focus management, and proper accessibility - all without JavaScript. Styling remains in CSS where it belongs. Content structure stays clean and semantic.

Yet we've normalized a way to couple everything together with JavaScript: layout, styling, logic, and content structure all living inside framework components. These monoliths not only make systems rigid and hard to maintain, but also obscure the powerful capabilities browsers now provide natively:

```js.bad "JavaScript monolith"
import { Dialog } from '@headlessui/react'
import { useDialogState } from './state'

export function DeleteDialog() {
  const [isOpen, setIsOpen] = useDialogState()

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Delete Account
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete your account?
          </Dialog.Description>
          <footer>
            <button onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button onClick={handleDelete}>
              Delete</button>
          </footer>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
```

The framework version not only clutters the markup with unnecessary components, but it also comes with a hefty cost. Each custom component requires JavaScript implementation, state management, event handlers, and accessibility considerations. The Dialog component alone often brings thousands of lines of code to your client bundle. In contrast, the HTML-first approach leverages native browser capabilities that require zero additional JavaScript.

Native HTML isn't just about simpler markup - it's about leveraging the sophisticated capabilities browsers now provide. From form validation through the Constraint Validation API to custom elements for truly reusable components, modern HTML eliminates the need for many framework abstractions while providing better accessibility and performance by default.



## CSS
Now onto the most important thing: the fundamentally different approaches to styling between JavaScript monoliths and modern CSS. This isn't about technical patterns or implementation details - it's about enabling systematic design through code.

Modern CSS excels at building design systems. Custom properties and calculations express precise mathematical relationships. Typography follows musical scales through `calc()`. Colors maintain harmony with OKLCH. Spacing flows from consistent ratios. The language itself is perfectly suited for translating design systems into code:

```css.good "CSS design system"
:root {
  /* Typography follows Perfect Fourth (1.333) */
  --scale: 1.333;
  --text-base: 1rem;
  --text-lg: calc(var(--text-base) * var(--scale));
  --text-xl: calc(var(--text-lg) * var(--scale));

  /* Colors maintain precise OKLCH relationships */
  --brand: oklch(67% 0.2 230);
  --brand-accent: oklch(67% 0.2 290);
  --brand-light: oklch(77% 0.2 230);
}
```

This is where the design engineer shines - someone who understands both visual design and mathematical precision. Experienced design engineers work directly in CSS, expressing systematic relationships that maintain harmony across the entire interface. They often skip the designer-developer handoff entirely, moving straight from Figma to CSS implementation.

Yet today's ecosystem has fragmented CSS into a wild array of JavaScript-centric approaches. Teams wrestle with styled-components, emotion, CSS Modules, CSS-in-JS, and various ways to mix CSS with TypeScript. All this complexity supposedly solves "global namespace pollution" - a problem that doesn't exist in proper design systems. Here's how a card component typically looks:

```tsx.bad "TypeScript monolith"
interface CardProps {
  title: string
  description: string
  variant?: 'default' | 'info' | 'error'
  isHighlighted?: boolean
  className?: string
}

export function Card({
  title,
  description,
  className,
  isHighlighted,
  variant = 'default'
}: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border p-6",
      "transition-all duration-200",
      {
        'border-gray-200 bg-white shadow-sm hover:shadow-md': variant === 'default',
        'border-blue-100 bg-blue-50': variant === 'info',
        'border-red-100 bg-red-50': variant === 'error',
        'ring-2 ring-blue-500': isHighlighted
      },
      "dark:bg-gray-900 dark:border-gray-800",
      className
    )}>
      <h3 className="text-lg font-medium tracking-tight mb-2 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  )
}
```

From a design engineering perspective, this is problematic. There's no system - just a maze of utility classes that only engineers can parse. The focus is entirely on TypeScript definitions, JavaScript patterns, and technical concerns that have nothing to do with design. A design engineer would express the same component through systematic thinking:

```html.good "Semantic HTML"
<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

```css.good "CSS design system"
.card, .bento > * {
  background-color: var(--card-bgcolor);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
}
```

This isn't about replacing utility classes with CSS properties. It's about the stark contrast between inline styling and systematic thinking. Utility frameworks like Tailwind are not design systems - they're just inline styles with better ergonomics. True design systems express visual harmony through mathematical relationships.

The key difference is focus. When styling lives in CSS, we think about typography, whitespace, and visual systems. The gap between design and engineering narrows dramatically. In the best cases, design engineers can eliminate the traditional designer-developer handoff entirely.

When you break free from JavaScript monoliths, you begin exploring CSS and the fascinating world of systematic design. These are vital skills for any frontend developer's future - far more valuable than learning temporary framework patterns.



## JavaScript
The role of JavaScript in modern web development needs another reassessment. Most websites consist primarily of content - product pages, documentation, blogs - where JavaScript should play a minimal role. At most, these sites need isolated interactive elements ("islands") and optional enhancements for CSS effects. Only in true single-page applications is JavaScript essential to the core experience. Yet frameworks like Next.js and React force the SPA model onto every site, regardless of its actual needs.

Consider a simple product page with a fade-in effect:

```html.good "Standards based"
<div class="product-page">
  <h1>Product Title</h1>
  <p>Product description</p>
</div>

<style>
@starting-style {
  .product-page { opacity: 0; }
}
.product-page {
  opacity: 1;
  transition: opacity 0.5s;
}
</style>
```

Yet frameworks like Next.js force this same content into a JavaScript-dependent architecture:

```js.bad "React monolith"
import { motion } from 'framer-motion'

export default function ProductPage({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{product.title}</h1>
      <p>{product.description}</p>
    </motion.div>
  )
}
```

The framework approach forces every page into a JavaScript-dependent architecture, regardless of its actual dynamic requirements. This not only bloats the bundle size but also reduces reliability - content becomes inaccessible if JavaScript fails to load.

Even when interactivity is needed, frameworks typically abstract away the powerful APIs browsers now provide natively. Consider animations:

```js.good "Vanilla JavaScript"
element.animate([
  { scale: 1, rotate: '0deg', borderRadius: '20%' },
  { scale: 2, rotate: '0deg', borderRadius: '20%' },
  { scale: 2, rotate: '270deg', borderRadius: '50%' },
  { scale: 1, rotate: '270deg', borderRadius: '50%' },
  { scale: 1, rotate: '0deg', borderRadius: '20%' }
], { duration: 2000 })
```

Instead of framework complexity:

```js.bad "JavaScript monolith"
import { motion } from 'framer-motion'

export default function MotionDiv() {
  return (
    <motion.div
      animate={{
        scale: [1, 2, 2, 1, 1],
        rotate: [0, 0, 270, 270, 0],
        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      }}
    />
  )
}
```

The JavaScript monolith approach doesn't just add unnecessary complexity - it actively prevents developers from learning these powerful browser APIs. Instead of mastering standards that will serve them for years, developers learn framework-specific patterns that quickly become outdated.

Most surprisingly, many features that traditionally required JavaScript now work natively through HTML and CSS alone. Beyond our earlier fade-in example, modern CSS handles responsive design, state management, scroll-based animations, and even complex interactions through features like container queries and view transitions.

The key insight: JavaScript should only be used where it genuinely enhances the user experience - form validation, data visualization, real-time features. Everything else works better through web standards.



## Markdown
While Markdown is not an official web standard, it has become the de-facto standard for content authoring. The original specification excels at simple prose, but modern websites need more: rich layouts, interactive elements, and sophisticated content structures that remain accessible to non-technical authors.

Nue extends Markdown syntax to enable rich content authoring while maintaining the readability of a book. Whether you're creating documentation, blog posts, marketing pages, or product tours, content remains clean and easily editable by both non-technical teams and AI assistants.

[image.bordered]:
  caption: Nue's extended Markdown syntax handles all varieties of content
  small: /img/content-files.png
  large: /img/content-files-big.png
  size: 745 × 383

Consider how to assemble a features section:

```md.good "Content assembly"
## Amazing features
Our platform provides everything you need for modern web development

[.bento]
  ### Lightning fast
  Your content and styling loads instantly
  [image feature1.webp]

  ### Simple to use
  Clean interface that your team will love
  [image feature2.webp]

  ### Built to scale
  Grows seamlessly with your business needs
  [image feature3.webp]
```

This generates semantic HTML that hooks into the systematic styling we saw earlier. Now compare this to the same structure in a JavaScript monolith:

```jsx.bad "JavaScript monolith"
import { Container, Grid, Card, CardMedia, CardContent } from '@mui/material'
import { Typography } from '@mui/material'
import { Section } from '@/components/Section'
import { motion } from 'framer-motion'

function Features() {
  return (
    <Section className="features">
      <Container maxWidth="lg">
        <Typography variant="h2" className="text-center mb-12">
          Amazing features
        </Typography>
        <Typography variant="subtitle1" className="text-center mb-16">
          Our platform provides everything you need for modern web development
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia component="img" src="/feature1.webp" />
              <CardContent>
                <Typography variant="h5">Lightning fast</Typography>
                <Typography>
                  Your content and styling loads instantly
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <!--
            Two more identical grid items here
            ...

          -->
        </Grid>
      </Container>
    </Section>
  )
}
```

The JavaScript approach quickly becomes unwieldy. Building a feature tour, customer showcase, or documentation site becomes a massive software engineering project. This is particularly problematic when frameworks make no distinction between website content and single-page applications - everything becomes a software development task.

While MDX attempts to bridge this gap, it creates new problems. The mixture of JavaScript imports and JSX blocks makes content fragile and intimidating for non-technical authors. More importantly, MDX lacks support for rich content structures like sections, blocks, and grids that are essential for creating **Apple**-level marketing pages.

Nue provides the perfect system for content management. Marketing teams can directly edit content through clean, readable Markdown files. When this content hooks into a systematic CSS design system, the entire site scales effortlessly as content grows. This is particularly powerful for organizations who care about design - content authors can focus on structure and meaning while the design system ensures visual consistency.



## Dynamic HTML
While standard HTML is perfect for static content, modern websites need dynamic features: rendering data from APIs, showing user-specific content, responding to interactions. Traditionally this has led developers to abandon HTML entirely for JavaScript frameworks like React, with all their complexity.

Nue takes a different approach: instead of replacing HTML, it enhances it with minimal syntax for dynamic features. All HTML examples so far have in fact used this extended HTML syntax. With just a few additions - `:for` for loops, `:if` for conditionals, `{ }` for dynamic values - you get all the power of React while staying close to web standards. The entire client-side runtime is just 2.5kb minified, yet it provides the same reactivity and DOM diffing capabilities.

Consider rendering a list of blog entries:

```html.good
<ul>
  <li :for="post in posts">
    <time :datetime="post.date">{ post.date }</time>
    <a :href="post.url">
      <h2>{ post.title }</h2>
      <p>{ post.description }</p>
    </a>
  </li>
</ul>
```

The same functionality in a JavaScript monolith requires extensive boilerplate, especially when types are involved:

```tsx.bad
import type { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <time dateTime={post.date}>
            {formatDate(new Date(post.date))}
          </time>
          <Link href={post.url}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

Nue is simpler. If you know HTML, you know Nue. There's no need to learn complex hooks patterns, master state management libraries, or understand years of framework evolution. No historical baggage of class components, higher-order components, or render props. Just HTML enhanced with minimal syntax for dynamic features.

What sets Nue apart is how this simple syntax works everywhere: server-side rendering, client-side components ("islands"), and even hybrid ("isomorphic") components that adapt to their context. Most importantly, these components work seamlessly in both Markdown content and layout modules. The same component can render server-side in your marketing pages and client-side in your interactive features.


## Motion
Modern CSS handles a remarkable range of motion design natively:

1. **State transitions**: Smoothly animate between element states through transitions, handle entry animations with `@starting-style`, and orchestrate complex sequences with keyframe animations.

2. **Scroll-driven animations**: Trigger motion based on scroll position, viewport intersection, or container size - perfect for scroll-based reveals and responsive animations.

3. **Page transitions**: Transform navigation between pages through the View Transitions API, enabling app-like experiences without JavaScript complexity.

The last point deserves special attention. Nue has put significant effort into making view transitions both powerful and standards-based. Enable them globally in your `site.yaml`:

```yaml
view_transitions: true
```

This adds a minimal 1.9kB script that brings sophisticated client-side navigation to your site. While solutions like PJAX and Turbolinks pioneered this approach, and Next.js made it mainstream through React, Nue's implementation is the most sophisticated and standards-based take yet. The script:

1. Intercepts navigation events
2. Fetches new content via JavaScript
3. Uses DOM diffing to precisely identify changed content
4. Leverages the View Transitions API to smoothly animate between states
5. Updates only what changed while preserving page state

This means instant, app-like navigation while maintaining proper HTML semantics. The animations are fully customizable through CSS:

```css
::view-transition-group(main) {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

::view-transition-old(main) {
  opacity: 1;
  transform: scale(1);
}

::view-transition-new(main) {
  opacity: 0;
  transform: scale(0.95);
}
```

Most impressively, view transitions enable fluid image morphing between pages. When an image triggers navigation, Nue automatically assigns `view-transition-name: active-image`, allowing the image to smoothly transform to its new position:

```css
.hero-image {
  view-transition-name: active-image;
}
```

This standards-first approach extends to all motion design. Entry animations use `@starting-style` instead of JavaScript libraries:

```css
.product-page {
  opacity: 1;
  transition: opacity 0.5s;

  @starting-style {
    opacity: 0;
  }
}
```

Compare this to JavaScript monoliths where even basic transitions require complex component hierarchies and animation libraries. A simple fade-in needs React, Framer Motion, and careful state management. Page transitions demand extensive configuration and client-side routing. Everything becomes a software engineering challenge rather than straightforward motion design.

Through web standards, Nue enables sophisticated motion while maintaining performance, accessibility, and clean separation between content and behavior. The animations enhance the experience without compromising the core principles of progressive enhancement.


## Tooling
Development speed depends critically on feedback time. When you make a change, how quickly do you see the result? Nue provides universal hot-reloading that impacts your workflow quite a bit:

[bunny-video]:
  videoId: abb2cf75-c7f9-43e6-b126-8827d0c8721e
  style: "background-color: #282C30"
  poster: /img/blog-content-editing-big.png


In above, you can see hot-reloading in action: the content, styles, and components update instantly while maintaining page state.

When you modify content, Nue performs DOM diffing to update only what actually changed. Input values remain preserved. Open dialogs stay open, even if you're editing the dialog's content. The system maintains document state while seamlessly integrating your changes.

The intelligence extends beyond the current page. If you modify content on another route, Nue automatically navigates to show you the updated page. Yet if you change an asset that isn't relevant to your current view, the system knows to ignore it. This contextual awareness means you always see relevant updates without unnecessary refreshes.

The secret to this performance is staying closer to the metal. The entire Nue installation is just 11MB. Getting started requires only two files: `site.yaml` for configuration and `index.md` for content. No programmatic setup, no dependency chains, no framework-specific patterns.

Compare this to JavaScript monoliths:
- A minimal Next.js installation consumes more than 300MB disk space
- Over 250 NPM dependencies just to set up a development environment
- Build times of 15 seconds or more for moderate-sized applications
- Component updates need seconds to refresh
- Content changes are ignored

Nue makes it better:
- Content updates around 50ms
- Style changes: 10-20ms
- Component modifications: 20-100ms
- Full site rebuild (100 pages) below 0.5 seconds

This changes how development feels. The tight feedback loop keeps you in flow. Ideas can be explored rapidly. Adjustments feel immediate and natural. Development becomes enjoyable.


## Optimization
Nue builds the fastest pages possible, which are the ones that require just one request. When the initial HTML response contains everything needed to render the page - content, structure, and styles - the browser can begin painting immediately. There's no waterfall of CSS and JavaScript requests, no cumulative layout shifts, no waiting for framework initialization. The page simply appears.

The optimization secret is CSS inlining. Enable it in your `site.yaml`:

```yaml
inline_css: true
```

Nue's build system is designed from the ground up to support this technique.

Contrast this to JavaScript monoliths that can never achieve this ideal. Their architecture fundamentally depends on shipping large amounts of framework code before meaningful content can be displayed. Even with aggressive optimization, they must send React, routing logic, and component code. And it makes no sense to inline large CSS frameworks like Tailwind on every page.

The web development world has become obsessed with the wrong kind of optimization. Complex bundlers written in Rust and Go slice, dice, and rearrange JavaScript code in increasingly sophisticated ways. Teams spend countless hours configuring build tools, optimizing chunk splitting, and fine-tuning tree-shaking algorithms. But this optimization theater misses the point: proper separation of concerns naturally leads to better performance without complex bundling strategies.


## Who is Nue for
The standards-first approach to web development creates value for several distinct audiences:

* **For beginner web developers**, Nue offers a clearer path to mastery. Rather than immediately diving into complex framework abstractions, beginners can focus on understanding the core web technologies: HTML, CSS, and JavaScript. This creates stronger foundations that remain relevant regardless of which tools emerge in the future. Instead of learning temporary framework patterns, developers build deep knowledge of web standards that naturally compound over time.

* **For experienced JavaScript developers**, Nue provides relief from framework complexity. After years of wrestling with React's growing abstractions - managing state, coordinating effects, optimizing builds - many developers seek simpler solutions. Nue demonstrates how modern web standards can replace many framework patterns naturally. Complex data flows become simple HTML forms. JavaScript-heavy animations transform into native CSS transitions. State management shifts to custom properties. The result is sophisticated applications with dramatically less code and complexity.

* **For design-focused teams**, Nue enables a return to systematic thinking. Rather than embedding design decisions in utility classes or CSS-in-JS, teams can create true design systems that scale naturally. Modern CSS features like custom properties, calculations, and container queries provide unprecedented power for creating mathematical relationships. Design engineers can focus on building systems that unite marketing sites and applications under consistent visual languages. The emphasis stays on user experience and design systems rather than framework-specific patterns.

In each case, Nue's standards-first approach creates more than just immediate benefits - it builds knowledge and systems that appreciate over time rather than decaying with each framework iteration.

This sustainable approach to skill development might be Nue's most important contribution. In a world of constant framework churn, learning web standards provides stable foundations that become more valuable over time. Whether you're just starting your journey or bringing years of experience, working closer to the web platform creates more resilient knowledge and more maintainable applications.


