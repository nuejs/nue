
# The standards-first web framework
Nue is a closer-to-metal framework that returns web development to its core strengths. It takes modern HTML, CSS, and JavaScript to their natural peaks without introducing unnecessary abstractions.

## Modern web standards
Frontend development has lost its way. What began as elegant HTML, CSS, and JavaScript has devolved into labyrinthine build systems demanding hundreds of dependencies. Today's projects require complex TypeScript configurations, module bundlers, CSS preprocessors, and an endless chain of plugins just to render a page. This mounting complexity doesn't merely slow development - it creates brittle foundations requiring constant maintenance.

We've normalized the idea that simple tasks demand massive amounts of JavaScript. That basic styling needs thousands of utility classes. That design changes mean updating countless components. While this approach might seem efficient initially, it produces rigid systems that resist change and grow increasingly difficult to maintain over time.

But during this pursuit of framework complexity, browsers have quietly evolved. They now offer sophisticated native capabilities that eliminate the need for most framework abstractions. The gap between what frameworks provide and what browsers can do natively has narrowed dramatically - and in many cases, reversed.

The web platform itself offers a simpler path forward. Modern standards provide everything needed to build sophisticated interfaces without framework overhead. This isn't about returning to a simpler past - it's about embracing the remarkable capabilities that exist in browsers today.


## HTML
Modern HTML provides remarkable power that most developers overlook. The platform now offers native solutions for core functionality that frameworks often unnecessarily abstract away. Custom elements enable truly reusable components. The native `<dialog>` element handles modal interactions. Form validation works reliably through HTML attributes alone.

This evolution transforms how we approach web development. Consider how frameworks often wrap simple HTML elements in complex abstractions:

```html
// Framework approach
<Dialog>
  <DialogOverlay />
  <DialogContent>
    <DialogTitle>Delete Account</DialogTitle>
    <DialogDescription>Are you sure you want to delete your account?</DialogDescription>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// HTML-first approach
<dialog>
  <h2>Delete Account</h2>
  <p>Are you sure you want to delete your account?</p>
  <footer>
    <button type="button">Cancel</button>
    <button type="submit">Delete</button>
  </footer>
</dialog>
```

The framework version not only clutters the markup with unnecessary components, but it also comes with a hefty cost. Each custom component requires JavaScript implementation, state management, event handlers, and accessibility considerations. The `Dialog` component alone often brings thousands of lines of code to your client bundle. In contrast, the HTML-first approach leverages native browser capabilities that require zero additional JavaScript. The browser already knows how to handle focus management, keyboard interactions, and accessibility for the `<dialog>` element.

Nue builds on this HTML-first foundation by providing flexible ways to extend HTML's capabilities. Server-side components handle complex rendering without client overhead. Reactive components add sophisticated interactivity when needed. Isomorphic components work seamlessly across server and client contexts. This architecture maintains HTML's natural simplicity while enabling powerful functionality through the platform's built-in features.


## CSS
The evolution of CSS represents perhaps the most dramatic transformation in modern web development. Features that once required complex JavaScript solutions now work natively through CSS alone. Consider how frameworks traditionally handle responsive design:

```js
// Framework approach
function ResponsiveComponent() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width > 768 ? <DesktopLayout /> : <MobileLayout />
}
```

Compare this to modern CSS container queries:

```css
/* CSS-first approach */
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
```

The framework approach requires component lifecycle management, event listeners, state updates, and conditional rendering logic. The CSS solution handles the same functionality through declarative rules that browsers process natively. No JavaScript, no state management, no performance overhead.

This pattern repeats across modern CSS features. Custom properties and calculations enable sophisticated design systems without JavaScript variables. The `@property` syntax provides type-safe theming. Scroll-driven animations replace entire animation libraries. Features like `:has()` and subgrid transform layout capabilities. Even state management becomes possible through CSS layers and custom properties.

The implications are profound. Tasks that once required React components can now be handled through pure CSS. Interactions that demanded state management work through pseudo-classes. Animations that relied on JavaScript libraries flow naturally through CSS transitions. By embracing these capabilities, we can create sophisticated interfaces with dramatically less code and complexity.

Nue's approach maximizes these native features while providing tools to manage CSS at scale. The build system processes styles through Lightning CSS for optimal performance. Automatic dependency management keeps styles modular as projects grow. Most importantly, the standards-first architecture means your CSS knowledge remains relevant as browsers continue evolving.



## JavaScript
The role of JavaScript in modern web development needs fundamental reassessment. While frameworks like Next.js mandate JavaScript for even the simplest content pages, the reality is that many websites require minimal client-side code. Consider a typical company website with product pages, documentation, and a blog:

```html
// Framework approach (Next.js)
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

This simple product page requires the entire Next.js runtime, React, and Framer Motion - often totaling hundreds of kilobytes of JavaScript - just to fade in some static content. The same effect through native web standards:

```html
<!-- HTML-first approach -->
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

The framework approach forces every page into a JavaScript-dependent architecture, regardless of the actual dynamic requirements. This creates multiple issues:

- Increased load times as browsers must download, parse, and execute large JavaScript bundles
- Reduced reliability as content becomes inaccessible if JavaScript fails to load
- Higher maintenance burden as framework upgrades often require significant code changes
- Unnecessary complexity for content creators who must work through component abstractions

When JavaScript is truly needed for interactivity, Nue provides several approaches that work with browser standards rather than against them. Custom elements handle reusable functionality. Event delegation manages complex interactions. The native animation API enables sophisticated motion. Most importantly, these features remain optional - you add JavaScript only where it genuinely improves the user experience.

This standards-first approach means your JavaScript remains focused on real functionality rather than framework requirements. A typical Nue application might use JavaScript for:

- Enhanced form validation beyond HTML's built-in capabilities
- Complex data visualizations that require dynamic updates
- Sophisticated user interactions that extend beyond CSS possibilities
- Real-time features requiring WebSocket connections

The result is dramatically smaller client bundles, faster page loads, and more reliable applications. By working with web standards, we create experiences that remain fast and dependable while using JavaScript judiciously for genuine interactivity needs.


## The cost of framework knowledge
Modern web development has created an unusual paradox: the more you invest in learning today's popular frameworks, the more technical debt you accumulate in your skillset. This represents a fundamental shift from how web development skills traditionally compound over time.

Consider the evolution of a typical React developer's journey. They start by learning React's core concepts - components, props, state. Then they add state management with Redux or Context. They master hooks, effect patterns, and memoization strategies. Soon they're learning Next.js for server-side rendering, Framer Motion for animations, and Tailwind for styling. Each layer adds framework-specific knowledge that's fundamentally disconnected from web standards.

This knowledge has a short half-life. React patterns from just a few years ago - class components, lifecycle methods, higher-order components - are now considered anti-patterns. State management solutions have cycled through Flux, Redux, MobX, Recoil, and Jotai. Even fundamental concepts like server-side rendering have been reimagined multiple times through Next.js iterations.

In contrast, knowledge of web standards compounds over time. Understanding CSS Grid from 2017 remains valuable today and has only grown more powerful as browser support improved. Knowledge of custom elements from 2015 translates directly to modern web components. Semantic HTML principles from the early web still form the foundation of accessible applications.

The cost becomes particularly apparent when we examine specific tasks:

```js
// Framework-specific knowledge (React + Framer Motion)
function FadeInSection({ children }) {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.8 }
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Web standards knowledge (CSS)
.fade-in {
  view-timeline-name: --reveal;
  view-timeline-axis: block;
  animation: fade-in linear both;
  animation-timeline: --reveal;
  animation-range: entry 25% cover 50%;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

The framework approach requires understanding:
- React's component model and hooks system
- Framer Motion's animation API
- Intersection Observer patterns through React
- Effect cleanup and dependency arrays
- Component composition patterns

All of this knowledge becomes obsolete when frameworks evolve or when you switch to different tools. The web standards approach builds lasting skills:
- CSS animation and transition properties
- View timeline features
- Transform and opacity effects
- Progressive enhancement principles

These standards-based skills remain valuable regardless of which tools you use in the future. They work across frameworks, improve naturally as browsers evolve, and provide a deeper understanding of web platform capabilities.

This is why a standards-first approach isn't just about technical choices - it's about sustainable skill development. When you build expertise in HTML, CSS, and JavaScript fundamentals, you create knowledge that appreciates over time rather than degrading with each framework iteration. Your understanding grows deeper as web standards evolve, rather than being repeatedly displaced by new framework patterns.




## Content-heavy websites
The web started as a platform for sharing documents. The idea was simple and elegant: HTML defines content structure, CSS handles visual appearance, and JavaScript adds optional interactivity. This natural separation of concerns made perfect sense for content-heavy websites like documentation, blogs, marketing sites, and e-commerce catalogs.

But something strange happened. As single-page application frameworks like React gained popularity, teams began applying SPA patterns to content-heavy websites. Marketing sites that could be simple HTML documents became complex JavaScript applications. Blog posts that could be static Markdown files turned into React components with heavy client-side rendering.

Consider how a typical company website is built today using Next.js:

```jsx
// A simple blog post becomes a complex component tree
export default function BlogPost({ post }) {
  return (
    <Layout>
      <Header>
        <Navigation items={navigationItems} />
        <SearchWidget />
      </Header>

      <Main>
        <Article>
          <Title>{post.title}</Title>
          <MDXContent>{post.content}</MDXContent>
          <SocialShare />
        </Article>
        <Sidebar>
          <TableOfContents />
          <RelatedPosts />
        </Sidebar>
      </Main>

      <Footer>
        <NewsletterSignup />
        <SiteMap />
      </Footer>
    </Layout>
  )
}
```

This approach creates multiple issues:

- Content becomes trapped inside JavaScript components
- Marketing teams can't update pages without developer help
- Every page load requires heavy JavaScript processing
- SEO and performance suffer from client-side complexity
- Simple content changes require full application rebuilds

The core problem is treating document-based websites like applications. When your marketing site uses the same architecture as your complex web app, you inherit all the complexity with none of the benefits. Your blog posts don't need React. Your product pages don't need client-side rendering. Your documentation doesn't need a JavaScript framework.

Content-heavy websites need a different approach - one that returns to the web's core strengths while embracing modern capabilities. This means:

- Content lives in simple, portable formats
- Structure flows from semantic HTML
- Styling comes from sophisticated CSS
- JavaScript remains optional, used only when truly needed

Nue provides this approach through two core innovations: an extended Markdown format for content authoring and mathematical design systems for visual presentation. Together, these enable teams to build sophisticated websites without framework complexity.


Ah, this is an excellent point that makes Nue's Markdown even more elegant. Let me revise that section to highlight this power:


## Extended Markdown
Nue's extended Markdown format transforms how we build content-heavy websites by bridging the gap between simple document authoring and sophisticated web layouts. While traditional Markdown works well for basic content, modern websites need more expressive capabilities for responsive images, complex layouts, interactive elements, and rich data presentation.

Consider how frameworks typically handle a product features section:

```jsx
function Features() {
  return (
    <Section className="features">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia component="img" src="/feature1.webp" />
              <CardContent>
                <Typography variant="h5">Fast</Typography>
                <Typography>
                  Lightning-quick performance through optimized delivery
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Two more identical grid items */}
        </Grid>
      </Container>
    </Section>
  )
}
```

Nue's extended Markdown takes a radically different approach. Instead of wrapping content in complex component hierarchies, it uses the document's natural structure to create sophisticated layouts:

```md
[.grid]
  ### Lightning fast
  Optimized delivery ensures your content loads instantly.
  [image feature1.webp]

  ### Simple to use
  Clean interface that your team will love.
  [image feature2.webp]

  ### Built to scale
  Grows seamlessly with your business needs.
  [image feature3.webp]
```

This approach reveals the true power of content-first development. The heading structure naturally defines grid items - no extra markup needed. Images flow within the content rather than requiring wrapper components. The entire layout emerges from the document's semantic structure while the design system handles visual presentation.

The benefits are profound:
- Content reads like a natural document
- Structure flows from semantic meaning
- Marketing teams can instantly understand the format
- Design changes don't touch the content
- No artificial component boundaries


This separation extends to all aspects of modern web content. Need responsive images with art direction? The syntax stays clear:

```md
[image]
  large: desktop-hero.webp
  small: mobile-hero.webp
  caption: Optimized for every screen
```

Want to embed interactive elements? Native HTML capabilities are just a tag away:

```md
## Ready to transform your business?

[.cta]
  Start your journey today with our platform.
  [button href="/signup" "Get Started"]

[video demo.mp4 autoplay muted]
```

Even complex data visualization becomes manageable:

```md
[table]
  Region    | Q1 Sales | Q2 Sales | Growth
  Americas  | 1.2M     | 1.8M     | +50%
  Europe    | 0.8M     | 1.1M     | +37%
  Asia      | 0.6M     | 1.0M     | +66%
```

The format scales naturally to handle sophisticated layouts while maintaining content readability. Blocks can be nested for complex arrangements, tables can display rich data, and interactive elements integrate seamlessly. All of this happens while preserving the core benefits of Markdown:

- Content remains in plain text, versionable through Git
- Marketing teams can edit without development support
- SEO benefits from semantic HTML output
- Design changes don't require content updates
- No JavaScript required for layout or presentation

This approach recognizes that most web content isn't about complex application logic - it's about presenting information effectively. By providing sophisticated capabilities through a simple format, Nue enables teams to create compelling web experiences without framework complexity. The content stays focused on structure and meaning, while the mathematical design system handles visual presentation.



## CSS design systems
The rise of utility-first CSS frameworks like Tailwind reflects a deeper misunderstanding about CSS. Embedding design decisions directly in JavaScript or through utility classes represents a fundamental break from sound architectural practice — that form must follow function. This principle, central to disciplines from architecture to industrial design, becomes even more crucial in web development where content, structure, and presentation must evolve independently.

Consider the practical reality of building websites for clients. With current approaches, each project starts the same way: configuring build tools, setting up frameworks, then either embedding countless utility classes or writing CSS-in-JS components. Even when clients need similar features - product pages, contact forms, blog layouts - you can't truly reuse what you've built before. Every project requires rebuilding components because design decisions are locked inside markup or JavaScript.

Nue takes a fundamentally different approach by embracing CSS's global nature and the power of design systems. When content structure remains pure and semantic, the design system can create sophisticated visual relationships that respect and enhance that structure. Every visual decision - typography, spacing, color - emerges from the content's purpose rather than being arbitrarily applied through utility classes.

This systematic approach provides natural layers of reusability. Global styles establish your foundational design language through carefully calculated proportions and relationships. Library components provide reusable patterns that maintain mathematical harmony. Area-specific styles adapt the system for different contexts while preserving the underlying ratios. Page-specific styles handle unique needs without breaking the visual system. Each layer builds naturally on the ones before it, creating a cohesive visual language without repetition.

The power of this architecture becomes clear in how it transforms team workflows:

- Designers can focus on visual systems rather than diving deep in the JS monolith
- Developers can build on established patterns rather than recreating them
- Marketing teams can deploy new pages that automatically inherit design language
- Everyone benefits from components that are truly reusable across projects

Design is about creating visual systems that naturally express content's purpose and meaning through mathematical precision. Consider how this manifests in code:

``` css
:root {
  /* Typography follows a Perfect Fourth scale (1.333) */
  --scale: 1.333;
  --text-base: 1rem;
  --text-sm: calc(var(--text-base) / var(--scale));
  --text-lg: calc(var(--text-base) * var(--scale));
  --text-xl: calc(var(--text-lg) * var(--scale));

  /* Colors maintain precise OKLCH relationships */
  --brand: oklch(67% 0.2 230);
  --brand-accent: oklch(67% 0.2 290);  /* +60° hue rotation */
  --brand-light: oklch(77% 0.2 230);   /* +10% lightness */
  --brand-dim: oklch(67% 0.15 230);    /* -25% chroma */

  /* Spacing follows the same musical ratio */
  --space-base: 1rem;
  --space-xs: calc(var(--space-base) / var(--scale));
  --space-sm: calc(var(--space-xs) * var(--scale));
  --space-lg: calc(var(--space-base) * var(--scale));
}
```

When every visual relationship emerges from mathematical harmony rather than arbitrary decisions, we create interfaces that are not just maintainable, but fundamentally more elegant and effective. This is what scalable design looks like - not more classes, not more JavaScript, but thoughtful systems where precision creates impact.



## HTML extensions
While frameworks like React replace HTML with JavaScript-based templating (JSX), Nue takes the opposite approach: it extends HTML's native capabilities while maintaining its semantic nature. Any valid HTML works naturally in Nue - the system simply adds essential features like loops and conditionals when needed.

Consider how Nue handles dynamic content:

```html
<ul>
  <li :for="item in items">
    <h3>{ item.title }</h3>
    <p>{ item.description }</p>
  </li>
</ul>
```

This template syntax respects HTML's natural structure while adding just enough power for dynamic rendering. No special components needed, no JSX transformation, no framework-specific patterns to learn. The same clean syntax works seamlessly across server-side templates, client-side components, and isomorphic contexts.

Most remarkably, the entire client-side runtime is just 2.5kb. This small footprint demonstrates how little code is actually needed when working with web standards rather than against them. The template syntax provides loops, conditionals, custom components, and reactivity while maintaining HTML's semantic nature and browser's native capabilities.

This "less is more" philosophy extends throughout Nue's approach to HTML. Server components handle complex rendering without client overhead. Interactive islands add focused reactivity only where needed. Isomorphic components work across contexts while maintaining semantic structure. In each case, HTML's natural capabilities are enhanced rather than replaced.

This approach recognizes that HTML isn't just a rendering target - it's a sophisticated language for structuring content and interfaces. By extending HTML thoughtfully rather than replacing it, we create systems that remain aligned with web standards while providing the capabilities modern applications need.



## Universal hot-reloading
Development speed depends critically on feedback time. When you make a change, how quickly do you see the result? In modern web development, this feedback loop has become painfully slow. Even a simple style change in a JavaScript monolith can trigger a massive recompilation process, forcing developers to wait seconds or even tens of seconds to see their changes.

The root cause of this slowdown is the tight coupling inherent in JavaScript monoliths. When styling lives inside JavaScript components, even trivial CSS changes require rebuilding and re-executing large portions of the application. Your simple margin adjustment triggers TypeScript compilation, dependency resolution, tree-shaking, and bundle optimization - a cascade of unnecessary work that turns millisecond changes into multi-second waits.

Nue's standards-first architecture transforms this experience. Because content, styling, and behavior remain properly separated, changes can be processed with surgical precision. When you adjust a CSS property, only that style needs to be updated. When you modify content, only that specific section of the DOM needs to change. When you tweak a component, only that particular functionality needs to refresh.

This separation enables remarkably intelligent updates. When you modify content, Nue performs DOM diffing to update only what actually changed. Input values remain preserved. Open dialogs stay open, even if you're editing the dialog's content. The system maintains document state while seamlessly integrating your changes.

The intelligence extends beyond the current page. If you modify content on another route, Nue automatically navigates to show you the updated page. Yet if you change an asset that isn't relevant to your current view, the system knows to ignore it. This contextual awareness means you always see relevant updates without unnecessary refreshes.

This isn't just about faster numbers - it fundamentally transforms how development feels. The tight feedback loop keeps you in flow. Ideas can be explored rapidly. Adjustments feel immediate and natural. Development becomes truly enjoyable again.



## Build performance
Modern web development has normalized extraordinary slowness. Teams accept that a simple style change might take seconds to compile. They work around build times of 30 seconds or more for moderate-sized applications. This sluggishness has become so common that developers often don't question it.

But this slowness isn't inherent to web development - it's a direct result of architectural choices. JavaScript monoliths typically require over 300 NPM dependencies and occupy hundreds of megabytes just to set up a basic development environment. Each of these dependencies adds complexity to the build process, requiring careful orchestration during compilation.

Nue takes a radically different approach by embracing the "less is more" principle at every level. The entire system requires just 10 core dependencies and occupies roughly 10 megabytes - a reduction of over 90% compared to typical frameworks. This minimalism isn't about cutting corners; it's about thoughtful engineering that stays closer to the metal.

Consider the Markdown processor at the heart of Nue. Rather than depending on existing solutions like Marked, Nue includes a custom-built parser optimized specifically for content-first development. This decision wasn't just about adding custom features - the new parser actually outperforms Marked in raw speed while enabling more sophisticated content structures. By controlling the full stack, we eliminate layers of abstraction that typically slow builds down.

The same philosophy extends throughout the system. The largest dependency, Lightning CSS, accounts for about 70% of Nue's total size - and it's there because it delivers exceptional performance for style processing. Every other piece is engineered with the same attention to efficiency and simplicity.

The results speak for themselves:
- Content updates: 10-50ms
- Style changes: 5-20ms
- Component modifications: 20-100ms
- Full site rebuild (100 pages): 0.1 seconds

Compare this to a typical Next.js application:
- Style changes: 1-5 seconds
- Component updates: 2-10 seconds
- Full site rebuild: 30+ seconds

The impact on development teams is transformative. Fast builds mean more iteration, better exploration of ideas, and higher quality output. This is what development should feel like - fast, efficient, and focused on creating rather than waiting.


## Making websites fast
The web development world has become obsessed with the wrong kind of performance optimization. Complex bundlers written in Rust and Go slice, dice, and rearrange JavaScript code in increasingly sophisticated ways. Teams spend countless hours configuring build tools, optimizing chunk splitting, and fine-tuning tree-shaking algorithms. But this optimization theater misses a fundamental truth: the fastest page load is one that requires just a single request.

This insight transforms how we should think about web performance. When the initial HTML response contains everything needed to render the page - structure, styles, and critical content - the browser can begin painting immediately. There's no waterfall of CSS and JavaScript requests, no cumulative layout shifts, no waiting for framework initialization. The page simply appears.

Yet JavaScript monoliths can never achieve this ideal. Their architecture fundamentally depends on shipping large amounts of framework code before meaningful content can be displayed. Even with aggressive optimization, they must send React, routing logic, and component code. Their dependence on massive CSS frameworks like Tailwind further increases the base payload that every user must download.

Nue takes a radically different approach. By maintaining clean separation between content and presentation, it can intelligently inline critical CSS directly into the HTML. The initial response contains everything needed for the first meaningful paint. No framework initialization, no style recalculation, no JavaScript bootstrap - just instant content display.

This optimization extends beyond initial page loads. Nue comes with a powerful client-side navigation system that automatically enables "turbolinking" for your Markdown-based content. No configuration needed - your static pages instantly gain the fluid navigation traditionally associated with single-page applications. This system combines three powerful technologies:

- Intelligent DOM diffing that updates only changed content
- Clean CSS transitions between page states
- Preservation of document state during navigation

The result feels instant to users. Click a link, and new content flows smoothly into view through native CSS transitions. The navigation itself takes just milliseconds since only changed content needs to transfer. Most importantly, the experience remains fluid and natural - no jarring rebuilds or flashes of unstyled content.

This is where view transitions demonstrate their true value. They're not just visual polish - they fundamentally improve how users experience your site. When content transitions smoothly between states, it creates a sense of place and continuity. Users maintain their context and flow naturally through your information architecture. The animations may be subtle, but their impact on user experience is profound.

The crucial insight is that raw performance numbers don't tell the whole story. Yes, Nue's single-request architecture delivers impressive metrics. But the real goal is creating experiences that feel instant and natural to users. When every interaction happens within a 100ms window and transitions smoothly through native CSS animations, users stay engaged with your content rather than waiting for technology. This is what the web was always meant to be - fast, fluid, and focused on delivering information rather than running JavaScript.



## Who is Nue for?
The standards-first approach to web development creates value for several distinct audiences, each finding different benefits in Nue's capabilities.

For beginner web developers, Nue offers a clearer path to mastery. Rather than immediately diving into complex framework abstractions, beginners can focus on understanding the core web technologies: HTML, CSS, and JavaScript. This creates stronger foundations that remain relevant regardless of which tools emerge in the future. Instead of learning temporary framework patterns, developers build deep knowledge of web standards that naturally compound over time.

For experienced JavaScript developers, Nue provides relief from framework complexity. After years of wrestling with React's growing abstractions - managing state, coordinating effects, optimizing builds - many developers seek simpler solutions. Nue demonstrates how modern web standards can replace many framework patterns naturally. Complex data flows become simple HTML forms. JavaScript-heavy animations transform into native CSS transitions. State management shifts to custom properties. The result is sophisticated applications with dramatically less code and complexity.

For design-focused teams, Nue enables a return to systematic thinking. Rather than embedding design decisions in utility classes or CSS-in-JS, teams can create true design systems that scale naturally. Modern CSS features like custom properties, calculations, and container queries provide unprecedented power for creating mathematical relationships. Design engineers can focus on building systems that unite marketing sites and applications under consistent visual languages. The emphasis stays on user experience and design systems rather than framework-specific patterns.

In each case, Nue's standards-first approach creates more than just immediate benefits - it builds knowledge and systems that appreciate over time rather than decaying with each framework iteration. As browsers continue evolving, developers working directly with web standards find their capabilities expanding naturally. Their understanding grows deeper as the platform improves, rather than being repeatedly displaced by new framework patterns.

This sustainable approach to skill development might be Nue's most important contribution. In a world of constant framework churn, learning web standards provides stable foundations that become more valuable over time. Whether you're just starting your journey or bringing years of experience, working closer to the web platform creates more resilient knowledge and more maintainable applications.



## Templates
The future of web development becomes even clearer when we consider the profound implications of truly systematic design. Nue is currently developing a series of mathematical design systems that will transform how we build for the web, bringing together three decades of design and engineering expertise.

Each template approaches systematic design through a different mathematical lens. One achieves dramatic impact through extreme whitespace and commanding typography set in Perfect Fifth scale (1.5). Another creates functional beauty through precise OKLCH calculations and Perfect Fourth (1.333) proportions. A third explores three-dimensional space through calculated blur effects while maintaining perfect color relationships.

These templates, targeted for release in April 2025, represent more than just design systems - they demonstrate how mathematical precision can transform web development. What previously required dedicated design teams and months of component development will emerge instantly through calculated relationships. The sophistication that large companies achieve through extensive resources will become accessible to everyone through systematic thinking.

This vision is only possible because of Nue's standards-first architecture. JavaScript monoliths, with their tight coupling between content and presentation, make such powerful templating impossible. You cannot meaningfully transform a Tailwind or CSS-in-JS interface without rebuilding components. But when content remains pure and styling flows from mathematical systems, sophisticated redesigns become trivial.

Most importantly, these templates will serve as profound learning resources. They demonstrate how systematic thinking creates more elegant solutions than arbitrary decisions ever could. Through their implementation, developers will understand how mathematical precision enables both better architecture and more sophisticated design.

This is the future of web development - where form truly follows function.


